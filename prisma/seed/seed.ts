import { PrismaClient, UserRole, Gender } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create a clinic
  const clinic = await prisma.clinic.upsert({
    where: { id: 'clinic-1' },
    update: {},
    create: {
      id: 'clinic-1',
      name: 'AyurCare Main Clinic',
      address: '123 Wellness Street, Health City',
      phone: '+1-555-0123',
      email: 'info@ayurcare.com',
    },
  })

  // Create users
  const users = [
    {
      id: 'user-1',
      email: 'admin@ayurcare.com',
      name: 'Admin User',
      role: UserRole.SUPER_ADMIN,
      clinicId: clinic.id,
    },
    {
      id: 'user-2',
      email: 'dietitian@ayurcare.com',
      name: 'Dr. Sharma',
      role: UserRole.DIETITIAN,
      clinicId: clinic.id,
    },
    {
      id: 'user-3',
      email: 'patient@ayurcare.com',
      name: 'Ravi Kumar',
      role: UserRole.PATIENT,
      clinicId: clinic.id,
    },
    {
      id: 'user-4',
      email: 'assistant@ayurcare.com',
      name: 'Assistant User',
      role: UserRole.ASSISTANT,
      clinicId: clinic.id,
    },
  ]

  for (const userData of users) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    })
  }

  // Create sample patients
  const patients = [
  
    {
      id: 'patient-1',
      name: 'Priya Patel',
      email: 'priya@example.com',
      dateOfBirth: new Date('1990-05-15'),
      gender: Gender.FEMALE,
      height: 165,
      weight: 68,
      dietitianId: 'user-2',
      clinicId: clinic.id,
      allergies: JSON.stringify(['nuts', 'dairy']),
      chronicConditions: JSON.stringify(['hypertension']),
      goals: JSON.stringify(['weight loss', 'better digestion']),
    },
    {
      id: 'patient-2',
      name: 'Amit Kumar',
      email: 'amit@example.com',
      dateOfBirth: new Date('1985-08-22'),
      gender: Gender.MALE,
      height: 175,
      weight: 80,
      dietitianId: 'user-2',
      clinicId: clinic.id,
      allergies: JSON.stringify(['gluten']),
      chronicConditions: JSON.stringify(['diabetes']),
      goals: JSON.stringify(['blood sugar control', 'energy improvement']),
    },
  ]
  for (const patientData of patients) {
    await prisma.patient.upsert({
      where: { email: patientData.email },
      update: {},
      create: patientData,
    })
  }

  // Create sample prakriti assessments
  const assessments = [
    {
      id: 'assessment-1',
      patientId: 'patient-1',
      vataScore: 35,
      pittaScore: 40,
      kaphaScore: 25,
      confidence: 0.85,
      responses: JSON.stringify({}),
      notes: 'Patient shows Pitta-Vata constitution',
    },
    {
      id: 'assessment-2',
      patientId: 'patient-2',
      vataScore: 30,
      pittaScore: 45,
      kaphaScore: 25,
      confidence: 0.90,
      responses: JSON.stringify({}),
      notes: 'Patient shows Pitta dominance',
    },
  ]

  for (const assessmentData of assessments) {
    await prisma.prakritiAssessment.upsert({
      where: { id: assessmentData.id },
      update: {},
      create: assessmentData,
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })