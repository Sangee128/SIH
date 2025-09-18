"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Search, 
  Plus, 
  Filter,
  Utensils,
  Leaf,
  Droplets,
  Wind,
  Mountain,
  Thermometer,
  Activity,
  Star,
  Clock,
  Scale
} from "lucide-react"

interface FoodItem {
  id: string
  name: string
  aliases: string[]
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
  vernacularNames: Record<string, string>
  source: string
}

const mockFoodDatabase: FoodItem[] = [
  {
    id: "1",
    name: "Basmati Rice",
    aliases: ["White Rice", "Long Grain Rice"],
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
    contraindications: ["kapha imbalance", "obesity", "diabetes"],
    vernacularNames: { hi: "बासमती चावल", ta: "பாசுமதி அரிசி" },
    source: "IFCT"
  },
  {
    id: "2",
    name: "Mung Dal",
    aliases: ["Moong Dal", "Green Gram"],
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
    contraindications: ["high vata (when unsprouted)"],
    vernacularNames: { hi: "मूंग दाल", ta: "பாசிப்பருப்பு" },
    source: "IFCT"
  },
  {
    id: "3",
    name: "Ghee",
    aliases: ["Clarified Butter"],
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
    contraindications: ["high cholesterol", "obesity", "kapha imbalance"],
    vernacularNames: { hi: "घी", ta: "நெய்" },
    source: "IFCT"
  },
  {
    id: "4",
    name: "Ginger",
    aliases: ["Adrak", "Fresh Ginger"],
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
    contraindications: ["pitta imbalance", "bleeding disorders", "high fever"],
    vernacularNames: { hi: "अदरक", ta: "இஞ்சி" },
    source: "IFCT"
  },
  {
    id: "5",
    name: "Turmeric",
    aliases: ["Haldi", "Curcuma Longa"],
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
    contraindications: ["pitta imbalance", "bleeding disorders", "pregnancy (high doses)"],
    vernacularNames: { hi: "हल्दी", ta: "மஞ்சள்" },
    source: "IFCT"
  },
  {
    id: "6",
    name: "Coconut Water",
    aliases: ["Nariyal Pani", "Tender Coconut"],
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
    contraindications: ["kapha imbalance", "cough", "cold"],
    vernacularNames: { hi: "नारियल पानी", ta: "தேங்காய் தண்ணீர்" },
    source: "IFCT"
  },
  {
    id: "7",
    name: "Almonds",
    aliases: ["Badam"],
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
    contraindications: ["kapha imbalance", "obesity", "high ama"],
    vernacularNames: { hi: "बादाम", ta: "பாதம்" },
    source: "USDA"
  },
  {
    id: "8",
    name: "Spinach",
    aliases: ["Palak"],
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
    contraindications: ["vata imbalance", "kidney stones", "thyroid disorders"],
    vernacularNames: { hi: "पालक", ta: "கீரை" },
    source: "IFCT"
  },
  {
    id: "9",
    name: "Honey",
    aliases: ["Madh", "Shahad"],
    servingSize: "1 tbsp (21g)",
    calories: 64,
    protein: 0.1,
    fat: 0,
    carbs: 17.3,
    fiber: 0,
    vataEffect: "PACIFIES",
    pittaEffect: "AGGRAVATES",
    kaphaEffect: "AGGRAVATES",
    taste: ["SWEET"],
    quality: ["HEAVY", "DRY"],
    potency: "HEATING",
    postDigestiveEffect: "SWEET",
    seasonality: ["all"],
    preparation: ["raw", "cooked"],
    contraindications: ["pitta imbalance", "high heat", "infants under 1 year"],
    vernacularNames: { hi: "शहद", ta: "தேன்" },
    source: "IFCT"
  },
  {
    id: "10",
    name: "Cumin Seeds",
    aliases: ["Jeera"],
    servingSize: "1 tsp (2g)",
    calories: 8,
    protein: 0.4,
    fat: 0.5,
    carbs: 1,
    fiber: 0.2,
    vataEffect: "PACIFIES",
    pittaEffect: "PACIFIES",
    kaphaEffect: "PACIFIES",
    taste: ["PUNGENT", "BITTER"],
    quality: ["LIGHT", "DRY", "SHARP"],
    potency: "HEATING",
    postDigestiveEffect: "PUNGENT",
    seasonality: ["all"],
    preparation: ["raw", "roasted", "powder", "cooked"],
    contraindications: ["pitta imbalance (high doses)"],
    vernacularNames: { hi: "जीरा", ta: "சீரகம்" },
    source: "IFCT"
  }
]

