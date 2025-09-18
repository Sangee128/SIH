"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function UnauthorizedPage() {
  const { user } = useAuth()
  const router = useRouter()

  const handleGoBack = () => {
    if (user) {
      // Redirect based on role
      switch (user.role) {
        case 'SUPER_ADMIN':
        case 'CLINIC_ADMIN':
        case 'DIETITIAN':
          router.push('/')
          break
        case 'PATIENT':
          router.push('/patient-dashboard')
          break
        default:
          router.push('/login')
      }
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-800">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this resource.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-6">
            {user 
              ? `Your current role (${user.role}) doesn't have the required permissions for this page.`
              : 'Please log in to access this resource.'
            }
          </p>
          <Button onClick={handleGoBack} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}