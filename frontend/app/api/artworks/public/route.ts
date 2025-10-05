import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '50'

    const response = await fetch(
      `http://localhost:5000/api/artworks/public?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}


