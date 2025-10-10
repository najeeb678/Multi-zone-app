import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getToken } from "next-auth/jwt";
import { authOptions } from "../../auth/[...nextauth]/route";
import axios from "axios";

// Proxy all API calls to backend
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
  const backendUrl = process.env.BACKEND_URL || process.env.APP_BASE_URL || "https://devapi.techship.me";

  // Get NextAuth session to check authentication and get backend token
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { STATUS: "FAILED", MESSAGE: "authentication required to access the resource" },
      { status: 401 }
    );
  }

  // Get the backend token from the JWT token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token || !token.backendToken) {
    return NextResponse.json(
      { STATUS: "FAILED", MESSAGE: "backend token not found in session" },
      { status: 401 }
    );
  }

  const backendToken = token.backendToken;

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

    // Create axios instance with backend configuration
    const apiClient = axios.create({
      baseURL: backendUrl,
      headers: {
        Authorization: `Bearer ${backendToken}`,
        "Content-Type": "application/json",
        "x-host": request.headers.get("host") || "",
        "x-device-id": request.headers.get("x-device-id") || "",
      },
    });

    // Make the backend request using axios
    const backendResponse = await apiClient({
      method: request.method.toLowerCase(),
      url: apiPath,
      data: requestBody,
      validateStatus: () => true, // Don't throw on any status code
    });

    // For demo purposes, return mock data if backend is not available
    if (!process.env.BACKEND_URL && !process.env.APP_BASE_URL) {
      return getMockResponse(apiPath, request.method);
    }

    console.log(`📡 Backend response: ${apiPath} -> ${backendResponse.status}`);

    return NextResponse.json(backendResponse.data, { status: backendResponse.status });
  } catch (error) {
    console.error("Backend proxy error:", error.message);

    // Return mock data for demo
    if (!process.env.BACKEND_URL && !process.env.APP_BASE_URL) {
      return getMockResponse(apiPath, request.method);
    }

    // Handle axios errors
    if (error.response) {
      // Backend responded with error status
      return NextResponse.json(error.response.data || { STATUS: "FAILED", MESSAGE: "Backend error" }, {
        status: error.response.status,
      });
    } else if (error.request) {
      // Network error
      return NextResponse.json(
        { STATUS: "FAILED", MESSAGE: "Backend service unavailable" },
        { status: 503 }
      );
    } else {
      // Other error
      return NextResponse.json({ STATUS: "FAILED", MESSAGE: "Internal server error" }, { status: 500 });
    }
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
