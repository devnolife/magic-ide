import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { UAParser } from 'ua-parser-js'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'
const DEVICE_ENCRYPTION_KEY = process.env.DEVICE_ENCRYPTION_KEY || 'fallback-device-key'

export interface DeviceInfo {
  browser: string
  os: string
  device: string
  userAgent: string
  ip?: string
}

export interface JWTPayload {
  userId: string
  username: string
  deviceId: string
  sessionId: string
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Generate a JWT token
 */
export function generateJWT(payload: JWTPayload, expiresIn: string = '30d'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions)
}

/**
 * Verify and decode a JWT token
 */
export function verifyJWT(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

/**
 * Generate a device fingerprint from request headers
 */
export function generateDeviceFingerprint(userAgent: string, ip?: string): string {
  const parser = new UAParser(userAgent)
  const result = parser.getResult()

  const deviceData = {
    browser: `${result.browser.name || 'unknown'}_${result.browser.version || 'unknown'}`,
    os: `${result.os.name || 'unknown'}_${result.os.version || 'unknown'}`,
    device: result.device.type || 'desktop',
    cpu: result.cpu.architecture || 'unknown',
    ip: ip || 'unknown'
  }

  const fingerprint = JSON.stringify(deviceData)

  // Encrypt the fingerprint for security
  const cipher = crypto.createCipher('aes-256-cbc', DEVICE_ENCRYPTION_KEY)
  let encrypted = cipher.update(fingerprint, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  return encrypted
}

/**
 * Parse device information from user agent
 */
export function parseDeviceInfo(userAgent: string, ip?: string): DeviceInfo {
  const parser = new UAParser(userAgent)
  const result = parser.getResult()

  return {
    browser: `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`.trim(),
    os: `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim(),
    device: result.device.type || 'desktop',
    userAgent,
    ip
  }
}

/**
 * Generate a secure random session token
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Validate username format
 */
export function validateUsername(username: string): { isValid: boolean; error?: string } {
  if (!username || username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters long' }
  }

  if (username.length > 20) {
    return { isValid: false, error: 'Username must be less than 20 characters long' }
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' }
  }

  return { isValid: true }
}

/**
 * Validate password format
 */
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password || password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' }
  }

  if (password.length > 100) {
    return { isValid: false, error: 'Password must be less than 100 characters long' }
  }

  // Check for at least one letter and one number
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one letter and one number' }
  }

  return { isValid: true }
}

/**
 * Calculate session duration in minutes
 */
export function calculateSessionDuration(loginTime: Date, logoutTime?: Date): number {
  const endTime = logoutTime || new Date()
  const durationMs = endTime.getTime() - loginTime.getTime()
  return Math.floor(durationMs / (1000 * 60)) // Convert to minutes
}
