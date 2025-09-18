"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Activity, 
  Heart, 
  Brain, 
  Wind, 
  Droplets, 
  Mountain,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react"

interface PrakritiQuestion {
  id: string
  question: string
  category: string
  options: {
    value: "vata" | "pitta" | "kapha"
    label: string
    description?: string
  }[]
  weight: number
}

interface PrakritiResult {
  vata: number
  pitta: number
  kapha: number
  dominant: string[]
  confidence: number
  description: string
  recommendations: string[]
}

const prakritiQuestions: PrakritiQuestion[] = [
  {
    id: "physical_frame",
    question: "How would you describe your body frame?",
    category: "Physical",
    weight: 1,
    options: [
      {
        value: "vata",
        label: "Thin, light, narrow frame",
        description: "Delicate bone structure, joints may protrude"
      },
      {
        value: "pitta",
        label: "Medium, moderate frame",
        description: "Well-proportioned, balanced build"
      },
      {
        value: "kapha",
        label: "Broad, heavy, large frame",
        description: "Solid, well-built, strong bone structure"
      }
    ]
  },
  {
    id: "weight_gain",
    question: "How easily do you gain weight?",
    category: "Physical",
    weight: 1,
    options: [
      {
        value: "vata",
        label: "Difficulty gaining weight",
        description: "Tend to remain thin regardless of diet"
      },
      {
        value: "pitta",
        label: "Moderate weight gain",
        description: "Gain weight if not careful, can lose it relatively easily"
      },
      {
        value: "kapha",
        label: "Gain weight easily",
        description: "Prone to weight gain, difficult to lose weight"
      }
    ]
  },
  {
    id: "skin_texture",
    question: "What is your skin texture like?",
    category: "Physical",
    weight: 1,
    options: [
      {
        value: "vata",
        label: "Dry, rough, thin, cool to touch",
        description: "Tends to be dry, may crack easily"
      },
      {
        value: "pitta",
        label: "Soft, warm, slightly oily",
        description: "Tends to be sensitive, may have moles or freckles"
      },
      {
        value: "kapha",
        label: "Thick, oily, cool, smooth",
        description: "Tends to be moist and smooth"
      }
    ]
  },
  {
    id: "hair_quality",
    question: "How would you describe your hair?",
    category: "Physical",
    weight: 1,
    options: [
      {
        value: "vata",
        label: "Dry, curly, thin, brittle",
        description: "Prone to split ends and breakage"
      },
      {
        value: "pitta",
        label: "Fine, straight, soft, prone to early graying",
        description: "May be thin or receding hairline"
      },
      {
        value: "kapha",
        label: "Thick, oily, wavy, lustrous",
        description: "Full, healthy-looking hair"
      }
    ]
  },
  {
    id: "appetite",
    question: "How would you describe your appetite and digestion?",
    category: "Digestive",
    weight: 1.5,
    options: [
      {
        value: "vata",
        label: "Variable, irregular, gas-prone",
        description: "Sometimes very hungry, sometimes not; bloating common"
      },
      {
        value: "pitta",
        label: "Strong, sharp, regular",
        description: "Can eat large quantities, good digestion"
      },
      {
        value: "kapha",
        label: "Slow, steady, heavy feeling",
        description: "Takes time to feel hungry, digestion slow"
      }
    ]
  },
  {
    id: "bowel_movements",
    question: "What are your bowel movements typically like?",
    category: "Digestive",
    weight: 1,
    options: [
      {
        value: "vata",
        label: "Dry, hard, irregular, constipated",
        description: "Often constipated, gas and bloating"
      },
      {
        value: "pitta",
        label: "Loose, frequent, urgent",
        description: "Tendency towards loose stools"
      },
      {
        value: "kapha",
        label: "Regular, well-formed, slow",
        description: "Regular but may feel sluggish"
      }
    ]
  },
  {
    id: "sleep_pattern",
    question: "What is your sleep pattern like?",
    category: "Sleep & Energy",
    weight: 1.5,
    options: [
      {
        value: "vata",
        label: "Light, interrupted, less hours",
        description: "Difficulty falling asleep, easily awakened"
      },
      {
        value: "pitta",
        label: "Moderate, sound, regular",
        description: "Generally good sleep unless stressed"
      },
      {
        value: "kapha",
        label: "Heavy, long, deep",
        description: "Can sleep long hours, hard to wake up"
      }
    ]
  },
  {
    id: "energy_levels",
    question: "How would you describe your energy levels throughout the day?",
    category: "Sleep & Energy",
    weight: 1,
    options: [
      {
        value: "vata",
        label: "Variable, bursts of energy",
        description: "Energy comes in spurts, prone to fatigue"
      },
      {
        value: "pitta",
        label: "High, intense, focused",
        description: "Strong drive, may burn out"
      },
      {
        value: "kapha",
        label: "Steady, consistent, slower",
        description: "Enduring energy but slow to start"
      }
    ]
  },
  {
    id: "stress_response",
    question: "How do you typically respond to stress?",
    category: "Mental & Emotional",
    weight: 1.5,
    options: [
      {
        value: "vata",
        label: "Anxious, worried, restless",
        description: "Mind races, difficulty concentrating"
      },
      {
        value: "pitta",
        label: "Irritable, angry, critical",
        description: "Become judgmental, short-tempered"
      },
      {
        value: "kapha",
        label: "Calm, withdrawn, resistant",
        description: "Become quiet, may avoid dealing with it"
      }
    ]
  },
  {
    id: "memory_learning",
    question: "How would you describe your memory and learning ability?",
    category: "Mental & Emotional",
    weight: 1,
    options: [
      {
        value: "vata",
        label: "Quick to learn, quick to forget",
        description: "Good short-term memory, poor long-term"
      },
      {
        value: "pitta",
        label: "Sharp, precise, good memory",
        description: "Excellent memory, analytical thinker"
      },
      {
        value: "kapha",
        label: "Slow to learn, excellent long-term memory",
        description: "Takes time but retains information well"
      }
    ]
  },
  {
    id: "social_behavior",
    question: "How would you describe your social behavior?",
    category: "Mental & Emotional",
    weight: 1,
    options: [
      {
        value: "vata",
        label: "Talkative, enthusiastic, changeable",
        description: "Makes friends easily but may not maintain them"
      },
      {
        value: "pitta",
        label: "Leader, assertive, goal-oriented",
        description: "Natural leader, may be dominating"
      },
      {
        value: "kapha",
        label: "Calm, supportive, loyal",
        description: "Good listener, steady friend"
      }
    ]
  },
  {
    id: "temperature_preference",
    question: "What is your temperature preference?",
    category: "Physical",
    weight: 1,
    options: [
      {
        value: "vata",
        label: "Prefer warm weather",
        description: "Often feel cold, dislike wind"
      },
      {
        value: "pitta",
        label: "Prefer cool weather",
        description: "Often feel hot, dislike heat and sun"
      },
      {
        value: "kapha",
        label: "Prefer warm, dry weather",
        description: "Dislike cold, damp weather"
      }
    ]
  }
]

