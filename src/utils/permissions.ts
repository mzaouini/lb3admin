/**
 * Role-Based Access Control (RBAC) Permissions
 * 
 * CORRECT Maker-Checker Model (Banking/Fintech Standard):
 * 
 * - Maker: Full operational access - creates transactions, manages cards, performs all operations
 * - Checker: Limited approval access - only approves/rejects what Maker created
 * - Support: Read-only access - views data for customer support
 * - Super Admin: Full system access including user management
 */

export type AdminRole = 'maker' | 'checker' | 'support' | 'super_admin';

export interface RolePermissions {
  // Employee Management
  canViewEmployees: boolean;
  canCreateEmployee: boolean;
  canEditEmployee: boolean;
  canDeleteEmployee: boolean;

  // Transaction Management
  canViewTransactions: boolean;
  canCreateTransaction: boolean;
  canApproveTransaction: boolean;
  canRejectTransaction: boolean;

  // Salary Advance Management
  canViewAdvances: boolean;
  canCreateAdvance: boolean;
  canApproveAdvance: boolean;
  canRejectAdvance: boolean;

  // Card Management (Admin only)
  canViewCards: boolean;
  canActivateCard: boolean;
  canDeactivateCard: boolean;
  canBlockCard: boolean;
  canViewCardTransactions: boolean;

  // Reports & Analytics
  canViewReports: boolean;
  canExportData: boolean;

  // System Management
  canViewAuditLogs: boolean;
  canManageUsers: boolean;
  canManageSettings: boolean;
}

/**
 * Get permissions for a specific role
 */
export function getRolePermissions(role: AdminRole): RolePermissions {
  const permissions: Record<AdminRole, RolePermissions> = {
    maker: {
      // Employee Management - FULL ACCESS
      canViewEmployees: true,
      canCreateEmployee: true,
      canEditEmployee: true,
      canDeleteEmployee: false, // Only super admin can delete

      // Transaction Management - FULL OPERATIONAL ACCESS
      canViewTransactions: true,
      canCreateTransaction: true, // Makers create transactions
      canApproveTransaction: false, // Cannot approve own work
      canRejectTransaction: false, // Cannot reject

      // Salary Advance Management - FULL OPERATIONAL ACCESS
      canViewAdvances: true,
      canCreateAdvance: true, // Makers create advance requests
      canApproveAdvance: false, // Cannot approve own work
      canRejectAdvance: false, // Cannot reject

      // Card Management - FULL OPERATIONAL ACCESS
      canViewCards: true,
      canActivateCard: true, // Makers can activate cards
      canDeactivateCard: true, // Makers can deactivate/freeze cards
      canBlockCard: true, // Makers can block cards
      canViewCardTransactions: true,

      // Reports & Analytics - FULL ACCESS
      canViewReports: true,
      canExportData: true,

      // System Management - LIMITED
      canViewAuditLogs: true,
      canManageUsers: false,
      canManageSettings: false,
    },

    checker: {
      // Employee Management - READ ONLY
      canViewEmployees: true,
      canCreateEmployee: false, // Checkers don't create
      canEditEmployee: false, // Checkers don't edit
      canDeleteEmployee: false,

      // Transaction Management - APPROVAL ONLY
      canViewTransactions: true,
      canCreateTransaction: false, // Checkers don't create
      canApproveTransaction: true, // Checkers approve what Makers created
      canRejectTransaction: true, // Checkers can reject

      // Salary Advance Management - APPROVAL ONLY
      canViewAdvances: true,
      canCreateAdvance: false, // Checkers don't create
      canApproveAdvance: true, // Checkers approve advances
      canRejectAdvance: true, // Checkers can reject advances

      // Card Management - READ ONLY (No operational access)
      canViewCards: true,
      canActivateCard: false, // Checkers don't manage cards
      canDeactivateCard: false,
      canBlockCard: false,
      canViewCardTransactions: true,

      // Reports & Analytics - READ ONLY
      canViewReports: true,
      canExportData: false, // Limited export access

      // System Management - LIMITED
      canViewAuditLogs: true, // Can view audit logs
      canManageUsers: false,
      canManageSettings: false,
    },

    support: {
      // Employee Management - READ ONLY
      canViewEmployees: true,
      canCreateEmployee: false,
      canEditEmployee: false,
      canDeleteEmployee: false,

      // Transaction Management - READ ONLY
      canViewTransactions: true,
      canCreateTransaction: false,
      canApproveTransaction: false,
      canRejectTransaction: false,

      // Salary Advance Management - READ ONLY
      canViewAdvances: true,
      canCreateAdvance: false,
      canApproveAdvance: false,
      canRejectAdvance: false,

      // Card Management - READ ONLY
      canViewCards: true,
      canActivateCard: false,
      canDeactivateCard: false,
      canBlockCard: false,
      canViewCardTransactions: true,

      // Reports & Analytics - READ ONLY
      canViewReports: true,
      canExportData: false,

      // System Management - NO ACCESS
      canViewAuditLogs: false,
      canManageUsers: false,
      canManageSettings: false,
    },

    super_admin: {
      // Employee Management - FULL ACCESS
      canViewEmployees: true,
      canCreateEmployee: true,
      canEditEmployee: true,
      canDeleteEmployee: true,

      // Transaction Management - FULL ACCESS
      canViewTransactions: true,
      canCreateTransaction: true,
      canApproveTransaction: true,
      canRejectTransaction: true,

      // Salary Advance Management - FULL ACCESS
      canViewAdvances: true,
      canCreateAdvance: true,
      canApproveAdvance: true,
      canRejectAdvance: true,

      // Card Management - FULL ACCESS
      canViewCards: true,
      canActivateCard: true,
      canDeactivateCard: true,
      canBlockCard: true,
      canViewCardTransactions: true,

      // Reports & Analytics - FULL ACCESS
      canViewReports: true,
      canExportData: true,

      // System Management - FULL ACCESS
      canViewAuditLogs: true,
      canManageUsers: true,
      canManageSettings: true,
    },
  };

  return permissions[role];
}

/**
 * Check if a role has a specific permission
 */
export function hasPermission(
  role: AdminRole,
  permission: keyof RolePermissions
): boolean {
  const permissions = getRolePermissions(role);
  return permissions[permission];
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: AdminRole): string {
  const displayNames: Record<AdminRole, string> = {
    maker: 'Maker',
    checker: 'Checker',
    support: 'Support',
    super_admin: 'Super Admin',
  };
  return displayNames[role];
}

/**
 * Get role description
 */
export function getRoleDescription(role: AdminRole): string {
  const descriptions: Record<AdminRole, string> = {
    maker: 'Full operational access - creates transactions, manages cards, performs operations',
    checker: 'Approval access only - reviews and approves/rejects transactions created by Makers',
    support: 'Read-only access - views data for customer support purposes',
    super_admin: 'Full system access - manages users, settings, and all operations',
  };
  return descriptions[role];
}

/**
 * Get role badge color for UI
 */
export function getRoleBadgeColor(role: AdminRole): string {
  const colors: Record<AdminRole, string> = {
    maker: 'bg-blue-100 text-blue-800',
    checker: 'bg-green-100 text-green-800',
    support: 'bg-purple-100 text-purple-800',
    super_admin: 'bg-orange-100 text-orange-800',
  };
  return colors[role];
}
