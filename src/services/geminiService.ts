/**
 * Gemini AI Culinary Intelligence & Precise Research Service
 * Integrates Google Gemini Flash API using VITE_GEMINI_API_KEY environment variable.
 */

const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

// Primary and fallback models for high availability
const MODEL_CASCADE = [
  'gemini-flash-lite-latest',
  'gemini-flash-latest',
  'gemini-2.5-flash-lite',
  'gemini-3.5-flash',
];

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
  error?: {
    message?: string;
    code?: number;
    status?: string;
  };
}

/**
 * Execute raw Gemini content generation request with model fallback
 */
async function callGemini(prompt: string, systemInstruction?: string): Promise<string> {
  let lastError: string | null = null;

  for (const model of MODEL_CASCADE) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      
      const payload: any = {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2, // Low temperature for high precision scientific research
          topP: 0.8,
          maxOutputTokens: 1000,
        },
      };

      if (systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const data: GeminiResponse = await res.json();

      if (res.ok && data.candidates && data.candidates.length > 0) {
        const text = data.candidates[0].content?.parts?.[0]?.text;
        if (text && text.trim().length > 0) {
          return text.trim();
        }
      }

      if (data.error) {
        lastError = `${model}: ${data.error.message || data.error.status}`;
      }
    } catch (e: any) {
      lastError = `${model}: ${e.message}`;
    }
  }

  throw new Error(lastError || 'All Gemini models unavailable.');
}

export interface DetailedAIResearch {
  verdictTitle: string;
  summary: string;
  biochemicalBreakdown: { title: string; detail: string }[];
  thermalStabilityNotes: string;
  nutritionalTradeoffs: string;
  recommendedKitchenApplication: string;
  isAiGenerated: boolean;
}

/**
 * Ask Gemini for precise culinary research on any cooking or nutrition question
 */
export async function getPreciseGeminiResearch(question: string): Promise<DetailedAIResearch> {
  const systemPrompt = `You are PantryVerdict's Chief Food Chemist & Culinary Scientist. 
Analyze ingredients with extreme precision: exact smoke points (°C & °F), fatty acid ratios (MUFA, PUFA, SFA, Omega-6 to Omega-3), thermal degradation (acrolein formation, polar compounds), processing methods (cold-pressed vs solvent extracted, NOVA groups), and exact culinary techniques.
Respond strictly in JSON format with this exact structure:
{
  "verdictTitle": "Concise Scientific Verdict Title",
  "summary": "2-3 sentences explaining the core culinary science fact clearly.",
  "biochemicalBreakdown": [
    {"title": "Factor 1", "detail": "Detailed explanation with chemistry and metrics"},
    {"title": "Factor 2", "detail": "Detailed explanation with chemistry and metrics"}
  ],
  "thermalStabilityNotes": "Exact smoke point and heat breakdown analysis.",
  "nutritionalTradeoffs": "Health considerations, cholesterol, vitamins, or additives.",
  "recommendedKitchenApplication": "Specific cooking guidance (e.g. Deep frying vs high tadka vs raw finish)."
}`;

  try {
    const rawText = await callGemini(
      `Conduct precise culinary and nutritional research on: "${question}"`,
      systemPrompt
    );

    // Extract JSON if wrapped in markdown code fence
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, rawText];
    const parsed = JSON.parse(jsonMatch[1] || rawText);

    return {
      verdictTitle: parsed.verdictTitle || 'Scientific Culinary Analysis',
      summary: parsed.summary || rawText,
      biochemicalBreakdown: parsed.biochemicalBreakdown || [],
      thermalStabilityNotes: parsed.thermalStabilityNotes || 'See smoke point guidelines for thermal limits.',
      nutritionalTradeoffs: parsed.nutritionalTradeoffs || 'Match fats to metabolic goals.',
      recommendedKitchenApplication: parsed.recommendedKitchenApplication || 'Follow culinary temperature thresholds.',
      isAiGenerated: true,
    };
  } catch (err) {
    console.warn('Gemini live call fallback to deterministic science:', err);
    // Fallback format
    return {
      verdictTitle: `Culinary Research: ${question}`,
      summary: `Research indicates that matching heat stability (smoke point) to cooking temperature prevents the formation of harmful polar compounds. Cold-pressed staples preserve native antioxidants, whereas ultra-processed refined staples undergo chemical bleaching and deodorization.`,
      biochemicalBreakdown: [
        {
          title: 'Lipid Stability Under Heat',
          detail: 'High monounsaturated and saturated fatty acids resist thermal oxidation, whereas high polyunsaturated oils break down into aldehydes and peroxides when overheated.',
        },
        {
          title: 'Extraction Integrity (NOVA)',
          detail: 'Cold-pressed staples retain natural tocopherols and phytonutrients. Solvent extraction uses chemical hexane and synthetic antifoams (E900).',
        },
      ],
      thermalStabilityNotes: 'Always cook below the smoke point of your cooking medium to avoid acrolein formation.',
      nutritionalTradeoffs: 'Choose unrefined, clean-label pantry essentials for minimal processing exposure.',
      recommendedKitchenApplication: 'Use high-smoke-point oils (>220°C) for deep frying; reserve cold-pressed oils for sautéing and finishing.',
      isAiGenerated: false,
    };
  }
}

/**
 * Conduct deep side-by-side scientific comparison for 2 to 4 ingredients
 */
export async function getGeminiComparisonVerdict(ingredientNames: string[]): Promise<string> {
  const prompt = `Perform an objective, expert food-science comparison of these cooking ingredients: ${ingredientNames.join(', ')}.
Address:
1. Smoke point and thermal oxidation resistance (which is best for high heat vs raw use).
2. Fatty acid balance (Omega 3:6, MUFA, saturated fat) or protein density.
3. Processing quality (NOVA group, cold-pressed vs refined).
4. Direct recommendation: for what exact dish or cooking style should each be used?
Keep it concise, editorial, and authoritative (around 150-200 words).`;

  try {
    return await callGemini(prompt, 'You are an elite food scientist and culinary chemist.');
  } catch (err) {
    return `Comparison of ${ingredientNames.join(' and ')}: High heat cooking demands ingredients with high smoke points and low polyunsaturated fatty acid degradation. Prioritize unrefined cold-pressed oils and traditional fats for clean-label integrity, reserving delicate oils for dressings and finishing drizzles.`;
  }
}
