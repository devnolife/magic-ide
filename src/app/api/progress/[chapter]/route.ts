import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/authService'
import { ProgressService } from '@/lib/progressService'

export async function GET(
  request: NextRequest,
  { params }: { params: { chapter: string } }
) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const authResult = await AuthService.verifyToken(token)
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Invalid session' },
        { status: 401 }
      )
    }

    const chapterNumber = parseInt(params.chapter)
    if (isNaN(chapterNumber) || chapterNumber < 0 || chapterNumber > 5) {
      return NextResponse.json(
        { success: false, error: 'Invalid chapter number' },
        { status: 400 }
      )
    }

    // Get chapter-specific progress
    const progress = await ProgressService.getChapterProgress(
      authResult.user.id,
      chapterNumber
    )

    return NextResponse.json({
      success: true,
      data: progress
    })
  } catch (error) {
    console.error('Get chapter progress API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
