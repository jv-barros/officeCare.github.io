const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'officecare',
      password: 'officecare',
      database: 'officecare_dev',
      insecureAuth: false,
    });
    console.log('✅ Direct connection successful!');
    await connection.end();
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    if (err.code === 'AUTH_SWITCH_PLUGIN_ERROR') {
      console.error('\n⚠️  WINDOWS SSPI/GSSAPI ISSUE DETECTED');
      console.error('Trying with insecureAuth: true...\n');
      
      try {
        const connection2 = await mysql.createConnection({
          host: '127.0.0.1',
          user: 'officecare',
          password: 'officecare',
          database: 'officecare_dev',
          insecureAuth: true,
        });
        console.log('✅ Connection with insecureAuth successful!');
        await connection2.end();
      } catch (err2) {
        console.error('❌ Still failed:', err2.message);
      }
    }
  }
}

testConnection();
