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
