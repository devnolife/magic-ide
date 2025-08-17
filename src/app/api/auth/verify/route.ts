import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWT } from '@/lib/auth'

export async function GET(request: NextRequest) {
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

    // Verify token and get user data
    const payload = verifyJWT(token)
    if (!payload) {
      // Clear invalid cookie
      const response = NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
      response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0
      })
      return response
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
      // Clear invalid cookie
      const response = NextResponse.json(
        { success: false, error: 'Session expired or user inactive' },
        { status: 401 }
      )
      response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0
      })
      return response
    }

    // Update last used time for device
    await prisma.device.update({
      where: { id: session.deviceId },
      data: { lastUsed: new Date() }
    })

    return NextResponse.json({
      success: true,
      user: session.user
    })

  } catch (error) {
    console.error('Verify API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