const prakritiDescriptions = {
  vata: {
    title: "Vata Dominant",
    description: "You have a Vata-dominant constitution. Vata is the energy of movement, composed of air and ether elements.",
    characteristics: [
      "Light, thin frame",
      "Quick mind, creative thinking",
      "Variable energy and appetite",
      "Tendency towards anxiety and worry",
      "Dry skin and hair",
      "Preference for warm environments",
      "Irregular routines and patterns"
    ],
    recommendations: [
      "Follow a regular daily routine",
      "Eat warm, cooked, nourishing foods",
      "Practice calming activities like meditation",
      "Keep warm and avoid cold, raw foods",
      "Use warm oils for self-massage (abhyanga)",
      "Get adequate rest and avoid overstimulation"
    ]
  },
  pitta: {
    title: "Pitta Dominant",
    description: "You have a Pitta-dominant constitution. Pitta is the energy of transformation, composed of fire and water elements.",
    characteristics: [
      "Medium, athletic build",
      "Sharp intellect, analytical mind",
      "Strong appetite and digestion",
      "Tendency towards anger and criticism",
      "Warm body temperature",
      "Natural leadership qualities",
      "Goal-oriented and ambitious"
    ],
    recommendations: [
      "Eat cooling, non-spicy foods",
      "Avoid excessive heat and sun exposure",
      "Practice cooling activities like swimming",
      "Learn to manage anger and stress",
      "Take time to relax and unwind",
      "Avoid competitive situations when possible"
    ]
  },
  kapha: {
    title: "Kapha Dominant",
    description: "You have a Kapha-dominant constitution. Kapha is the energy of structure, composed of earth and water elements.",
    characteristics: [
      "Solid, heavy build",
      "Calm, steady temperament",
      "Slow metabolism and digestion",
      "Tendency towards attachment and possessiveness",
      "Cool, moist skin",
      "Good stamina and endurance",
      "Loyal and supportive nature"
    ],
    recommendations: [
      "Eat light, warm, spicy foods",
      "Exercise regularly and vigorously",
      "Stay mentally stimulated and active",
      "Avoid heavy, oily foods",
      "Keep warm and dry",
      "Practice detachment and let go of possessions"
    ]
  },
  "vata-pitta": {
    title: "Vata-Pitta Constitution",
    description: "You have a dual Vata-Pitta constitution. This combines the qualities of both doshas.",
    characteristics: [
      "Medium build with Vata lightness",
      "Quick, creative, and analytical mind",
      "Variable but strong appetite",
      "Tendency towards both anxiety and anger",
      "Warm body temperature",
      "Energetic but may burn out"
    ],
    recommendations: [
      "Balance routine with flexibility",
      "Eat warm, cooked, slightly cooling foods",
      "Practice both calming and cooling activities",
      "Manage stress through meditation and exercise",
      "Avoid extreme temperatures",
      "Maintain regular sleep patterns"
    ]
  },
  "vata-kapha": {
    title: "Vata-Kapha Constitution",
    description: "You have a dual Vata-Kapha constitution. This creates an interesting dynamic between movement and stability.",
    characteristics: [
      "Can be either thin or heavy built",
      "Creative yet steady mind",
      "Variable appetite and digestion",
      "Tendency towards anxiety and lethargy",
      "Cool body temperature",
      "Energy can be erratic or consistent"
    ],
    recommendations: [
      "Establish a very regular routine",
      "Eat warm, light, stimulating foods",
      "Exercise regularly but moderately",
      "Stay warm and avoid damp conditions",
      "Practice both energizing and calming activities",
      "Get adequate rest but avoid oversleeping"
    ]
  },
  "pitta-kapha": {
    title: "Pitta-Kapha Constitution",
    description: "You have a dual Pitta-Kapha constitution. This combines transformation with structure.",
    characteristics: [
      "Strong, solid build",
      "Intelligent yet calm mind",
      "Strong, steady digestion",
      "Tendency towards anger and attachment",
      "Warm body temperature",
      "Good stamina and drive"
    ],
    recommendations: [
      "Eat cooling, light, non-spicy foods",
      "Exercise regularly to maintain balance",
      "Practice both cooling and energizing activities",
      "Avoid heavy, oily foods",
      "Manage anger through cooling practices",
      "Stay mentally stimulated but avoid overwork"
    ]
  },
  "tridoshic": {
    title: "Tridoshic Constitution",
    description: "You have a balanced Tridoshic constitution. All three doshas are relatively equal, giving you adaptability.",
    characteristics: [
      "Balanced, proportional build",
      "Adaptable, balanced mind",
      "Good digestion and appetite",
      "Emotionally balanced",
      "Adaptable to different environments",
      "Good overall health",
      "Flexible and resilient"
    ],
    recommendations: [
      "Follow seasonal routines and diet",
      "Maintain balance in all activities",
      "Eat a variety of fresh, whole foods",
      "Exercise moderately and regularly",
      "Practice stress management techniques",
      "Listen to your body's needs"
    ]
  }
}

