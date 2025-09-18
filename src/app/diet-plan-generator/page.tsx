"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Utensils, 
  Brain, 
  Heart, 
  Wind, 
  Droplets, 
  Mountain,
  Activity,
  Clock,
  Target,
  Plus,
  Edit,
  Download,
  RefreshCw,
  Lightbulb,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

interface Patient {
  id: string
  name: string
  prakriti: {
    vata: number
    pitta: number
    kapha: number
    dominant: string[]
  }
  goals: string[]
  allergies: string[]
  chronicConditions: string[]
  lifestyle: {
    dietType: string
    exerciseFrequency: string
  }
}

interface FoodItem {
  id: string
  name: string
  servingSize: string
  calories: number
  protein: number
  fat: number
  carbs: number
  fiber: number
  vataEffect: "PACIFIES" | "NEUTRAL" | "AGGRAVATES"
  pittaEffect: "PACIFIES" | "NEUTRAL" | "AGGRAVATES"
  kaphaEffect: "PACIFIES" | "NEUTRAL" | "AGGRAVATES"
  taste: string[]
  quality: string[]
  potency: "HEATING" | "COOLING" | "NEUTRAL"
  postDigestiveEffect: string
  seasonality: string[]
  preparation: string[]
  contraindications: string[]
}

interface Meal {
  name: string
  time: string
  foods: {
    food: FoodItem
    quantity: string
    notes?: string
  }[]
  rationale: string
  totalCalories: number
  totalProtein: number
  totalFat: number
  totalCarbs: number
  totalFiber: number
}

interface DietPlan {
  id: string
  patient: Patient
  name: string
  description: string
  startDate: string
  endDate: string
  meals: Meal[]
  rationale: {
    ayurvedic: string
    nutritional: string
    lifestyle: string
  }
  totalCalories: number
  totalProtein: number
  totalFat: number
  totalCarbs: number
  totalFiber: number
  warnings: string[]
  recommendations: string[]
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Ravi Sharma",
    prakriti: {
      vata: 45,
      pitta: 35,
      kapha: 20,
      dominant: ["vata"]
    },
    goals: ["Weight Loss", "Improve Digestion"],
    allergies: ["Peanuts"],
    chronicConditions: ["Acidity"],
    lifestyle: {
      dietType: "vegetarian",
      exerciseFrequency: "moderate"
    }
  },
  {
    id: "2",
    name: "Priya Patel",
    prakriti: {
      vata: 25,
      pitta: 50,
      kapha: 25,
      dominant: ["pitta"]
    },
    goals: ["Balance Doshas", "Stress Management"],
    allergies: [],
    chronicConditions: ["Migraine"],
    lifestyle: {
      dietType: "vegetarian",
      exerciseFrequency: "light"
    }
  }
]

