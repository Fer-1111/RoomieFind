import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { calculateCompatibilityScore, getCompatibilityLevel, UserPreferences } from '@/lib/matching'

// GET /api/matches - Obtener matches para un usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const minScore = parseFloat(searchParams.get('minScore') || '50')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      )
    }

    // Obtener usuario actual con su perfil
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true
      }
    })

    if (!currentUser || !currentUser.profile) {
      return NextResponse.json(
        { error: 'Usuario no encontrado o sin perfil completo' },
        { status: 404 }
      )
    }

    // Obtener otros usuarios con perfiles completos
    const otherUsers = await prisma.user.findMany({
      where: {
        id: { not: userId },
        profile: {
          isNot: null
        }
      },
      include: {
        profile: true
      },
      take: limit * 2 // Obtener más para filtrar después
    })

    // Convertir a formato UserPreferences y calcular compatibilidad
    const currentUserPrefs: UserPreferences = {
      id: currentUser.id,
      name: currentUser.name,
      age: currentUser.age || undefined,
      budget: currentUser.profile.budget || undefined,
      vegetarian: currentUser.profile.vegetarian || false,
      hasPets: currentUser.profile.hasPets || false,
      allowsPets: currentUser.profile.allowsPets || false,
      smoker: currentUser.profile.smoker || false,
      allowsSmoking: currentUser.profile.allowsSmoking || false,
      cleanliness: currentUser.profile.cleanliness || undefined,
      socialLevel: currentUser.profile.socialLevel || undefined,
      noiseLevel: currentUser.profile.noiseLevel || undefined,
      scheduleType: currentUser.profile.scheduleType || undefined,
      genderPreference: currentUser.profile.genderPreference || undefined,
      ageMin: currentUser.profile.ageMin || undefined,
      ageMax: currentUser.profile.ageMax || undefined,
    }

    const matches = otherUsers
      .map(user => {
        const userPrefs: UserPreferences = {
          id: user.id,
          name: user.name,
          age: user.age || undefined,
          budget: user.profile?.budget || undefined,
          vegetarian: user.profile?.vegetarian || false,
          hasPets: user.profile?.hasPets || false,
          allowsPets: user.profile?.allowsPets || false,
          smoker: user.profile?.smoker || false,
          allowsSmoking: user.profile?.allowsSmoking || false,
          cleanliness: user.profile?.cleanliness || undefined,
          socialLevel: user.profile?.socialLevel || undefined,
          noiseLevel: user.profile?.noiseLevel || undefined,
          scheduleType: user.profile?.scheduleType || undefined,
          genderPreference: user.profile?.genderPreference || undefined,
          ageMin: user.profile?.ageMin || undefined,
          ageMax: user.profile?.ageMax || undefined,
        }

        const score = calculateCompatibilityScore(currentUserPrefs, userPrefs)
        const compatibility = getCompatibilityLevel(score)

        return {
          user: {
            id: user.id,
            name: user.name,
            age: user.age,
            profile: user.profile
          },
          compatibility: {
            score,
            ...compatibility
          }
        }
      })
      .filter(match => match.compatibility.score >= minScore)
      .sort((a, b) => b.compatibility.score - a.compatibility.score)
      .slice(0, limit)

    return NextResponse.json({
      matches,
      currentUser: {
        id: currentUser.id,
        name: currentUser.name,
        profile: currentUser.profile
      },
      filters: {
        minScore,
        limit
      }
    })

  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/matches - Crear o actualizar match/like
export async function POST(request: NextRequest) {
  try {
    const { userId, targetUserId, action } = await request.json()

    if (!userId || !targetUserId || !action) {
      return NextResponse.json(
        { error: 'userId, targetUserId y action son requeridos' },
        { status: 400 }
      )
    }

    if (!['like', 'dislike', 'super_like'].includes(action)) {
      return NextResponse.json(
        { error: 'action debe ser: like, dislike o super_like' },
        { status: 400 }
      )
    }

    // Verificar que ambos usuarios existan
    const [user, targetUser] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.user.findUnique({ where: { id: targetUserId } })
    ])

    if (!user || !targetUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Crear o actualizar match
    const match = await prisma.match.upsert({
      where: {
        userId_targetUserId: {
          userId,
          targetUserId
        }
      },
      update: {
        action,
        updatedAt: new Date()
      },
      create: {
        userId,
        targetUserId,
        action
      }
    })

    // Verificar si hay match mutuo
    let mutualMatch = false
    if (action === 'like' || action === 'super_like') {
      const reverseMatch = await prisma.match.findUnique({
        where: {
          userId_targetUserId: {
            userId: targetUserId,
            targetUserId: userId
          }
        }
      })

      if (reverseMatch && (reverseMatch.action === 'like' || reverseMatch.action === 'super_like')) {
        mutualMatch = true
      }
    }

    return NextResponse.json({
      match,
      mutualMatch,
      message: mutualMatch ? '¡Es un match! 🎉' : 'Acción registrada'
    })

  } catch (error) {
    console.error('Error creating match:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET /api/matches/mutual - Obtener matches mutuos
export async function GET_MUTUAL(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      )
    }

    // Obtener matches donde el usuario dio like
    const userLikes = await prisma.match.findMany({
      where: {
        userId,
        action: { in: ['like', 'super_like'] }
      }
    })

    // Obtener matches mutuos
    const mutualMatches = []
    for (const like of userLikes) {
      const reverseMatch = await prisma.match.findUnique({
        where: {
          userId_targetUserId: {
            userId: like.targetUserId,
            targetUserId: userId
          }
        },
        include: {
          targetUser: {
            include: {
              profile: true
            }
          }
        }
      })

      if (reverseMatch && (reverseMatch.action === 'like' || reverseMatch.action === 'super_like')) {
        mutualMatches.push({
          matchId: like.id,
          user: reverseMatch.targetUser,
          matchedAt: reverseMatch.createdAt > like.createdAt ? reverseMatch.createdAt : like.createdAt
        })
      }
    }

    return NextResponse.json({
      mutualMatches: mutualMatches.sort((a, b) => 
        new Date(b.matchedAt).getTime() - new Date(a.matchedAt).getTime()
      )
    })

  } catch (error) {
    console.error('Error fetching mutual matches:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}