import { Roadmap, QuizAnswers } from '../types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama3-8b-8192';

function getApiKey(): string | null {
  return process.env.EXPO_PUBLIC_GROQ_API_KEY || null;
}

export async function generateRoadmap(answers: QuizAnswers): Promise<Roadmap> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return getMockRoadmap(answers);
  }

  const prompt = `You are a career advisor for Indian engineering students. Based on the following quiz answers, generate a DETAILED personalized skill development roadmap with specific milestones, projects, and resources.

Current skills: ${answers.skills.join(', ') || 'None'}
Dream role: ${answers.dreamRole}
Target company: ${answers.targetCompany}
Study hours per week: ${answers.studyHours}
Current year: ${answers.currentYear}

Return ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "skillGaps": ["skill1", "skill2", "skill3"],
  "weeks": [
    {
      "week": 1,
      "topic": "Topic Name",
      "resources": "Resource name (website/book)",
      "estimatedHours": 10,
      "milestones": [
        {"title": "Learn Basics", "description": "Understand core concepts", "estimatedHours": 5},
        {"title": "First Project", "description": "Build a simple project", "estimatedHours": 5}
      ],
      "projects": [
        {"name": "Todo App", "description": "Build a basic todo application", "estimatedHours": 8, "difficulty": "Easy"}
      ],
      "resources": [
        {"type": "video", "title": "Topic Fundamentals"},
        {"type": "article", "title": "Best Practices Guide"},
        {"type": "course", "title": "Complete Course"}
      ],
      "keyTopics": ["Concept1", "Concept2", "Concept3"]
    }
  ]
}

Generate 8-12 weeks of roadmap. For each week include:
- 2-3 milestones with descriptions
- 1-2 hands-on projects
- 3-4 learning resources by type (video/article/course)
- 4-5 key topics to master

Make it practical, specific, and inspiring for Indian engineering students. Include project ideas they can show in interviews.`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return parsed as Roadmap;
  } catch {
    return getMockRoadmap(answers);
  }
}

export async function chatWithAI(userMessage: string): Promise<string> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return getMockChatResponse(userMessage);
  }

  const systemPrompt = `You are SkillBridge AI, a career advisor and coding mentor for Indian engineering students. Be concise, practical, and encouraging. Help with career guidance, coding questions, and study roadmaps. Keep responses under 200 words.`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    return data.choices?.[0]?.message?.content || getMockChatResponse(userMessage);
  } catch {
    return getMockChatResponse(userMessage);
  }
}

function getMockRoadmap(answers: QuizAnswers): Roadmap {
  const roleGaps: Record<string, string[]> = {
    'Full Stack': ['React.js', 'Node.js', 'Databases', 'System Design', 'REST APIs'],
    'ML Engineer': ['Python', 'TensorFlow', 'Statistics', 'Data Preprocessing', 'Model Deployment'],
    'Mobile Dev': ['React Native', 'Flutter', 'Firebase', 'Mobile UI/UX', 'App Store Deployment'],
    'DevOps': ['Docker', 'Kubernetes', 'CI/CD', 'AWS/GCP', 'Linux', 'Terraform'],
  };

  const gaps = roleGaps[answers.dreamRole] || ['DSA', 'Projects', 'Communication'];
  const filtered = gaps.filter(g => !answers.skills.some(s => s.toLowerCase().includes(g.toLowerCase().split(' ')[0].toLowerCase())));

  const hoursPerWeek = answers.studyHours;
  const weeks = filtered.map((topic, i) => ({
    week: i + 1,
    topic,
    resources: `freeCodeCamp ${topic} Course / ${topic} YouTube Playlist`,
    estimatedHours: Math.min(hoursPerWeek + 2, 15),
    milestones: [
      { title: `Learn ${topic} Basics`, description: `Master fundamental concepts of ${topic}`, estimatedHours: Math.floor((hoursPerWeek + 2) / 2) },
      { title: `Build ${topic} Project`, description: `Create a practical project using ${topic}`, estimatedHours: Math.ceil((hoursPerWeek + 2) / 2) },
    ],
    projects: [
      { name: `${topic} Learning Project`, description: `Build a real-world project using ${topic}`, estimatedHours: 12, difficulty: 'Medium' as const },
    ],
    resources: [
      { type: 'video' as const, title: `${topic} Fundamentals` },
      { type: 'course' as const, title: `Complete ${topic} Guide` },
      { type: 'article' as const, title: `${topic} Best Practices` },
    ],
    keyTopics: [`${topic} Core Concepts`, 'Best Practices', 'Performance Optimization'],
  }));

  return { skillGaps: filtered.length > 0 ? filtered : gaps, weeks };
}

function getMockChatResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('dsa') || lower.includes('data structure')) {
    return 'Start with Arrays and Strings on LeetCode. Solve 2 easy problems daily, then move to Linked Lists and Trees. Consistency beats intensity!';
  }
  if (lower.includes('job') || lower.includes('placement') || lower.includes('interview')) {
    return 'Focus on 3 pillars: DSA (2 problems/day), 1 solid project, and core CS fundamentals. Apply to 5 companies/week on LinkedIn and Naukri.';
  }
  if (lower.includes('ai') || lower.includes('ml') || lower.includes('machine learning')) {
    return 'Start with Andrew Ng\'s ML course on Coursera. Learn Python, NumPy, and Pandas first. Then build 2-3 small ML projects for your portfolio.';
  }
  return 'I recommend starting with a clear goal, breaking it into weekly milestones, and tracking your progress. What specific area would you like guidance on?';
}

