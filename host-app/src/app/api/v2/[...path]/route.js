import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated, getAuthCookie } from "../../../../utils/auth";

// Proxy all API calls to backend - equivalent to your Express server middleware
export async function GET(request) {
  return handleApiProxy(request);
}

export async function POST(request) {
  return handleApiProxy(request);
}

export async function PUT(request) {
  return handleApiProxy(request);
}

export async function DELETE(request) {
  return handleApiProxy(request);
}

async function handleApiProxy(request) {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split("/");

  // Extract the actual API path (remove /api/v2 prefix)
  const apiPath = "/" + pathSegments.slice(3).join("/");

  console.log(`🔄 API Proxy: ${request.method} ${apiPath}`);

  // Backend URL from environment
  const backendUrl = process.env.APP_BASE_URL || "https://devapi.techship.me";

  // Check authentication (handled by middleware, but double-check)
  if (!isAuthenticated(request)) {
    return NextResponse.json(
      { STATUS: "FAILED", MESSAGE: "authentication required to access the resource" },
      { status: 401 }
    );
  }

  const authCookie = getAuthCookie(request);

  try {
    // Prepare request body for non-GET requests
    let requestBody;
    if (request.method !== "GET") {
      try {
        requestBody = await request.json();
      } catch (e) {
        requestBody = null;
      }
    }

    // Prepare headers for backend request
    const headers = {
      Authorization: `Bearer ${authCookie.value}`,
      "Content-Type": "application/json",
      "x-host": request.headers.get("host") || "",
      "x-device-id": request.headers.get("x-device-id") || "",
    };

    // Make the backend request
    const backendResponse = await fetch(`${backendUrl}${apiPath}`, {
      method: request.method,
      headers: headers,
      body: requestBody ? JSON.stringify(requestBody) : undefined,
    });

    // For demo purposes, return mock data if backend is not available
    if (!process.env.APP_BASE_URL) {
      return getMockResponse(apiPath, request.method);
    }

    // Forward the backend response
    const responseData = await backendResponse.json();
    console.log(`📡 Backend response: ${apiPath} -> ${backendResponse.status}`);

    return NextResponse.json(responseData, { status: backendResponse.status });
  } catch (error) {
    console.error("Backend proxy error:", error);

    // Return mock data for demo
    if (!process.env.APP_BASE_URL) {
      return getMockResponse(apiPath, request.method);
    }

    return NextResponse.json(
      { STATUS: "FAILED", MESSAGE: "Backend service unavailable" },
      { status: 500 }
    );
  }
}

function getMockResponse(apiPath, method) {
  console.log(`🎭 Returning mock data for: ${method} ${apiPath}`);

  // Mock responses for different endpoints
  if (apiPath.includes("/warehouse/get/list")) {
    return NextResponse.json({
      status: 200,
      data: {
        data: [
          { id: "WH001", name: "Main Warehouse", location: "New York", capacity: 1000 },
          { id: "WH002", name: "Secondary Warehouse", location: "California", capacity: 800 },
          { id: "WH003", name: "Regional Hub", location: "Texas", capacity: 600 },
        ],
      },
    });
  }

  if (apiPath.includes("/driver/get/list")) {
    return NextResponse.json({
      status: 200,
      data: {
        data: [
          { id: "DRV001", name: "John Doe", vehicle: "Van-123", status: "available" },
          { id: "DRV002", name: "Jane Smith", vehicle: "Truck-456", status: "busy" },
          { id: "DRV003", name: "Mike Johnson", vehicle: "Bike-789", status: "available" },
        ],
      },
    });
  }

  if (apiPath.includes("/order/get/for/admin")) {
    return NextResponse.json({
      status: 200,
      data: {
        data: [
          { id: "ORD001", customer: "Alice Brown", status: "pending", amount: 150 },
          { id: "ORD002", customer: "Bob Wilson", status: "delivered", amount: 230 },
          { id: "ORD003", customer: "Carol Davis", status: "in-transit", amount: 89 },
        ],
      },
    });
  }

  // Default successful response
  return NextResponse.json({
    status: 200,
    message: "Operation completed successfully",
    data: { success: true, timestamp: new Date().toISOString() },
  });
}
