"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { useAuth } from "@/contexts/AuthContext"
import { 
  Users, 
  Calendar, 
  Utensils, 
  Heart, 
  Plus, 
  Search,
  Bell,
  Settings,
  Activity,
  BarChart3,
  FileText,
  LogOut
} from "lucide-react"

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const { user, logout } = useAuth()

  // Mock data for demonstration
  const recentPatients = [
    { id: "patient-1", name: "Ravi Sharma", prakriti: "Vata-Pitta", lastVisit: "2 days ago", status: "Active" },
    { id: "patient-2", name: "Priya Patel", prakriti: "Kapha", lastVisit: "1 week ago", status: "Follow-up" },
    { id: "patient-3", name: "Amit Kumar", prakriti: "Pitta", lastVisit: "3 days ago", status: "Active" },
    { id: "patient-4", name: "Sneha Reddy", prakriti: "Vata", lastVisit: "5 days ago", status: "New Plan" },
  ]

  const todayAppointments = [
    { id: "appointment-1", time: "9:00 AM", patient: "Ravi Sharma", type: "Follow-up", status: "Confirmed" },
    { id: "appointment-2", time: "11:00 AM", patient: "Priya Patel", type: "Consultation", status: "Confirmed" },
    { id: "appointment-3", time: "2:00 PM", patient: "Amit Kumar", type: "Plan Review", status: "Pending" },
  ]

  const quickStats = {
    totalPatients: 24,
    activePlans: 18,
    appointmentsToday: 3,
    pendingReviews: 5,
  }

  const handleLogout = () => {
    logout()
  }

  const handleViewProfile = (patientId: string) => {
    router.push(`/patient-profile/${patientId}`)
  }

  const handleViewPlan = (patientId: string) => {
    router.push(`/diet-plan/plan-${patientId}`)
  }

  const handleNewPatient = () => {
    router.push("/patient-onboarding")
  }

  const handleRescheduleAppointment = (appointmentId: string) => {
    // For now, just show an alert - in real app, this would open a reschedule dialog
    alert(`Reschedule appointment ${appointmentId} - This would open a reschedule dialog`)
  }

  const handleCancelAppointment = (appointmentId: string) => {
    // For now, just show an alert - in real app, this would show a confirmation dialog
    if (confirm(`Are you sure you want to cancel appointment ${appointmentId}?`)) {
      alert(`Appointment ${appointmentId} cancelled - This would update the database`)
    }
  }

  const getWelcomeMessage = () => {
    if (!user) return "Welcome"
    
    switch (user.role) {
      case 'SUPER_ADMIN':
        return `Welcome back, Super Admin ${user.name}`
      case 'CLINIC_ADMIN':
        return `Welcome back, Admin ${user.name}`
      case 'DIETITIAN':
        return `Welcome back, Dr. ${user.name}`
      case 'ASSISTANT':
        return `Welcome back, ${user.name}`
      case 'PATIENT':
        return `Welcome back, ${user.name}`
      default:
        return `Welcome back, ${user.name}`
    }
  }

  const getRoleBasedNavigation = () => {
    if (!user) return []

    const baseNav = [
      { icon: BarChart3, label: "Dashboard", href: "/" },
    ]

    switch (user.role) {
      case 'SUPER_ADMIN':
      case 'CLINIC_ADMIN':
      case 'DIETITIAN':
        return [
          ...baseNav,
          { icon: Users, label: "Patients", href: "/patients" },
          { icon: Calendar, label: "Appointments", href: "/appointments" },
          { icon: Utensils, label: "Diet Plans", href: "/diet-plans" },
          { icon: Activity, label: "Prakriti Assessment", href: "/prakriti-assessment" },
          { icon: FileText, label: "Reports", href: "/reports" },
        ]
      case 'ASSISTANT':
        return [
          ...baseNav,
          { icon: Users, label: "Patients", href: "/patients" },
          { icon: Calendar, label: "Appointments", href: "/appointments" },
        ]
      case 'PATIENT':
        return [
          ...baseNav,
          { icon: Utensils, label: "My Diet Plan", href: "/my-diet-plan" },
          { icon: Activity, label: "My Assessment", href: "/my-assessment" },
          { icon: FileText, label: "My Progress", href: "/my-progress" },
        ]
      default:
        return baseNav
    }
  }

  const navigation = getRoleBasedNavigation()

  return (
    <AuthGuard requiredRoles={['SUPER_ADMIN', 'CLINIC_ADMIN', 'DIETITIAN', 'ASSISTANT']}>
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
              <div className="w-full flex-1 md:w-auto md:flex-none">
                <Button variant="outline" className="relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64">
                  <Search className="mr-2 h-4 w-4" />
                  Search patients...
                  <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    ⌘K
                  </kbd>
                </Button>
              </div>
              <nav className="flex items-center">
                <Button variant="ghost" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
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
              {navigation.map((item) => (
                <Button 
                  key={item.label} 
                  variant="ghost" 
                  className="justify-start"
                  onClick={() => router.push(item.href)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
              <Separator className="my-2" />
              {['SUPER_ADMIN', 'CLINIC_ADMIN', 'DIETITIAN'].includes(user?.role || '') && (
                <Button className="justify-start" onClick={handleNewPatient}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Patient
                </Button>
              )}
            </div>
          </aside>

          {/* Dashboard Content */}
          <main className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">{getWelcomeMessage()}</p>
              </div>
              <div className="flex items-center space-x-2">
                {['SUPER_ADMIN', 'CLINIC_ADMIN', 'DIETITIAN'].includes(user?.role || '') && (
                  <Button onClick={handleNewPatient}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Patient
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{quickStats.totalPatients}</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                  <Utensils className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{quickStats.activePlans}</div>
                  <p className="text-xs text-muted-foreground">+12% from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{quickStats.appointmentsToday}</div>
                  <p className="text-xs text-muted-foreground">2 confirmed, 1 pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{quickStats.pendingReviews}</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="patients">Recent Patients</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Recent Patients</CardTitle>
                      <CardDescription>
                        Your latest patient interactions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <div className="space-y-4">
                        {recentPatients.map((patient) => (
                          <div key={patient.id} className="flex items-center space-x-4 rounded-lg border p-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={`/avatars/${patient.id}.png`} alt={patient.name} />
                              <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium leading-none">{patient.name}</p>
                              <p className="text-sm text-muted-foreground">{patient.prakriti} • {patient.lastVisit}</p>
                            </div>
                            <Badge variant={patient.status === "Active" ? "default" : "secondary"}>
                              {patient.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Today's Schedule</CardTitle>
                      <CardDescription>
                        Your appointments for today
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {todayAppointments.map((appointment) => (
                          <div key={appointment.id} className="flex items-center justify-between space-x-4">
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{appointment.time}</p>
                              <p className="text-sm text-muted-foreground">{appointment.patient}</p>
                            </div>
                            <div className="text-right space-y-1">
                              <p className="text-xs">{appointment.type}</p>
                              <Badge variant={appointment.status === "Confirmed" ? "default" : "outline"}>
                                {appointment.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="patients" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Management</CardTitle>
                    <CardDescription>
                      View and manage all your patients
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentPatients.map((patient) => (
                        <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={`/avatars/${patient.id}.png`} alt={patient.name} />
                              <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{patient.name}</h3>
                              <p className="text-sm text-muted-foreground">{patient.prakriti} • Last visit: {patient.lastVisit}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={patient.status === "Active" ? "default" : "secondary"}>
                              {patient.status}
                            </Badge>
                            <Button variant="outline" size="sm" onClick={() => handleViewProfile(patient.id)}>
                              View Profile
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleViewPlan(patient.id)}>
                              View Plan
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appointments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Appointment Schedule</CardTitle>
                    <CardDescription>
                      Manage your appointments and calendar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {todayAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <p className="text-lg font-semibold">{appointment.time}</p>
                            </div>
                            <div>
                              <h3 className="font-medium">{appointment.patient}</h3>
                              <p className="text-sm text-muted-foreground">{appointment.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={appointment.status === "Confirmed" ? "default" : "outline"}>
                              {appointment.status}
                            </Badge>
                            <Button variant="outline" size="sm" onClick={() => handleRescheduleAppointment(appointment.id)}>
                              Reschedule
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleCancelAppointment(appointment.id)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Patient Progress</CardTitle>
                      <CardDescription>
                        Overall patient improvement metrics
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Weight Management</span>
                            <span>78%</span>
                          </div>
                          <Progress value={78} className="mt-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Dosha Balance</span>
                            <span>85%</span>
                          </div>
                          <Progress value={85} className="mt-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Diet Adherence</span>
                            <span>72%</span>
                          </div>
                          <Progress value={72} className="mt-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Symptom Improvement</span>
                            <span>91%</span>
                          </div>
                          <Progress value={91} className="mt-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Prakriti Distribution</CardTitle>
                      <CardDescription>
                        Patient constitution types
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Vata Dominant</span>
                            <span>35%</span>
                          </div>
                          <Progress value={35} className="mt-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Pitta Dominant</span>
                            <span>40%</span>
                          </div>
                          <Progress value={40} className="mt-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Kapha Dominant</span>
                            <span>25%</span>
                          </div>
                          <Progress value={25} className="mt-1" />
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