import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validar email
    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      )
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'No se encontró una cuenta con este email' },
        { status: 404 }
      )
    }

    // Retornar datos del usuario (sin contraseña por ahora)
    return NextResponse.json(
      { 
        message: 'Login exitoso', 
        userId: user.id,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          age: user.age
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}