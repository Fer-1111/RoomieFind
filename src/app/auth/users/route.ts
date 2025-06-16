import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/users - Obtener usuarios con filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const excludeId = searchParams.get('excludeId')

    const skip = (page - 1) * limit

    const where = excludeId ? {
      id: {
        not: excludeId
      }
    } : {}

    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        profile: {
          select: {
            budget: true,
            vegetarian: true,
            hasPets: true,
            allowsPets: true,
            smoker: true,
            allowsSmoking: true,
            cleanliness: true,
            socialLevel: true,
            noiseLevel: true,
            scheduleType: true,
            genderPreference: true,
            ageMin: true,
            ageMax: true,
            bio: true,
            location: true,
            gender: true,
            occupation: true,
            interests: true,
            createdAt: true,
            updatedAt: true
          }
        },
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const total = await prisma.user.count({ where })

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/users - Crear usuario (si necesitas otra forma además del registro)
export async function POST(request: NextRequest) {
  try {
    const { name, email, age } = await request.json()

    // Validar datos básicos
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      )
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con este email' },
        { status: 400 }
      )
    }

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        age: age ? parseInt(age) : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        age: true,
        createdAt: true
      }
    })

    return NextResponse.json(
      { message: 'Usuario creado exitosamente', user },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}