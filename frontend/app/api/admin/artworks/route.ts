import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";
    const status = searchParams.get("status") || "all";

    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization header required" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `http://localhost:5000/api/admin/artworks?page=${page}&limit=${limit}&status=${status}`,
      {
        method: "GET",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Admin artworks API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
