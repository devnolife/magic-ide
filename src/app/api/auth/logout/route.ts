import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWT, calculateSessionDuration } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie or header
    const token = request.cookies.get('auth-token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No active session' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = verifyJWT(token)
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Find and update the session
    const session = await prisma.userSession.findUnique({
      where: { id: payload.sessionId }
    })

    if (session && session.isActive) {
      // Calculate and save session duration
      const duration = calculateSessionDuration(session.loginTime)

      // Update UserSession with logout time
      await prisma.userSession.update({
        where: { id: payload.sessionId },
        data: {
          logoutTime: new Date(),
          duration,
          isActive: false
        }
      })

      // Mark device as inactive
      await prisma.device.update({
        where: { id: payload.deviceId },
        data: { isActive: false }
      })
    }

    // Clear authentication tokens
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

    // Clear cookies
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })

    response.cookies.set('refresh-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })

    return response

  } catch (error) {
    console.error('Logout API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
