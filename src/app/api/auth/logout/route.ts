import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/authService'

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No active session' },
        { status: 401 }
      )
    }

    // Logout user
    const result = await AuthService.logout(token)

    // Clear the cookie
    const response = NextResponse.json(result)
    response.cookies.delete('auth-token')

    return response
  } catch (error) {
    console.error('Logout API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
