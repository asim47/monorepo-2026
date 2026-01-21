export const PERMISSIONS = [
  // Admin Management
  'adminManagement.superAdmin.create',
  'adminManagement.superAdmin.read',
  'adminManagement.superAdmin.update',
  'adminManagement.superAdmin.delete',

  'adminManagement.admin.create',
  'adminManagement.admin.read',
  'adminManagement.admin.update',
  'adminManagement.admin.delete',

  'adminManagement.contentManager.create',
  'adminManagement.contentManager.read',
  'adminManagement.contentManager.update',
  'adminManagement.contentManager.delete',

  // Customer Management
  'customerManagement.customer.create',
  'customerManagement.customer.read',
  'customerManagement.customer.update',
  'customerManagement.customer.delete',

  'customerManagement.customerTeam.create',
  'customerManagement.customerTeam.read',
  'customerManagement.customerTeam.update',
  'customerManagement.customerTeam.delete',

  'customerManagement.engineer.create',
  'customerManagement.engineer.read',
  'customerManagement.engineer.update',
  'customerManagement.engineer.delete',

  // Brokerage Management
  'brokerageManagement.brokerage.create',
  'brokerageManagement.brokerage.read',
  'brokerageManagement.brokerage.update',
  'brokerageManagement.brokerage.delete',

  'brokerageManagement.brokerageAdmin.create',
  'brokerageManagement.brokerageAdmin.read',
  'brokerageManagement.brokerageAdmin.update',
  'brokerageManagement.brokerageAdmin.delete',

  'brokerageManagement.agent.create',
  'brokerageManagement.agent.read',
  'brokerageManagement.agent.update',
  'brokerageManagement.agent.delete',

  // Project Management
  'projectManagement.project.create',
  'projectManagement.project.read',
  'projectManagement.project.update',
  'projectManagement.project.delete',

  'projectManagement.masterplan.create',
  'projectManagement.masterplan.read',
  'projectManagement.masterplan.update',
  'projectManagement.masterplan.delete',

  'projectManagement.phase.create',
  'projectManagement.phase.read',
  'projectManagement.phase.update',
  'projectManagement.phase.delete',

  'projectManagement.building.create',
  'projectManagement.building.read',
  'projectManagement.building.update',
  'projectManagement.building.delete',

  'projectManagement.layout.create',
  'projectManagement.layout.read',
  'projectManagement.layout.update',
  'projectManagement.layout.delete',

  'projectManagement.unit.create',
  'projectManagement.unit.read',
  'projectManagement.unit.update',
  'projectManagement.unit.delete',

  'projectManagement.room.create',
  'projectManagement.room.read',
  'projectManagement.room.update',
  'projectManagement.room.delete',

  // Hub Page Management
  'hubPageManagement.hubPage.create',
  'hubPageManagement.hubPage.read',
  'hubPageManagement.hubPage.update',
  'hubPageManagement.hubPage.delete',

  // Agent Portal Management
  'agentPortalManagement.agentPortal.create',
  'agentPortalManagement.agentPortal.read',
  'agentPortalManagement.agentPortal.update',
  'agentPortalManagement.agentPortal.delete',

  // Asset Management
  'assetManagement.asset.create',
  'assetManagement.asset.read',
  'assetManagement.asset.update',
  'assetManagement.asset.delete',

  'assetManagement.3dModel.create',
  'assetManagement.3dModel.read',
  'assetManagement.3dModel.update',
  'assetManagement.3dModel.delete',

  // Invoice Management
  'invoiceManagement.invoice.create',
  'invoiceManagement.invoice.read',
  'invoiceManagement.invoice.update',
  'invoiceManagement.invoice.delete',

  // Payment Management
  'paymentManagement.paymentMethod.create',
  'paymentManagement.paymentMethod.read',
  'paymentManagement.paymentMethod.update',
  'paymentManagement.paymentMethod.delete',

  // Analytics
  'analytics.projects.read',
  'analytics.customer.read',

  // Integration Management
  'integrationManagement.proximaX.create',
  'integrationManagement.proximaX.read',
  'integrationManagement.proximaX.update',
  'integrationManagement.proximaX.delete',

  // X Components Management
  'xComponents.3dModel.create',
  'xComponents.3dModel.read',
  'xComponents.3dModel.update',
  'xComponents.3dModel.delete',

  'xComponents.floorPlan.create',
  'xComponents.floorPlan.read',
  'xComponents.floorPlan.update',
  'xComponents.floorPlan.delete',

  'xComponents.units.create',
  'xComponents.units.read',
  'xComponents.units.update',
  'xComponents.units.delete',

  'xComponents.sitemap.create',
  'xComponents.sitemap.read',
  'xComponents.sitemap.update',
  'xComponents.sitemap.delete',

  'xComponents.interactiveMap.create',
  'xComponents.interactiveMap.read',
  'xComponents.interactiveMap.update',
  'xComponents.interactiveMap.delete',

  // Permission Management
  'permissionManagement.permission.create',
  'permissionManagement.permission.read',
  'permissionManagement.permission.update',
  'permissionManagement.permission.delete',

  'permissionManagement.userGroup.create',
  'permissionManagement.userGroup.read',
  'permissionManagement.userGroup.update',
  'permissionManagement.userGroup.delete',

];

// Super Admin gets all permissions
export const SUPER_ADMIN_PERMISSIONS = [...PERMISSIONS];

// Permission groups for different user types
export const PERMISSION_GROUPS = {
  SUPER_ADMIN: [...PERMISSIONS],

  ADMIN: PERMISSIONS.filter((p) => !p.includes('superAdmin') && !p.includes('permissionManagement.permission')),

  CONTENT_MANAGER: PERMISSIONS.filter(
    (p) =>
      p.includes('contentManagement') ||
      p.includes('assetManagement') ||
      p.includes('hubPageManagement') ||
      p.includes('agentPortalManagement'),
  ),

  CUSTOMER: PERMISSIONS.filter(
    (p) =>
      p.includes('customerManagement.customerTeam') ||
      p.includes('projectManagement.project') ||
      p.includes('hubPageManagement.hubPage') ||
      p.includes('agentPortalManagement.agentPortal') ||
      p.includes('invoiceManagement.invoice') ||
      p.includes('paymentManagement') ||
      p.includes('integrationManagement.proximaX') ||
      p.includes('analytics.customer'),
  ),

  CUSTOMER_TEAM_MEMBER: PERMISSIONS.filter(
    (p) =>
      p.includes('.read') &&
      (p.includes('projectManagement') || p.includes('hubPageManagement') || p.includes('agentPortalManagement')),
  ),

  ENGINEER: PERMISSIONS.filter(
    (p) => p.includes('projectManagement') || p.includes('assetManagement.3dModel') || p.includes('xComponents'),
  ),

  BROKERAGE_ADMIN: [
    'system.agentPortal.read',
    'brokerageManagement.agent.create',
    'brokerageManagement.agent.read',
    'brokerageManagement.agent.update',
    'agentPortalManagement.agentPortal.read',
  ],

  AGENT: ['system.agentPortal.read', 'agentPortalManagement.agentPortal.read', 'assetManagement.asset.read'],
};
