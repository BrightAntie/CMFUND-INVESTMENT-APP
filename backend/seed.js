const bcrypt = require('bcrypt');
const pool = require('./config/database');

// Sample data based on your Excel requirements
const sampleMembers = [
  {
    csm_memberID: 'M001',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    telephone: '+233123456789',
    date_registered: '2024-01-15',
    customer_number: 'C001'
  },
  {
    csm_memberID: 'M002',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    telephone: '+233987654321',
    date_registered: '2024-01-20',
    customer_number: 'C002'
  },
  {
    csm_memberID: 'M003',
    first_name: 'Kwame',
    last_name: 'Asante',
    email: 'kwame.asante@example.com',
    telephone: '+233555123456',
    date_registered: '2024-02-01',
    customer_number: 'C003'
  },
  {
    csm_memberID: 'M004',
    first_name: 'Ama',
    last_name: 'Osei',
    email: 'ama.osei@example.com',
    telephone: '+233777888999',
    date_registered: '2024-02-10',
    customer_number: 'C004'
  },
  {
    csm_memberID: 'M005',
    first_name: 'Kofi',
    last_name: 'Mensah',
    email: 'kofi.mensah@example.com',
    telephone: '+233444555666',
    date_registered: '2024-02-15',
    customer_number: 'C005'
  }
];

