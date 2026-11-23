import { Ingredient } from '../types/ingredient';
import { CULINARY_STAPLES } from './culinaryData';

export interface QAResult {
  question: string;
  verdictTitle: string;
  directAnswer: string;
  topPickNames: string[];
  suggestedIngredientIds: string[];
  keyFactors: { title: string; explanation: string }[];
  cautions?: string;
}

export const CURATED_QA_TOPICS: { queryPatterns: string[]; response: QAResult }[] = [
  {
    queryPatterns: ['deep fry', 'frying', 'best oil for frying', 'deep frying oil', 'high heat oil'],
    response: {
      question: 'Which oil or fat is best for deep frying?',
      verdictTitle: 'High Smoke Point (>220°C) + Thermal Stability Win',
      directAnswer: 'For deep frying, you need oils with a smoke point above 220°C (428°F) that do not break down into toxic polar compounds or trans fats at 180°C.',
      topPickNames: ['Groundnut Oil (Wood-Pressed)', 'Rice Bran Oil (Physically Refined)', 'A2 Gir Cow Ghee', 'Avocado Oil'],
      suggestedIngredientIds: ['oil-groundnut-cold-pressed', 'oil-rice-bran-physically-refined', 'ghee-a2-desi-cow-bilona', 'oil-avocado-unrefined'],
      keyFactors: [
        { title: 'Thermal Oxidation', explanation: 'High monounsaturated oils (like Groundnut & Avocado) resist oxidative rancidity far better than high-polyunsaturated oils (like regular Sunflower or Soybean).' },
        { title: 'Smoke Point Threshold', explanation: 'Deep frying standard is 175°C–190°C. Oils must sit safely above 220°C to prevent smoking and acrolein formation.' },
      ],
      cautions: 'Avoid Extra Virgin Olive Oil and unclarified Dairy Butter for deep frying due to low smoke points and rapid degradation.',
    },
  },
  {
    queryPatterns: ['refined vs cold pressed', 'cold pressed vs refined', 'kachi ghani vs refined', 'mustard oil vs refined'],
    response: {
      question: 'What is the real difference between Refined and Cold-Pressed oils?',
      verdictTitle: 'Mechanical Extraction vs. Chemical Hexane Solvents',
      directAnswer: 'Cold-pressed (Kachi Ghani / Wood-pressed) oils are pressed below 50°C without chemicals, preserving natural antioxidants, vitamin E, and essential fatty acids. Refined oils are solvent-extracted with hexane, bleached with Fuller earth, deodorized at 240°C, and often injected with synthetic TBHQ (E319) and dimethylpolysiloxane (E900).',
      topPickNames: ['Kachi Ghani Mustard Oil', 'Groundnut Oil (Wood-Pressed)', 'Extra Virgin Olive Oil'],
      suggestedIngredientIds: ['oil-mustard-kachi-ghani', 'oil-groundnut-cold-pressed', 'oil-evoo-cold-pressed', 'oil-sunflower-refined'],
      keyFactors: [
        { title: 'Processing (NOVA)', explanation: 'Cold-pressed oils are NOVA Group 2 (pure culinary ingredients). Refined commercial oils are NOVA Group 4 (ultra-processed).' },
        { title: 'Antioxidants & Flavor', explanation: 'Cold-pressed oils retain phytonutrients, polyphenols, and distinct natural aromas.' },
      ],
      cautions: 'While cold-pressed oils are nutritionally superior, match the smoke point to your cooking method (e.g., reserve EVOO for low heat, use mustard or groundnut for high heat).',
    },
  },
  {
    queryPatterns: ['ghee vs butter', 'butter vs ghee', 'is ghee healthier than butter', 'makhan vs ghee'],
    response: {
      question: 'Is Desi Ghee healthier than Butter for everyday cooking?',
      verdictTitle: 'Ghee Wins on Heat Stability; White Butter Wins on Probiotics',
      directAnswer: 'Desi Ghee is clarified butterfat where milk solids (lactose and casein) are simmered and strained out. This elevates its smoke point to a staggering 252°C (485°F) versus just 150°C for butter, making Ghee completely lactose-free and vastly superior for hot cooking.',
      topPickNames: ['A2 Gir Cow Desi Ghee (Bilona)', 'Desi White Butter (Makhan)', 'Pasteurized Salted Table Butter'],
      suggestedIngredientIds: ['ghee-a2-desi-cow-bilona', 'butter-cultured-white-makhan', 'butter-salted-table'],
      keyFactors: [
        { title: 'Smoke Point Divergence', explanation: 'Butter burns at 150°C due to browning milk solids. Ghee can be safely heated to 252°C without charring.' },
        { title: 'Lactose & Casein', explanation: 'Traditional bilona ghee is virtually free from lactose and casein, making it gut-friendly even for milk-sensitive individuals.' },
        { title: 'Sodium Content', explanation: 'Commercial table butter contains 820mg sodium per 100g, whereas pure Ghee is naturally sodium-free.' },
      ],
      cautions: 'Cultured white butter (Makhan) is great for topping hot rotis, but do not use it for high-temperature tadka.',
    },
  },
  {
    queryPatterns: ['sweetener', 'sugar alternative', 'lowest glycemic', 'jaggery vs sugar', 'honey vs sugar'],
    response: {
      question: 'Which everyday sweetener has the lowest glycemic impact?',
      verdictTitle: 'Unfiltered Raw Honey & Desi Khand Beat Refined White Sugar',
      directAnswer: 'Refined white table sugar is 100% stripped sucrose with a high glycemic index (GI 65) and zero micronutrients. While all caloric sweeteners must be consumed mindfully, Raw Forest Honey (GI 58) and Desi Khand provide trace minerals and gentler blood glucose spikes.',
      topPickNames: ['Raw Unfiltered Forest Honey', 'Organic Desi Jaggery', 'Desi Khand', 'Refined White Table Sugar'],
      suggestedIngredientIds: ['sweet-raw-unfiltered-honey', 'sweet-jaggery-organic-gur', 'sweet-desi-khand-raw', 'sweet-white-table-sugar'],
      keyFactors: [
        { title: 'Mineral Content', explanation: 'Organic Jaggery contains 11mg iron per 100g plus potassium and magnesium; white sugar has zero.' },
        { title: 'Enzyme Activity', explanation: 'Raw honey contains active bee enzymes (invertase and glucose oxidase), but should never be heated beyond 40°C.' },
      ],
      cautions: 'Jaggery and honey still contain fructose and glucose; diabetics should monitor total carbohydrate load.',
    },
  },
  {
    queryPatterns: ['flour', 'atta', 'high protein flour', 'weight loss flour', 'maida vs atta', 'besan'],
    response: {
      question: 'Which flour provides the highest protein and lowest glycemic index?',
      verdictTitle: 'Pure Besan (Chana Dal) & Almond Flour Lead the Protein Ranks',
      directAnswer: 'Pure Chana Dal Besan (22.4g protein, GI 35) and Blanched Almond Flour (21.4g protein, GI 15) offer more than double the protein of standard Chakki Atta (12.1g) and quadruple that of refined Maida (10.3g stripped).',
      topPickNames: ['Pure Chana Dal Besan', 'Superfine Blanched Almond Flour', 'Chakki Fresh Whole Wheat Atta', 'Sprouted Ragi Flour'],
      suggestedIngredientIds: ['flour-besan-gram-flour', 'flour-almond-blanched', 'flour-chakki-whole-wheat-atta', 'flour-refined-maida'],
      keyFactors: [
        { title: 'Dietary Fiber', explanation: 'Chakki Atta and Ragi provide 11g+ fiber per 100g; Maida has less than 2.7g.' },
        { title: 'Processing & Bran', explanation: 'Maida is chemically bleached (E928) with the bran and germ removed, triggering rapid insulin spikes.' },
      ],
    },
  },
  {
    queryPatterns: ['heart health', 'cholesterol', 'healthy fats', 'best oil for heart', 'omega 3'],
    response: {
      question: 'Which cooking oil is best for heart health and cholesterol balance?',
      verdictTitle: 'High MUFA (Oleic Acid) + Balanced Omega-6:3 Ratio',
      directAnswer: 'Heart-healthy oils feature high Monounsaturated Fatty Acids (MUFA) and a balanced Omega-6 to Omega-3 ratio. Cold-Pressed Extra Virgin Olive Oil and Kachi Ghani Mustard Oil (1.5:1 ratio) excel here. Rice Bran Oil also contains 10,000 ppm natural Gamma Oryzanol to help regulate LDL cholesterol.',
      topPickNames: ['Extra Virgin Olive Oil', 'Kachi Ghani Mustard Oil', 'Rice Bran Oil (Physically Refined)'],
      suggestedIngredientIds: ['oil-evoo-cold-pressed', 'oil-mustard-kachi-ghani', 'oil-rice-bran-physically-refined', 'oil-sunflower-refined'],
      keyFactors: [
        { title: 'Omega-6 Hazard', explanation: 'Commercial sunflower and corn oils have staggering 300:1+ omega-6 to 3 ratios, promoting chronic vascular inflammation.' },
        { title: 'Oryzanol & Polyphenols', explanation: 'Oryzanol in Rice Bran and polyphenols in Olive Oil protect endothelial cell linings.' },
      ],
    },
  },
];

