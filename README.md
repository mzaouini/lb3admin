# LibertyPay Admin Panel

Admin panel for managing LibertyPay salary advance platform. Built with React, TypeScript, and Tailwind CSS.

## Features

- 📊 **Dashboard** - Real-time metrics, charts, and analytics
- 👥 **Employee Management** - Add, edit, view employees and salary information
- 💳 **Transaction Management** - Approve/reject salary advances with maker-checker workflow
- 📈 **Reports & Analytics** - Generate comprehensive reports (PDF, Excel, CSV)
- ⚙️ **Settings** - Configure fees, limits, and system preferences
- 👤 **Admin User Management** - Role-based access control (Maker, Checker, Support)

## Admin Roles

| Role | Permissions |
|------|-------------|
| **Super Admin** | Full system access and control |
| **Maker** | Create and submit transactions for approval |
| **Checker** | Review and approve/reject transactions |
| **Support** | View-only access for customer support |

## Setup Instructions

### 1. Database Setup

Run the SQL script in your Supabase SQL Editor:

```bash
# Open Supabase Dashboard → SQL Editor
# Copy and paste the contents of SETUP_ADMIN_USERS.sql
# Click "Run" to execute
```

This will create:
- `admin_users` table with 3 users
- `audit_logs` table for tracking admin actions
- `organizations` table for company management
- `system_settings` table for configuration

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env` file:

```env
VITE_DATABASE_URL=your_database_url_here
DATABASE_URL=your_database_url_here
VITE_APP_TITLE=LibertyPay Admin
```

### 4. Run Development Server

```bash
pnpm dev
```

The admin panel will be available at `http://localhost:5173`

## Login Credentials

After running the setup SQL script, you can login with:

| Role | Email | Password |
|------|-------|----------|
| **Maker** | maker@libertypay.ma | admin123 |
| **Checker** | checker@libertypay.ma | admin123 |
| **Support** | support@libertypay.ma | admin123 |

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Routing**: Wouter
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM

## Color Palette

The admin panel uses LibertyPay's brand colors:

- **Navy**: `#1a2332` - Primary background
- **Teal**: `#0d9488` - Primary actions
- **Mint**: `#00c48c` - Success states
- **Gold**: `#dc8b5e` - Highlights

## Security Notes

⚠️ **Important**: The current implementation uses plain text passwords for demo purposes. In production:

1. Use bcrypt or argon2 to hash passwords
2. Implement proper JWT authentication
3. Add CSRF protection
4. Enable rate limiting
5. Use HTTPS only
6. Implement proper session management

## License

Proprietary - LibertyPay Morocco
