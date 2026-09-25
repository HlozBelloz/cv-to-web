import { NextRequest, NextResponse } from 'next/server';
import { CVProfile } from '@/types';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

const CANDIDATE_MODELS = [
  'google/gemma-4-26b-a4b-it:free',
  'liquid/lfm-2.5-2.6b:free',
  'qwen/qwen3.8-27b:free',
  'inclusionai/ling-3.0-flash-fin:free',
  'meta-llama/llama-3.3-70b-instruct:free',
];

interface ChatRequest {
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  profile: CVProfile;
}

/**
 * Fallback intent processor for instant response if OpenRouter upstream is temporarily rate-limited
 */
function processLocalIntent(userPrompt: string, currentProfile: CVProfile): { reply: string; updates: Partial<CVProfile> } | null {
  const lower = userPrompt.toLowerCase();
  const updates: Partial<CVProfile> = {};
  const replies: string[] = [];

  // 1. Theme intent
  if (lower.includes('executive')) {
    updates.theme = 'executive';
    replies.push('Switched your portfolio theme to Executive (Slate & Amber).');
  } else if (lower.includes('tech') || lower.includes('modern')) {
    updates.theme = 'tech';
    replies.push('Switched your portfolio theme to Modern Tech (Cyber Dark & Terminal).');
  } else if (lower.includes('minimal')) {
    updates.theme = 'minimal';
    replies.push('Switched your portfolio theme to Minimalist (Swiss Editorial Ivory).');
  } else if (lower.includes('creative')) {
    updates.theme = 'creative';
    replies.push('Switched your portfolio theme to Creative (Bento Grid & Violet).');
  }

  // 2. Accent color intent
  const colors = ['amber', 'emerald', 'blue', 'indigo', 'violet', 'rose', 'cyan', 'slate'] as const;
  for (const c of colors) {
    if (lower.includes(`color to ${c}`) || lower.includes(`accent to ${c}`) || lower.includes(`${c} color`) || lower.includes(`${c} theme`)) {
      updates.accentColor = c;
      replies.push(`Updated your accent color palette to ${c.toUpperCase()}.`);
      break;
    }
  }

  // 3. GPA intent
  const gpaMatch = lower.match(/gpa\s*(?:to|is|=)?\s*([0-4](?:\.[0-9]{1,2})?)/i) || lower.match(/([0-4]\.[0-9]{1,2})\s*gpa/i);
  if (gpaMatch) {
    const gpaVal = gpaMatch[1];
    const newEdu = (currentProfile.education || []).map(edu => ({
      ...edu,
      gpa: gpaVal,
      honors: edu.honors ? `${edu.honors} (GPA: ${gpaVal})` : `GPA: ${gpaVal} / 4.0`,
    }));
    updates.education = newEdu;

    // Also update metrics if a GPA metric exists or add one
    const metrics = [...(currentProfile.metrics || [])];
    const gpaMetricIdx = metrics.findIndex(m => m.label.toLowerCase().includes('gpa'));
    if (gpaMetricIdx >= 0) {
      metrics[gpaMetricIdx] = { ...metrics[gpaMetricIdx], value: `${gpaVal} / 4.0` };
    } else {
      metrics.unshift({ label: 'Academic GPA', value: `${gpaVal} / 4.0`, description: 'Verified Grade Point Average' });
    }
    updates.metrics = metrics;
    replies.push(`Updated your academic GPA to ${gpaVal} across your education profile and highlight metrics.`);
  }

  // 4. Bio / Summary polish intent
  if (lower.includes('punchier') || lower.includes('rewrite summary') || lower.includes('improve bio') || lower.includes('executive summary')) {
    updates.summary = `Accomplished and high-impact technology specialist recognized for driving strategic engineering solutions, cross-functional collaboration, and technical innovation. Proven track record in architecting modern web platforms, optimizing distributed workflows, and executing complex software initiatives with excellence.`;
    replies.push('Polished your executive summary with high-converting, leadership-focused phrasing.');
  }

  // 5. Title intent
  const titleMatch = lower.match(/(?:title|headline)\s*(?:to|is|=)\s*(.+)/i);
  if (titleMatch && !titleMatch[1].includes('gpa') && !titleMatch[1].includes('theme')) {
    const newTitle = titleMatch[1].trim().replace(/^["']|["']$/g, '');
    updates.title = newTitle;
    replies.push(`Updated your professional title to "${newTitle}".`);
  }

  if (replies.length > 0) {
    return {
      reply: replies.join(' '),
      updates,
    };
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { messages, profile } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || '';

    // Prepare system instructions with current CVProfile context
    const systemPrompt = `You are an expert AI Executive CV and Portfolio Website Architect.
You help the candidate edit and customize their personal CV website in real time.

Current candidate profile:
Name: ${profile.fullName}
Title: ${profile.title}
Theme: ${profile.theme}
Accent Color: ${profile.accentColor || 'amber'}
Summary: ${profile.summary}
Metrics: ${JSON.stringify(profile.metrics || [])}
Education: ${JSON.stringify(profile.education || [])}
Experiences: ${JSON.stringify(profile.experiences || [])}
Skill Groups: ${JSON.stringify(profile.skillGroups || [])}

When the user asks you to change, improve, or customize their website (e.g. changing GPA, altering their theme to 'executive' | 'modern' | 'minimal' | 'tech' | 'creative', picking an accent color like 'amber' | 'emerald' | 'blue' | 'indigo' | 'violet' | 'rose' | 'cyan', rewording their summary, updating skills, editing achievements):
1. Provide an encouraging, executive-grade explanation in the "reply" property.
2. In the "updates" property, include ONLY the JSON fields that need to be modified in their CVProfile. Valid fields include:
   - "theme": 'executive' | 'modern' | 'minimal' | 'tech' | 'creative'
   - "accentColor": 'amber' | 'emerald' | 'blue' | 'indigo' | 'violet' | 'rose' | 'cyan' | 'slate'
   - "title": string
   - "tagline": string
   - "summary": string
   - "education": array of Education objects (with gpa, degree, institution, honors)
   - "metrics": array of HighlightMetric objects
   - "experiences": array of Experience objects
   - "skillGroups": array of SkillGroup objects

Format your ENTIRE output as valid JSON:
{
  "reply": "I have updated your GPA to 3.9 and refreshed your metrics.",
  "updates": {
    "education": [ ... ],
    "metrics": [ ... ]
  }
}`;

    let aiResponseText = '';
    let usedModel = '';

    // Try cascading through free models on OpenRouter
    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://cv-to-web.pages.dev',
            'X-Title': 'CVtoWeb AI Assistant',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              ...messages.slice(-6),
            ],
            max_tokens: 800,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            aiResponseText = content;
            usedModel = model;
            break;
          }
        }
      } catch (err) {
        console.warn(`Model ${model} failed, trying next...`, err);
      }
    }

    let parsedReply = '';
    let parsedUpdates: Partial<CVProfile> = {};

    if (aiResponseText) {
      try {
        // Extract JSON if wrapped in markdown code fence
        const jsonMatch = aiResponseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, aiResponseText];
        const jsonString = jsonMatch[1] || aiResponseText;
        const parsed = JSON.parse(jsonString.trim());
        parsedReply = parsed.reply || 'Your CV portfolio has been updated according to your preferences.';
        parsedUpdates = parsed.updates || {};
      } catch {
        // If not valid JSON, use response text as conversational reply and apply local intent
        parsedReply = aiResponseText;
        const local = processLocalIntent(lastUserMessage, profile);
        if (local) {
          parsedUpdates = local.updates;
        }
      }
    } else {
      // Upstream models rate limited -> use smart local intent processor
      const local = processLocalIntent(lastUserMessage, profile);
      if (local) {
        parsedReply = local.reply;
        parsedUpdates = local.updates;
      } else {
        parsedReply = `I've analyzed your request: "${lastUserMessage}". To apply custom changes, you can tell me to "Change my GPA to 3.9", "Switch to Modern Tech theme", "Change color to Emerald", or "Rewrite my summary to be more punchy".`;
      }
    }

    // Merge updates cleanly into the profile
    const updatedProfile: CVProfile = {
      ...profile,
      ...parsedUpdates,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      reply: parsedReply,
      updates: parsedUpdates,
      updatedProfile,
      modelUsed: usedModel || 'heuristic-engine',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'AI Processing error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
