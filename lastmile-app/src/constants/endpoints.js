// API endpoints - all calls go through host app at /api/v2/
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