const mockFoodDatabase: FoodItem[] = [
  {
    id: "1",
    name: "Basmati Rice",
    servingSize: "1 cup (185g cooked)",
    calories: 205,
    protein: 4.3,
    fat: 0.4,
    carbs: 45,
    fiber: 0.6,
    vataEffect: "PACIFIES",
    pittaEffect: "NEUTRAL",
    kaphaEffect: "AGGRAVATES",
    taste: ["SWEET"],
    quality: ["LIGHT", "DRY"],
    potency: "COOLING",
    postDigestiveEffect: "SWEET",
    seasonality: ["all"],
    preparation: ["cooked", "steamed", "boiled"],
    contraindications: ["kapha imbalance", "obesity", "diabetes"]
  },
  {
    id: "2",
    name: "Mung Dal",
    servingSize: "1 cup (202g cooked)",
    calories: 212,
    protein: 14.2,
    fat: 0.8,
    carbs: 38.7,
    fiber: 15.4,
    vataEffect: "PACIFIES",
    pittaEffect: "PACIFIES",
    kaphaEffect: "NEUTRAL",
    taste: ["SWEET", "ASTRINGENT"],
    quality: ["LIGHT", "DRY"],
    potency: "COOLING",
    postDigestiveEffect: "SWEET",
    seasonality: ["all"],
    preparation: ["cooked", "soup", "sprouted"],
    contraindications: ["high vata (when unsprouted)"]
  },
  {
    id: "3",
    name: "Ghee",
    servingSize: "1 tbsp (15g)",
    calories: 135,
    protein: 0,
    fat: 15,
    carbs: 0,
    fiber: 0,
    vataEffect: "PACIFIES",
    pittaEffect: "PACIFIES",
    kaphaEffect: "NEUTRAL",
    taste: ["SWEET"],
    quality: ["HEAVY", "OILY", "SMOOTH"],
    potency: "COOLING",
    postDigestiveEffect: "SWEET",
    seasonality: ["winter", "autumn"],
    preparation: ["raw", "cooked"],
    contraindications: ["high cholesterol", "obesity", "kapha imbalance"]
  },
  {
    id: "4",
    name: "Ginger",
    servingSize: "1 inch piece (10g)",
    calories: 8,
    protein: 0.2,
    fat: 0.1,
    carbs: 1.8,
    fiber: 0.2,
    vataEffect: "PACIFIES",
    pittaEffect: "AGGRAVATES",
    kaphaEffect: "PACIFIES",
    taste: ["PUNGENT"],
    quality: ["LIGHT", "DRY", "SHARP", "HOT"],
    potency: "HEATING",
    postDigestiveEffect: "SWEET",
    seasonality: ["winter", "monsoon"],
    preparation: ["raw", "cooked", "dried", "juice"],
    contraindications: ["pitta imbalance", "bleeding disorders", "high fever"]
  },
  {
    id: "5",
    name: "Turmeric",
    servingSize: "1 tsp (3g)",
    calories: 9,
    protein: 0.3,
    fat: 0.1,
    carbs: 1.7,
    fiber: 0.6,
    vataEffect: "PACIFIES",
    pittaEffect: "AGGRAVATES",
    kaphaEffect: "PACIFIES",
    taste: ["BITTER", "ASTRINGENT", "PUNGENT"],
    quality: ["LIGHT", "DRY"],
    potency: "HEATING",
    postDigestiveEffect: "PUNGENT",
    seasonality: ["all"],
    preparation: ["powder", "raw", "cooked"],
    contraindications: ["pitta imbalance", "bleeding disorders", "pregnancy (high doses)"]
  },
  {
    id: "6",
    name: "Coconut Water",
    servingSize: "1 cup (240ml)",
    calories: 46,
    protein: 1.7,
    fat: 0.5,
    carbs: 8.9,
    fiber: 2.6,
    vataEffect: "PACIFIES",
    pittaEffect: "PACIFIES",
    kaphaEffect: "AGGRAVATES",
    taste: ["SWEET"],
    quality: ["LIGHT", "OILY", "COOL"],
    potency: "COOLING",
    postDigestiveEffect: "SWEET",
    seasonality: ["summer", "monsoon"],
    preparation: ["fresh", "raw"],
    contraindications: ["kapha imbalance", "cough", "cold"]
  },
  {
    id: "7",
    name: "Almonds",
    servingSize: "1 oz (28g, about 23 nuts)",
    calories: 164,
    protein: 6,
    fat: 14,
    carbs: 6,
    fiber: 3.5,
    vataEffect: "PACIFIES",
    pittaEffect: "NEUTRAL",
    kaphaEffect: "AGGRAVATES",
    taste: ["SWEET"],
    quality: ["HEAVY", "OILY"],
    potency: "HEATING",
    postDigestiveEffect: "SWEET",
    seasonality: ["winter", "autumn"],
    preparation: ["raw", "soaked", "roasted"],
    contraindications: ["kapha imbalance", "obesity", "high ama"]
  },
  {
    id: "8",
    name: "Spinach",
    servingSize: "1 cup cooked (180g)",
    calories: 41,
    protein: 5.4,
    fat: 0.5,
    carbs: 6.8,
    fiber: 4.3,
    vataEffect: "AGGRAVATES",
    pittaEffect: "PACIFIES",
    kaphaEffect: "PACIFIES",
    taste: ["SWEET", "ASTRINGENT", "BITTER"],
    quality: ["LIGHT", "DRY", "COOL"],
    potency: "COOLING",
    postDigestiveEffect: "SWEET",
    seasonality: ["winter", "spring"],
    preparation: ["cooked", "steamed", "raw"],
    contraindications: ["vata imbalance", "kidney stones", "thyroid disorders"]
  }
]

