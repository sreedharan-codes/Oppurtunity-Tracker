import { Opportunity, UserProfile, MatchScore } from '../types';

export function calculateMatchScore(opportunity: Opportunity, user: UserProfile | null): MatchScore {
  // If user is not logged in or has no skills, return a baseline discovery match
  if (!user || (!user.skills?.length && !user.interests?.length)) {
    return {
      percentage: 75,
      reason: 'Standard recommendation based on trending industry relevance.',
      matchedSkills: [],
      scoreType: 'moderate',
    };
  }

  const userSkills = (user.skills || []).map(s => s.toLowerCase().trim());
  const oppSkills = (opportunity.skills || []).map(s => s.toLowerCase().trim());
  const userInterests = (user.interests || []).map(i => i.toLowerCase().trim());

  // 1. Skill Overlap (Weight: 55 points)
  const matchedSkills: string[] = [];
  oppSkills.forEach(oppSkill => {
    const isDirectMatch = userSkills.some(uSkill => 
      uSkill === oppSkill || uSkill.includes(oppSkill) || oppSkill.includes(uSkill)
    );
    if (isDirectMatch) {
      // Find original casing from opportunity.skills
      const original = opportunity.skills.find(s => s.toLowerCase().trim() === oppSkill) || oppSkill;
      if (!matchedSkills.includes(original)) {
        matchedSkills.push(original);
      }
    }
  });

  const skillScore = oppSkills.length > 0
    ? Math.min(55, Math.round((matchedSkills.length / Math.min(oppSkills.length, 4)) * 55))
    : 40;

  // 2. Type Preference (Weight: 20 points)
  let typeScore = 10;
  if (user.preferredTypes && user.preferredTypes.length > 0) {
    if (user.preferredTypes.includes(opportunity.type)) {
      typeScore = 20;
    } else {
      typeScore = 5;
    }
  }

  // 3. Work Mode Preference (Weight: 15 points)
  let modeScore = 10;
  if (user.preferredMode && user.preferredMode !== 'Any') {
    if (user.preferredMode === opportunity.mode) {
      modeScore = 15;
    } else if (opportunity.mode === 'Hybrid') {
      modeScore = 12;
    } else {
      modeScore = 4;
    }
  } else {
    modeScore = 15;
  }

  // 4. Interest Alignment (Weight: 10 points)
  let interestScore = 0;
  const oppText = `${opportunity.title} ${opportunity.description} ${opportunity.type}`.toLowerCase();
  const matchedInterests = userInterests.filter(interest => oppText.includes(interest));
  if (matchedInterests.length > 0) {
    interestScore = Math.min(10, matchedInterests.length * 5);
  } else {
    interestScore = 4;
  }

  // Total raw score capped between 45% and 98%
  let totalScore = skillScore + typeScore + modeScore + interestScore;
  if (matchedSkills.length === 0 && userSkills.length > 0) {
    totalScore = Math.min(totalScore, 68);
  }
  totalScore = Math.min(98, Math.max(45, totalScore));

  // Determine score type
  let scoreType: MatchScore['scoreType'] = 'moderate';
  if (totalScore >= 85) scoreType = 'high';
  else if (totalScore >= 70) scoreType = 'medium';
  else if (totalScore >= 55) scoreType = 'moderate';
  else scoreType = 'low';

  // Construct explanatory reason
  let reason = '';
  if (matchedSkills.length >= 2) {
    reason = `Strong match because this opportunity directly aligns with your ${matchedSkills.slice(0, 3).join(', ')} expertise and ${opportunity.mode.toLowerCase()} mode preference.`;
  } else if (matchedSkills.length === 1) {
    reason = `Good match for your ${matchedSkills[0]} skill and target ${opportunity.type.toLowerCase()} format.`;
  } else if (user.preferredTypes?.includes(opportunity.type)) {
    reason = `Matches your preference for ${opportunity.type.toLowerCase()}s in the tech industry.`;
  } else {
    reason = `Opportunity to build relevant experience in ${opportunity.skills.slice(0, 2).join(' & ')}.`;
  }

  return {
    percentage: totalScore,
    reason,
    matchedSkills,
    scoreType,
  };
}

/**
 * Interface designed for easy expansion to an external LLM / Vertex AI / Gemini API
 */
export async function getAIMatchExplanation(
  opportunity: Opportunity,
  user: UserProfile
): Promise<MatchScore> {
  // Currently calculates deterministically client-side; structure is prepared for remote LLM inference
  return calculateMatchScore(opportunity, user);
}