const sampleInvestments = [
  // Member M001 investments
  {
    csm_memberID: 'M001',
    tnx_date: '2024-01-15',
    description: 'CM FUND Growth Fund',
    qty_bought: 1000,
    purchase_price: 15.70,
    amount_invested: 15700.00,
    share_balance: 1000,
    current_value: 18500.00,
    gain: 2800.00,
    qty_sold: 0,
    charges: 78.50,
    shareholder: 'John Doe',
    current_price: 18.50
  },
  {
    csm_memberID: 'M001',
    tnx_date: '2024-02-01',
    description: 'CM FUND Equity Fund',
    qty_bought: 500,
    purchase_price: 22.40,
    amount_invested: 11200.00,
    share_balance: 1500,
    current_value: 12800.00,
    gain: 1600.00,
    qty_sold: 0,
    charges: 56.00,
    shareholder: 'John Doe',
    current_price: 25.60
  },
  {
    csm_memberID: 'M001',
    tnx_date: '2024-03-10',
    description: 'CM FUND Bond Fund',
    qty_bought: 800,
    purchase_price: 18.25,
    amount_invested: 14600.00,
    share_balance: 2300,
    current_value: 15800.00,
    gain: 1200.00,
    qty_sold: 0,
    charges: 73.00,
    shareholder: 'John Doe',
    current_price: 19.75
  },
  {
    csm_memberID: 'M001',
    tnx_date: '2024-04-05',
    description: 'CM FUND Growth Fund',
    qty_bought: 0,
    purchase_price: 0,
    amount_invested: 0,
    share_balance: 1800,
    current_value: 16200.00,
    gain: -1500.00,
    qty_sold: 200,
    charges: 45.00,
    shareholder: 'John Doe',
    current_price: 19.75
  },

  // Member M002 investments
  {
    csm_memberID: 'M002',
    tnx_date: '2024-01-20',
    description: 'CM FUND Equity Fund',
    qty_bought: 750,
    purchase_price: 20.00,
    amount_invested: 15000.00,
    share_balance: 750,
    current_value: 18000.00,
    gain: 3000.00,
    qty_sold: 0,
    charges: 75.00,
    shareholder: 'Jane Smith',
    current_price: 24.00
  },
  {
    csm_memberID: 'M002',
    tnx_date: '2024-02-15',
    description: 'CM FUND Growth Fund',
    qty_bought: 1200,
    purchase_price: 16.50,
    amount_invested: 19800.00,
    share_balance: 1950,
    current_value: 23400.00,
    gain: 3600.00,
    qty_sold: 0,
    charges: 99.00,
    shareholder: 'Jane Smith',
    current_price: 18.00
  },

  // Member M003 investments
  {
    csm_memberID: 'M003',
    tnx_date: '2024-02-01',
    description: 'CM FUND Bond Fund',
    qty_bought: 2000,
    purchase_price: 12.00,
    amount_invested: 24000.00,
    share_balance: 2000,
    current_value: 26000.00,
    gain: 2000.00,
    qty_sold: 0,
    charges: 120.00,
    shareholder: 'Kwame Asante',
    current_price: 13.00
  },
  {
    csm_memberID: 'M003',
    tnx_date: '2024-03-20',
    description: 'CM FUND Equity Fund',
    qty_bought: 600,
    purchase_price: 25.00,
    amount_invested: 15000.00,
    share_balance: 2600,
    current_value: 31200.00,
    gain: 1200.00,
    qty_sold: 0,
    charges: 75.00,
    shareholder: 'Kwame Asante',
    current_price: 26.00
  },

  // Member M004 investments
  {
    csm_memberID: 'M004',
    tnx_date: '2024-02-10',
    description: 'CM FUND Growth Fund',
    qty_bought: 1500,
    purchase_price: 14.00,
    amount_invested: 21000.00,
    share_balance: 1500,
    current_value: 24000.00,
    gain: 3000.00,
    qty_sold: 0,
    charges: 105.00,
    shareholder: 'Ama Osei',
    current_price: 16.00
  },
  {
    csm_memberID: 'M004',
    tnx_date: '2024-03-05',
    description: 'CM FUND Bond Fund',
    qty_bought: 1000,
    purchase_price: 15.50,
    amount_invested: 15500.00,
    share_balance: 2500,
    current_value: 30000.00,
    gain: 2500.00,
    qty_sold: 0,
    charges: 77.50,
    shareholder: 'Ama Osei',
    current_price: 16.50
  },

  // Member M005 investments
  {
    csm_memberID: 'M005',
    tnx_date: '2024-02-15',
    description: 'CM FUND Equity Fund',
    qty_bought: 900,
    purchase_price: 18.00,
    amount_invested: 16200.00,
    share_balance: 900,
    current_value: 19800.00,
    gain: 3600.00,
    qty_sold: 0,
    charges: 81.00,
    shareholder: 'Kofi Mensah',
    current_price: 22.00
  },
  {
    csm_memberID: 'M005',
    tnx_date: '2024-03-25',
    description: 'CM FUND Growth Fund',
    qty_bought: 1100,
    purchase_price: 17.00,
    amount_invested: 18700.00,
    share_balance: 2000,
    current_value: 24000.00,
    gain: 2300.00,
    qty_sold: 0,
    charges: 93.50,
    shareholder: 'Kofi Mensah',
    current_price: 19.00
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await pool.query('DELETE FROM Investment_History');
    await pool.query('DELETE FROM Members');

    // Insert members
    console.log('👥 Inserting members...');
    for (const member of sampleMembers) {
      // Generate default password (first 6 characters of memberID + "123")
      const defaultPassword = member.csm_memberID.substring(0, 6) + '123';
      const passwordHash = await bcrypt.hash(defaultPassword, 10);

      await pool.query(`
        INSERT INTO Members (
          csm_memberID, first_name, last_name, email, telephone, 
          date_registered, customer_number, password_hash
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        member.csm_memberID,
        member.first_name,
        member.last_name,
        member.email,
        member.telephone,
        member.date_registered,
        member.customer_number,
        passwordHash
      ]);

      console.log(`✅ Created member: ${member.first_name} ${member.last_name} (${member.csm_memberID})`);
      console.log(`   Email: ${member.email}`);
      console.log(`   Password: ${defaultPassword}`);
    }

    // Insert investments
    console.log('💰 Inserting investment records...');
    for (const investment of sampleInvestments) {
      await pool.query(`
        INSERT INTO Investment_History (
          csm_memberID, tnx_date, description, qty_bought, purchase_price,
          amount_invested, share_balance, current_value, gain, qty_sold,
          charges, shareholder, current_price
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, [
        investment.csm_memberID,
        investment.tnx_date,
        investment.description,
        investment.qty_bought,
        investment.purchase_price,
        investment.amount_invested,
        investment.share_balance,
        investment.current_value,
        investment.gain,
        investment.qty_sold,
        investment.charges,
        investment.shareholder,
        investment.current_price
      ]);
    }

    console.log(`✅ Created ${sampleInvestments.length} investment records`);

    // Display summary
    console.log('\n📊 Database Seeding Summary:');
    console.log('============================');
    
    const memberCount = await pool.query('SELECT COUNT(*) FROM Members');
    const investmentCount = await pool.query('SELECT COUNT(*) FROM Investment_History');
    const totalInvested = await pool.query('SELECT SUM(amount_invested) FROM Investment_History');
    const totalGains = await pool.query('SELECT SUM(gain) FROM Investment_History');

    console.log(`👥 Members: ${memberCount.rows[0].count}`);
    console.log(`💰 Investment Records: ${investmentCount.rows[0].count}`);
    console.log(`💵 Total Invested: GH₵${parseFloat(totalInvested.rows[0].sum || 0).toLocaleString()}`);
    console.log(`📈 Total Gains: GH₵${parseFloat(totalGains.rows[0].sum || 0).toLocaleString()}`);

    console.log('\n🔑 Login Credentials:');
    console.log('====================');
    sampleMembers.forEach(member => {
      const password = member.csm_memberID.substring(0, 6) + '123';
      console.log(`${member.csm_memberID}: ${password} (${member.email})`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('🚀 You can now start the server and test the application');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the seeding
seedDatabase();