export default function PrakritiAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<string, "vata" | "pitta" | "kapha">>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [result, setResult] = useState<PrakritiResult | null>(null)

  const handleAnswer = (answer: "vata" | "pitta" | "kapha") => {
    const newResponses = { ...responses, [prakritiQuestions[currentQuestion].id]: answer }
    setResponses(newResponses)

    if (currentQuestion < prakritiQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResult(newResponses)
    }
  }

  const calculateResult = (responses: Record<string, "vata" | "pitta" | "kapha">) => {
    const scores = { vata: 0, pitta: 0, kapha: 0 }
    
    Object.entries(responses).forEach(([questionId, answer]) => {
      const question = prakritiQuestions.find(q => q.id === questionId)
      if (question) {
        scores[answer] += question.weight
      }
    })

    const total = scores.vata + scores.pitta + scores.kapha
    const percentages = {
      vata: Math.round((scores.vata / total) * 100),
      pitta: Math.round((scores.pitta / total) * 100),
      kapha: Math.round((scores.kapha / total) * 100)
    }

    // Determine dominant dosha(s)
    const sorted = Object.entries(percentages).sort(([,a], [,b]) => b - a)
    const dominant = sorted.filter(([_, percentage]) => percentage >= 30).map(([dosha]) => dosha)
    
    // If no single dosha is dominant, consider combinations
    let constitution = ""
    if (dominant.length === 1) {
      constitution = dominant[0]
    } else if (dominant.length === 2) {
      constitution = dominant.sort().join("-")
    } else {
      constitution = "tridoshic"
    }

    const confidence = Math.max(...Object.values(percentages))

    const result: PrakritiResult = {
      vata: percentages.vata,
      pitta: percentages.pitta,
      kapha: percentages.kapha,
      dominant,
      confidence,
      description: prakritiDescriptions[constitution as keyof typeof prakritiDescriptions]?.description || "",
      recommendations: prakritiDescriptions[constitution as keyof typeof prakritiDescriptions]?.recommendations || []
    }

    setResult(result)
    setIsCompleted(true)
  }

  const resetAssessment = () => {
    setCurrentQuestion(0)
    setResponses({})
    setIsCompleted(false)
    setResult(null)
  }

  const getProgress = () => {
    return (Object.keys(responses).length / prakritiQuestions.length) * 100
  }

  const currentQ = prakritiQuestions[currentQuestion]

  if (isCompleted && result) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center px-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Prakriti Assessment</span>
            </div>
          </div>
        </header>

        <div className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Your Prakriti Analysis</h1>
              <p className="text-muted-foreground">Based on your responses, here's your constitutional analysis</p>
            </div>

            <Tabs defaultValue="results" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="characteristics">Characteristics</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Dosha Distribution</span>
                    </CardTitle>
                    <CardDescription>
                      Your constitutional makeup based on the assessment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="flex items-center space-x-2">
                            <Wind className="h-4 w-4" />
                            <span className="font-medium">Vata</span>
                          </span>
                          <span className="text-sm font-medium">{result.vata}%</span>
                        </div>
                        <Progress value={result.vata} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="flex items-center space-x-2">
                            <Droplets className="h-4 w-4" />
                            <span className="font-medium">Pitta</span>
                          </span>
                          <span className="text-sm font-medium">{result.pitta}%</span>
                        </div>
                        <Progress value={result.pitta} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="flex items-center space-x-2">
                            <Mountain className="h-4 w-4" />
                            <span className="font-medium">Kapha</span>
                          </span>
                          <span className="text-sm font-medium">{result.kapha}%</span>
                        </div>
                        <Progress value={result.kapha} className="h-2" />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-lg font-semibold">Dominant Constitution:</span>
                        <Badge variant="secondary" className="text-sm">
                          {result.dominant.join(" - ").toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Confidence: {result.confidence}%
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Understanding Your Constitution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {result.description}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="characteristics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Constitutional Characteristics</CardTitle>
                    <CardDescription>
                      Common traits associated with your prakriti
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {prakritiDescriptions[result.dominant.join("-") as keyof typeof prakritiDescriptions]?.characteristics.map((char, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm">{char}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personalized Recommendations</CardTitle>
                    <CardDescription>
                      Lifestyle and dietary recommendations for your constitution
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {result.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <Heart className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Info className="h-5 w-5" />
                      <span>Important Notes</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">This is a general assessment</p>
                        <p className="text-xs text-muted-foreground">
                          For a complete analysis, consult with a qualified Ayurvedic practitioner
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Seasonal variations</p>
                        <p className="text-xs text-muted-foreground">
                          Your needs may change with seasons and life circumstances
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Individual differences</p>
                        <p className="text-xs text-muted-foreground">
                          This provides general guidance; listen to your body's unique needs
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-center mt-8">
              <Button onClick={resetAssessment} variant="outline">
                Retake Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Prakriti Assessment</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Discover Your Prakriti</h1>
            <p className="text-muted-foreground">
              Answer these questions to understand your Ayurvedic constitution
            </p>
          </div>

          {/* Progress */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {prakritiQuestions.length}
                </span>
              </div>
              <Progress value={getProgress()} className="h-2" />
            </CardContent>
          </Card>

          {/* Question */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{currentQ.question}</CardTitle>
                  <CardDescription>
                    Category: {currentQ.category}
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {currentQ.weight}x weight
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup onValueChange={(value) => handleAnswer(value as "vata" | "pitta" | "kapha")}>
                {currentQ.options.map((option) => (
                  <div key={option.value} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                    {option.description && (
                      <p className="text-sm text-muted-foreground ml-6">
                        {option.description}
                      </p>
                    )}
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              {Object.keys(responses).length} of {prakritiQuestions.length} answered
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}