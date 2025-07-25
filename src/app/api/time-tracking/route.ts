import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/authService'
import { ProgressService } from '@/lib/progressService'

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
    const { chapterNumber, timeSpent, lessonNumber, action } = body

    if (typeof chapterNumber !== 'number' || typeof timeSpent !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Chapter number and time spent are required' },
        { status: 400 }
      )
    }

    if (action === 'start_session') {
      // Record session start - just acknowledge
      return NextResponse.json({ success: true, message: 'Session started' })
    }

    if (action === 'end_session') {
      // Record time spent when session ends
      await ProgressService.trackTimeSpent(
        authResult.user.id,
        chapterNumber,
        timeSpent,
        lessonNumber
      )

      return NextResponse.json({ success: true, message: 'Time tracked' })
    }

    // Default: track time
    await ProgressService.trackTimeSpent(
      authResult.user.id,
      chapterNumber,
      timeSpent,
      lessonNumber
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Time tracking API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
