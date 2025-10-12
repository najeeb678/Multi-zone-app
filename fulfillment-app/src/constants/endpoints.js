// Fulfillment API endpoints - all calls go through host app proxy at /v2/api/
export const FulfillmentEndpoints = {
  BundlesCreate: "/v2/api/FUL/product/bundle/create/by/admin",
  ChildProductsCreate: "/v2/api/FUL/product/pull/and/create/child",
  Clients: "/v2/api/MAN/client/get/fulfilment/list",
  CreateBulkOrders: "/v2/api/FUL/fulfilment/order/bulk",
  CreateOrder: "/v2/api/FUL/fulfilment/order",
  LocationBarcode: "/v2/api/FUL/barcode",
  Orders: "/v2/api/FUL/fulfilment/order/get/for/admin",
  OrderCancel3pl: "/v2/api/FUL/fulfilment/order/removed/forcefully/from/self",
  OrderCreateThreepl: "/v2/api/FUL/fulfilment/order/three/pl/create",
  OrderProductDetails: "/v2/api/FUL/fulfilment/order/get/product/details",
  OrdersExport: "/v2/api/FUL/fulfilment/order/export/excel/for/admin",
  OrderStatuses: "/v2/api/FUL/fulfilment/order/get/status",
  OrderUpdateCity: "/v2/api/FUL/fulfilment/order/update/city",
  OrderCancel: "/v2/api/FUL/fulfilment/order/cancel",
  OrderInvoice: "/v2/api/FUL/fulfilment/order/get/platform/pdf/data",
  OrderSallaInvoice: "/v2/api/MAN/platform/salla/invoice",
  PackOrders: "/v2/api/FUL/fulfilment/order/packed",
};

// Management endpoints (shared across apps)
export const ManagementEndpoints = {
  Clients: "/v2/api/MAN/client/get/fulfilment/list",
  DriverList: "/v2/api/MAN/driver/get/list",
  WarehouseList: "/v2/api/MAN/warehouse/get/list",
  SallaInvoice: "/v2/api/MAN/platform/salla/invoice",
};

export default FulfillmentEndpoints;
