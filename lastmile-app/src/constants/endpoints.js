// API endpoints - all calls go through host app proxy at /api/v2/
export const LastMile = {
  driverlist: "/api/v2/MAN/driver/get/list",
  warehouseList: "/api/v2/MAN/warehouse/get/list",
  shelfList: "/api/v2/MAN/warehouse/get/shelves/list",
  allOrders: "/api/v2/LM/order/get/for/admin",
  orderStatus: "/api/v2/LM/order/update/status",
  driverAssignment: "/api/v2/LM/driver/assign",
  routeOptimization: "/api/v2/LM/route/optimize",
  deliveryTracking: "/api/v2/LM/delivery/track",
  reverseCreateOrder: "/api/v2/LM/order/reverse/create/by/client",
};

export const orders = "/api/v2/LM/order/get/for/admin?";
