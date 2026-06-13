import { GithubProfile, LinkedInProfile, SkillGap, ProfileAnalysisResult, RoadmapResource } from '../types';
import { chatWithAI } from './groq';

interface ParsedProfile {
  github?: GithubProfile;
  linkedin?: LinkedInProfile;
}

function extractGithubUsername(input: string): string | null {
  // Extract GitHub username from URL or direct input
  const urlMatch = input.match(/github\.com\/([a-zA-Z0-9-]+)/);
  if (urlMatch) return urlMatch[1];
  if (/^[a-zA-Z0-9-]+$/.test(input)) return input;
  return null;
}

function extractLinkedInUrl(input: string): string | null {
  // Validate LinkedIn URL
  if (input.includes('linkedin.com')) return input;
  return null;
}

async function fetchGithubData(username: string): Promise<GithubProfile | null> {
  try {
    // Mock GitHub data - in production, use GitHub API with token
    const mockData: GithubProfile = {
      username,
      repositories: Math.floor(Math.random() * 50) + 5,
      stars: Math.floor(Math.random() * 200) + 10,
      followers: Math.floor(Math.random() * 300) + 5,
      languages: ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript'].slice(0, Math.floor(Math.random() * 3) + 2),
    };
    return mockData;
  } catch {
    return null;
  }
}

function parseLinkedInProfile(url: string): LinkedInProfile | null {
  try {
    // Mock LinkedIn data - in production, use LinkedIn Scraper API
    const mockData: LinkedInProfile = {
      profileUrl: url,
      headline: 'Software Engineer | Full Stack Developer',
      skills: ['React', 'Node.js', 'MongoDB', 'Python', 'AWS', 'Docker', 'System Design'],
      endorsements: {
        'React': 45,
        'Node.js': 38,
        'MongoDB': 28,
        'Python': 52,
      },
    };
    return mockData;
  } catch {
    return null;
  }
}

async function analyzeSkillGaps(
  profiles: ParsedProfile,
  dreamRole: string,
  currentSkills: string[]
): Promise<SkillGap[]> {
  // Define role-skill requirements
  const roleRequirements: Record<string, Record<string, 'Beginner' | 'Intermediate' | 'Advanced'>> = {
    'Full Stack': {
      'React': 'Advanced',
      'Node.js': 'Advanced',
      'MongoDB': 'Intermediate',
      'System Design': 'Intermediate',
      'AWS': 'Intermediate',
      'Docker': 'Beginner',
    },
    'ML Engineer': {
      'Python': 'Advanced',
      'TensorFlow': 'Advanced',
      'PyTorch': 'Intermediate',
      'Statistics': 'Advanced',
      'SQL': 'Intermediate',
      'Cloud ML': 'Intermediate',
    },
    'Mobile Dev': {
      'React Native': 'Advanced',
      'Swift': 'Intermediate',
      'Firebase': 'Intermediate',
      'UI/UX': 'Intermediate',
      'REST APIs': 'Advanced',
    },
    'DevOps': {
      'Docker': 'Advanced',
      'Kubernetes': 'Advanced',
      'CI/CD': 'Advanced',
      'AWS': 'Advanced',
      'Linux': 'Intermediate',
      'Terraform': 'Intermediate',
    },
  };

  const requirements = roleRequirements[dreamRole] || roleRequirements['Full Stack'];
  const gaps: SkillGap[] = [];
  const priorityMap = { 0: 'Must' as const, 1: 'Should' as const, 2: 'Nice' as const };

  Object.entries(requirements).forEach(([skill, requiredLevel], index) => {
    const userHasSkill = currentSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()));
    
    if (!userHasSkill) {
      gaps.push({
        skill,
        currentLevel: 'Beginner',
        requiredLevel,
        priority: priorityMap[Math.min(index, 2)],
        suggestedResources: generateResourcesForSkill(skill),
        timelineWeeks: requiredLevel === 'Advanced' ? 12 : requiredLevel === 'Intermediate' ? 8 : 4,
      });
    }
  });

  return gaps.slice(0, 8); // Limit to 8 skill gaps
}

function generateResourcesForSkill(skill: string): RoadmapResource[] {
  const resourceMap: Record<string, RoadmapResource[]> = {
    'React': [
      { type: 'course', title: 'React Complete Guide 2024', url: 'udemy.com' },
      { type: 'article', title: 'React Hooks Deep Dive', url: 'dev.to' },
      { type: 'video', title: 'React Patterns & Best Practices' },
    ],
    'Python': [
      { type: 'course', title: 'Python for Everybody', url: 'coursera.org' },
      { type: 'article', title: 'Python Advanced Concepts', url: 'realpython.com' },
      { type: 'video', title: 'Python OOP Mastery' },
    ],
    'Docker': [
      { type: 'course', title: 'Docker & Kubernetes Complete Guide', url: 'udemy.com' },
      { type: 'article', title: 'Docker Best Practices', url: 'docker.com' },
      { type: 'video', title: 'Docker in 100 Seconds' },
    ],
  };

  return resourceMap[skill] || [
    { type: 'course', title: `${skill} Masterclass` },
    { type: 'article', title: `${skill} Advanced Guide` },
    { type: 'video', title: `${skill} Tutorial` },
  ];
}

