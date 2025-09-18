"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { useAuth } from "@/contexts/AuthContext"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Download, 
  Share, 
  Clock,
  Utensils,
  User,
  Calendar,
  FileText,
  Search
} from "lucide-react"

interface Meal {
  id: string
  name: string
  time: string
  foods: MealFood[]
  notes?: string
}

interface MealFood {
  id: string
  foodItemId: string
  quantity: string
  notes?: string
  foodItem?: FoodItem
}

interface FoodItem {
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

interface DietPlan {
  id: string
  name: string
  description?: string
  startDate: string
  endDate?: string
  status: string
  patientId: string
  dietitianId: string
  meals: Meal[]
}

export default function DietPlanEditor() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("editor")
  const [selectedPatient, setSelectedPatient] = useState("")
  const [dietPlan, setDietPlan] = useState<Partial<DietPlan>>({
    name: "",
    description: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    status: "DRAFT",
    meals: []
  })
  const [isEditing, setIsEditing] = useState(false)

  // Mock data
  const patients = [
    { id: "patient-1", name: "Priya Patel", prakriti: "Vata-Pitta" },
    { id: "patient-2", name: "Amit Kumar", prakriti: "Pitta" },
  ]

  const foodItems: FoodItem[] = [
    {
      id: "food-1",
      name: "Basmati Rice",
      calories: 130,
      protein: 2.7,
      fat: 0.3,
      carbs: 28,
      vataEffect: "PACIFIES",
      pittaEffect: "NEUTRAL",
      kaphaEffect: "AGGRAVATES"
    },
    {
      id: "food-2",
      name: "Moong Dal",
      calories: 105,
      protein: 7.5,
      fat: 0.4,
      carbs: 19,
      vataEffect: "PACIFIES",
      pittaEffect: "PACIFIES",
      kaphaEffect: "NEUTRAL"
    },
    {
      id: "food-3",
      name: "Ghee",
      calories: 120,
      protein: 0,
      fat: 14,
      carbs: 0,
      vataEffect: "PACIFIES",
      pittaEffect: "NEUTRAL",
      kaphaEffect: "AGGRAVATES"
    },
  ]

  const defaultMeals = [
    { id: "meal-1", name: "Early Morning", time: "6:00 AM" },
    { id: "meal-2", name: "Breakfast", time: "8:00 AM" },
    { id: "meal-3", name: "Mid-Morning", time: "11:00 AM" },
    { id: "meal-4", name: "Lunch", time: "1:30 PM" },
    { id: "meal-5", name: "Evening Snack", time: "4:30 PM" },
    { id: "meal-6", name: "Dinner", time: "7:00 PM" },
  ]

  const addMeal = () => {
    const newMeal: Meal = {
      id: `meal-${Date.now()}`,
      name: "New Meal",
      time: "12:00 PM",
      foods: []
    }
    setDietPlan(prev => ({
      ...prev,
      meals: [...(prev.meals || []), newMeal]
    }))
  }

  const updateMeal = (mealId: string, updates: Partial<Meal>) => {
    setDietPlan(prev => ({
      ...prev,
      meals: prev.meals?.map(meal => 
        meal.id === mealId ? { ...meal, ...updates } : meal
      ) || []
    }))
  }

  const deleteMeal = (mealId: string) => {
    setDietPlan(prev => ({
      ...prev,
      meals: prev.meals?.filter(meal => meal.id !== mealId) || []
    }))
  }

  const addFoodToMeal = (mealId: string, foodItem: FoodItem) => {
    const newFood: MealFood = {
      id: `food-${Date.now()}`,
      foodItemId: foodItem.id,
      quantity: "1 serving",
      foodItem
    }
    
    setDietPlan(prev => ({
      ...prev,
      meals: prev.meals?.map(meal => 
        meal.id === mealId 
          ? { ...meal, foods: [...meal.foods, newFood] }
          : meal
      ) || []
    }))
  }

  const removeFoodFromMeal = (mealId: string, foodId: string) => {
    setDietPlan(prev => ({
      ...prev,
      meals: prev.meals?.map(meal => 
        meal.id === mealId 
          ? { ...meal, foods: meal.foods.filter(food => food.id !== foodId) }
          : meal
      ) || []
    }))
  }

  const saveDietPlan = () => {
    // In a real app, this would save to the database
    console.log("Saving diet plan:", dietPlan)
    alert("Diet plan saved successfully!")
  }

  const exportToPDF = () => {
    // In a real app, this would generate a PDF
    alert("PDF export functionality would be implemented here")
  }

