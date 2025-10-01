import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { hash: string } }
) {
  try {
    const { hash } = params

    if (!hash || hash.length !== 64) {
      return NextResponse.json(
        { success: false, message: 'Invalid hash format' },
        { status: 400 }
      )
    }

    // This would normally check against your backend API
    // For now, return mock data
    const mockArtwork = {
      id: '1',
      title: 'Sample Digital Art',
      description: 'This is a sample digital artwork',
      creator: {
        name: 'Demo Creator',
        walletAddress: '0x1234567890123456789012345678901234567890'
      },
      fileHash: hash,
      createdAt: new Date().toISOString(),
      status: 'verified',
      certificateUrl: '/api/certificates/1/download',
      nftTokenId: '123'
    }

    return NextResponse.json({
      success: true,
      isValid: true,
      artwork: mockArtwork
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
