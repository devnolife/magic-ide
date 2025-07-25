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

    // Get user progress (includes analytics)
    const progress = await ProgressService.getUserProgress(authResult.user.id)

    // Calculate streak
    const streak = await ProgressService.calculateStreak(authResult.user.id)

    return NextResponse.json({
      success: true,
      data: {
        ...progress,
        streak
      }
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