const doshaColors = {
  PACIFIES: "bg-green-100 text-green-800",
  NEUTRAL: "bg-yellow-100 text-yellow-800",
  AGGRAVATES: "bg-red-100 text-red-800"
}

const potencyColors = {
  HEATING: "bg-red-100 text-red-800",
  COOLING: "bg-blue-100 text-blue-800",
  NEUTRAL: "bg-gray-100 text-gray-800"
}

export default function FoodDatabase() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDosha, setSelectedDosha] = useState<string>("all")
  const [selectedPotency, setSelectedPotency] = useState<string>("all")
  const [selectedTaste, setSelectedTaste] = useState<string>("all")
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)

  const filteredFoods = useMemo(() => {
    return mockFoodDatabase.filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.aliases.some(alias => alias.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesDosha = selectedDosha === "all" || 
        food.vataEffect === selectedDosha ||
        food.pittaEffect === selectedDosha ||
        food.kaphaEffect === selectedDosha

      const matchesPotency = selectedPotency === "all" || food.potency === selectedPotency

      const matchesTaste = selectedTaste === "all" || food.taste.includes(selectedTaste)

      return matchesSearch && matchesDosha && matchesPotency && matchesTaste
    })
  }, [searchTerm, selectedDosha, selectedPotency, selectedTaste])

  const uniqueTastes = Array.from(new Set(mockFoodDatabase.flatMap(food => food.taste)))

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <div className="flex items-center space-x-2">
            <Utensils className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Ayurvedic Food Database</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Food Database</h1>
            <p className="text-muted-foreground">
              Browse foods with their Ayurvedic properties and nutritional information
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Search & Filter</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search Foods</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dosha">Dosha Effect</Label>
                  <Select value={selectedDosha} onValueChange={setSelectedDosha}>
                    <SelectTrigger>
                      <SelectValue placeholder="All effects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Effects</SelectItem>
                      <SelectItem value="PACIFIES">Pacifies</SelectItem>
                      <SelectItem value="NEUTRAL">Neutral</SelectItem>
                      <SelectItem value="AGGRAVATES">Aggravates</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="potency">Potency (Virya)</Label>
                  <Select value={selectedPotency} onValueChange={setSelectedPotency}>
                    <SelectTrigger>
                      <SelectValue placeholder="All potencies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Potencies</SelectItem>
                      <SelectItem value="HEATING">Heating</SelectItem>
                      <SelectItem value="COOLING">Cooling</SelectItem>
                      <SelectItem value="NEUTRAL">Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taste">Taste (Rasa)</Label>
                  <Select value={selectedTaste} onValueChange={setSelectedTaste}>
                    <SelectTrigger>
                      <SelectValue placeholder="All tastes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tastes</SelectItem>
                      {uniqueTastes.map(taste => (
                        <SelectItem key={taste} value={taste}>
                          {taste.charAt(0) + taste.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Results</Label>
                  <div className="text-sm text-muted-foreground pt-2">
                    {filteredFoods.length} foods found
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Food Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFoods.map((food) => (
              <Card key={food.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{food.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {food.servingSize}
                      </CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedFood(food)}
                        >
                          <Activity className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <Utensils className="h-5 w-5" />
                            <span>{food.name}</span>
                          </DialogTitle>
                          <DialogDescription>
                            {food.servingSize} • Source: {food.source}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          {/* Nutritional Information */}
                          <div>
                            <h4 className="font-semibold mb-3">Nutritional Information</h4>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                              <div className="text-center p-3 bg-muted rounded-lg">
                                <div className="text-lg font-bold">{food.calories}</div>
                                <div className="text-xs text-muted-foreground">Calories</div>
                              </div>
                              <div className="text-center p-3 bg-muted rounded-lg">
                                <div className="text-lg font-bold">{food.protein}g</div>
                                <div className="text-xs text-muted-foreground">Protein</div>
                              </div>
                              <div className="text-center p-3 bg-muted rounded-lg">
                                <div className="text-lg font-bold">{food.fat}g</div>
                                <div className="text-xs text-muted-foreground">Fat</div>
                              </div>
                              <div className="text-center p-3 bg-muted rounded-lg">
                                <div className="text-lg font-bold">{food.carbs}g</div>
                                <div className="text-xs text-muted-foreground">Carbs</div>
                              </div>
                              <div className="text-center p-3 bg-muted rounded-lg">
                                <div className="text-lg font-bold">{food.fiber}g</div>
                                <div className="text-xs text-muted-foreground">Fiber</div>
                              </div>
                            </div>
                          </div>

                          {/* Dosha Effects */}
                          <div>
                            <h4 className="font-semibold mb-3">Dosha Effects</h4>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="text-center p-3 border rounded-lg">
                                <div className="flex items-center justify-center space-x-1 mb-1">
                                  <Wind className="h-4 w-4" />
                                  <span className="font-medium">Vata</span>
                                </div>
                                <Badge className={doshaColors[food.vataEffect]}>
                                  {food.vataEffect}
                                </Badge>
                              </div>
                              <div className="text-center p-3 border rounded-lg">
                                <div className="flex items-center justify-center space-x-1 mb-1">
                                  <Droplets className="h-4 w-4" />
                                  <span className="font-medium">Pitta</span>
                                </div>
                                <Badge className={doshaColors[food.pittaEffect]}>
                                  {food.pittaEffect}
                                </Badge>
                              </div>
                              <div className="text-center p-3 border rounded-lg">
                                <div className="flex items-center justify-center space-x-1 mb-1">
                                  <Mountain className="h-4 w-4" />
                                  <span className="font-medium">Kapha</span>
                                </div>
                                <Badge className={doshaColors[food.kaphaEffect]}>
                                  {food.kaphaEffect}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Ayurvedic Properties */}
                          <div>
                            <h4 className="font-semibold mb-3">Ayurvedic Properties</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Taste (Rasa)</Label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {food.taste.map(taste => (
                                    <Badge key={taste} variant="outline" className="text-xs">
                                      {taste.charAt(0) + taste.slice(1).toLowerCase()}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Quality (Guna)</Label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {food.quality.map(quality => (
                                    <Badge key={quality} variant="outline" className="text-xs">
                                      {quality.charAt(0) + quality.slice(1).toLowerCase()}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Potency (Virya)</Label>
                                <Badge className={potencyColors[food.potency]} variant="outline">
                                  {food.potency.charAt(0) + food.potency.slice(1).toLowerCase()}
                                </Badge>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Post-Digestive Effect (Vipaka)</Label>
                                <Badge variant="outline">
                                  {food.postDigestiveEffect.charAt(0) + food.postDigestiveEffect.slice(1).toLowerCase()}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Usage Information */}
                          <div>
                            <h4 className="font-semibold mb-3">Usage Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Seasonality</Label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {food.seasonality.map(season => (
                                    <Badge key={season} variant="outline" className="text-xs">
                                      {season.charAt(0) + season.slice(1).toLowerCase()}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Preparation</Label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {food.preparation.map(method => (
                                    <Badge key={method} variant="outline" className="text-xs">
                                      {method.charAt(0) + method.slice(1).toLowerCase()}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Contraindications */}
                          {food.contraindications.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-3">Contraindications</h4>
                              <div className="flex flex-wrap gap-1">
                                {food.contraindications.map(contraindication => (
                                  <Badge key={contraindication} variant="destructive" className="text-xs">
                                    {contraindication}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Vernacular Names */}
                          <div>
                            <h4 className="font-semibold mb-3">Vernacular Names</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {Object.entries(food.vernacularNames).map(([lang, name]) => (
                                <div key={lang} className="text-sm">
                                  <span className="font-medium">{lang.toUpperCase()}:</span> {name}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Dosha Effects Summary */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Wind className="h-3 w-3" />
                          <span className="text-xs">Vata</span>
                        </div>
                        <Badge className={`text-xs ${doshaColors[food.vataEffect]}`}>
                          {food.vataEffect}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Droplets className="h-3 w-3" />
                          <span className="text-xs">Pitta</span>
                        </div>
                        <Badge className={`text-xs ${doshaColors[food.pittaEffect]}`}>
                          {food.pittaEffect}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Mountain className="h-3 w-3" />
                          <span className="text-xs">Kapha</span>
                        </div>
                        <Badge className={`text-xs ${doshaColors[food.kaphaEffect]}`}>
                          {food.kaphaEffect}
                        </Badge>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Thermometer className="h-3 w-3" />
                        <span>{food.potency.charAt(0) + food.potency.slice(1).toLowerCase()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Scale className="h-3 w-3" />
                        <span>{food.calories} cal</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>{food.source}</span>
                      </div>
                    </div>

                    {/* Tastes */}
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Tastes:</div>
                      <div className="flex flex-wrap gap-1">
                        {food.taste.slice(0, 3).map(taste => (
                          <Badge key={taste} variant="outline" className="text-xs">
                            {taste.charAt(0)}
                          </Badge>
                        ))}
                        {food.taste.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{food.taste.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFoods.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No foods found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}