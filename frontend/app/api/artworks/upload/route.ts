import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization header required" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = String(formData.get("title") || "Untitled");
    const description = String(formData.get("description") || "");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File is required" },
        { status: 400 }
      );
    }

    // Kirim metadata ke backend (daftarkan karya menggunakan hash sisi klien)
    // Hash cepat menggunakan Web Crypto API
    const arrayBuffer = await file.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(digest));
    const fileHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    const payload = new FormData();
    payload.append("title", title);
    payload.append("description", description);
    payload.append("fileType", file.type || "application/octet-stream");
    payload.append("fileSize", String((file as any).size || 0));
    payload.append("fileHash", fileHash);

    const response = await fetch(`http://localhost:5000/api/artworks/register`, {
      method: "POST",
      headers: { Authorization: authHeader },
      body: JSON.stringify({
        title,
        description,
        fileType: file.type || "application/octet-stream",
        fileSize: (file as any).size || 0,
        fileHash,
      }),
    } as any);

    // Fallback untuk lingkungan yang tidak mengizinkan JSON body pada fetch di atas
    if (!response || !(response as any).ok) {
      const response2 = await fetch(`http://localhost:5000/api/artworks/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          title,
          description,
          fileType: file.type || "application/octet-stream",
          fileSize: (file as any).size || 0,
          fileHash,
        }),
      });
      const data2 = await response2.json();
      return NextResponse.json(data2, { status: response2.status });
    }

    const data = await (response as any).json();
    return NextResponse.json(data, { status: (response as any).status });
  } catch (error) {
    console.error("Artwork upload API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}


