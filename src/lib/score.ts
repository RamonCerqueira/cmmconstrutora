// Calculate Score RH based on profile and vacancy requirements
export function calculateMatchScore(profile: any, vacancy: any) {
  let score = 0;
  let totalPoints = 0;

  // 1. Escolaridade (20 pts)
  totalPoints += 20;
  const eduLevels = ['ENSINO_MEDIO', 'TECNICO', 'GRADUACAO', 'POS_GRADUACAO', 'MESTRADO', 'DOUTORADO'];
  const profileEduIdx = eduLevels.indexOf(profile.education || '');
  const vacancyEduIdx = eduLevels.indexOf(vacancy.minEducation || 'ENSINO_MEDIO');
  if (profileEduIdx >= vacancyEduIdx && profileEduIdx !== -1) {
    score += 20;
  } else if (profileEduIdx !== -1) {
    score += 10; // Partial credit
  }

  // 2. Experiência (30 pts)
  totalPoints += 30;
  let totalMonths = 0;
  if (profile.experiences) {
    for (const exp of profile.experiences) {
      const start = new Date(exp.startDate);
      const end = exp.isCurrent ? new Date() : (exp.endDate ? new Date(exp.endDate) : new Date());
      const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      totalMonths += Math.max(0, diffMonths);
    }
  }
  const minExp = vacancy.minExperienceMonths || 0;
  if (minExp === 0) {
    score += 30;
  } else {
    const ratio = totalMonths / minExp;
    score += Math.min(30, Math.floor(ratio * 30));
  }

  // 3. Localização (15 pts)
  totalPoints += 15;
  const cityMatch = profile.city?.toLowerCase().trim() === vacancy.city?.toLowerCase().trim();
  const stateMatch = profile.state?.toLowerCase().trim() === vacancy.state?.toLowerCase().trim();
  if (cityMatch && profile.city) {
    score += 15;
  } else if (stateMatch && profile.state) {
    score += 10;
  }

  // 4. CREA (15 pts)
  if (vacancy.creaRequired) {
    totalPoints += 15;
    if (profile.crea && profile.crea.trim() !== '') {
      score += 15;
    }
  }

  // 5. CNH (20 pts)
  if (vacancy.cnhRequired) {
    totalPoints += 20;
    if (profile.cnh && profile.cnh.toUpperCase().includes(vacancy.cnhRequired.toUpperCase())) {
      score += 20;
    } else if (profile.cnh) {
      score += 10;
    }
  }

  return totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 100;
}
