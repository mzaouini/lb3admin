import postgres from 'postgres';

// Database connection
const DATABASE_URL = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = postgres(DATABASE_URL);

async function seedAdminUsers() {
  console.log('🌱 Seeding admin users...');

  try {
    // Create admin_role enum if it doesn't exist
    await sql`
      DO $$ BEGIN
        CREATE TYPE admin_role AS ENUM ('maker', 'checker', 'support', 'super_admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    // Create admin_users table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(320) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role admin_role NOT NULL DEFAULT 'support',
        is_active BOOLEAN NOT NULL DEFAULT true,
        last_login_at TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;

    // Insert 3 admin users
    // Password is 'admin123' (in production, use proper bcrypt hashing)
    const users = [
      {
        email: 'maker@libertypay.ma',
        name: 'Operations Manager',
        password: 'admin123', // In production: await bcrypt.hash('admin123', 10)
        role: 'maker',
      },
      {
        email: 'checker@libertypay.ma',
        name: 'Finance Manager',
        password: 'admin123',
        role: 'checker',
      },
      {
        email: 'support@libertypay.ma',
        name: 'Support Agent',
        password: 'admin123',
        role: 'support',
      },
    ];

    for (const user of users) {
      await sql`
        INSERT INTO admin_users (email, name, password, role)
        VALUES (${user.email}, ${user.name}, ${user.password}, ${user.role})
        ON CONFLICT (email) DO UPDATE
        SET name = EXCLUDED.name,
            role = EXCLUDED.role,
            updated_at = NOW()
      `;
      console.log(`✅ Created/Updated admin user: ${user.email} (${user.role})`);
    }

    // Create audit_logs table
    await sql`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        admin_user_id INTEGER REFERENCES admin_users(id),
        action VARCHAR(255) NOT NULL,
        entity_type VARCHAR(100) NOT NULL,
        entity_id INTEGER,
        details TEXT,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;

    // Create system_settings table
    await sql`
      CREATE TABLE IF NOT EXISTS system_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(100) NOT NULL UNIQUE,
        value TEXT NOT NULL,
        description TEXT,
        updated_by INTEGER REFERENCES admin_users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;

    // Insert default system settings
    const settings = [
      { key: 'service_fee_ht', value: '50', description: 'Service fee before tax (in Dhs)' },
      { key: 'vat_rate', value: '20', description: 'VAT rate percentage' },
      { key: 'min_advance_amount', value: '100', description: 'Minimum salary advance amount (in Dhs)' },
      { key: 'max_advance_amount', value: '5000', description: 'Maximum salary advance amount (in Dhs)' },
      { key: 'max_salary_percentage', value: '50', description: 'Maximum percentage of salary that can be advanced' },
    ];

    for (const setting of settings) {
      await sql`
        INSERT INTO system_settings (key, value, description)
        VALUES (${setting.key}, ${setting.value}, ${setting.description})
        ON CONFLICT (key) DO NOTHING
      `;
    }

    console.log('✅ System settings created');

    console.log('\n🎉 Admin users seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Maker:   maker@libertypay.ma / admin123');
    console.log('Checker: checker@libertypay.ma / admin123');
    console.log('Support: support@libertypay.ma / admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error seeding admin users:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

seedAdminUsers();
