import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/authService'
import { ProgressService } from '@/lib/progressService'

export async function GET(request: NextRequest) {
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

    // Get user progress
    const progress = await ProgressService.getUserProgress(authResult.user.id)

    return NextResponse.json({
      success: true,
      data: progress
    })
  } catch (error) {
    console.error('Get progress API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'complete_lesson':
        await ProgressService.completLesson(
          authResult.user.id,
          data.chapterNumber,
          data.lessonNumber,
          data.lessonTitle,
          data.timeSpent || 0
        )
        break

      case 'track_time':
        await ProgressService.trackTimeSpent(
          authResult.user.id,
          data.chapterNumber,
          data.timeSpent,
          data.lessonNumber
        )
        break

      case 'update_chapter':
        await ProgressService.updateChapterProgress({
          userId: authResult.user.id,
          ...data
        })
        break

      case 'record_analytics':
        await ProgressService.recordAnalytics({
          userId: authResult.user.id,
          ...data
        })
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update progress API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
