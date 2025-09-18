"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { useAuth } from "@/contexts/AuthContext"
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Heart, 
  Activity, 
  Utensils,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Scale,
  Ruler,
  Plus,
  X
} from "lucide-react"

const steps = [
  { id: "basic", title: "Basic Information", icon: User },
  { id: "clinical", title: "Clinical History", icon: Heart },
  { id: "lifestyle", title: "Lifestyle & Goals", icon: Activity },
  { id: "prakriti", title: "Prakriti Assessment", icon: Utensils },
  { id: "review", title: "Review & Complete", icon: Calendar },
]

export default function PatientOnboarding() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    height: "",
    weight: "",
    address: "",
    
    // Clinical History
    allergies: [] as string[],
    chronicConditions: [] as string[],
    medications: [] as string[],
    
    // Lifestyle
    lifestyle: {
      dietType: "",
      exerciseFrequency: "",
      sleepHours: "",
      stressLevel: "",
      waterIntake: "",
    },
    goals: [] as string[],
    
    // Prakriti (will be calculated)
    prakritiResponses: {} as Record<string, string>,
  })

  const [newAllergy, setNewAllergy] = useState("")
  const [newCondition, setNewCondition] = useState("")
  const [newMedication, setNewMedication] = useState("")

  const prakritiQuestions = [
    {
      id: "q1",
      question: "How is your body frame?",
      options: [
        { value: "vata", label: "Thin, light, narrow frame" },
        { value: "pitta", label: "Medium, moderate frame" },
        { value: "kapha", label: "Broad, heavy, large frame" },
      ]
    },
    {
      id: "q2",
      question: "How is your skin texture?",
      options: [
        { value: "vata", label: "Dry, rough, thin" },
        { value: "pitta", label: "Soft, warm, reddish" },
        { value: "kapha", label: "Thick, oily, cool" },
      ]
    },
    {
      id: "q3",
      question: "How is your appetite and digestion?",
      options: [
        { value: "vata", label: "Variable, irregular, gas-prone" },
        { value: "pitta", label: "Strong, sharp, regular" },
        { value: "kapha", label: "Slow, steady, heavy" },
      ]
    },
    {
      id: "q4",
      question: "How do you respond to stress?",
      options: [
        { value: "vata", label: "Anxious, worried, restless" },
        { value: "pitta", label: "Irritable, angry, critical" },
        { value: "kapha", label: "Calm, withdrawn, resistant" },
      ]
    },
    {
      id: "q5",
      question: "What is your sleep pattern like?",
      options: [
        { value: "vata", label: "Light, interrupted, less hours" },
        { value: "pitta", label: "Moderate, sound, regular" },
        { value: "kapha", label: "Heavy, long, deep" },
      ]
    }
  ]

  const goalOptions = [
    "Weight Loss", "Weight Gain", "Improve Digestion", "Balance Doshas",
    "Increase Energy", "Better Sleep", "Stress Management", "Skin Health",
    "Immune Support", "Joint Health", "Heart Health", "Blood Sugar Control"
  ]

  const calculatePrakriti = () => {
    const scores = { vata: 0, pitta: 0, kapha: 0 }
    Object.values(formData.prakritiResponses).forEach(response => {
      scores[response as keyof typeof scores]++
    })
    return scores
  }

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }))
      setNewAllergy("")
    }
  }

  const removeAllergy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }))
  }

  const addCondition = () => {
    if (newCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        chronicConditions: [...prev.chronicConditions, newCondition.trim()]
      }))
      setNewCondition("")
    }
  }

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      chronicConditions: prev.chronicConditions.filter((_, i) => i !== index)
    }))
  }

  const addMedication = () => {
    if (newMedication.trim()) {
      setFormData(prev => ({
        ...prev,
        medications: [...prev.medications, newMedication.trim()]
      }))
      setNewMedication("")
    }
  }

  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }))
  }

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    // Calculate prakriti scores
    const prakritiScores = calculatePrakriti()
    
    // Submit the form data
    console.log("Submitting patient data:", {
      ...formData,
      prakritiScores
    })
    
    // Here you would typically send the data to your API
    alert("Patient profile created successfully!")
    
    // Redirect to dashboard after successful submission
    router.push("/")
  }

  const renderStepContent = () => {
    const StepIcon = steps[currentStep].icon

    switch (steps[currentStep].id) {
      case "basic":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-6">
              <StepIcon className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter patient's full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="patient@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Gender *</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="MALE" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="FEMALE" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="OTHER" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  placeholder="170"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="70"
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter complete address"
                  rows={2}
                />
              </div>
            </div>
          </div>
        )

      case "clinical":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-6">
              <StepIcon className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Clinical History</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Allergies</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Add allergy"
                    onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                  />
                  <Button onClick={addAllergy} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.allergies.map((allergy, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {allergy}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeAllergy(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-base font-medium">Chronic Conditions</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="Add chronic condition"
                    onKeyPress={(e) => e.key === 'Enter' && addCondition()}
                  />
                  <Button onClick={addCondition} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.chronicConditions.map((condition, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {condition}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeCondition(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-base font-medium">Current Medications</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    placeholder="Add medication"
                    onKeyPress={(e) => e.key === 'Enter' && addMedication()}
                  />
                  <Button onClick={addMedication} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.medications.map((medication, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {medication}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeMedication(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case "lifestyle":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-6">
              <StepIcon className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Lifestyle & Goals</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dietType">Diet Type</Label>
                  <Select
                    value={formData.lifestyle.dietType}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      lifestyle: { ...prev.lifestyle, dietType: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select diet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                      <SelectItem value="eggetarian">Eggetarian</SelectItem>
                      <SelectItem value="jain">Jain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="exerciseFrequency">Exercise Frequency</Label>
                  <Select
                    value={formData.lifestyle.exerciseFrequency}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      lifestyle: { ...prev.lifestyle, exerciseFrequency: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary</SelectItem>
                      <SelectItem value="light">Light (1-2 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (3-4 days/week)</SelectItem>
                      <SelectItem value="active">Active (5-6 days/week)</SelectItem>
                      <SelectItem value="very-active">Very Active (daily)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sleepHours">Sleep Hours</Label>
                  <Select
                    value={formData.lifestyle.sleepHours}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      lifestyle: { ...prev.lifestyle, sleepHours: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sleep hours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-5">Less than 5 hours</SelectItem>
                      <SelectItem value="5-6">5-6 hours</SelectItem>
                      <SelectItem value="6-7">6-7 hours</SelectItem>
                      <SelectItem value="7-8">7-8 hours</SelectItem>
                      <SelectItem value="8-plus">8+ hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stressLevel">Stress Level</Label>
                  <Select
                    value={formData.lifestyle.stressLevel}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      lifestyle: { ...prev.lifestyle, stressLevel: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stress level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="very-high">Very High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="waterIntake">Daily Water Intake</Label>
                  <Select
                    value={formData.lifestyle.waterIntake}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      lifestyle: { ...prev.lifestyle, waterIntake: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select water intake" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-1L">Less than 1L</SelectItem>
                      <SelectItem value="1-2L">1-2 Liters</SelectItem>
                      <SelectItem value="2-3L">2-3 Liters</SelectItem>
                      <SelectItem value="3-plus">3+ Liters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label className="text-base font-medium">Health Goals</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {goalOptions.map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={formData.goals.includes(goal)}
                        onCheckedChange={() => toggleGoal(goal)}
                      />
                      <Label htmlFor={goal} className="text-sm">{goal}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case "prakriti":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-6">
              <StepIcon className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Prakriti Assessment</h2>
            </div>
            
            <div className="space-y-6">
              {prakritiQuestions.map((question) => (
                <div key={question.id} className="space-y-3">
                  <Label className="text-base font-medium">{question.question}</Label>
                  <RadioGroup
                    value={formData.prakritiResponses[question.id] || ""}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      prakritiResponses: { ...prev.prakritiResponses, [question.id]: value }
                    }))}
                  >
                    {question.options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                        <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Prakriti Analysis</CardTitle>
                  <CardDescription>
                    Based on your responses, here's your constitutional analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.keys(formData.prakritiResponses).length === prakritiQuestions.length ? (
                    <div className="space-y-4">
                      {Object.entries(calculatePrakriti()).map(([dosha, score]) => (
                        <div key={dosha}>
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{dosha}</span>
                            <span>{score}/5</span>
                          </div>
                          <Progress value={(score / 5) * 100} className="mt-1" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Complete all questions to see your prakriti analysis</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "review":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-6">
              <StepIcon className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Review & Complete</h2>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Name:</strong> {formData.name}</div>
                    <div><strong>Email:</strong> {formData.email}</div>
                    <div><strong>Phone:</strong> {formData.phone}</div>
                    <div><strong>Date of Birth:</strong> {formData.dateOfBirth}</div>
                    <div><strong>Gender:</strong> {formData.gender}</div>
                    <div><strong>Height:</strong> {formData.height} cm</div>
                    <div><strong>Weight:</strong> {formData.weight} kg</div>
                    <div><strong>Address:</strong> {formData.address}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Clinical History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <strong>Allergies:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.allergies.length > 0 ? (
                        formData.allergies.map((allergy, index) => (
                          <Badge key={index} variant="secondary">{allergy}</Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <strong>Chronic Conditions:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.chronicConditions.length > 0 ? (
                        formData.chronicConditions.map((condition, index) => (
                          <Badge key={index} variant="secondary">{condition}</Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <strong>Medications:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.medications.length > 0 ? (
                        formData.medications.map((medication, index) => (
                          <Badge key={index} variant="secondary">{medication}</Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Lifestyle & Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Diet Type:</strong> {formData.lifestyle.dietType}</div>
                    <div><strong>Exercise:</strong> {formData.lifestyle.exerciseFrequency}</div>
                    <div><strong>Sleep:</strong> {formData.lifestyle.sleepHours}</div>
                    <div><strong>Stress Level:</strong> {formData.lifestyle.stressLevel}</div>
                    <div><strong>Water Intake:</strong> {formData.lifestyle.waterIntake}</div>
                  </div>
                  <div>
                    <strong>Health Goals:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.goals.map((goal, index) => (
                        <Badge key={index} variant="secondary">{goal}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Prakriti Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.keys(formData.prakritiResponses).length === prakritiQuestions.length ? (
                    <div className="space-y-4">
                      {Object.entries(calculatePrakriti()).map(([dosha, score]) => (
                        <div key={dosha}>
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{dosha}</span>
                            <span>{score}/5</span>
                          </div>
                          <Progress value={(score / 5) * 100} className="mt-1" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Prakriti assessment incomplete</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <AuthGuard requiredRoles={['DIETITIAN', 'CLINIC_ADMIN', 'SUPER_ADMIN']}>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center px-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">AyurCare</span>
            </div>
          </div>
        </header>

        <div className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">Patient Onboarding</h1>
                <span className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {steps.length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {steps.map((step, index) => {
                  const StepIcon = step.icon
                  return (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          index <= currentStep
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <StepIcon className="h-4 w-4" />
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`w-16 h-1 ${
                            index < currentStep ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Step Content */}
            <Card>
              <CardContent className="p-6">
                {renderStepContent()}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex space-x-2">
                {currentStep === steps.length - 1 ? (
                  <Button onClick={handleSubmit}>
                    Complete Onboarding
                  </Button>
                ) : (
                  <Button onClick={nextStep}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}