export async function analyzeProfiles(
  githubId: string,
  linkedinUrl: string,
  dreamRole: string,
  currentSkills: string[]
): Promise<ProfileAnalysisResult> {
  try {
    const parsedProfiles: ParsedProfile = {};

    // Parse and fetch GitHub data
    if (githubId.trim()) {
      const username = extractGithubUsername(githubId.trim());
      if (username) {
        const githubData = await fetchGithubData(username);
        if (githubData) parsedProfiles.github = githubData;
      }
    }

    // Parse LinkedIn data
    if (linkedinUrl.trim()) {
      const url = extractLinkedInUrl(linkedinUrl.trim());
      if (url) {
        const linkedinData = parseLinkedInProfile(url);
        if (linkedinData) parsedProfiles.linkedin = linkedinData;
      }
    }

    // Analyze skill gaps
    const skillGaps = await analyzeSkillGaps(parsedProfiles, dreamRole, currentSkills);
    
    // Generate recommendations using AI
    const recommendations = await generateRecommendations(
      parsedProfiles,
      skillGaps,
      dreamRole
    );

    // Calculate metrics
    const overallScore = calculateScore(skillGaps, parsedProfiles);
    const strengthAreas = extractStrengths(skillGaps, parsedProfiles);
    const improvementAreas = skillGaps.slice(0, 3).map(g => g.skill);

    return {
      github: parsedProfiles.github,
      linkedin: parsedProfiles.linkedin,
      skillGaps,
      recommendations,
      overallScore,
      strengthAreas,
      improvementAreas,
    };
  } catch (error) {
    console.error('[v0] Profile analysis error:', error);
    throw new Error('Failed to analyze profiles');
  }
}

async function generateRecommendations(
  profiles: ParsedProfile,
  skillGaps: SkillGap[],
  dreamRole: string
): Promise<string[]> {
  const mustLearnSkills = skillGaps.filter(g => g.priority === 'Must').map(g => g.skill);
  const shouldLearnSkills = skillGaps.filter(g => g.priority === 'Should').map(g => g.skill);

  const prompt = `Based on these skill gaps for a ${dreamRole} role:
  Must learn: ${mustLearnSkills.join(', ')}
  Should learn: ${shouldLearnSkills.join(', ')}
  
  Provide 3 concrete, actionable recommendations for the next 30 days (short sentences, max 50 words each). Focus on priority skills first.`;

  try {
    const aiResponse = await chatWithAI(prompt);
    // Parse AI response into recommendations
    const recommendations = aiResponse
      .split('\n')
      .filter(line => line.trim())
      .slice(0, 3)
      .map(rec => rec.replace(/^\d+\.\s*/, '').trim());
    
    return recommendations.length > 0 ? recommendations : getDefaultRecommendations(mustLearnSkills, dreamRole);
  } catch {
    return getDefaultRecommendations(mustLearnSkills, dreamRole);
  }
}

function getDefaultRecommendations(skills: string[], role: string): string[] {
  return [
    `Start with ${skills[0] || 'core fundamentals'} - it's critical for ${role} roles. Allocate 10 hours/week for this skill.`,
    `Build a project using ${skills[1] || 'new technology'} to gain practical experience and strengthen your portfolio.`,
    `Join a community or take mock interviews to practice explaining your skills and gain confidence for interviews.`,
  ];
}

function calculateScore(skillGaps: SkillGap[], profiles: ParsedProfile): number {
  let score = 70; // Base score

  // Add points for GitHub presence
  if (profiles.github) {
    score += Math.min(profiles.github.repositories * 2, 15);
  }

  // Subtract points for skill gaps
  const mustLearnGaps = skillGaps.filter(g => g.priority === 'Must').length;
  score -= mustLearnGaps * 5;

  return Math.max(20, Math.min(100, score));
}

function extractStrengths(skillGaps: SkillGap[], profiles: ParsedProfile): string[] {
  const strengths: string[] = [];

  if (profiles.github && profiles.github.stars > 50) {
    strengths.push('Strong GitHub presence');
  }

  if (profiles.linkedin && Object.keys(profiles.linkedin.endorsements).length > 3) {
    strengths.push('Well-endorsed on LinkedIn');
  }

  if (skillGaps.length === 0) {
    strengths.push('Already have required skills');
  } else {
    const gaps = new Set(skillGaps.map(g => g.skill));
    if (gaps.size < 3) {
      strengths.push('Few critical gaps to fill');
    }
  }

  return strengths.length > 0 ? strengths : ['Room for growth'];
}
