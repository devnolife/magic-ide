import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/authService'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No active session' },
        { status: 401 }
      )
    }

    // Verify token and get user data
    const result = await AuthService.verifyToken(token)

    if (!result.success) {
      // Clear invalid cookie
      const response = NextResponse.json(result, { status: 401 })
      response.cookies.delete('auth-token')
      return response
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Verify API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
