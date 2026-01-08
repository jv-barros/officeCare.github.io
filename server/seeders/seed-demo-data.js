const db = require('../models');

async function seed() {
  try {
    await db.sequelize.sync();

    // create sample appointments
    const now = new Date();
    const days = [0,1,2,3,4,5,6];
    for (let i=0;i<12;i++){
      const d = new Date();
      d.setDate(now.getDate() + (i % 7));
      d.setHours(9 + (i%8), 0,0,0);
      await db.Appointment.create({ title: `Consulta ${i+1}`, start: d, status: i%4 === 0 ? 'pending' : 'scheduled' });
    }

    // sample transactions
    for (let i=0;i<10;i++){
      const d = new Date(); d.setDate(now.getDate() - i);
      await db.Transaction.create({ amount: (Math.random()*200 + 50).toFixed(2), date: d, description: 'Pagamento' });
    }

    console.log('Demo data seeded');
    process.exit(0);
  } catch (err) {
    console.error('Demo seed failed', err);
    process.exit(1);
  }
}

seed();