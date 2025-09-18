"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { useAuth } from "@/contexts/AuthContext"
import { 
  FileText, 
  Download, 
  Calendar as CalendarIcon, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Users,
  Utensils,
  Activity,
  ArrowLeft,
  Filter,
  RefreshCw
} from "lucide-react"

interface ReportData {
  totalPatients: number
  activePlans: number
  completedPlans: number
  avgPlanDuration: number
  patientGrowth: number
  planSuccessRate: number
  topConditions: Array<{ condition: string; count: number }>
  prakritiDistribution: Array<{ type: string; count: number; percentage: number }>
  monthlyStats: Array<{ month: string; patients: number; plans: number }>
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  })
  const [reportType, setReportType] = useState("overview")
  const [format, setFormat] = useState("pdf")
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock data
  const reportData: ReportData = {
    totalPatients: 24,
    activePlans: 18,
    completedPlans: 12,
    avgPlanDuration: 45,
    patientGrowth: 15,
    planSuccessRate: 85,
    topConditions: [
      { condition: "Weight Management", count: 12 },
      { condition: "Digestive Issues", count: 8 },
      { condition: "Stress Management", count: 6 },
      { condition: "Diabetes", count: 4 },
      { condition: "Hypertension", count: 3 }
    ],
    prakritiDistribution: [
      { type: "Vata", count: 8, percentage: 33 },
      { type: "Pitta", count: 7, percentage: 29 },
      { type: "Kapha", count: 5, percentage: 21 },
      { type: "Vata-Pitta", count: 3, percentage: 13 },
      { type: "Vata-Kapha", count: 1, percentage: 4 }
    ],
    monthlyStats: [
      { month: "Jan", patients: 18, plans: 15 },
      { month: "Feb", patients: 20, plans: 17 },
      { month: "Mar", patients: 22, plans: 19 },
      { month: "Apr", patients: 24, plans: 21 }
    ]
  }

  const generateReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In a real app, this would generate and download the report
    const reportContent = {
      type: reportType,
      dateRange,
      data: reportData,
      generatedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(reportContent, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report-${reportType}-${new Date().toISOString().split('T')[0]}.${format}`
    a.click()
    URL.revokeObjectURL(url)
    
    setIsGenerating(false)
  }

  const getPrakritiColor = (type: string) => {
    switch (type) {
      case 'Vata': return 'bg-blue-500'
      case 'Pitta': return 'bg-red-500'
      case 'Kapha': return 'bg-green-500'
      case 'Vata-Pitta': return 'bg-purple-500'
      case 'Vata-Kapha': return 'bg-cyan-500'
      default: return 'bg-gray-500'
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
                <FileText className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">Reports</span>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              <div className="flex items-center space-x-2">
                <Button onClick={generateReport} disabled={isGenerating}>
                  {isGenerating ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  {isGenerating ? 'Generating...' : 'Export Report'}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Report Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">Overview Report</SelectItem>
                      <SelectItem value="patients">Patient Analytics</SelectItem>
                      <SelectItem value="plans">Diet Plan Analytics</SelectItem>
                      <SelectItem value="financial">Financial Report</SelectItem>
                      <SelectItem value="compliance">Compliance Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="format">Export Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date Range</Label>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      placeholder="From date"
                      value={dateRange.from ? dateRange.from.toISOString().split('T')[0] : ''}
                      onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value ? new Date(e.target.value) : undefined }))}
                    />
                    <Input
                      type="date"
                      placeholder="To date"
                      value={dateRange.to ? dateRange.to.toISOString().split('T')[0] : ''}
                      onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value ? new Date(e.target.value) : undefined }))}
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" onClick={() => setDateRange({ from: undefined, to: undefined })}>
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Content */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="plans">Diet Plans</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reportData.totalPatients}</div>
                    <p className="text-xs text-muted-foreground">+{reportData.patientGrowth}% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                    <Utensils className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reportData.activePlans}</div>
                    <p className="text-xs text-muted-foreground">Currently active</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reportData.planSuccessRate}%</div>
                    <p className="text-xs text-muted-foreground">Plan completion rate</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{reportData.avgPlanDuration}</div>
                    <p className="text-xs text-muted-foreground">Days per plan</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Prakriti Distribution</CardTitle>
                    <CardDescription>Patient constitution types</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {reportData.prakritiDistribution.map((item) => (
                        <div key={item.type} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded ${getPrakritiColor(item.type)}`}></div>
                            <span className="text-sm font-medium">{item.type}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getPrakritiColor(item.type)}`}
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Health Conditions</CardTitle>
                    <CardDescription>Most common patient concerns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {reportData.topConditions.map((item, index) => (
                        <div key={item.condition} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium">{index + 1}</span>
                            </div>
                            <span className="text-sm font-medium">{item.condition}</span>
                          </div>
                          <Badge variant="outline">{item.count} patients</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="patients" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Growth Trends</CardTitle>
                  <CardDescription>Monthly patient acquisition and retention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.monthlyStats.map((stat) => (
                      <div key={stat.month} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-lg font-semibold">{stat.month}</div>
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{stat.patients} patients</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Utensils className="h-4 w-4 text-muted-foreground" />
                              <span>{stat.plans} plans</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={stat.patients > 20 ? "default" : "secondary"}>
                            {stat.patients > 20 ? "Growing" : "Stable"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="plans" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Plan Status Distribution</CardTitle>
                    <CardDescription>Current status of all diet plans</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Active Plans</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="h-2 rounded-full bg-green-500" style={{ width: '75%' }}></div>
                          </div>
                          <span className="text-sm font-medium">{reportData.activePlans}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Completed Plans</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div className="h-2 rounded-full bg-blue-500" style={{ width: '50%' }}></div>
                          </div>
                          <span className="text-sm font-medium">{reportData.completedPlans}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Plan Performance</CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Average Plan Duration</span>
                        <span className="font-medium">{reportData.avgPlanDuration} days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Success Rate</span>
                        <span className="font-medium">{reportData.planSuccessRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Patient Satisfaction</span>
                        <span className="font-medium">4.2/5.0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Analytics</CardTitle>
                  <CardDescription>Detailed insights and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Advanced Analytics</h3>
                    <p className="text-muted-foreground mb-4">
                      Comprehensive analytics dashboard with detailed charts and insights.
                    </p>
                    <Button>
                      <PieChart className="mr-2 h-4 w-4" />
                      View Full Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AuthGuard>
  )
}