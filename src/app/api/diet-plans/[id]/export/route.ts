import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth/middleware'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(request)
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { format = 'json' } = body

    // Get diet plan with full details
    const dietPlan = await db.dietPlan.findUnique({
      where: { id: params.id },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
            dateOfBirth: true,
            height: true,
            weight: true
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

    // Calculate total nutrition
    const totalNutrition = dietPlan.meals.reduce((totals, meal) => {
      return meal.foods.reduce((mealTotals, food) => {
        if (food.foodItem) {
          return {
            calories: mealTotals.calories + (food.foodItem.calories || 0),
            protein: mealTotals.protein + (food.foodItem.protein || 0),
            fat: mealTotals.fat + (food.foodItem.fat || 0),
            carbs: mealTotals.carbs + (food.foodItem.carbs || 0)
          }
        }
        return mealTotals
      }, totals)
    }, { calories: 0, protein: 0, fat: 0, carbs: 0 })

    const exportData = {
      dietPlan: {
        id: dietPlan.id,
        name: dietPlan.name,
        description: dietPlan.description,
        startDate: dietPlan.startDate,
        endDate: dietPlan.endDate,
        status: dietPlan.status,
        createdAt: dietPlan.createdAt,
        totalNutrition
      },
      patient: dietPlan.patient,
      dietitian: dietPlan.dietitian,
      meals: dietPlan.meals.map(meal => ({
        id: meal.id,
        name: meal.name,
        time: meal.time,
        notes: meal.notes,
        foods: meal.foods.map(food => ({
          id: food.id,
          foodItem: food.foodItem,
          quantity: food.quantity,
          notes: food.notes
        }))
      }))
    }

    if (format === 'json') {
      return NextResponse.json(exportData)
    }

    if (format === 'pdf') {
      // In a real implementation, you would use a PDF library like puppeteer or jsPDF
      // For now, we'll return HTML that can be converted to PDF
      const html = generatePDFHTML(exportData)
      return NextResponse.json({ html, data: exportData })
    }

    if (format === 'csv') {
      const csv = generateCSV(exportData)
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="diet-plan-${params.id}.csv"`
        }
      })
    }

    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 })
  } catch (error) {
    console.error('Error exporting diet plan:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generatePDFHTML(data: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${data.dietPlan.name}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .meal { border: 1px solid #ddd; margin: 10px 0; padding: 15px; }
        .food { margin: 5px 0; padding-left: 20px; }
        .nutrition { background: #f5f5f5; padding: 15px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${data.dietPlan.name}</h1>
        <p>${data.dietPlan.description || ''}</p>
        <p><strong>Patient:</strong> ${data.patient.name}</p>
        <p><strong>Dietitian:</strong> ${data.dietitian.name}</p>
        <p><strong>Period:</strong> ${data.dietPlan.startDate} to ${data.dietPlan.endDate || 'Ongoing'}</p>
      </div>

      <div class="section nutrition">
        <h2>Nutritional Summary</h2>
        <p>Calories: ${data.dietPlan.totalNutrition.calories}</p>
        <p>Protein: ${data.dietPlan.totalNutrition.protein}g</p>
        <p>Fat: ${data.dietPlan.totalNutrition.fat}g</p>
        <p>Carbohydrates: ${data.dietPlan.totalNutrition.carbs}g</p>
      </div>

      <div class="section">
        <h2>Meal Plan</h2>
        ${data.meals.map(meal => `
          <div class="meal">
            <h3>${meal.name} - ${meal.time}</h3>
            ${meal.notes ? `<p><em>${meal.notes}</em></p>` : ''}
            ${meal.foods.map(food => `
              <div class="food">
                <strong>${food.foodItem.name}</strong> - ${food.quantity}
                ${food.notes ? `<br><small>${food.notes}</small>` : ''}
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    </body>
    </html>
  `
}

function generateCSV(data: any) {
  const headers = ['Meal', 'Time', 'Food', 'Quantity', 'Calories', 'Protein', 'Fat', 'Carbs', 'Notes']
  
  const rows = data.meals.flatMap(meal => 
    meal.foods.map(food => [
      meal.name,
      meal.time,
      food.foodItem.name,
      food.quantity,
      food.foodItem.calories || '',
      food.foodItem.protein || '',
      food.foodItem.fat || '',
      food.foodItem.carbs || '',
      food.notes || ''
    ])
  )

  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')
}