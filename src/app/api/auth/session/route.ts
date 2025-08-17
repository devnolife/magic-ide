import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWT, calculateSessionDuration } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie or header
    const token = request.cookies.get('auth-token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'No authentication token provided'
        },
        { status: 401 }
      )
    }

    // Validate current session, return user info
    const payload = verifyJWT(token)
    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or expired token'
        },
        { status: 401 }
      )
    }

    // Check if session is still active
    const session = await prisma.userSession.findFirst({
      where: {
        id: payload.sessionId,
        isActive: true
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatar: true,
            isActive: true
          }
        },
        device: true
      }
    })

    if (!session || !session.user.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: 'Session expired or user inactive'
        },
        { status: 401 }
      )
    }

    // Update last used time for device
    await prisma.device.update({
      where: { id: session.deviceId },
      data: { lastUsed: new Date() }
    })

    return NextResponse.json(
      {
        success: true,
        user: session.user,
        session: {
          id: session.id,
          loginTime: session.loginTime,
          device: {
            id: session.device.id,
            deviceInfo: session.device.deviceInfo,
            lastUsed: session.device.lastUsed
          }
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Session validation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Session validation failed'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Handle logout process
    const token = request.cookies.get('auth-token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'No authentication token provided'
        },
        { status: 401 }
      )
    }

    const payload = verifyJWT(token)
    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid token'
        },
        { status: 401 }
      )
    }

    // Find the session
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
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully'
      },
      { status: 200 }
    )

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
    console.error('Logout error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Logout failed'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Force logout (update UserSession with logout time)
    const token = request.cookies.get('auth-token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'No authentication token provided'
        },
        { status: 401 }
      )
    }

    const payload = verifyJWT(token)
    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid token'
        },
        { status: 401 }
      )
    }

    // Force logout all sessions for the user
    const activeSessions = await prisma.userSession.findMany({
      where: {
        userId: payload.userId,
        isActive: true
      }
    })

    // Update all active sessions
    for (const session of activeSessions) {
      const duration = calculateSessionDuration(session.loginTime)

      await prisma.userSession.update({
        where: { id: session.id },
        data: {
          logoutTime: new Date(),
          duration,
          isActive: false
        }
      })
    }

    // Mark all user devices as inactive
    await prisma.device.updateMany({
      where: { userId: payload.userId },
      data: { isActive: false }
    })

    // Clear authentication tokens
    const response = NextResponse.json(
      {
        success: true,
        message: 'Force logout completed for all devices'
      },
      { status: 200 }
    )

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
    console.error('Force logout error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Force logout failed'
      },
      { status: 500 }
    )
  }
}
