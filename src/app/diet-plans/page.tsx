"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { useAuth } from "@/contexts/AuthContext"
import { 
  Utensils, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Activity,
  ArrowLeft,
  User,
  Target,
  FileText
} from "lucide-react"

interface DietPlan {
  id: string
  name: string
  description?: string
  startDate: string
  endDate?: string
  status: 'DRAFT' | 'APPROVED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
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
  totalNutrition?: {
    calories: number
    protein: number
    fat: number
    carbs: number
  }
  createdAt: string
  updatedAt: string
}

export default function DietPlansPage() {
  const router = useRouter()
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([])
  const [filteredDietPlans, setFilteredDietPlans] = useState<DietPlan[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedDietPlan, setSelectedDietPlan] = useState<DietPlan | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPatient, setFilterPatient] = useState<string>("all")

  // Mock data
  const mockDietPlans: DietPlan[] = [
    {
      id: "plan-1",
      name: "Vata-Pitta Balance Plan",
      description: "Customized diet plan to balance Vata and Pitta doshas",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      status: "ACTIVE",
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
      totalNutrition: {
        calories: 2000,
        protein: 80,
        fat: 65,
        carbs: 250
      },
      createdAt: "2024-01-10",
      updatedAt: "2024-01-15"
    },
    {
      id: "plan-2",
      name: "Kapha Reduction Plan",
      description: "Weight management plan for Kapha constitution",
      startDate: "2024-01-05",
      endDate: "2024-03-05",
      status: "ACTIVE",
      patient: {
        id: "patient-2",
        name: "Priya Patel",
        email: "priya.patel@email.com",
        prakriti: "Kapha"
      },
      dietitian: {
        id: "dietitian-1",
        name: "Dr. Priya Patel",
        email: "priya.patel@clinic.com"
      },
      totalNutrition: {
        calories: 1800,
        protein: 90,
        fat: 50,
        carbs: 200
      },
      createdAt: "2024-01-03",
      updatedAt: "2024-01-05"
    },
    {
      id: "plan-3",
      name: "Pitta Soothing Plan",
      description: "Cooling diet plan for Pitta constitution",
      startDate: "2024-01-08",
      endDate: "2024-02-08",
      status: "DRAFT",
      patient: {
        id: "patient-3",
        name: "Amit Kumar",
        email: "amit.kumar@email.com",
        prakriti: "Pitta"
      },
      dietitian: {
        id: "dietitian-1",
        name: "Dr. Priya Patel",
        email: "priya.patel@clinic.com"
      },
      totalNutrition: {
        calories: 2200,
        protein: 85,
        fat: 70,
        carbs: 280
      },
      createdAt: "2024-01-06",
      updatedAt: "2024-01-08"
    },
    {
      id: "plan-4",
      name: "Vata Nourishing Plan",
      description: "Grounding diet plan for Vata constitution",
      startDate: "2024-01-12",
      endDate: "2024-02-12",
      status: "APPROVED",
      patient: {
        id: "patient-4",
        name: "Sneha Reddy",
        email: "sneha.reddy@email.com",
        prakriti: "Vata"
      },
      dietitian: {
        id: "dietitian-1",
        name: "Dr. Priya Patel",
        email: "priya.patel@clinic.com"
      },
      totalNutrition: {
        calories: 2100,
        protein: 75,
        fat: 75,
        carbs: 260
      },
      createdAt: "2024-01-10",
      updatedAt: "2024-01-12"
    }
  ]

  useEffect(() => {
    setDietPlans(mockDietPlans)
    setFilteredDietPlans(mockDietPlans)
  }, [])

  useEffect(() => {
    let filtered = dietPlans

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(plan =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(plan => plan.status === filterStatus)
    }

    // Patient filter
    if (filterPatient !== "all") {
      filtered = filtered.filter(plan => plan.patient.id === filterPatient)
    }

    setFilteredDietPlans(filtered)
  }, [dietPlans, searchTerm, filterStatus, filterPatient])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'default'
      case 'APPROVED': return 'default'
      case 'DRAFT': return 'outline'
      case 'COMPLETED': return 'secondary'
      case 'CANCELLED': return 'destructive'
      default: return 'outline'
    }
  }

  const getPrakritiColor = (prakriti?: string) => {
    switch (prakriti) {
      case 'Vata': return 'bg-blue-100 text-blue-800'
      case 'Pitta': return 'bg-red-100 text-red-800'
      case 'Kapha': return 'bg-green-100 text-green-800'
      case 'Vata-Pitta': return 'bg-purple-100 text-purple-800'
      case 'Vata-Kapha': return 'bg-cyan-100 text-cyan-800'
      case 'Pitta-Kapha': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddDietPlan = () => {
    router.push("/diet-plan-editor")
  }

  const handleEditDietPlan = (dietPlan: DietPlan) => {
    router.push(`/diet-plan-editor?planId=${dietPlan.id}`)
  }

  const handleDeleteDietPlan = (planId: string) => {
    if (confirm('Are you sure you want to delete this diet plan? This action cannot be undone.')) {
      setDietPlans(prev => prev.filter(plan => plan.id !== planId))
    }
  }

  const handleViewPlan = (planId: string) => {
    router.push(`/diet-plan/${planId}`)
  }

  const handleDuplicatePlan = (planId: string) => {
    const plan = dietPlans.find(p => p.id === planId)
    if (plan) {
      const newPlan: DietPlan = {
        ...plan,
        id: `plan-${Date.now()}`,
        name: `${plan.name} (Copy)`,
        status: 'DRAFT' as const,
        startDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setDietPlans(prev => [...prev, newPlan])
    }
  }

  return (
    <AuthGuard requiredRoles={['DIETITIAN', 'CLINIC_ADMIN', 'SUPER_ADMIN']}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 flex">
              <Button variant="ghost" onClick={() => window.history.back()} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <Utensils className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">Diet Plans</span>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              <div className="flex items-center space-x-2">
                <Button onClick={handleAddDietPlan}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Diet Plan
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search diet plans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPatient} onValueChange={setFilterPatient}>
              <SelectTrigger className="w-40">
                <User className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                {Array.from(new Set(dietPlans.map(plan => plan.patient))).map(patient => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Diet Plans Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDietPlans.map((dietPlan) => (
              <Card key={dietPlan.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{dietPlan.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {dietPlan.description}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusColor(dietPlan.status)}>
                      {dietPlan.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Patient Info */}
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/avatars/${dietPlan.patient.id}.png`} alt={dietPlan.patient.name} />
                      <AvatarFallback>{dietPlan.patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{dietPlan.patient.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={`text-xs ${getPrakritiColor(dietPlan.patient.prakriti)}`}>
                          {dietPlan.patient.prakriti}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Plan Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{dietPlan.startDate} to {dietPlan.endDate || 'Ongoing'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Dietitian:</span>
                      <span>{dietPlan.dietitian.name}</span>
                    </div>
                    {dietPlan.totalNutrition && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Calories:</span>
                        <span>{dietPlan.totalNutrition.calories} cal</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewPlan(dietPlan.id)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDuplicatePlan(dietPlan.id)}>
                        <FileText className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditDietPlan(dietPlan)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteDietPlan(dietPlan.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDietPlans.length === 0 && (
            <div className="text-center py-12">
              <Utensils className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No diet plans found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterStatus !== "all" || filterPatient !== "all" 
                  ? "Try adjusting your filters or search terms." 
                  : "Get started by creating your first diet plan."
                }
              </p>
              <Button onClick={handleAddDietPlan}>
                <Plus className="mr-2 h-4 w-4" />
                Create Diet Plan
              </Button>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}