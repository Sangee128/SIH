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
  User, 
  Calendar, 
  Activity, 
  Heart, 
  FileText, 
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  MapPin,
  Scale,
  Ruler
} from "lucide-react"

interface Patient {
  id: string
  name: string
  email?: string
  phone?: string
  dateOfBirth: string
  gender: string
  height?: number
  weight?: number
  address?: string
  prakriti?: string
  status: string
  lastVisit?: string
  allergies?: string[]
  chronicConditions?: string[]
  medications?: string[]
  goals?: string[]
}

interface DietPlan {
  id: string
  name: string
  description?: string
  startDate: string
  endDate?: string
  status: string
  totalNutrition?: {
    calories: number
    protein: number
    fat: number
    carbs: number
  }
}

interface PrakritiAssessment {
  id: string
  vataScore: number
  pittaScore: number
  kaphaScore: number
  assessedAt: string
  confidence?: number
}

export default function PatientProfile() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([])
  const [assessments, setAssessments] = useState<PrakritiAssessment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockPatient: Patient = {
      id: params.id as string,
      name: "Ravi Sharma",
      email: "ravi.sharma@email.com",
      phone: "+91 98765 43210",
      dateOfBirth: "1990-05-15",
      gender: "MALE",
      height: 175,
      weight: 72,
      address: "123 Main St, Mumbai, Maharashtra",
      prakriti: "Vata-Pitta",
      status: "Active",
      lastVisit: "2 days ago",
      allergies: ["None"],
      chronicConditions: ["None"],
      medications: ["None"],
      goals: ["Weight management", "Improved digestion"]
    }

    const mockDietPlans: DietPlan[] = [
      {
        id: "plan-1",
        name: "Vata-Pitta Balance Plan",
        description: "Customized diet plan to balance Vata and Pitta doshas",
        startDate: "2024-01-15",
        endDate: "2024-02-15",
        status: "ACTIVE",
        totalNutrition: {
          calories: 2000,
          protein: 80,
          fat: 65,
          carbs: 250
        }
      }
    ]

    const mockAssessments: PrakritiAssessment[] = [
      {
        id: "assessment-1",
        vataScore: 45,
        pittaScore: 35,
        kaphaScore: 20,
        assessedAt: "2024-01-10",
        confidence: 0.85
      }
    ]

    setPatient(mockPatient)
    setDietPlans(mockDietPlans)
    setAssessments(mockAssessments)
    setLoading(false)
  }, [params.id])

  const calculateAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const getBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100
    return (weight / (heightInMeters * heightInMeters)).toFixed(1)
  }

  const getBMICategory = (bmi: string) => {
    const bmiValue = parseFloat(bmi)
    if (bmiValue < 18.5) return "Underweight"
    if (bmiValue < 25) return "Normal"
    if (bmiValue < 30) return "Overweight"
    return "Obese"
  }

  if (loading) {
    return (
      <AuthGuard requiredRoles={['DIETITIAN', 'CLINIC_ADMIN', 'SUPER_ADMIN']}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </AuthGuard>
    )
  }

  if (!patient) {
    return (
      <AuthGuard requiredRoles={['DIETITIAN', 'CLINIC_ADMIN', 'SUPER_ADMIN']}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Patient not found</h1>
            <Button onClick={() => router.push("/")}>Back to Dashboard</Button>
          </div>
        </div>
      </AuthGuard>
    )
  }

  const bmi = patient.height && patient.weight ? getBMI(patient.weight, patient.height) : null
  const bmiCategory = bmi ? getBMICategory(bmi) : null

  return (
    <AuthGuard requiredRoles={['DIETITIAN', 'CLINIC_ADMIN', 'SUPER_ADMIN']}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 flex">
              <Button variant="ghost" onClick={() => router.push("/")} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <User className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">Patient Profile</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Sidebar - Patient Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Patient Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Patient Information
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`/avatars/${patient.id}.png`} alt={patient.name} />
                      <AvatarFallback className="text-lg">{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-bold">{patient.name}</h2>
                      <Badge variant={patient.status === "Active" ? "default" : "secondary"}>
                        {patient.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{patient.email || "No email provided"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{patient.phone || "No phone provided"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{patient.address || "No address provided"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{calculateAge(patient.dateOfBirth)} years old</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Scale className="h-4 w-4 text-muted-foreground" />
                      <span>{patient.weight ? `${patient.weight} kg` : "No weight recorded"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Ruler className="h-4 w-4 text-muted-foreground" />
                      <span>{patient.height ? `${patient.height} cm` : "No height recorded"}</span>
                    </div>
                    {bmi && (
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span>BMI: {bmi} ({bmiCategory})</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Prakriti Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Prakriti
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{patient.prakriti}</div>
                      <div className="text-sm text-muted-foreground">Constitution type</div>
                    </div>
                    {assessments.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Latest Assessment</div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-blue-50 p-2 rounded">
                            <div className="text-xs text-blue-600">Vata</div>
                            <div className="font-bold">{assessments[0].vataScore}%</div>
                          </div>
                          <div className="bg-red-50 p-2 rounded">
                            <div className="text-xs text-red-600">Pitta</div>
                            <div className="font-bold">{assessments[0].pittaScore}%</div>
                          </div>
                          <div className="bg-green-50 p-2 rounded">
                            <div className="text-xs text-green-600">Kapha</div>
                            <div className="font-bold">{assessments[0].kaphaScore}%</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Content - Details */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="diet-plans">Diet Plans</TabsTrigger>
                  <TabsTrigger value="assessments">Assessments</TabsTrigger>
                  <TabsTrigger value="medical">Medical History</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Patient Overview</CardTitle>
                      <CardDescription>
                        Summary of patient information and current status
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="text-sm font-medium">Last Visit</div>
                          <div className="text-lg">{patient.lastVisit || "No visits recorded"}</div>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="text-sm font-medium">Status</div>
                          <div className="text-lg">{patient.status}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="font-medium">Health Goals</h3>
                        <div className="flex flex-wrap gap-2">
                          {patient.goals?.map((goal, index) => (
                            <Badge key={index} variant="outline">{goal}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="diet-plans" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Diet Plans</CardTitle>
                      <CardDescription>
                        Current and historical diet plans for this patient
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {dietPlans.map((plan) => (
                          <div key={plan.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium">{plan.name}</h3>
                              <Badge variant={plan.status === "ACTIVE" ? "default" : "secondary"}>
                                {plan.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                            <div className="flex items-center justify-between text-sm">
                              <span>{plan.startDate} to {plan.endDate || "Ongoing"}</span>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => router.push(`/diet-plan/${plan.id}`)}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                View Plan
                              </Button>
                            </div>
                            {plan.totalNutrition && (
                              <div className="mt-3 pt-3 border-t">
                                <div className="text-sm font-medium mb-2">Nutrition Summary</div>
                                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                                  <div>
                                    <div className="text-muted-foreground">Calories</div>
                                    <div className="font-medium">{plan.totalNutrition.calories}</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Protein</div>
                                    <div className="font-medium">{plan.totalNutrition.protein}g</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Fat</div>
                                    <div className="font-medium">{plan.totalNutrition.fat}g</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Carbs</div>
                                    <div className="font-medium">{plan.totalNutrition.carbs}g</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        {dietPlans.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            No diet plans found for this patient
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="assessments" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Prakriti Assessments</CardTitle>
                      <CardDescription>
                        Dosha assessment history and results
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {assessments.map((assessment) => (
                          <div key={assessment.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-medium">Assessment</h3>
                              <span className="text-sm text-muted-foreground">
                                {new Date(assessment.assessedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center">
                                <div className="text-sm text-blue-600 mb-1">Vata</div>
                                <div className="text-2xl font-bold text-blue-600">{assessment.vataScore}%</div>
                                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${assessment.vataScore}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm text-red-600 mb-1">Pitta</div>
                                <div className="text-2xl font-bold text-red-600">{assessment.pittaScore}%</div>
                                <div className="w-full bg-red-200 rounded-full h-2 mt-2">
                                  <div 
                                    className="bg-red-600 h-2 rounded-full" 
                                    style={{ width: `${assessment.pittaScore}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm text-green-600 mb-1">Kapha</div>
                                <div className="text-2xl font-bold text-green-600">{assessment.kaphaScore}%</div>
                                <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                                  <div 
                                    className="bg-green-600 h-2 rounded-full" 
                                    style={{ width: `${assessment.kaphaScore}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            {assessment.confidence && (
                              <div className="mt-3 text-center">
                                <span className="text-sm text-muted-foreground">
                                  Confidence: {(assessment.confidence * 100).toFixed(1)}%
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                        {assessments.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            No assessments found for this patient
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="medical" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Allergies</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {patient.allergies?.map((allergy, index) => (
                            <Badge key={index} variant="outline">{allergy}</Badge>
                          ))}
                          {(!patient.allergies || patient.allergies.length === 0) && (
                            <span className="text-muted-foreground">No allergies recorded</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Chronic Conditions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {patient.chronicConditions?.map((condition, index) => (
                            <Badge key={index} variant="outline">{condition}</Badge>
                          ))}
                          {(!patient.chronicConditions || patient.chronicConditions.length === 0) && (
                            <span className="text-muted-foreground">No chronic conditions recorded</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Medications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {patient.medications?.map((medication, index) => (
                            <Badge key={index} variant="outline">{medication}</Badge>
                          ))}
                          {(!patient.medications || patient.medications.length === 0) && (
                            <span className="text-muted-foreground">No medications recorded</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Health Goals</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {patient.goals?.map((goal, index) => (
                            <Badge key={index} variant="outline">{goal}</Badge>
                          ))}
                          {(!patient.goals || patient.goals.length === 0) && (
                            <span className="text-muted-foreground">No goals recorded</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}