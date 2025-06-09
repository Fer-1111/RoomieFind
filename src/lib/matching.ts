// src/lib/matching.ts

export interface UserPreferences {
  id: string;
  name: string;
  age?: number;
  budget?: number;
  vegetarian: boolean;
  hasPets: boolean;
  allowsPets: boolean;
  smoker: boolean;
  allowsSmoking: boolean;
  cleanliness?: number;
  socialLevel?: number;
  noiseLevel?: number;
  scheduleType?: string;
  genderPreference?: string;
  ageMin?: number;
  ageMax?: number;
}

export function calculateCompatibilityScore(
  user1: UserPreferences,
  user2: UserPreferences
): number {
  let score = 0;
  let maxScore = 100;

  // 1. CRITERIOS OBLIGATORIOS (40 puntos)
  
  // Presupuesto (15 puntos)
  if (user1.budget && user2.budget) {
    const budgetDiff = Math.abs(user1.budget - user2.budget);
    const budgetScore = Math.max(0, 15 - (budgetDiff / 100));
    score += budgetScore;
  } else {
    maxScore -= 15;
  }

  // Mascotas (15 puntos)
  const petsCompatible = 
    (!user1.hasPets && !user2.hasPets) || // Ninguno tiene mascotas
    (user1.hasPets && user2.allowsPets) || // User1 tiene, User2 permite
    (user2.hasPets && user1.allowsPets);   // User2 tiene, User1 permite
  
  if (petsCompatible) {
    score += 15;
  }

  // Fumar (10 puntos)
  const smokingCompatible = 
    (!user1.smoker && !user2.smoker) || // Ninguno fuma
    (user1.smoker && user2.allowsSmoking) || // User1 fuma, User2 permite
    (user2.smoker && user1.allowsSmoking);   // User2 fuma, User1 permite
  
  if (smokingCompatible) {
    score += 10;
  }

  // 2. ESTILO DE VIDA (40 puntos)
  
  // Limpieza (15 puntos)
  if (user1.cleanliness && user2.cleanliness) {
    const cleanDiff = Math.abs(user1.cleanliness - user2.cleanliness);
    const cleanScore = Math.max(0, 15 - (cleanDiff * 3));
    score += cleanScore;
  } else {
    maxScore -= 15;
  }

  // Nivel social (10 puntos)
  if (user1.socialLevel && user2.socialLevel) {
    const socialDiff = Math.abs(user1.socialLevel - user2.socialLevel);
    const socialScore = Math.max(0, 10 - (socialDiff * 2));
    score += socialScore;
  } else {
    maxScore -= 10;
  }

  // Ruido (10 puntos)
  if (user1.noiseLevel && user2.noiseLevel) {
    const noiseDiff = Math.abs(user1.noiseLevel - user2.noiseLevel);
    const noiseScore = Math.max(0, 10 - (noiseDiff * 2));
    score += noiseScore;
  } else {
    maxScore -= 10;
  }

  // Horarios (5 puntos)
  if (user1.scheduleType && user2.scheduleType) {
    if (user1.scheduleType === user2.scheduleType || 
        user1.scheduleType === 'flexible' || 
        user2.scheduleType === 'flexible') {
      score += 5;
    }
  } else {
    maxScore -= 5;
  }

  // 3. PREFERENCIAS ESPECÍFICAS (20 puntos)

  // Edad (10 puntos)
  let ageCompatible = true;
  if (user1.ageMin && user2.age && user2.age < user1.ageMin) ageCompatible = false;
  if (user1.ageMax && user2.age && user2.age > user1.ageMax) ageCompatible = false;
  if (user2.ageMin && user1.age && user1.age < user2.ageMin) ageCompatible = false;
  if (user2.ageMax && user1.age && user1.age > user2.ageMax) ageCompatible = false;
  
  if (ageCompatible) {
    score += 10;
  }

  // Vegetarianismo (5 puntos bonus)
  if (user1.vegetarian && user2.vegetarian) {
    score += 5;
  }

  // Género - esto es solo para filtrar, no afecta puntuación
  // Se maneja en la consulta de base de datos

  // Calcular porcentaje final
  const finalScore = maxScore > 0 ? (score / maxScore) * 100 : 0;
  return Math.round(finalScore * 100) / 100; // Redondear a 2 decimales
}

export function getCompatibilityLevel(score: number): {
  level: string;
  color: string;
  description: string;
} {
  if (score >= 80) {
    return {
      level: "Excelente",
      color: "text-green-600",
      description: "¡Muy compatible! Comparten muchas preferencias."
    };
  } else if (score >= 65) {
    return {
      level: "Buena",
      color: "text-blue-600", 
      description: "Buena compatibilidad. Algunas diferencias menores."
    };
  } else if (score >= 50) {
    return {
      level: "Regular",
      color: "text-yellow-600",
      description: "Compatibilidad moderada. Requiere compromiso."
    };
  } else {
    return {
      level: "Baja",
      color: "text-red-600",
      description: "Poca compatibilidad. Muchas diferencias importantes."
    };
  }
}