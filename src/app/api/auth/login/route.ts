import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import {
  verifyPassword,
  generateJWT,
  generateDeviceFingerprint,
  parseDeviceInfo,
  generateSessionToken
} from '@/lib/auth'

// Zod schema for input validation
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input with Zod schema
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input data',
          details: validationResult.error.issues
        },
        { status: 400 }
      )
    }

    const { username, password } = validationResult.data

    // Extract device info from request
    const userAgent = request.headers.get('user-agent') || ''
    const ip = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1'

    const deviceInfo = parseDeviceInfo(userAgent, ip)

    // Validate credentials against database
    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user || !user.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid username or password'
        },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid username or password'
        },
        { status: 401 }
      )
    }

    const deviceFingerprint = generateDeviceFingerprint(userAgent, ip)

    // Check if user already has active session on another device
    const activeSession = await prisma.userSession.findFirst({
      where: {
        userId: user.id,
        isActive: true
      },
      include: {
        device: true
      }
    })

    // If active session exists on different device: force logout from other device
    if (activeSession && activeSession.device.deviceFingerprint !== deviceFingerprint) {
      // Calculate duration for the previous session
      const duration = Math.floor((new Date().getTime() - activeSession.loginTime.getTime()) / (1000 * 60))

      // Force logout from other device
      await prisma.userSession.update({
        where: { id: activeSession.id },
        data: {
          logoutTime: new Date(),
          duration,
          isActive: false
        }
      })

      // Mark the old device as inactive
      await prisma.device.update({
        where: { id: activeSession.deviceId },
        data: { isActive: false }
      })
    }

    // Find or create device record for current login
    let device = await prisma.device.findUnique({
      where: { deviceFingerprint }
    })

    if (!device) {
      device = await prisma.device.create({
        data: {
          userId: user.id,
          deviceFingerprint,
          deviceInfo: deviceInfo as any,
          isActive: true,
          lastUsed: new Date()
        }
      })
    } else {
      // Update existing device
      await prisma.device.update({
        where: { id: device.id },
        data: {
          isActive: true,
          lastUsed: new Date()
        }
      })
    }

    // Create new device record for current login (if needed)
    // This is handled above in the device creation/update logic

    // Generate JWT tokens (access token)
    const sessionToken = generateSessionToken()

    // Create UserSession record with login time
    const userSession = await prisma.userSession.create({
      data: {
        userId: user.id,
        deviceId: device.id,
        sessionToken,
        loginTime: new Date(),
        isActive: true
      }
    })

    // Generate JWT with session info
    const accessToken = generateJWT({
      userId: user.id,
      username: user.username,
      deviceId: device.id,
      sessionId: userSession.id
    }, '7d') // 7 days for access token

    const refreshToken = generateJWT({
      userId: user.id,
      username: user.username,
      deviceId: device.id,
      sessionId: userSession.id
    }, '30d') // 30 days for refresh token

    // Return tokens and user info
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          avatar: user.avatar
        },
        accessToken,
        refreshToken
      },
      { status: 200 }
    )

    // Set HTTP-only cookies for tokens
    response.cookies.set('auth-token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    response.cookies.set('refresh-token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error. Please try again later.'
      },
      { status: 500 }
    )
  }
}
