# LibertyPay Admin Panel TODO

## Authentication & Onboarding
- [ ] Add proper login screen (not going straight to dashboard)
- [ ] Add splash screen with LibertyPay logo on load
- [ ] Implement authentication flow with role detection
- [ ] Add logout functionality

## Role-Based Access Control (Maker-Checker-Support)
- [ ] Implement Maker role permissions (create/submit transactions)
- [ ] Implement Checker role permissions (approve/reject transactions)
- [ ] Implement Support role permissions (view-only, customer support)
- [ ] Add role-based menu visibility
- [ ] Add role-based action buttons (approve/reject only for Checker)
- [ ] Add audit trail for maker-checker actions

## UI/UX Improvements
- [ ] Match splash screen design with main LibertyPay app
- [ ] Add role indicator in header (show current user role)
- [ ] Add pending approvals badge for Checker role
- [ ] Improve mobile responsiveness

## Data Integration
- [x] Add Meryem user data from main app to admin panel
- [x] Create SQL script to insert Meryem's data into database
- [ ] Sync employee details (name, phone, salary, bank account)
- [ ] Sync transaction history
- [ ] Show real transaction data in dashboard and reports

## NEW: Enhanced Role-Based Access Control
- [x] Maker role: Read + Create salary advance requests (no approval rights)
- [x] Checker role: Read + Approve/Reject pending requests (no create rights)
- [x] Support role: Read-only access across all screens (no actions)
- [x] Update Transactions page with role-based action buttons
- [ ] Update Employees page with role-based create/edit buttons
- [x] Add permission checks in database service layer
- [x] Show/hide UI elements based on user role
- [x] Add role badge in header/sidebar

## NEW: Card Management Section (Admin Only)
- [x] Create Card Management page (/cards route)
- [x] Card list view with all user cards
- [x] Search and filter cards (by user, status, balance)
- [x] Card activation/deactivation toggle
- [x] Balance tracking display per card
- [x] Transaction history per card (from card_transactions table)
- [x] Card status management (Active, Inactive, Blocked, Pending)
- [x] Card details modal/page with full information
- [x] Restrict Card Management to Checker role only (admin access)
- [x] Add Cards menu item to navigation
- [ ] Query card_transactions table in database service
- [ ] Add card statistics to Dashboard

## Card Management - NAPS Platform Integration Features
- [x] PIN management (reset PIN functionality)
- [x] Freeze/unfreeze card toggle
- [x] Block card (permanent) with confirmation
- [x] Card activation workflow
- [x] Link cards to existing users and transactions
- [x] Generate mock card numbers for existing users
- [x] Card balance calculation from transaction history
- [x] NAPS platform integration preparation (API endpoints ready)
- [x] Card details modal with full card info
- [x] PIN reset confirmation and security checks


## URGENT: Fix Maker-Checker Permissions (Correct Model)
- [x] Fix permissions.ts: Maker = Full operational access
- [x] Fix permissions.ts: Checker = Approve/Reject only (limited)
- [x] Fix permissions.ts: Support = Read-only
- [x] Update card management access for Maker role
- [x] Restrict Checker to approval actions only
- [x] Test all three roles with correct permissions
