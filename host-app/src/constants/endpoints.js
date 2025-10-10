// API endpoints for the host app
export const CommonEndpoints = {
  login: "/v2/api/oauth/token",
  logout: "/v2/api/logout",
  authenticate: "/v2/api/authenticate",
  refreshToken: "/v2/api/refresh-token",
  Upload: "/v2/api/upload/",
  TenantSettings: "/v2/api/tenant/settings",
  TwoFactorAuthEnable: "/v2/api/oauth/enable/2fa",
  TwoFactorAuthDisable: "/v2/api/oauth/disable/2fa",
  VerifyTwoFactorAuth: "/v2/api/oauth/verify/2fa",
};

// Lastmile endpoints
export const LastMile = {
  driverlist: "/MAN/driver/get/list",
  warehouseList: "/MAN/warehouse/get/list",
  shelfList: "/MAN/warehouse/get/shelves/list",
  allOrders: "/LM/order/get/for/admin",
  orderStatus: "/LM/order/update/status",
  driverAssignment: "/LM/driver/assign",
  routeOptimization: "/LM/route/optimize",
  deliveryTracking: "/LM/delivery/track",
};

// Fulfillment endpoints
export const Fulfillment = {
  orders: "/FF/order/get/for/admin",
  inventory: "/FF/inventory/get/list",
  pickList: "/FF/pick/list/get",
  packList: "/FF/pack/list/get",
  shipments: "/FF/shipment/get/list",
};
