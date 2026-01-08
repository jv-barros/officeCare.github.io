const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const sequelize = new Sequelize(process.env.DB_NAME || 'officecare_dev', process.env.DB_USER || 'officecare', process.env.DB_PASSWORD || 'officecare', {
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    authPlugins: {
      // Fallback: treat auth_gssapi_client like caching_sha2_password so mysql2 can authenticate
      auth_gssapi_client: ((pluginOptions = {}) => ({ connection, command } = {}) => {
      const crypto = require('crypto');
      const REQUEST_SERVER_KEY_PACKET = Buffer.from([2]);
      const FAST_AUTH_SUCCESS_PACKET = Buffer.from([3]);
      const PERFORM_FULL_AUTHENTICATION_PACKET = Buffer.from([4]);
      const STATE_INITIAL = 0;
      const STATE_TOKEN_SENT = 1;
      const STATE_WAIT_SERVER_KEY = 2;
      const STATE_FINAL = -1;

      function sha256(msg) {
        const hash = crypto.createHash('sha256');
        hash.update(msg);
        return hash.digest();
      }

      function xor(a, b) {
        const result = Buffer.allocUnsafe(a.length);
        for (let i = 0; i < a.length; i++) {
          result[i] = a[i] ^ b[i];
        }
        return result;
      }

      function xorRotating(a, seed) {
        const result = Buffer.allocUnsafe(a.length);
        const seedLen = seed.length;
        for (let i = 0; i < a.length; i++) {
          result[i] = a[i] ^ seed[i % seedLen];
        }
        return result;
      }

      function calculateToken(password, scramble) {
        if (!password) {
          return Buffer.alloc(0);
        }
        const stage1 = sha256(Buffer.from(password));
        const stage2 = sha256(stage1);
        const stage3 = sha256(Buffer.concat([stage2, scramble]));
        return xor(stage1, stage3);
      }

      function encrypt(password, scramble, key) {
        const stage1 = xorRotating(Buffer.from(`${password}\0`, 'utf8'), scramble);
        return crypto.publicEncrypt(
          {
            key,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          },
          stage1
        );
      }

      let state = STATE_INITIAL;
      let scramble = null;
      // Use DB password from env as fallback (Sequelize may not set connection.config)
      const password = process.env.DB_PASSWORD || 'officecare';

      const authWithKey = (serverKey) => {
        const _password = encrypt(password, scramble, serverKey);
        state = STATE_FINAL;
        return _password;
      };

      return (data) => {
        switch (state) {
          case STATE_INITIAL:
            scramble = data.slice(0, 20);
            state = STATE_TOKEN_SENT;
            return calculateToken(password, scramble);

          case STATE_TOKEN_SENT:
            if (FAST_AUTH_SUCCESS_PACKET.equals(data)) {
              state = STATE_FINAL;
              return null;
            }

            if (PERFORM_FULL_AUTHENTICATION_PACKET.equals(data)) {
              // We don't rely on connection.config.ssl; assume insecure and request server key
              if (pluginOptions.serverPublicKey) {
                return authWithKey(pluginOptions.serverPublicKey);
              }

              state = STATE_WAIT_SERVER_KEY;
              return REQUEST_SERVER_KEY_PACKET;
            }
            throw new Error('Invalid AuthMoreData packet received by custom auth plugin.');

          case STATE_WAIT_SERVER_KEY:
            if (pluginOptions.onServerPublicKey) {
              pluginOptions.onServerPublicKey(data);
            }
            return authWithKey(data);

          case STATE_FINAL:
            throw new Error('Unexpected data in AuthMoreData packet received by custom auth plugin in STATE_FINAL state.');
        }

        throw new Error('Unexpected data in AuthMoreData packet received by custom auth plugin.');
      };
    })(),
    },
  },
});

module.exports = sequelize;