// Ayurvedic rules engine
class AyurvedicRulesEngine {
  static generatePlan(patient: Patient, foodDb: FoodItem[]): DietPlan {
    const dominantDosha = patient.prakriti.dominant[0]
    
    // Filter foods based on patient's prakriti and restrictions
    const suitableFoods = foodDb.filter(food => {
      // Check allergies
      if (patient.allergies.some(allergy => 
        food.name.toLowerCase().includes(allergy.toLowerCase()))) {
        return false
      }
      
      // Check contraindications based on chronic conditions
      if (patient.chronicConditions.some(condition =>
        food.contraindications.some(contraindication =>
          contraindication.toLowerCase().includes(condition.toLowerCase())))) {
        return false
      }
      
      // Basic dosha balancing
      if (dominantDosha === "vata") {
        return food.vataEffect !== "AGGRAVATES"
      } else if (dominantDosha === "pitta") {
        return food.pittaEffect !== "AGGRAVATES"
      } else if (dominantDosha === "kapha") {
        return food.kaphaEffect !== "AGGRAVATES"
      }
      
      return true
    })

    // Generate meals
    const meals = this.generateMeals(patient, suitableFoods)
    
    // Calculate totals
    const totals = meals.reduce((acc, meal) => ({
      totalCalories: acc.totalCalories + meal.totalCalories,
      totalProtein: acc.totalProtein + meal.totalProtein,
      totalFat: acc.totalFat + meal.totalFat,
      totalCarbs: acc.totalCarbs + meal.totalCarbs,
      totalFiber: acc.totalFiber + meal.totalFiber
    }), { totalCalories: 0, totalProtein: 0, totalFat: 0, totalCarbs: 0, totalFiber: 0 })

    // Generate rationale
    const rationale = this.generateRationale(patient, dominantDosha)
    
    // Generate warnings and recommendations
    const { warnings, recommendations } = this.generateWarningsAndRecommendations(patient, meals)

    return {
      id: Date.now().toString(),
      patient,
      name: `${patient.name}'s Personalized Diet Plan`,
      description: `A ${dominantDosha}-balancing diet plan for ${patient.goals.join(" and ")}`,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      meals,
      rationale,
      ...totals,
      warnings,
      recommendations
    }
  }

