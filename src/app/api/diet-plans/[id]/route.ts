import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth/middleware'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dietPlan = await db.dietPlan.findUnique({
      where: { id: params.id },
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

    if (!dietPlan) {
      return NextResponse.json({ error: 'Diet plan not found' }, { status: 404 })
    }

    // Check access permissions
    if (auth.role === 'PATIENT' && dietPlan.patientId !== auth.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (auth.role !== 'SUPER_ADMIN' && auth.role !== 'PATIENT' && dietPlan.dietitianId !== auth.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.json(dietPlan)
  } catch (error) {
    console.error('Error fetching diet plan:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only dietitians and admins can update diet plans
    if (!['DIETITIAN', 'CLINIC_ADMIN', 'SUPER_ADMIN'].includes(auth.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, startDate, endDate, status, meals } = body

    // Check if diet plan exists and user has access
    const existingPlan = await db.dietPlan.findUnique({
      where: { id: params.id },
      include: { patient: true }
    })

    if (!existingPlan) {
      return NextResponse.json({ error: 'Diet plan not found' }, { status: 404 })
    }

    if (auth.role !== 'SUPER_ADMIN' && existingPlan.dietitianId !== auth.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Update diet plan
    const updatedPlan = await db.dietPlan.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(status && { status }),
        ...(meals && {
          meals: {
            deleteMany: {},
            create: meals.map((meal: any) => ({
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
            }))
          }
        })
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

    return NextResponse.json(updatedPlan)
  } catch (error) {
    console.error('Error updating diet plan:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only dietitians and admins can delete diet plans
    if (!['DIETITIAN', 'CLINIC_ADMIN', 'SUPER_ADMIN'].includes(auth.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Check if diet plan exists and user has access
    const existingPlan = await db.dietPlan.findUnique({
      where: { id: params.id }
    })

    if (!existingPlan) {
      return NextResponse.json({ error: 'Diet plan not found' }, { status: 404 })
    }

    if (auth.role !== 'SUPER_ADMIN' && existingPlan.dietitianId !== auth.userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    await db.dietPlan.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Diet plan deleted successfully' })
  } catch (error) {
    console.error('Error deleting diet plan:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}