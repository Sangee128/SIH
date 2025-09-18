"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { useAuth } from "@/contexts/AuthContext"
import { 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  ArrowLeft,
  Phone,
  Mail,
  MapPin
} from "lucide-react"

interface Appointment {
  id: string
  patientId: string
  patientName: string
  patientEmail?: string
  patientPhone?: string
  date: string
  time: string
  type: string
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED'
  notes?: string
  duration: number
  location?: string
}

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState("schedule")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Mock data
  const mockAppointments: Appointment[] = [
    {
      id: "1",
      patientId: "1",
      patientName: "Ravi Sharma",
      patientEmail: "ravi.sharma@email.com",
      patientPhone: "+91 98765 43210",
      date: "2024-01-20",
      time: "9:00 AM",
      type: "Follow-up",
      status: "CONFIRMED",
      notes: "Regular follow-up for diet plan review",
      duration: 30,
      location: "Clinic Room 1"
    },
    {
      id: "2",
      patientId: "2",
      patientName: "Priya Patel",
      patientEmail: "priya.patel@email.com",
      patientPhone: "+91 98765 43211",
      date: "2024-01-20",
      time: "11:00 AM",
      type: "Consultation",
      status: "CONFIRMED",
      notes: "Initial consultation for new patient",
      duration: 60,
      location: "Clinic Room 2"
    },
    {
      id: "3",
      patientId: "3",
      patientName: "Amit Kumar",
      patientEmail: "amit.kumar@email.com",
      patientPhone: "+91 98765 43212",
      date: "2024-01-20",
      time: "2:00 PM",
      type: "Plan Review",
      status: "PENDING",
      notes: "Review current diet plan effectiveness",
      duration: 45,
      location: "Clinic Room 1"
    },
    {
      id: "4",
      patientId: "4",
      patientName: "Sneha Reddy",
      patientEmail: "sneha.reddy@email.com",
      patientPhone: "+91 98765 43213",
      date: "2024-01-21",
      time: "10:00 AM",
      type: "Assessment",
      status: "CONFIRMED",
      notes: "Prakriti assessment session",
      duration: 90,
      location: "Clinic Room 3"
    }
  ]

  useEffect(() => {
    setAppointments(mockAppointments)
  }, [])

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || appointment.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'default'
      case 'PENDING': return 'outline'
      case 'CANCELLED': return 'destructive'
      case 'COMPLETED': return 'secondary'
      default: return 'outline'
    }
  }

  const handleAddAppointment = () => {
    setIsAddDialogOpen(true)
  }

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsEditDialogOpen(true)
  }

  const handleRescheduleAppointment = (appointmentId: string) => {
    const appointment = appointments.find(a => a.id === appointmentId)
    if (appointment) {
      setSelectedAppointment(appointment)
      setIsEditDialogOpen(true)
    }
  }

  const handleCancelAppointment = (appointmentId: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments(prev => 
        prev.map(app => 
          app.id === appointmentId 
            ? { ...app, status: 'CANCELLED' as const }
            : app
        )
      )
    }
  }

  const handleSaveAppointment = (appointmentData: Partial<Appointment>) => {
    if (selectedAppointment) {
      // Edit existing appointment
      setAppointments(prev => 
        prev.map(app => 
          app.id === selectedAppointment.id 
            ? { ...app, ...appointmentData }
            : app
        )
      )
    } else {
      // Add new appointment
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        patientId: appointmentData.patientId || "",
        patientName: appointmentData.patientName || "",
        patientEmail: appointmentData.patientEmail,
        patientPhone: appointmentData.patientPhone,
        date: appointmentData.date || "",
        time: appointmentData.time || "",
        type: appointmentData.type || "",
        status: appointmentData.status || 'PENDING',
        notes: appointmentData.notes,
        duration: appointmentData.duration || 30,
        location: appointmentData.location
      }
      setAppointments(prev => [...prev, newAppointment])
    }
    setIsAddDialogOpen(false)
    setIsEditDialogOpen(false)
    setSelectedAppointment(null)
  }

  const AppointmentForm = ({ appointment, onSave, onCancel }: { 
    appointment?: Appointment | null, 
    onSave: (data: Partial<Appointment>) => void, 
    onCancel: () => void 
  }) => {
    const [formData, setFormData] = useState({
      patientName: appointment?.patientName || "",
      patientEmail: appointment?.patientEmail || "",
      patientPhone: appointment?.patientPhone || "",
      date: appointment?.date || "",
      time: appointment?.time || "",
      type: appointment?.type || "",
      status: appointment?.status || "PENDING",
      notes: appointment?.notes || "",
      duration: appointment?.duration || 30,
      location: appointment?.location || ""
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSave(formData)
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="patientName">Patient Name</Label>
            <Input
              id="patientName"
              value={formData.patientName}
              onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="patientEmail">Email</Label>
            <Input
              id="patientEmail"
              type="email"
              value={formData.patientEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, patientEmail: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="patientPhone">Phone</Label>
            <Input
              id="patientPhone"
              value={formData.patientPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, patientPhone: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="type">Appointment Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Consultation">Consultation</SelectItem>
                <SelectItem value="Follow-up">Follow-up</SelectItem>
                <SelectItem value="Plan Review">Plan Review</SelectItem>
                <SelectItem value="Assessment">Assessment</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
              min="15"
              max="180"
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as "CONFIRMED" | "PENDING" | "CANCELLED" | "COMPLETED" }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="e.g., Clinic Room 1"
          />
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Additional notes about the appointment"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {appointment ? 'Update Appointment' : 'Create Appointment'}
          </Button>
        </div>
      </form>
    )
  }

  return (
    <AuthGuard requiredRoles={['DIETITIAN', 'CLINIC_ADMIN', 'SUPER_ADMIN', 'ASSISTANT']}>
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
                <Calendar className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">Appointments</span>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              <div className="flex items-center space-x-2">
                <Button onClick={handleAddAppointment}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Appointment
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="space-y-4">
              {/* Search and Filter */}
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search appointments..."
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
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Appointments List */}
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                              {new Date(appointment.date).getDate()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                          </div>
                          <div className="h-12 w-px bg-border"></div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{appointment.patientName}</h3>
                              <Badge variant={getStatusColor(appointment.status)}>
                                {appointment.status}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{appointment.time}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>{appointment.type}</span>
                              </div>
                              <span>{appointment.duration} min</span>
                            </div>
                            {appointment.location && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {appointment.location}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditAppointment(appointment)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleRescheduleAppointment(appointment.id)}
                          >
                            Reschedule
                          </Button>
                          {appointment.status !== 'CANCELLED' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleCancelAppointment(appointment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      {appointment.notes && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {filteredAppointments.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No appointments found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchTerm || filterStatus !== 'all' 
                          ? 'Try adjusting your search or filters'
                          : 'Get started by creating your first appointment'
                        }
                      </p>
                      {(!searchTerm && filterStatus === 'all') && (
                        <Button onClick={handleAddAppointment}>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Appointment
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Calendar View</CardTitle>
                  <CardDescription>
                    View your appointments in a calendar format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4" />
                    <p>Calendar view coming soon!</p>
                    <p className="text-sm">This will show a full calendar with appointment blocks</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment History</CardTitle>
                  <CardDescription>
                    View past and completed appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4" />
                    <p>Appointment history coming soon!</p>
                    <p className="text-sm">This will show completed and cancelled appointments</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        {/* Add Appointment Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>New Appointment</DialogTitle>
              <DialogDescription>
                Create a new appointment for a patient
              </DialogDescription>
            </DialogHeader>
            <AppointmentForm
              onSave={handleSaveAppointment}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Appointment Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Appointment</DialogTitle>
              <DialogDescription>
                Update appointment details
              </DialogDescription>
            </DialogHeader>
            <AppointmentForm
              appointment={selectedAppointment}
              onSave={handleSaveAppointment}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedAppointment(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  )
}