  private static generateMeals(patient: Patient, foods: FoodItem[]): Meal[] {
    const meals: Meal[] = []
    
    // Early Morning (6-7 AM)
    meals.push({
      name: "Early Morning",
      time: "6:00 AM",
      foods: [
        {
          food: foods.find(f => f.name === "Ginger") || foods[0],
          quantity: "1 inch piece",
          notes: "Warm water with ginger for digestion"
        }
      ],
      rationale: "Stimulates digestion and balances morning dosha",
      totalCalories: 8,
      totalProtein: 0.2,
      totalFat: 0.1,
      totalCarbs: 1.8,
      totalFiber: 0.2
    })

    // Breakfast (8-9 AM)
    const breakfastFoods = foods.filter(f => 
      f.potency === "HEATING" && f.vataEffect === "PACIFIES"
    )
    meals.push({
      name: "Breakfast",
      time: "8:00 AM",
      foods: [
        {
          food: foods.find(f => f.name === "Mung Dal") || foods[1],
          quantity: "1 cup",
          notes: "Light and protein-rich"
        },
        {
          food: foods.find(f => f.name === "Ghee") || foods[2],
          quantity: "1 tsp",
          notes: "For nourishment and digestion"
        }
      ],
      rationale: "Provides sustained energy without aggravating dominant dosha",
      totalCalories: 347,
      totalProtein: 14.2,
      totalFat: 15.8,
      totalCarbs: 38.7,
      totalFiber: 15.4
    })

    // Mid-Morning (11 AM)
    meals.push({
      name: "Mid-Morning",
      time: "11:00 AM",
      foods: [
        {
          food: foods.find(f => f.name === "Coconut Water") || foods[5],
          quantity: "1 cup",
          notes: "Hydrating and cooling"
        }
      ],
      rationale: "Maintains hydration and electrolyte balance",
      totalCalories: 46,
      totalProtein: 1.7,
      totalFat: 0.5,
      totalCarbs: 8.9,
      totalFiber: 2.6
    })

    // Lunch (1-2 PM)
    const lunchFoods = foods.filter(f => f.potency === "COOLING")
    meals.push({
      name: "Lunch",
      time: "1:00 PM",
      foods: [
        {
          food: foods.find(f => f.name === "Basmati Rice") || foods[0],
          quantity: "1 cup",
          notes: "Easy to digest"
        },
        {
          food: foods.find(f => f.name === "Spinach") || foods[7],
          quantity: "1 cup cooked",
          notes: "Rich in iron and nutrients"
        },
        {
          food: foods.find(f => f.name === "Turmeric") || foods[4],
          quantity: "1 tsp",
          notes: "Anti-inflammatory properties"
        }
      ],
      rationale: "Balanced meal with all six tastes for optimal digestion",
      totalCalories: 255,
      totalProtein: 10,
      totalFat: 1,
      totalCarbs: 53.5,
      totalFiber: 5.5
    })

    // Evening Snack (4-5 PM)
    meals.push({
      name: "Evening Snack",
      time: "4:30 PM",
      foods: [
        {
          food: foods.find(f => f.name === "Almonds") || foods[6],
          quantity: "10 almonds",
          notes: "Soaked overnight for better digestion"
        }
      ],
      rationale: "Provides healthy fats and sustained energy",
      totalCalories: 71,
      totalProtein: 2.6,
      totalFat: 6.1,
      totalCarbs: 2.6,
      totalFiber: 1.5
    })

    // Dinner (7-8 PM)
    const dinnerFoods = foods.filter(f => f.quality.includes("LIGHT"))
    meals.push({
      name: "Dinner",
      time: "7:00 PM",
      foods: [
        {
          food: foods.find(f => f.name === "Mung Dal") || foods[1],
          quantity: "3/4 cup",
          notes: "Light soup for easy digestion"
        },
        {
          food: foods.find(f => f.name === "Ginger") || foods[3],
          quantity: "1/2 inch",
          notes: "Aids digestion"
        }
      ],
      rationale: "Light meal to promote good sleep and digestion",
      totalCalories: 166,
      totalProtein: 10.8,
      totalFat: 0.9,
      totalCarbs: 29.5,
      totalFiber: 11.7
    })

    return meals
  }

  private static generateRationale(patient: Patient, dominantDosha: string) {
    const ayurvedic = `This plan is designed to balance ${dominantDosha} dosha while supporting the patient's goals: ${patient.goals.join(", ")}. The food combinations are selected to provide all six tastes (rasa) and optimize digestion (agni).`

    const nutritional = `The plan provides balanced macronutrients with adequate protein for tissue repair, complex carbohydrates for sustained energy, and healthy fats for hormone production. Total daily calories are adjusted to support the patient's goals.`

    const lifestyle = `Meal timing is aligned with natural circadian rhythms and digestive fire cycles. Food preparation methods are chosen to enhance digestibility and nutrient absorption.`

    return { ayurvedic, nutritional, lifestyle }
  }

