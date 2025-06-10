'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Settings, LogOut, User, MapPin, DollarSign, Star } from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  age?: number
  hasPreferences: boolean
}

interface Match {
  id: string
  name: string
  age?: number
  compatibilityScore: number
  location?: string
  budget?: number
  summary: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUserData = async () => {
      const userId = localStorage.getItem('userId')
      
      if (!userId) {
        router.push('/auth/signin')
        return
      }

      try {
        // Cargar datos del usuario
        const userResponse = await fetch(`/api/users/${userId}`)
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData)

          // Si tiene preferencias, cargar matches
          if (userData.hasPreferences) {
            const matchesResponse = await fetch(`/api/matches/${userId}`)
            if (matchesResponse.ok) {
              const matchesData = await matchesResponse.json()
              setMatches(matchesData.matches || [])
            }
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('userId')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Cargando tu dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error al cargar los datos del usuario</p>
          <button onClick={() => router.push('/auth/signin')} className="btn-primary">
            Volver al login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Roomie Find</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">¡Hola, {user.name}!</span>
              <button 
                onClick={() => router.push('/profile')}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user.hasPreferences ? (
          // Sin preferencias - Mostrar setup
          <div className="text-center py-12">
            <div className="card max-w-md mx-auto">
              <User className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ¡Bienvenido a Roomie Find!
              </h2>
              <p className="text-gray-600 mb-6">
                Para encontrar tu roommate perfecto, necesitamos conocer tus preferencias.
              </p>
              <button 
                onClick={() => router.push('/profile/setup')}
                className="btn-primary w-full"
              >
                Completar mi perfil
              </button>
            </div>
          </div>
        ) : (
          // Con preferencias - Mostrar matches
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card text-center">
                <div className="text-3xl font-bold text-blue-600">{matches.length}</div>
                <div className="text-sm text-gray-600">Matches encontrados</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-green-600">
                  {matches.filter(m => m.compatibilityScore >= 80).length}
                </div>
                <div className="text-sm text-gray-600">Alta compatibilidad</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {matches.length > 0 ? Math.round(matches.reduce((acc, m) => acc + m.compatibilityScore, 0) / matches.length) : 0}%
                </div>
                <div className="text-sm text-gray-600">Compatibilidad promedio</div>
              </div>
            </div>

            {/* Matches List */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Tus Matches</h2>
                <button 
                  onClick={() => window.location.reload()}
                  className="btn-secondary text-sm"
                >
                  Actualizar
                </button>
              </div>

              {matches.length === 0 ? (
                <div className="card text-center py-12">
                  <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No hay matches aún
                  </h3>
                  <p className="text-gray-600">
                    Estamos buscando roommates compatibles para ti. ¡Vuelve pronto!
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {matches.map((match) => (
                    <div key={match.id} className="card hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-xl font-semibold text-gray-900 mr-3">
                              {match.name}
                            </h3>
                            {match.age && (
                              <span className="text-sm text-gray-600">
                                {match.age} años
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            {match.location && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {match.location}
                              </div>
                            )}
                            {match.budget && (
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />
                                ${match.budget.toLocaleString()}
                              </div>
                            )}
                          </div>
                          
                          <p className="text-gray-700 mb-4">
                            {match.summary}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Star className="h-5 w-5 text-yellow-500 mr-1" />
                              <span className="font-semibold text-gray-900">
                                {match.compatibilityScore}% compatibilidad
                              </span>
                            </div>
                            
                            <div className="flex space-x-2">
                              <button className="btn-secondary text-sm">
                                Ver perfil
                              </button>
                              <button className="btn-primary text-sm">
                                Conectar
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          <div className={`
                            w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg
                            ${match.compatibilityScore >= 80 ? 'bg-green-500' : 
                              match.compatibilityScore >= 60 ? 'bg-yellow-500' : 'bg-gray-500'}
                          `}>
                            {match.compatibilityScore}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}