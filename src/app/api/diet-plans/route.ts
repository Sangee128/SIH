import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth/middleware'

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get('patientId')

    const whereClause: any = {}
    
    // Filter based on user role
    if (auth.role === 'PATIENT') {
      // Patients can only see their own plans
      whereClause.patientId = auth.userId
    } else if (patientId) {
      // Dietitians and admins can filter by patient
      whereClause.patientId = patientId
    }

    const dietPlans = await db.dietPlan.findMany({
      where: whereClause,
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        dietitian: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        meals: {
          include: {
            foods: {
              include: {
                foodItem: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(dietPlans)
  } catch (error) {
    console.error('Error fetching diet plans:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only dietitians and admins can create diet plans
    if (!['DIETITIAN', 'CLINIC_ADMIN', 'SUPER_ADMIN'].includes(auth.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, startDate, endDate, patientId, meals } = body

    if (!name || !startDate || !patientId) {
      return NextResponse.json(
        { error: 'Name, start date, and patient ID are required' },
        { status: 400 }
      )
    }

    // Verify patient exists and belongs to the same clinic
    const patient = await db.patient.findUnique({
      where: { id: patientId },
      include: { clinic: true }
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    // Check if user has access to this patient
    if (auth.role !== 'SUPER_ADMIN' && patient.clinicId !== auth.clinicId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Create diet plan with meals
    const dietPlan = await db.dietPlan.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        patientId,
        dietitianId: auth.userId,
        status: 'DRAFT',
        meals: {
          create: meals?.map((meal: any) => ({
            name: meal.name,
            time: meal.time,
            notes: meal.notes,
            foods: {
              create: meal.foods?.map((food: any) => ({
                foodItemId: food.foodItemId,
                quantity: food.quantity,
                notes: food.notes
              })) || []
            }
          })) || []
        }
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        dietitian: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        meals: {
          include: {
            foods: {
              include: {
                foodItem: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(dietPlan)
  } catch (error) {
    console.error('Error creating diet plan:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}