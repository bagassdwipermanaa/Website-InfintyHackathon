import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        { error: "Token tidak ditemukan" },
        { status: 401 }
      );
    }

    // Get user data from token (simple implementation)
    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Token tidak valid" },
        { status: 401 }
      );
    }

    const userData = await response.json();
    
    return NextResponse.json({
      success: true,
      user: userData.user,
    });
  } catch (error) {
    console.error("Error checking profile status:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}