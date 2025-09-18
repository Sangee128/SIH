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
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Activity,
  ArrowLeft,
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
  status: 'ACTIVE' | 'INACTIVE' | 'NEW'
  lastVisit?: string
  registeredAt: string
  dietitianId: string
  dietitianName: string
  allergies?: string[]
  chronicConditions?: string[]
  medications?: string[]
  goals?: string[]
}

export default function PatientsPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPrakriti, setFilterPrakriti] = useState<string>("all")

  // Mock data
  const mockPatients: Patient[] = [
    {
      id: "1",
      name: "Ravi Sharma",
      email: "ravi.sharma@email.com",
      phone: "+91 98765 43210",
      dateOfBirth: "1990-05-15",
      gender: "MALE",
      height: 175,
      weight: 72,
      address: "123 Main St, Mumbai, Maharashtra",
      prakriti: "Vata-Pitta",
      status: "ACTIVE",
      lastVisit: "2 days ago",
      registeredAt: "2024-01-10",
      dietitianId: "dietitian-1",
      dietitianName: "Dr. Priya Patel",
      allergies: ["None"],
      chronicConditions: ["None"],
      medications: ["None"],
      goals: ["Weight management", "Improved digestion"]
    },
    {
      id: "2",
      name: "Priya Patel",
      email: "priya.patel@email.com",
      phone: "+91 98765 43211",
      dateOfBirth: "1985-08-22",
      gender: "FEMALE",
      height: 165,
      weight: 68,
      address: "456 Park Ave, Delhi, NCR",
      prakriti: "Kapha",
      status: "ACTIVE",
      lastVisit: "1 week ago",
      registeredAt: "2024-01-05",
      dietitianId: "dietitian-1",
      dietitianName: "Dr. Priya Patel",
      allergies: ["Dairy"],
      chronicConditions: ["Hypothyroidism"],
      medications: ["Levothyroxine"],
      goals: ["Weight loss", "Energy improvement"]
    },
    {
      id: "3",
      name: "Amit Kumar",
      email: "amit.kumar@email.com",
      phone: "+91 98765 43212",
      dateOfBirth: "1992-12-10",
      gender: "MALE",
      height: 180,
      weight: 85,
      address: "789 Church St, Bangalore, Karnataka",
      prakriti: "Pitta",
      status: "ACTIVE",
      lastVisit: "3 days ago",
      registeredAt: "2024-01-08",
      dietitianId: "dietitian-1",
      dietitianName: "Dr. Priya Patel",
      allergies: ["None"],
      chronicConditions: ["Acid reflux"],
      medications: ["Antacids"],
      goals: ["Weight management", "Digestive health"]
    },
    {
      id: "4",
      name: "Sneha Reddy",
      email: "sneha.reddy@email.com",
      phone: "+91 98765 43213",
      dateOfBirth: "1988-03-18",
      gender: "FEMALE",
      height: 160,
      weight: 55,
      address: "321 Oak St, Hyderabad, Telangana",
      prakriti: "Vata",
      status: "NEW",
      lastVisit: "5 days ago",
      registeredAt: "2024-01-15",
      dietitianId: "dietitian-1",
      dietitianName: "Dr. Priya Patel",
      allergies: ["Nuts"],
      chronicConditions: ["None"],
      medications: ["None"],
      goals: ["Weight gain", "Stress management"]
    }
  ]

  useEffect(() => {
    setPatients(mockPatients)
    setFilteredPatients(mockPatients)
  }, [])

  useEffect(() => {
    let filtered = patients

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone?.includes(searchTerm)
      )
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(patient => patient.status === filterStatus)
    }

    // Prakriti filter
    if (filterPrakriti !== "all") {
      filtered = filtered.filter(patient => patient.prakriti === filterPrakriti)
    }

    setFilteredPatients(filtered)
  }, [patients, searchTerm, filterStatus, filterPrakriti])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'default'
      case 'INACTIVE': return 'secondary'
      case 'NEW': return 'outline'
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

  const handleAddPatient = () => {
    router.push("/patient-onboarding")
  }

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsEditDialogOpen(true)
  }

  const handleDeletePatient = (patientId: string) => {
    if (confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      setPatients(prev => prev.filter(patient => patient.id !== patientId))
    }
  }

  const handleViewProfile = (patientId: string) => {
    router.push(`/patient-profile/${patientId}`)
  }

  const handleViewPlan = (patientId: string) => {
    router.push(`/diet-plan/plan-${patientId}`)
  }

  const handleSavePatient = (patientData: Partial<Patient>) => {
    if (selectedPatient) {
      // Edit existing patient
      setPatients(prev => 
        prev.map(patient => 
          patient.id === selectedPatient.id 
            ? { ...patient, ...patientData }
            : patient
        )
      )
    } else {
      // Add new patient
      const newPatient: Patient = {
        id: Date.now().toString(),
        name: patientData.name || "",
        email: patientData.email,
        phone: patientData.phone,
        dateOfBirth: patientData.dateOfBirth || "",
        gender: patientData.gender || "",
        height: patientData.height,
        weight: patientData.weight,
        address: patientData.address,
        prakriti: patientData.prakriti,
        status: patientData.status || 'NEW',
        registeredAt: new Date().toISOString().split('T')[0],
        dietitianId: "dietitian-1", // In real app, get from current user
        dietitianName: "Dr. Priya Patel", // In real app, get from current user
        allergies: patientData.allergies,
        chronicConditions: patientData.chronicConditions,
        medications: patientData.medications,
        goals: patientData.goals
      }
      setPatients(prev => [...prev, newPatient])
    }
    setIsAddDialogOpen(false)
    setIsEditDialogOpen(false)
    setSelectedPatient(null)
  }

  const PatientForm = ({ patient, onSave, onCancel }: { 
    patient?: Patient | null, 
    onSave: (data: Partial<Patient>) => void, 
    onCancel: () => void 
  }) => {
    const [formData, setFormData] = useState({
      name: patient?.name || "",
      email: patient?.email || "",
      phone: patient?.phone || "",
      dateOfBirth: patient?.dateOfBirth || "",
      gender: patient?.gender || "",
      height: patient?.height?.toString() || "",
      weight: patient?.weight?.toString() || "",
      address: patient?.address || "",
      prakriti: patient?.prakriti || "",
      status: patient?.status || "NEW"
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSave({
        ...formData,
        height: formData.height ? parseInt(formData.height) : undefined,
        weight: formData.weight ? parseInt(formData.weight) : undefined
      })
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="gender">Gender *</Label>
            <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              value={formData.height}
              onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="prakriti">Prakriti</Label>
            <Select value={formData.prakriti} onValueChange={(value) => setFormData(prev => ({ ...prev, prakriti: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select prakriti" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vata">Vata</SelectItem>
                <SelectItem value="Pitta">Pitta</SelectItem>
                <SelectItem value="Kapha">Kapha</SelectItem>
                <SelectItem value="Vata-Pitta">Vata-Pitta</SelectItem>
                <SelectItem value="Vata-Kapha">Vata-Kapha</SelectItem>
                <SelectItem value="Pitta-Kapha">Pitta-Kapha</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Enter complete address"
            rows={2}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {patient ? 'Update Patient' : 'Create Patient'}
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
                <Users className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">Patients</span>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              <div className="flex items-center space-x-2">
                <Button onClick={handleAddPatient}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Patient
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
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="NEW">New</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPrakriti} onValueChange={setFilterPrakriti}>
              <SelectTrigger className="w-32">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Prakriti" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prakriti</SelectItem>
                <SelectItem value="Vata">Vata</SelectItem>
                <SelectItem value="Pitta">Pitta</SelectItem>
                <SelectItem value="Kapha">Kapha</SelectItem>
                <SelectItem value="Vata-Pitta">Vata-Pitta</SelectItem>
                <SelectItem value="Vata-Kapha">Vata-Kapha</SelectItem>
                <SelectItem value="Pitta-Kapha">Pitta-Kapha</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{patients.length}</div>
                <p className="text-xs text-muted-foreground">
                  {patients.filter(p => p.status === 'ACTIVE').length} active
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {patients.filter(p => new Date(p.registeredAt).getMonth() === new Date().getMonth()).length}
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vata Dominant</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {patients.filter(p => p.prakriti?.includes('Vata')).length}
                </div>
                <p className="text-xs text-muted-foreground">Vata constitution</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {patients.filter(p => p.status === 'ACTIVE').length}
                </div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>
          </div>

          {/* Patients List */}
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <Card key={patient.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`/avatars/${patient.id}.png`} alt={patient.name} />
                        <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{patient.name}</h3>
                          <Badge variant={getStatusColor(patient.status)}>
                            {patient.status}
                          </Badge>
                          {patient.prakriti && (
                            <Badge className={getPrakritiColor(patient.prakriti)}>
                              {patient.prakriti}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{patient.email || 'No email'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{patient.phone || 'No phone'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{calculateAge(patient.dateOfBirth)} years</span>
                          </div>
                          {patient.height && patient.weight && (
                            <div className="flex items-center space-x-1">
                              <Scale className="h-3 w-3" />
                              <span>BMI: {getBMI(patient.weight, patient.height)}</span>
                            </div>
                          )}
                        </div>
                        {patient.lastVisit && (
                          <div className="text-sm text-muted-foreground">
                            Last visit: {patient.lastVisit}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewProfile(patient.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewPlan(patient.id)}>
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditPatient(patient)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeletePatient(patient.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredPatients.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No patients found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || filterStatus !== 'all' || filterPrakriti !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'Get started by adding your first patient'
                    }
                  </p>
                  {(!searchTerm && filterStatus === 'all' && filterPrakriti === 'all') && (
                    <Button onClick={handleAddPatient}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Patient
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        {/* Edit Patient Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Patient</DialogTitle>
              <DialogDescription>
                Update patient information
              </DialogDescription>
            </DialogHeader>
            <PatientForm
              patient={selectedPatient}
              onSave={handleSavePatient}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedPatient(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  )
}