import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '10'
    const status = searchParams.get('status')
    const category = searchParams.get('category')

    // This would normally fetch from your backend API
    // For now, return mock data
    const mockArtworks = [
      {
        id: '1',
        title: 'Sample Digital Art',
        description: 'This is a sample digital artwork',
        fileHash: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890',
        fileType: 'image/png',
        fileSize: 1024000,
        createdAt: new Date().toISOString(),
        status: 'verified',
        certificateUrl: '/api/certificates/1/download'
      }
    ]

    return NextResponse.json({
      success: true,
      artworks: mockArtworks,
      pagination: {
        total: mockArtworks.length,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(mockArtworks.length / parseInt(limit))
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