  private static generateWarningsAndRecommendations(patient: Patient, meals: Meal[]) {
    const warnings: string[] = []
    const recommendations: string[] = []

    // Add warnings based on patient conditions
    if (patient.chronicConditions.includes("Acidity")) {
      warnings.push("Avoid spicy foods and large meals")
      recommendations.push("Eat slowly and chew thoroughly")
    }

    if (patient.prakriti.dominant.includes("vata")) {
      recommendations.push("Maintain regular meal times")
      recommendations.push("Include warm, cooked foods")
    }

    if (patient.prakriti.dominant.includes("pitta")) {
      recommendations.push("Include cooling foods like coconut water")
      recommendations.push("Avoid excessive heating spices")
    }

    if (patient.prakriti.dominant.includes("kapha")) {
      recommendations.push("Make lunch the largest meal")
      recommendations.push("Include light, stimulating spices")
    }

    // General recommendations
    recommendations.push("Drink warm water throughout the day")
    recommendations.push("Eat in a calm environment")
    recommendations.push("Allow 3-4 hours between meals")
    recommendations.push("Avoid eating 2-3 hours before bedtime")

    return { warnings, recommendations }
  }
}

export default function DietPlanGenerator() {
  const [selectedPatient, setSelectedPatient] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<DietPlan | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleGeneratePlan = async () => {
    if (!selectedPatient) return

    setIsGenerating(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const patient = mockPatients.find(p => p.id === selectedPatient)
    if (patient) {
      const plan = AyurvedicRulesEngine.generatePlan(patient, mockFoodDatabase)
      setGeneratedPlan(plan)
    }
    
    setIsGenerating(false)
  }

  const getDoshaColor = (dosha: string) => {
    switch (dosha) {
      case "vata": return "bg-blue-100 text-blue-800"
      case "pitta": return "bg-red-100 text-red-800"
      case "kapha": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Diet Plan Generator</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Personalized Diet Plan Generator</h1>
            <p className="text-muted-foreground">
              Generate Ayurvedic diet plans based on patient prakriti, health conditions, and goals
            </p>
          </div>

          {!generatedPlan ? (
            <div className="space-y-6">
              {/* Patient Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Select Patient</span>
                  </CardTitle>
                  <CardDescription>
                    Choose a patient to generate a personalized diet plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockPatients.map((patient) => (
                      <div
                        key={patient.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedPatient === patient.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedPatient(patient.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{patient.name}</h3>
                          <div className="flex space-x-1">
                            {patient.prakriti.dominant.map((dosha) => (
                              <Badge key={dosha} className={`text-xs ${getDoshaColor(dosha)}`}>
                                {dosha}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>Goals: {patient.goals.join(", ")}</div>
                          <div>Allergies: {patient.allergies.join(", ") || "None"}</div>
                          <div>Conditions: {patient.chronicConditions.join(", ") || "None"}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Generation Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Generation Options</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="planDuration">Plan Duration</Label>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 Days</SelectItem>
                          <SelectItem value="30">30 Days</SelectItem>
                          <SelectItem value="60">60 Days</SelectItem>
                          <SelectItem value="90">90 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="calorieTarget">Calorie Target</Label>
                      <Select defaultValue="maintain">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lose">Weight Loss</SelectItem>
                          <SelectItem value="maintain">Maintain Weight</SelectItem>
                          <SelectItem value="gain">Weight Gain</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="advanced"
                      checked={showAdvanced}
                      onChange={(e) => setShowAdvanced(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="advanced">Show advanced options</Label>
                  </div>

                  {showAdvanced && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                      <div className="space-y-2">
                        <Label htmlFor="mealTiming">Meal Timing Preference</Label>
                        <Select defaultValue="traditional">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="traditional">Traditional Ayurvedic</SelectItem>
                            <SelectItem value="modern">Modern Schedule</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cookingStyle">Cooking Style</Label>
                        <Select defaultValue="balanced">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="simple">Simple & Quick</SelectItem>
                            <SelectItem value="balanced">Balanced</SelectItem>
                            <SelectItem value="traditional">Traditional</SelectItem>
                            <SelectItem value="gourmet">Gourmet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget Level</Label>
                        <Select defaultValue="moderate">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="budget">Budget-Friendly</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Generate Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleGeneratePlan}
                  disabled={!selectedPatient || isGenerating}
                  size="lg"
                  className="px-8"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating Plan...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Generate Diet Plan
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Plan Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{generatedPlan.name}</CardTitle>
                      <CardDescription className="text-base mt-2">
                        {generatedPlan.description}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Plan
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-bold">{generatedPlan.totalCalories}</div>
                      <div className="text-xs text-muted-foreground">Total Calories</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-bold">{generatedPlan.totalProtein}g</div>
                      <div className="text-xs text-muted-foreground">Protein</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-bold">{generatedPlan.totalCarbs}g</div>
                      <div className="text-xs text-muted-foreground">Carbs</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-bold">{generatedPlan.totalFat}g</div>
                      <div className="text-xs text-muted-foreground">Fat</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Duration: {generatedPlan.startDate} to {generatedPlan.endDate}</span>
                    <span>Generated for: {generatedPlan.patient.name}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Plan Content */}
              <Tabs defaultValue="meals" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="meals">Daily Meals</TabsTrigger>
                  <TabsTrigger value="rationale">Rationale</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  <TabsTrigger value="warnings">Warnings</TabsTrigger>
                </TabsList>

                <TabsContent value="meals" className="space-y-4">
                  {generatedPlan.meals.map((meal, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center space-x-2">
                              <Clock className="h-5 w-5" />
                              <span>{meal.name}</span>
                            </CardTitle>
                            <CardDescription>
                              {meal.time} • {meal.totalCalories} calories
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Foods:</h4>
                            <div className="grid gap-3">
                              {meal.foods.map((foodItem, foodIndex) => (
                                <div key={foodIndex} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                  <div>
                                    <div className="font-medium">{foodItem.food.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {foodItem.quantity}
                                      {foodItem.notes && ` • ${foodItem.notes}`}
                                    </div>
                                  </div>
                                  <div className="text-right text-sm">
                                    <div>{Math.round(foodItem.food.calories * (parseFloat(foodItem.quantity) || 1))} cal</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Ayurvedic Rationale:</h4>
                            <p className="text-sm text-muted-foreground">{meal.rationale}</p>
                          </div>

                          <div className="grid grid-cols-5 gap-2 text-center text-xs">
                            <div className="p-2 bg-muted rounded">
                              <div className="font-medium">{meal.totalCalories}</div>
                              <div className="text-muted-foreground">Calories</div>
                            </div>
                            <div className="p-2 bg-muted rounded">
                              <div className="font-medium">{meal.totalProtein}g</div>
                              <div className="text-muted-foreground">Protein</div>
                            </div>
                            <div className="p-2 bg-muted rounded">
                              <div className="font-medium">{meal.totalCarbs}g</div>
                              <div className="text-muted-foreground">Carbs</div>
                            </div>
                            <div className="p-2 bg-muted rounded">
                              <div className="font-medium">{meal.totalFat}g</div>
                              <div className="text-muted-foreground">Fat</div>
                            </div>
                            <div className="p-2 bg-muted rounded">
                              <div className="font-medium">{meal.totalFiber}g</div>
                              <div className="text-muted-foreground">Fiber</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="rationale" className="space-y-4">
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Brain className="h-5 w-5" />
                          <span>Ayurvedic Rationale</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {generatedPlan.rationale.ayurvedic}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Target className="h-5 w-5" />
                          <span>Nutritional Rationale</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {generatedPlan.rationale.nutritional}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Clock className="h-5 w-5" />
                          <span>Lifestyle Rationale</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {generatedPlan.rationale.lifestyle}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Lightbulb className="h-5 w-5" />
                        <span>Personalized Recommendations</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {generatedPlan.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="warnings" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Important Warnings</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {generatedPlan.warnings.length > 0 ? (
                        <div className="space-y-3">
                          {generatedPlan.warnings.map((warning, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{warning}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No specific warnings for this plan.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <Button onClick={() => setGeneratedPlan(null)} variant="outline">
                  Generate New Plan
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Save & Export Plan
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}