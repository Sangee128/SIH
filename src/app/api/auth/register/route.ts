import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserRole } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, clinicId } = await request.json()

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Email, password, name, and role are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // If clinicId is provided, verify clinic exists
    if (clinicId) {
      const clinic = await db.clinic.findUnique({
        where: { id: clinicId }
      })
      if (!clinic) {
        return NextResponse.json(
          { error: 'Clinic not found' },
          { status: 404 }
        )
      }
    }

    // Hash password (in production, use proper hashing)
    // const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create user
    const user = await db.user.create({
      data: {
        email,
        name,
        role,
        clinicId,
        // password: hashedPassword // In production, store hashed password
      },
      include: {
        clinic: true
      }
    })

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        clinicId: user.clinicId
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Return user data without sensitive information
    const { ...userWithoutPassword } = user

    return NextResponse.json({
      token,
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}