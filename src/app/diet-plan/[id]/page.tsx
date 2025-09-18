"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { useAuth } from "@/contexts/AuthContext"
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Clock, 
  Utensils, 
  FileText, 
  Download,
  Share,
  Edit,
  Activity,
  Target
} from "lucide-react"

interface DietPlan {
  id: string
  name: string
  description?: string
  startDate: string
  endDate?: string
  status: string
  notes?: string
  rationale?: string
  totalNutrition?: {
    calories: number
    protein: number
    fat: number
    carbs: number
  }
  patient: {
    id: string
    name: string
    email?: string
    prakriti?: string
  }
  dietitian: {
    id: string
    name: string
    email?: string
  }
  meals: Meal[]
}

interface Meal {
  id: string
  name: string
  time: string
  notes?: string
  foods: MealFood[]
}

interface MealFood {
  id: string
  quantity: string
  notes?: string
  foodItem: {
    id: string
    name: string
    calories?: number
    protein?: number
    fat?: number
    carbs?: number
    vataEffect: string
    pittaEffect: string
    kaphaEffect: string
  }
}

export default function DietPlanViewer() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockDietPlan: DietPlan = {
      id: params.id as string,
      name: "Vata-Pitta Balance Plan",
      description: "Customized diet plan to balance Vata and Pitta doshas with emphasis on warm, nourishing foods and cooling herbs.",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      status: "ACTIVE",
      notes: "Focus on regular meal times and proper food combinations.",
      rationale: "This plan is designed to pacify Vata's cold, light qualities and Pitta's hot, sharp qualities through balanced nutrition.",
      totalNutrition: {
        calories: 2000,
        protein: 80,
        fat: 65,
        carbs: 250
      },
      patient: {
        id: "patient-1",
        name: "Ravi Sharma",
        email: "ravi.sharma@email.com",
        prakriti: "Vata-Pitta"
      },
      dietitian: {
        id: "dietitian-1",
        name: "Dr. Priya Patel",
        email: "priya.patel@clinic.com"
      },
      meals: [
        {
          id: "meal-1",
          name: "Early Morning",
          time: "6:00 AM",
          notes: "Start the day with warm water to stimulate digestion",
          foods: [
            {
              id: "food-1",
              quantity: "1 cup",
              notes: "Warm, not hot",
              foodItem: {
                id: "item-1",
                name: "Warm Water with Lemon",
                calories: 10,
                protein: 0,
                fat: 0,
                carbs: 2,
                vataEffect: "PACIFIES",
                pittaEffect: "PACIFIES",
                kaphaEffect: "NEUTRAL"
              }
            }
          ]
        },
        {
          id: "meal-2",
          name: "Breakfast",
          time: "8:00 AM",
          notes: "Warm, nourishing breakfast to stabilize Vata",
          foods: [
            {
              id: "food-2",
              quantity: "1 bowl",
              notes: "Made with milk and warming spices",
              foodItem: {
                id: "item-2",
                name: "Oatmeal with Cinnamon",
                calories: 150,
                protein: 5,
                fat: 3,
                carbs: 27,
                vataEffect: "PACIFIES",
                pittaEffect: "NEUTRAL",
                kaphaEffect: "AGGRAVATES"
              }
            },
            {
              id: "food-3",
              quantity: "1 piece",
              notes: "Ripe but not overly sweet",
              foodItem: {
                id: "item-3",
                name: "Banana",
                calories: 105,
                protein: 1,
                fat: 0,
                carbs: 27,
                vataEffect: "PACIFIES",
                pittaEffect: "NEUTRAL",
                kaphaEffect: "AGGRAVATES"
              }
            }
          ]
        },
        {
          id: "meal-3",
          name: "Mid-Morning",
          time: "11:00 AM",
          notes: "Light snack to maintain energy",
          foods: [
            {
              id: "food-4",
              quantity: "1 cup",
              notes: "Herbal tea with cooling properties",
              foodItem: {
                id: "item-4",
                name: "Peppermint Tea",
                calories: 2,
                protein: 0,
                fat: 0,
                carbs: 0,
                vataEffect: "NEUTRAL",
                pittaEffect: "PACIFIES",
                kaphaEffect: "NEUTRAL"
              }
            }
          ]
        },
        {
          id: "meal-4",
          name: "Lunch",
          time: "1:30 PM",
          notes: "Main meal - largest meal of the day when digestion is strongest",
          foods: [
            {
              id: "food-5",
              quantity: "1 cup",
              notes: "Basmati rice with ghee",
              foodItem: {
                id: "item-5",
                name: "Rice with Ghee",
                calories: 250,
                protein: 4,
                fat: 8,
                carbs: 45,
                vataEffect: "PACIFIES",
                pittaEffect: "NEUTRAL",
                kaphaEffect: "AGGRAVATES"
              }
            },
            {
              id: "food-6",
              quantity: "1 cup",
              notes: "Moong dal with cooling spices",
              foodItem: {
                id: "item-6",
                name: "Moong Dal",
                calories: 120,
                protein: 8,
                fat: 1,
                carbs: 20,
                vataEffect: "PACIFIES",
                pittaEffect: "PACIFIES",
                kaphaEffect: "NEUTRAL"
              }
            },
            {
              id: "food-7",
              quantity: "1 cup",
              notes: "Cooked vegetables with coconut",
              foodItem: {
                id: "item-7",
                name: "Mixed Vegetables",
                calories: 80,
                protein: 3,
                fat: 2,
                carbs: 15,
                vataEffect: "PACIFIES",
                pittaEffect: "PACIFIES",
                kaphaEffect: "NEUTRAL"
              }
            }
          ]
        },
        {
          id: "meal-5",
          name: "Evening Snack",
          time: "4:30 PM",
          notes: "Light snack to prevent Vata aggravation",
          foods: [
            {
              id: "food-8",
              quantity: "1 handful",
              notes: "Soaked almonds for healthy fats",
              foodItem: {
                id: "item-8",
                name: "Soaked Almonds",
                calories: 160,
                protein: 6,
                fat: 14,
                carbs: 6,
                vataEffect: "PACIFIES",
                pittaEffect: "NEUTRAL",
                kaphaEffect: "NEUTRAL"
              }
            }
          ]
        },
        {
          id: "meal-6",
          name: "Dinner",
          time: "7:00 PM",
          notes: "Light, easily digestible meal",
          foods: [
            {
              id: "food-9",
              quantity: "1 bowl",
              notes: "Light soup with vegetables",
              foodItem: {
                id: "item-9",
                name: "Vegetable Soup",
                calories: 100,
                protein: 4,
                fat: 2,
                carbs: 18,
                vataEffect: "PACIFIES",
                pittaEffect: "PACIFIES",
                kaphaEffect: "NEUTRAL"
              }
            },
            {
              id: "food-10",
              quantity: "1 small piece",
              notes: "Easy to digest",
              foodItem: {
                id: "item-10",
                name: "Khichdi",
                calories: 180,
                protein: 6,
                fat: 4,
                carbs: 32,
                vataEffect: "PACIFIES",
                pittaEffect: "PACIFIES",
                kaphaEffect: "NEUTRAL"
              }
            }
          ]
        }
      ]
    }

    setDietPlan(mockDietPlan)
    setLoading(false)
  }, [params.id])

  const exportPlan = async (format: 'pdf' | 'json' | 'csv') => {
    try {
      const response = await fetch(`/api/diet-plans/${params.id}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ format })
      })

      if (response.ok) {
        if (format === 'json') {
          const data = await response.json()
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `diet-plan-${params.id}.json`
          a.click()
          URL.revokeObjectURL(url)
        } else if (format === 'csv') {
          const blob = await response.blob()
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `diet-plan-${params.id}.csv`
          a.click()
          URL.revokeObjectURL(url)
        } else if (format === 'pdf') {
          const data = await response.json()
          const newWindow = window.open('', '_blank')
          if (newWindow) {
            newWindow.document.write(data.html)
            newWindow.document.close()
            newWindow.print()
          }
        }
      }
    } catch (error) {
      console.error('Error exporting diet plan:', error)
    }
  }

  if (loading) {
    return (
      <AuthGuard requiredRoles={['DIETITIAN', 'CLINIC_ADMIN', 'SUPER_ADMIN', 'PATIENT']}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </AuthGuard>
    )
  }

  if (!dietPlan) {
    return (
      <AuthGuard requiredRoles={['DIETITIAN', 'CLINIC_ADMIN', 'SUPER_ADMIN', 'PATIENT']}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Diet plan not found</h1>
            <Button onClick={() => router.push("/")}>Back to Dashboard</Button>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requiredRoles={['DIETITIAN', 'CLINIC_ADMIN', 'SUPER_ADMIN', 'PATIENT']}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => router.back()} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <Utensils className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">Diet Plan</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => exportPlan('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={() => exportPlan('json')}>
                <FileText className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
              <Button variant="outline" onClick={() => exportPlan('csv')}>
                <FileText className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              {['DIETITIAN', 'CLINIC_ADMIN', 'SUPER_ADMIN'].includes(user?.role || '') && (
                <Button onClick={() => router.push(`/diet-plan-editor/${dietPlan.id}`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Left Sidebar - Plan Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Plan Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Plan Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">{dietPlan.name}</h3>
                    <p className="text-sm text-muted-foreground">{dietPlan.description}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{dietPlan.startDate} to {dietPlan.endDate || 'Ongoing'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{dietPlan.patient.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span>{dietPlan.patient.prakriti}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <Badge variant={dietPlan.status === "ACTIVE" ? "default" : "secondary"}>
                        {dietPlan.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Nutrition Summary */}
              {dietPlan.totalNutrition && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Nutrition Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-blue-50 p-2 rounded">
                          <div className="text-xs text-blue-600">Calories</div>
                          <div className="font-bold">{dietPlan.totalNutrition.calories}</div>
                        </div>
                        <div className="bg-green-50 p-2 rounded">
                          <div className="text-xs text-green-600">Protein</div>
                          <div className="font-bold">{dietPlan.totalNutrition.protein}g</div>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded">
                          <div className="text-xs text-yellow-600">Fat</div>
                          <div className="font-bold">{dietPlan.totalNutrition.fat}g</div>
                        </div>
                        <div className="bg-purple-50 p-2 rounded">
                          <div className="text-xs text-purple-600">Carbs</div>
                          <div className="font-bold">{dietPlan.totalNutrition.carbs}g</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* People */}
              <Card>
                <CardHeader>
                  <CardTitle>People</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/avatars/${dietPlan.patient.id}.png`} alt={dietPlan.patient.name} />
                      <AvatarFallback>{dietPlan.patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{dietPlan.patient.name}</p>
                      <p className="text-sm text-muted-foreground">Patient</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{dietPlan.dietitian.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{dietPlan.dietitian.name}</p>
                      <p className="text-sm text-muted-foreground">Dietitian</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Content - Meal Plan */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="meals" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="meals">Meal Plan</TabsTrigger>
                  <TabsTrigger value="rationale">Ayurvedic Rationale</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="meals" className="space-y-4">
                  <div className="space-y-4">
                    {dietPlan.meals.map((meal) => (
                      <Card key={meal.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <h3 className="font-medium">{meal.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {meal.time}
                              </div>
                            </div>
                          </div>
                          {meal.notes && (
                            <CardDescription className="text-sm">{meal.notes}</CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {meal.foods.map((food) => (
                              <div key={food.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-4">
                                  <div>
                                    <div className="font-medium">{food.foodItem.name}</div>
                                    <div className="text-sm text-muted-foreground">{food.quantity}</div>
                                    {food.notes && (
                                      <div className="text-xs text-muted-foreground mt-1">{food.notes}</div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right space-y-1">
                                  {food.foodItem.calories && (
                                    <div className="text-sm">{food.foodItem.calories} cal</div>
                                  )}
                                  <div className="flex gap-1">
                                    <Badge variant="outline" className="text-xs">
                                      V: {food.foodItem.vataEffect}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      P: {food.foodItem.pittaEffect}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      K: {food.foodItem.kaphaEffect}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="rationale" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ayurvedic Rationale</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <p>{dietPlan.rationale}</p>
                        
                        <h4>Dosha Balancing Principles</h4>
                        <p>This diet plan follows Ayurvedic principles to balance the Vata-Pitta constitution:</p>
                        
                        <ul>
                          <li><strong>Vata Pacifying:</strong> Warm, cooked, oily foods; regular meal times; sweet, sour, and salty tastes</li>
                          <li><strong>Pitta Pacifying:</strong> Cooling foods; sweet, bitter, and astringent tastes; moderate meal sizes</li>
                          <li><strong>Digestive Fire:</strong> Foods that strengthen Agni without aggravating Pitta</li>
                          <li><strong>Food Combinations:</strong> Proper food combining for optimal digestion</li>
                        </ul>
                        
                        <h4>Meal Timing</h4>
                        <p>Following the natural rhythm of digestive strength throughout the day:</p>
                        
                        <ul>
                          <li><strong>Breakfast (8:00 AM):</strong> Light but nourishing to kindle digestive fire</li>
                          <li><strong>Lunch (1:30 PM):</strong> Largest meal when digestive fire is strongest</li>
                          <li><strong>Dinner (7:00 PM):</strong> Light meal to avoid burdening digestion before sleep</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Additional Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">General Guidelines</h4>
                          <p className="text-sm text-muted-foreground">{dietPlan.notes}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Lifestyle Recommendations</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Eat meals at regular times each day</li>
                            <li>• Sit down to eat in a calm environment</li>
                            <li>• Chew food thoroughly</li>
                            <li>• Avoid drinking large amounts of water during meals</li>
                            <li>• Wait at least 3 hours between meals</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Foods to Avoid</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Cold, raw, and dry foods (aggravates Vata)</li>
                            <li>• Excessively spicy, sour, or fermented foods (aggravates Pitta)</li>
                            <li>• Heavy, oily, and sweet foods (aggravates Kapha)</li>
                            <li>• Processed and packaged foods</li>
                            <li>• Ice-cold beverages</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}