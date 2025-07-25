import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/authService'
import { parseDeviceInfo } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Extract device info from request
    const userAgent = request.headers.get('user-agent') || ''
    const ip = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1'

    const deviceInfo = parseDeviceInfo(userAgent, ip)

    // Attempt login
    const result = await AuthService.login({
      username,
      password,
      deviceInfo
    })

    if (!result.success) {
      return NextResponse.json(result, { status: 401 })
    }

    // Set HTTP-only cookie with the token
    const response = NextResponse.json(result)
    response.cookies.set('auth-token', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    })

    return response
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
