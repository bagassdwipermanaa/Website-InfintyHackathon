import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization header required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(`http://localhost:5000/api/auth/profile`, {
      method: "PUT",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Update profile API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
