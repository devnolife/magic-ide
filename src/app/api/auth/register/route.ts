import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { hashPassword, validateUsername, validatePassword } from '@/lib/auth'

// Zod schema for input validation
const registerSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(100),
  fullName: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input with Zod schema
    const validationResult = registerSchema.safeParse(body)
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

    const { username, password, fullName } = validationResult.data

    // Additional custom validation
    const usernameValidation = validateUsername(username)
    if (!usernameValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: usernameValidation.error
        },
        { status: 400 }
      )
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: passwordValidation.error
        },
        { status: 400 }
      )
    }

    // Check for existing username (must be unique)
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Username already exists. Please choose a different username.'
        },
        { status: 409 }
      )
    }

    // Hash password with bcrypt
    const hashedPassword = await hashPassword(password)

    // Create user record in database
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        fullName: fullName || null
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        avatar: true,
        createdAt: true
      }
    })

    // Initialize chapter progress for the new user
    const chapters = [0, 1, 2, 3, 4, 5]
    const chapterProgressData = chapters.map(chapterNumber => ({
      userId: newUser.id,
      chapterNumber,
      totalLessons: chapterNumber === 0 ? 4 : chapterNumber === 1 ? 5 : 4 // Adjust based on your curriculum
    }))

    await prisma.chapterProgress.createMany({
      data: chapterProgressData
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: newUser
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error. Please try again later.'
      },
      { status: 500 }
    )
  }
}
