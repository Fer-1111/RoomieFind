import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id

    // Buscar usuario con sus preferencias
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        preferences: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Retornar datos del usuario
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      hasPreferences: !!user.preferences,
      preferences: user.preferences
    })

  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}