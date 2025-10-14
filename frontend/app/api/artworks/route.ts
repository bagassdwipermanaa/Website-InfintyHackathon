import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '50'
    const status = searchParams.get('status') || 'all'

    const authHeader = request.headers.get('authorization') || ''

    const url = status === 'verified'
      ? `http://localhost:5000/api/artworks/public?page=${page}&limit=${limit}`
      : `http://localhost:5000/api/artworks?page=${page}&limit=${limit}&status=${status}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    
    // Debug: log first artwork to check user_id
    if (data?.data?.artworks?.length > 0) {
      console.log('🔍 API Route - First artwork:', {
        id: data.data.artworks[0].id,
        user_id: data.data.artworks[0].user_id,
        title: data.data.artworks[0].title
      })
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
