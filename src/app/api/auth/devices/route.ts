import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyJWT, calculateSessionDuration, generateDeviceFingerprint, parseDeviceInfo } from '@/lib/auth'

// Schema for device registration
const registerDeviceSchema = z.object({
  deviceInfo: z.object({
    browser: z.string(),
    os: z.string(),
    device: z.string(),
    userAgent: z.string(),
    ip: z.string().optional()
  })
})

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

    // List user's registered devices
    const devices = await prisma.device.findMany({
      where: { userId: payload.userId },
      include: {
        sessions: {
          where: { isActive: true },
          orderBy: { loginTime: 'desc' },
          take: 1
        }
      },
      orderBy: { lastUsed: 'desc' }
    })

    const deviceList = devices.map(device => ({
      id: device.id,
      deviceInfo: device.deviceInfo,
      isActive: device.isActive,
      lastUsed: device.lastUsed,
      createdAt: device.createdAt,
      currentSession: device.sessions.length > 0 ? {
        id: device.sessions[0].id,
        loginTime: device.sessions[0].loginTime
      } : null
    }))

    return NextResponse.json(
      {
        success: true,
        devices: deviceList,
        activeDeviceCount: devices.filter(d => d.isActive).length
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Device list error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve devices'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Force logout from specific device
    const { searchParams } = new URL(request.url)
    const deviceId = searchParams.get('deviceId')

    if (!deviceId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Device ID is required'
        },
        { status: 400 }
      )
    }

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
          error: 'Invalid or expired token'
        },
        { status: 401 }
      )
    }

    // Verify device belongs to the user
    const device = await prisma.device.findFirst({
      where: {
        id: deviceId,
        userId: payload.userId
      }
    })

    if (!device) {
      return NextResponse.json(
        {
          success: false,
          error: 'Device not found or access denied'
        },
        { status: 404 }
      )
    }

    // Force logout from specific device
    const activeSessions = await prisma.userSession.findMany({
      where: {
        deviceId: deviceId,
        isActive: true
      }
    })

    // Update all active sessions for this device
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

    // Mark device as inactive
    await prisma.device.update({
      where: { id: deviceId },
      data: { isActive: false }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Device logged out successfully'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Device logout error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to logout device'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Register new device (internal use)
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
          error: 'Invalid or expired token'
        },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate input
    const validationResult = registerDeviceSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid device information',
          details: validationResult.error.issues
        },
        { status: 400 }
      )
    }

    const { deviceInfo } = validationResult.data

    // Handle device limit enforcement (max 1 active)
    const activeDevicesCount = await prisma.device.count({
      where: {
        userId: payload.userId,
        isActive: true
      }
    })

    if (activeDevicesCount >= 1) {
      // Deactivate all existing devices for this user
      await prisma.device.updateMany({
        where: {
          userId: payload.userId,
          isActive: true
        },
        data: { isActive: false }
      })

      // Deactivate all active sessions
      const activeSessions = await prisma.userSession.findMany({
        where: {
          userId: payload.userId,
          isActive: true
        }
      })

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
    }

    // Generate device fingerprint
    const deviceFingerprint = generateDeviceFingerprint(
      deviceInfo.userAgent,
      deviceInfo.ip
    )

    // Check if device already exists
    let device = await prisma.device.findUnique({
      where: { deviceFingerprint }
    })

    if (!device) {
      // Create new device
      device = await prisma.device.create({
        data: {
          userId: payload.userId,
          deviceFingerprint,
          deviceInfo: deviceInfo as any,
          isActive: true,
          lastUsed: new Date()
        }
      })
    } else {
      // Update existing device
      device = await prisma.device.update({
        where: { id: device.id },
        data: {
          isActive: true,
          lastUsed: new Date()
        }
      })
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Device registered successfully',
        device: {
          id: device.id,
          deviceInfo: device.deviceInfo,
          isActive: device.isActive,
          lastUsed: device.lastUsed
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Device registration error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to register device'
      },
      { status: 500 }
    )
  }
}
