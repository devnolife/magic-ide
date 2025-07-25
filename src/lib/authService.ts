import { prisma } from '@/lib/prisma'
import {
  hashPassword,
  verifyPassword,
  generateJWT,
  verifyJWT,
  generateDeviceFingerprint,
  parseDeviceInfo,
  generateSessionToken,
  validateUsername,
  validatePassword,
  calculateSessionDuration,
  type DeviceInfo,
  type JWTPayload
} from '@/lib/auth'

export interface AuthResult {
  success: boolean
  user?: {
    id: string
    username: string
    fullName?: string
    avatar?: string
  }
  token?: string
  error?: string
}

export interface LoginCredentials {
  username: string
  password: string
  deviceInfo: DeviceInfo
}

export interface RegisterData {
  username: string
  password: string
  fullName?: string
  deviceInfo: DeviceInfo
}

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterData): Promise<AuthResult> {
    try {
      // Validate input
      const usernameValidation = validateUsername(data.username)
      if (!usernameValidation.isValid) {
        return { success: false, error: usernameValidation.error }
      }

      const passwordValidation = validatePassword(data.password)
      if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.error }
      }

      // Check if username already exists
      const existingUser = await prisma.user.findUnique({
        where: { username: data.username }
      })

      if (existingUser) {
        return { success: false, error: 'Username already exists' }
      }

      // Hash password
      const hashedPassword = await hashPassword(data.password)

      // Create user
      const user = await prisma.user.create({
        data: {
          username: data.username,
          password: hashedPassword,
          fullName: data.fullName
        }
      })

      // Create device and session
      const { deviceId, sessionId, token } = await this.createUserSession(
        user.id,
        data.deviceInfo
      )

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName || undefined,
          avatar: user.avatar || undefined
        },
        token
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Registration failed. Please try again.' }
    }
  }

  /**
   * Login user with username and password
   */
  static async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      // Find user by username
      const user = await prisma.user.findUnique({
        where: { username: credentials.username }
      })

      if (!user || !user.isActive) {
        return { success: false, error: 'Invalid username or password' }
      }

      // Verify password
      const isPasswordValid = await verifyPassword(credentials.password, user.password)
      if (!isPasswordValid) {
        return { success: false, error: 'Invalid username or password' }
      }

      // Check for single device restriction
      await this.handleSingleDeviceLogin(user.id, credentials.deviceInfo)

      // Create new session
      const { deviceId, sessionId, token } = await this.createUserSession(
        user.id,
        credentials.deviceInfo
      )

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName || undefined,
          avatar: user.avatar || undefined
        },
        token
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  /**
   * Logout user and end session
   */
  static async logout(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = verifyJWT(token)
      if (!payload) {
        return { success: false, error: 'Invalid token' }
      }

      // Update session with logout time
      const session = await prisma.userSession.findUnique({
        where: { id: payload.sessionId }
      })

      if (session) {
        const duration = calculateSessionDuration(session.loginTime)

        await prisma.userSession.update({
          where: { id: payload.sessionId },
          data: {
            logoutTime: new Date(),
            duration,
            isActive: false
          }
        })
      }

      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: 'Logout failed' }
    }
  }

  /**
   * Verify token and get user session
   */
  static async verifyToken(token: string): Promise<AuthResult> {
    try {
      const payload = verifyJWT(token)
      if (!payload) {
        return { success: false, error: 'Invalid or expired token' }
      }

      // Check if session is still active
      const session = await prisma.userSession.findFirst({
        where: {
          id: payload.sessionId,
          isActive: true
        },
        include: {
          user: true,
          device: true
        }
      })

      if (!session || !session.user.isActive) {
        return { success: false, error: 'Session expired or user inactive' }
      }

      return {
        success: true,
        user: {
          id: session.user.id,
          username: session.user.username,
          fullName: session.user.fullName || undefined,
          avatar: session.user.avatar || undefined
        },
        token
      }
    } catch (error) {
      console.error('Token verification error:', error)
      return { success: false, error: 'Token verification failed' }
    }
  }

  /**
   * Handle single device login restriction
   */
  private static async handleSingleDeviceLogin(userId: string, deviceInfo: DeviceInfo) {
    const deviceFingerprint = generateDeviceFingerprint(
      deviceInfo.userAgent,
      deviceInfo.ip
    )

    // Check if this device already exists
    const existingDevice = await prisma.device.findUnique({
      where: { deviceFingerprint }
    })

    if (!existingDevice) {
      // Deactivate all other devices for this user (single device restriction)
      await prisma.device.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false }
      })

      // Deactivate all active sessions for this user
      await prisma.userSession.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false }
      })
    }
  }

  /**
   * Create user session and device
   */
  private static async createUserSession(userId: string, deviceInfo: DeviceInfo) {
    const deviceFingerprint = generateDeviceFingerprint(
      deviceInfo.userAgent,
      deviceInfo.ip
    )

    // Find or create device
    let device = await prisma.device.findUnique({
      where: { deviceFingerprint }
    })

    if (!device) {
      device = await prisma.device.create({
        data: {
          userId,
          deviceFingerprint,
          deviceInfo: deviceInfo as any,
          isActive: true,
          lastUsed: new Date()
        }
      })
    } else {
      // Update last used time
      await prisma.device.update({
        where: { id: device.id },
        data: {
          lastUsed: new Date(),
          isActive: true
        }
      })
    }

    // Create session
    const sessionToken = generateSessionToken()
    const session = await prisma.userSession.create({
      data: {
        userId,
        deviceId: device.id,
        sessionToken,
        loginTime: new Date(),
        isActive: true
      }
    })

    // Generate JWT
    const token = generateJWT({
      userId,
      username: '', // Will be filled by calling function
      deviceId: device.id,
      sessionId: session.id
    })

    return {
      deviceId: device.id,
      sessionId: session.id,
      token
    }
  }

  /**
   * Get user's active sessions
   */
  static async getUserSessions(userId: string) {
    return prisma.userSession.findMany({
      where: { userId },
      include: {
        device: true
      },
      orderBy: { loginTime: 'desc' }
    })
  }

  /**
   * Deactivate specific session
   */
  static async deactivateSession(sessionId: string) {
    const session = await prisma.userSession.findUnique({
      where: { id: sessionId }
    })

    if (session) {
      const duration = calculateSessionDuration(session.loginTime)

      await prisma.userSession.update({
        where: { id: sessionId },
        data: {
          logoutTime: new Date(),
          duration,
          isActive: false
        }
      })
    }
  }
}
