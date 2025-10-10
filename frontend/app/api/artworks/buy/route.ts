import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization') || ''
    const body = await request.json()
    const { artworkId, paymentMethod } = body

    if (!artworkId || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: 'artworkId dan paymentMethod wajib diisi' },
        { status: 400 }
      )
    }

    const response = await fetch('http://localhost:5000/api/artworks/buy', {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ artworkId, paymentMethod })
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
