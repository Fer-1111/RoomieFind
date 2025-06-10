import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { calculateCompatibilityScore } from '@/lib/matching'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id

    // Obtener usuario actual
    const currentUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Obtener todos los otros usuarios
    const otherUsers = await prisma.user.findMany({
      where: {
        id: { not: userId }
      }
    })

    // Calcular compatibilidad con cada usuario
    const matches = otherUsers.map(otherUser => {
      const score = calculateCompatibilityScore(currentUser, otherUser)

      return {
        id: otherUser.id,
        name: otherUser.name,
        age: otherUser.age,
        compatibilityScore: Math.round(score * 100),
        budget: otherUser.budget || 0,
        summary: generateSummary(otherUser)
      }
    })

    // Ordenar por compatibilidad (mayor a menor) y filtrar >= 50%
    const filteredMatches = matches
      .filter(match => match.compatibilityScore >= 50)
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 10) // Limitar a 10 matches

    return NextResponse.json({
      matches: filteredMatches,
      total: filteredMatches.length
    })

  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

function generateSummary(user: any): string {
  const parts = []

  if (user.hasPets) parts.push('tiene mascotas')
  if (user.vegetarian) parts.push('vegetariano')
  if (user.allowsSmoking) parts.push('permite fumar')

  const cleanLevel = user.cleanliness || 3
  if (cleanLevel >= 4) parts.push('muy ordenado')
  else if (cleanLevel <= 2) parts.push('relajado con el orden')

  const socialLevel = user.socialLevel || 3
  if (socialLevel >= 4) parts.push('muy sociable')
  else if (socialLevel <= 2) parts.push('prefiere tranquilidad')

  if (parts.length === 0) {
    return 'Busca un roommate compatible para compartir gastos y experiencias.'
  }

  return `Perfil: ${parts.slice(0, 3).join(', ')}. Busca roommate con estilo de vida similar.`
}