  const exportToJSON = () => {
    const dataStr = JSON.stringify(dietPlan, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${dietPlan.name || 'diet-plan'}-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const sharePlan = () => {
    // In a real app, this would share the plan
    alert("Share functionality would be implemented here")
  }

  const calculateTotalNutrition = () => {
    if (!dietPlan.meals) return { calories: 0, protein: 0, fat: 0, carbs: 0 }

    return dietPlan.meals.reduce((totals, meal) => {
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
  }

  const totalNutrition = calculateTotalNutrition()

  return (
    <AuthGuard requiredRoles={['DIETITIAN', 'CLINIC_ADMIN', 'SUPER_ADMIN']}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 flex">
              <div className="flex items-center space-x-2">
                <Utensils className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">Diet Plan Editor</span>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={exportToPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
                <Button variant="outline" onClick={exportToJSON}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export JSON
                </Button>
                <Button variant="outline" onClick={sharePlan}>
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button onClick={saveDietPlan}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Plan
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Left Sidebar - Patient Info & Food Database */}
            <div className="lg:col-span-1 space-y-6">
              {/* Patient Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Patient
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name} ({patient.prakriti})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Plan Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Plan Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="planName">Plan Name</Label>
                    <Input
                      id="planName"
                      value={dietPlan.name || ""}
                      onChange={(e) => setDietPlan(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter plan name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={dietPlan.description || ""}
                      onChange={(e) => setDietPlan(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter plan description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={dietPlan.startDate || ""}
                        onChange={(e) => setDietPlan(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={dietPlan.endDate || ""}
                        onChange={(e) => setDietPlan(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Food Database */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Food Database
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {foodItems.map((food) => (
                      <div
                        key={food.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          if (dietPlan.meals && dietPlan.meals.length > 0) {
                            addFoodToMeal(dietPlan.meals[0].id, food)
                          }
                        }}
                      >
                        <div className="font-medium">{food.name}</div>
                        <div className="text-sm text-gray-600">
                          {food.calories} cal • {food.protein}g protein
                        </div>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            V: {food.vataEffect}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            P: {food.pittaEffect}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            K: {food.kaphaEffect}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Meal Editor */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                  <TabsTrigger value="editor">Meal Editor</TabsTrigger>
                  <TabsTrigger value="nutrition">Nutrition Analysis</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="editor" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Meal Plan</h2>
                    <Button onClick={addMeal}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Meal
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {dietPlan.meals?.map((meal) => (
                      <Card key={meal.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Input
                                value={meal.name}
                                onChange={(e) => updateMeal(meal.id, { name: e.target.value })}
                                className="w-48"
                              />
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <Input
                                  value={meal.time}
                                  onChange={(e) => updateMeal(meal.id, { time: e.target.value })}
                                  className="w-24"
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => deleteMeal(meal.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {meal.foods.map((food) => (
                              <div key={food.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-4">
                                  <div>
                                    <div className="font-medium">{food.foodItem?.name}</div>
                                    <div className="text-sm text-gray-600">{food.quantity}</div>
                                  </div>
                                  <div className="flex gap-1">
                                    <Badge variant="outline" className="text-xs">
                                      V: {food.foodItem?.vataEffect}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      P: {food.foodItem?.pittaEffect}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      K: {food.foodItem?.kaphaEffect}
                                    </Badge>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeFoodFromMeal(meal.id, food.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            {meal.foods.length === 0 && (
                              <div className="text-center text-gray-500 py-4">
                                No foods added. Click on foods from the database to add them.
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="nutrition" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Nutritional Analysis</CardTitle>
                      <CardDescription>
                        Complete nutritional breakdown of the diet plan
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {totalNutrition.calories}
                          </div>
                          <div className="text-sm text-gray-600">Calories</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {totalNutrition.protein}g
                          </div>
                          <div className="text-sm text-gray-600">Protein</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {totalNutrition.fat}g
                          </div>
                          <div className="text-sm text-gray-600">Fat</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {totalNutrition.carbs}g
                          </div>
                          <div className="text-sm text-gray-600">Carbs</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Dosha Effects</CardTitle>
                      <CardDescription>
                        Ayurvedic impact on constitution types
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {dietPlan.meals?.map((meal) => (
                          <div key={meal.id}>
                            <h4 className="font-medium">{meal.name}</h4>
                            <div className="grid grid-cols-3 gap-4 mt-2">
                              <div className="text-center">
                                <div className="text-sm font-medium">Vata</div>
                                <div className="text-lg">
                                  {meal.foods.reduce((acc, food) => {
                                    if (food.foodItem?.vataEffect === 'PACIFIES') return acc + 1
                                    if (food.foodItem?.vataEffect === 'AGGRAVATES') return acc - 1
                                    return acc
                                  }, 0) > 0 ? 'Pacifying' : 'Neutral'}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-medium">Pitta</div>
                                <div className="text-lg">
                                  {meal.foods.reduce((acc, food) => {
                                    if (food.foodItem?.pittaEffect === 'PACIFIES') return acc + 1
                                    if (food.foodItem?.pittaEffect === 'AGGRAVATES') return acc - 1
                                    return acc
                                  }, 0) > 0 ? 'Pacifying' : 'Neutral'}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-medium">Kapha</div>
                                <div className="text-lg">
                                  {meal.foods.reduce((acc, food) => {
                                    if (food.foodItem?.kaphaEffect === 'PACIFIES') return acc + 1
                                    if (food.foodItem?.kaphaEffect === 'AGGRAVATES') return acc - 1
                                    return acc
                                  }, 0) > 0 ? 'Pacifying' : 'Neutral'}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Diet Plan Preview</CardTitle>
                      <CardDescription>
                        How your patient will see this plan
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-bold">{dietPlan.name}</h2>
                          <p className="text-gray-600">{dietPlan.description}</p>
                          <div className="flex gap-4 mt-2 text-sm">
                            <span>Start: {dietPlan.startDate}</span>
                            <span>End: {dietPlan.endDate || 'Ongoing'}</span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {dietPlan.meals?.map((meal) => (
                            <div key={meal.id} className="border-l-4 border-blue-500 pl-4">
                              <div className="flex items-center gap-4 mb-2">
                                <h3 className="font-semibold">{meal.name}</h3>
                                <span className="text-sm text-gray-600">{meal.time}</span>
                              </div>
                              <div className="space-y-2">
                                {meal.foods.map((food) => (
                                  <div key={food.id} className="flex justify-between items-center">
                                    <span>{food.foodItem?.name}</span>
                                    <span className="text-sm text-gray-600">{food.quantity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
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