export function answerCulinaryQuery(rawQuery: string): QAResult {
  const query = rawQuery.toLowerCase().trim();

  // 1. Try exact or fuzzy pattern match in curated topics
  for (const topic of CURATED_QA_TOPICS) {
    if (topic.queryPatterns.some(pattern => query.includes(pattern) || pattern.includes(query))) {
      return topic.response;
    }
  }

  // 2. Keyword fallback match across ingredients in database
  const matchingStaples = CULINARY_STAPLES.filter(s => 
    s.name.toLowerCase().includes(query) ||
    s.category.toLowerCase().includes(query) ||
    s.culinaryNotes.toLowerCase().includes(query)
  );

  if (matchingStaples.length > 0) {
    const topPicks = matchingStaples.slice(0, 3);
    return {
      question: `Insights for "${rawQuery}"`,
      verdictTitle: `Found ${matchingStaples.length} Verified Pantry Matches`,
      directAnswer: `PantryVerdict analyzed the database for "${rawQuery}". Here are the top verified staples matching your culinary criteria, complete with smoke points, processing grades, and macro profiles.`,
      topPickNames: topPicks.map(p => p.name),
      suggestedIngredientIds: topPicks.map(p => p.id),
      keyFactors: [
        { title: 'Processing Transparency', explanation: `Top result is classified as ${topPicks[0].novaGroup === 1 ? 'NOVA 1 (Unprocessed Staple)' : topPicks[0].novaGroup === 2 ? 'NOVA 2 (Culinary Ingredient)' : 'NOVA 3/4 (Processed)'}.` },
        { title: 'Extraction Method', explanation: topPicks[0].extractionMethod },
      ],
      cautions: topPicks[0].smokePoint ? `Smoke point is ${topPicks[0].smokePoint.celsius}°C (${topPicks[0].smokePoint.fahrenheit}°F) for ${topPicks[0].smokePoint.recommendedUsage}.` : undefined,
    };
  }

  // 3. General Default Response
  return {
    question: rawQuery,
    verdictTitle: 'PantryVerdict Culinary Intelligence Guide',
    directAnswer: 'You can compare smoke points, processing levels (NOVA), and true unit cost across Oils, Ghee, Flours, Grains, Salts, and Sweeteners. Click any quick-question chip above or type terms like "best oil for frying", "ghee vs butter", or "flour for protein".',
    topPickNames: ['Kachi Ghani Mustard Oil', 'A2 Gir Cow Desi Ghee', 'Pure Chana Dal Besan'],
    suggestedIngredientIds: ['oil-mustard-kachi-ghani', 'ghee-a2-desi-cow-bilona', 'flour-besan-gram-flour'],
    keyFactors: [
      { title: 'Heat Stability Rule', explanation: 'Always match oil smoke points to your cooking technique (Deep Frying: >220°C; Sautéing: >190°C; Dressing: <160°C).' },
      { title: 'Clean Label Rule', explanation: 'Prioritize single-ingredient NOVA 1 & 2 staples over chemically refined blends with synthetic antifoams.' },
    ],
  };
}
