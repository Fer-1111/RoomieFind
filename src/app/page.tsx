import Link from 'next/link'
import { Users, Heart, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Roomie Find</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/signin" className="btn-secondary">
                Ingresar
              </Link>
              <Link href="/auth/signup" className="btn-primary">
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Encuentra tu <span className="text-yellow-300">roommate</span> perfecto
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Conecta con personas compatibles basado en tus preferencias de estilo de vida
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
                Comenzar gratis
              </Link>
              <Link href="#como-funciona" className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
                Ver cómo funciona
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="como-funciona" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-xl text-gray-600">
              En 3 simples pasos encuentra tu roommate ideal
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Crea tu perfil</h3>
              <p className="text-gray-600">
                Completa tus preferencias: presupuesto, mascotas, estilo de vida y más
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Algoritmo inteligente</h3>
              <p className="text-gray-600">
                Nuestro sistema encuentra personas compatibles con un score de 0-100
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Conecta y decide</h3>
              <p className="text-gray-600">
                Ve tus matches, revisa la compatibilidad y conecta con tu roommate ideal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Preview */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Matching inteligente
            </h2>
            <p className="text-xl text-gray-600">
              Considera múltiples factores para encontrar la mejor compatibilidad
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="text-2xl mb-2">💰</div>
              <h4 className="font-semibold mb-1">Presupuesto</h4>
              <p className="text-sm text-gray-600">Rango de precio compatible</p>
            </div>

            <div className="card text-center">
              <div className="text-2xl mb-2">🐕</div>
              <h4 className="font-semibold mb-1">Mascotas</h4>
              <p className="text-sm text-gray-600">Tienes o permites mascotas</p>
            </div>

            <div className="card text-center">
              <div className="text-2xl mb-2">🌱</div>
              <h4 className="font-semibold mb-1">Vegetariano</h4>
              <p className="text-sm text-gray-600">Estilo de alimentación</p>
            </div>

            <div className="card text-center">
              <div className="text-2xl mb-2">🧹</div>
              <h4 className="font-semibold mb-1">Limpieza</h4>
              <p className="text-sm text-gray-600">Nivel de orden (1-5)</p>
            </div>

            <div className="card text-center">
              <div className="text-2xl mb-2">🎉</div>
              <h4 className="font-semibold mb-1">Social</h4>
              <p className="text-sm text-gray-600">Qué tan sociable eres</p>
            </div>

            <div className="card text-center">
              <div className="text-2xl mb-2">🔇</div>
              <h4 className="font-semibold mb-1">Ruido</h4>
              <p className="text-sm text-gray-600">Tolerancia al ruido</p>
            </div>

            <div className="card text-center">
              <div className="text-2xl mb-2">🌅</div>
              <h4 className="font-semibold mb-1">Horarios</h4>
              <p className="text-sm text-gray-600">Mañana, noche o flexible</p>
            </div>

            <div className="card text-center">
              <div className="text-2xl mb-2">🚭</div>
              <h4 className="font-semibold mb-1">Fumar</h4>
              <p className="text-sm text-gray-600">Fumas o permites fumar</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para encontrar tu roommate ideal?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Únete a cientos de personas que ya encontraron su match perfecto
          </p>
          <Link href="/auth/signup" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
            Crear cuenta gratis
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Heart className="h-6 w-6 text-blue-400" />
            <span className="ml-2 text-lg font-semibold">Roomie Find</span>
          </div>
          <p className="text-center text-gray-400 mt-4">
            © 2024 Roomie Find. Conectando roommates compatibles.
          </p>
        </div>
      </footer>
    </div>
  )
}