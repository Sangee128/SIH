"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { useAuth } from "@/contexts/AuthContext"
import { 
  Utensils, 
  Activity, 
  FileText, 
  Heart, 
  Calendar,
  TrendingUp,
  LogOut,
  User,
  Target
} from "lucide-react"

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { user, logout } = useAuth()

  // Mock data for demonstration
  const currentDietPlan = {
    name: "Vata-Pitta Balance Plan",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    adherence: 85,
    meals: [
      { time: "6:30 AM", name: "Warm Water with Ginger", status: "completed" },
      { time: "8:00 AM", name: "Moong Dal Khichdi", status: "completed" },
      { time: "11:00 AM", name: "Seasonal Fruits", status: "pending" },
      { time: "1:30 PM", name: "Vegetable Pulao with Curd", status: "pending" },
      { time: "4:30 PM", name: "Herbal Tea", status: "pending" },
      { time: "7:00 PM", name: "Light Soup", status: "pending" },
    ]
  }

  const prakritiAssessment = {
    vata: 35,
    pitta: 40,
    kapha: 25,
    dominant: "Pitta-Vata",
    lastAssessed: "2024-01-10"
  }

  const progressData = {
    weight: { current: 72, target: 68, unit: "kg" },
    energy: { current: 8, target: 9, unit: "/10" },
    digestion: { current: 7, target: 9, unit: "/10" },
    sleep: { current: 6, target: 8, unit: "/10" }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <AuthGuard requiredRoles={['PATIENT']}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 flex">
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">AyurCare</span>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              <nav className="flex items-center">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="User" />
                    <AvatarFallback>{user?.name?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
                  </Avatar>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-full flex-col gap-2 p-4">
              <Button variant="ghost" className="justify-start">
                <Heart className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="justify-start">
                <Utensils className="mr-2 h-4 w-4" />
                My Diet Plan
              </Button>
              <Button variant="ghost" className="justify-start">
                <Activity className="mr-2 h-4 w-4" />
                My Assessment
              </Button>
              <Button variant="ghost" className="justify-start">
                <FileText className="mr-2 h-4 w-4" />
                My Progress
              </Button>
              <Button variant="ghost" className="justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Appointments
              </Button>
            </div>
          </aside>

          {/* Dashboard Content */}
          <main className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Patient Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user?.name}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Plan Adherence</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentDietPlan.adherence}%</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                  <Utensils className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentDietPlan.name}</div>
                  <p className="text-xs text-muted-foreground">Active</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Prakriti</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{prakritiAssessment.dominant}</div>
                  <p className="text-xs text-muted-foreground">Last assessed: {prakritiAssessment.lastAssessed}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Good</div>
                  <p className="text-xs text-muted-foreground">Keep it up!</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="diet-plan">Today's Diet Plan</TabsTrigger>
                <TabsTrigger value="assessment">My Assessment</TabsTrigger>
                <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Today's Meals</CardTitle>
                      <CardDescription>
                        Your personalized meal schedule
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {currentDietPlan.meals.slice(0, 4).map((meal, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="text-sm font-medium">{meal.time}</div>
                              <div>{meal.name}</div>
                            </div>
                            <Badge variant={meal.status === "completed" ? "default" : "outline"}>
                              {meal.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Prakriti Balance</CardTitle>
                      <CardDescription>
                        Your current constitution balance
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Vata</span>
                            <span>{prakritiAssessment.vata}%</span>
                          </div>
                          <Progress value={prakritiAssessment.vata} className="mt-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Pitta</span>
                            <span>{prakritiAssessment.pitta}%</span>
                          </div>
                          <Progress value={prakritiAssessment.pitta} className="mt-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Kapha</span>
                            <span>{prakritiAssessment.kapha}%</span>
                          </div>
                          <Progress value={prakritiAssessment.kapha} className="mt-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="diet-plan" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Complete Diet Plan</CardTitle>
                    <CardDescription>
                      {currentDietPlan.name} - {currentDietPlan.startDate} to {currentDietPlan.endDate}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentDietPlan.meals.map((meal, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <p className="text-lg font-semibold">{meal.time}</p>
                            </div>
                            <div>
                              <h3 className="font-medium">{meal.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {meal.status === "completed" ? "Completed" : "Upcoming"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={meal.status === "completed" ? "default" : "outline"}>
                              {meal.status}
                            </Badge>
                            {meal.status === "pending" && (
                              <Button variant="outline" size="sm">Mark Complete</Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="assessment" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Prakriti Analysis</CardTitle>
                      <CardDescription>
                        Your detailed constitution assessment
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <h3 className="text-lg font-semibold">Dominant Constitution</h3>
                          <p className="text-2xl font-bold text-primary">{prakritiAssessment.dominant}</p>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Vata</span>
                              <span>{prakritiAssessment.vata}%</span>
                            </div>
                            <Progress value={prakritiAssessment.vata} className="mt-1" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Pitta</span>
                              <span>{prakritiAssessment.pitta}%</span>
                            </div>
                            <Progress value={prakritiAssessment.pitta} className="mt-1" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm">
                              <span>Kapha</span>
                              <span>{prakritiAssessment.kapha}%</span>
                            </div>
                            <Progress value={prakritiAssessment.kapha} className="mt-1" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recommendations</CardTitle>
                      <CardDescription>
                        Personalized based on your prakriti
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-900">Diet</h4>
                          <p className="text-sm text-blue-700">Focus on warm, cooked foods. Avoid cold and raw foods.</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h4 className="font-medium text-green-900">Lifestyle</h4>
                          <p className="text-sm text-green-700">Maintain regular routine. Practice meditation.</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <h4 className="font-medium text-purple-900">Exercise</h4>
                          <p className="text-sm text-purple-700">Gentle yoga and walking. Avoid intense workouts.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="progress" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Health Metrics</CardTitle>
                      <CardDescription>
                        Track your progress towards health goals
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(progressData).map(([key, data]) => (
                          <div key={key}>
                            <div className="flex justify-between text-sm">
                              <span className="capitalize">{key}</span>
                              <span>{data.current}{data.unit} / {data.target}{data.unit}</span>
                            </div>
                            <Progress 
                              value={(data.current / data.target) * 100} 
                              className="mt-1" 
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>
                        Your latest health tracking entries
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Weight logged</p>
                            <p className="text-sm text-muted-foreground">72 kg - Today</p>
                          </div>
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Energy level</p>
                            <p className="text-sm text-muted-foreground">8/10 - Yesterday</p>
                          </div>
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Sleep quality</p>
                            <p className="text-sm text-muted-foreground">6/10 - Yesterday</p>
                          </div>
                          <TrendingUp className="h-4 w-4 text-yellow-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}