/**
 * Role-Based Access Control (RBAC) Permissions
 * 
 * Role Definitions:
 * - Maker: Can create and submit salary advance requests (Read + Create)
 * - Checker: Can approve/reject pending requests (Read + Approve/Reject)
 * - Support: Read-only access for customer support (Read only)
 * - Super Admin: Full access to all features including card management
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
      // Employee Management
      canViewEmployees: true,
      canCreateEmployee: false,
      canEditEmployee: false,
      canDeleteEmployee: false,

      // Transaction Management
      canViewTransactions: true,
      canCreateTransaction: true, // Makers can create/submit transactions
      canApproveTransaction: false,
      canRejectTransaction: false,

      // Salary Advance Management
      canViewAdvances: true,
      canCreateAdvance: true, // Makers can create advance requests
      canApproveAdvance: false,
      canRejectAdvance: false,

      // Card Management (No access)
      canViewCards: false,
      canActivateCard: false,
      canDeactivateCard: false,
      canBlockCard: false,
      canViewCardTransactions: false,

      // Reports & Analytics
      canViewReports: true,
      canExportData: false,

      // System Management
      canViewAuditLogs: false,
      canManageUsers: false,
      canManageSettings: false,
    },

    checker: {
      // Employee Management
      canViewEmployees: true,
      canCreateEmployee: false,
      canEditEmployee: false,
      canDeleteEmployee: false,

      // Transaction Management
      canViewTransactions: true,
      canCreateTransaction: false,
      canApproveTransaction: true, // Checkers can approve transactions
      canRejectTransaction: true, // Checkers can reject transactions

      // Salary Advance Management
      canViewAdvances: true,
      canCreateAdvance: false,
      canApproveAdvance: true, // Checkers can approve advances
      canRejectAdvance: true, // Checkers can reject advances

      // Card Management (Full access for Checkers)
      canViewCards: true,
      canActivateCard: true,
      canDeactivateCard: true,
      canBlockCard: true,
      canViewCardTransactions: true,

      // Reports & Analytics
      canViewReports: true,
      canExportData: true,

      // System Management
      canViewAuditLogs: true,
      canManageUsers: false,
      canManageSettings: false,
    },

    support: {
      // Employee Management (Read-only)
      canViewEmployees: true,
      canCreateEmployee: false,
      canEditEmployee: false,
      canDeleteEmployee: false,

      // Transaction Management (Read-only)
      canViewTransactions: true,
      canCreateTransaction: false,
      canApproveTransaction: false,
      canRejectTransaction: false,

      // Salary Advance Management (Read-only)
      canViewAdvances: true,
      canCreateAdvance: false,
      canApproveAdvance: false,
      canRejectAdvance: false,

      // Card Management (Read-only)
      canViewCards: true,
      canActivateCard: false,
      canDeactivateCard: false,
      canBlockCard: false,
      canViewCardTransactions: true,

      // Reports & Analytics (Read-only)
      canViewReports: true,
      canExportData: false,

      // System Management
      canViewAuditLogs: false,
      canManageUsers: false,
      canManageSettings: false,
    },

    super_admin: {
      // Employee Management (Full access)
      canViewEmployees: true,
      canCreateEmployee: true,
      canEditEmployee: true,
      canDeleteEmployee: true,

      // Transaction Management (Full access)
      canViewTransactions: true,
      canCreateTransaction: true,
      canApproveTransaction: true,
      canRejectTransaction: true,

      // Salary Advance Management (Full access)
      canViewAdvances: true,
      canCreateAdvance: true,
      canApproveAdvance: true,
      canRejectAdvance: true,

      // Card Management (Full access)
      canViewCards: true,
      canActivateCard: true,
      canDeactivateCard: true,
      canBlockCard: true,
      canViewCardTransactions: true,

      // Reports & Analytics (Full access)
      canViewReports: true,
      canExportData: true,

      // System Management (Full access)
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
