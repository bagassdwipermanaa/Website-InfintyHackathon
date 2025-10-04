import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const userId = params.id;
    const body = await request.json();

    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization header required" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `http://localhost:5000/api/admin/users/${userId}/toggle-status`,
      {
        method: "PUT",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Admin user toggle status API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
