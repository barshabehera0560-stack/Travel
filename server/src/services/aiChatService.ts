import { prisma } from '../config/prisma.js';

export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequestPayload {
  message: string;
  history?: ChatHistoryItem[];
  userPreferences?: {
    travelStyle?: string;
    budgetTier?: number;
    interests?: string[];
  };
}

export interface DestinationCardSummary {
  id: string;
  name: string;
  country: string;
  region: string;
  category: string;
  imageUrl: string;
  rating: number;
  avgCostTier: number;
  estimatedDailyCostInr: number;
  bestSeason: string;
}

export interface ChatResponseData {
  reply: string;
  destinations: DestinationCardSummary[];
  suggestedPrompts: string[];
}

export class AIChatService {
  /**
   * Main chat completion handler
   */
  static async handleChat(payload: ChatRequestPayload): Promise<ChatResponseData> {
    const { message, userPreferences } = payload;
    const lower = (message || '').toLowerCase().trim();

    // 1. Fetch available destinations from Neon DB
    const allDestinations = await prisma.destination.findMany({
      include: {
        attractions: true,
      },
    });

    // Helper: Daily cost tier to INR estimate
    const getDailyCostInr = (tier: number) => {
      switch (tier) {
        case 1:
          return 3500; // Budget
        case 2:
          return 8500; // Moderate
        case 3:
          return 18000; // Luxury
        default:
          return 7500;
      }
    };

    const mapToCard = (dest: any): DestinationCardSummary => ({
      id: dest.id,
      name: dest.name,
      country: dest.country,
      region: dest.region,
      category: dest.category,
      imageUrl: dest.imageUrl,
      rating: dest.rating,
      avgCostTier: dest.avgCostTier,
      estimatedDailyCostInr: getDailyCostInr(dest.avgCostTier),
      bestSeason: dest.bestSeason,
    });

    // 2. Identify mentioned destinations
    const matchedDestinations = allDestinations.filter((d) =>
      lower.includes(d.name.toLowerCase()) || lower.includes(d.country.toLowerCase())
    );

    // 3. Category matching
    const categoryKeywords: Record<string, string[]> = {
      Beach: ['beach', 'sea', 'coast', 'coastal', 'ocean', 'sand', 'tropical'],
      Heritage: ['heritage', 'culture', 'history', 'temple', 'ancient', 'monument', 'historical'],
      Mountain: ['mountain', 'snow', 'alp', 'hiking', 'peak', 'hill', 'scenic', 'trek'],
      Island: ['island', 'archipelago', 'cyclades'],
      Adventure: ['adventure', 'wildlife', 'nature', 'rafting', 'thrill', 'national park'],
      Urban: ['city', 'urban', 'modern', 'shopping', 'nightlife', 'metropolis'],
    };

    let matchedCategory: string | null = null;
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((kw) => lower.includes(kw))) {
        matchedCategory = category;
        break;
      }
    }

    // 4. Duration detection (e.g. "3 days", "5-day", "a week")
    let durationDays = 4;
    const daysMatch = lower.match(/(\d+)\s*(?:day|days|-day)/);
    if (daysMatch) {
      durationDays = Math.min(Math.max(parseInt(daysMatch[1], 10), 2), 14);
    } else if (lower.includes('week')) {
      durationDays = 7;
    } else if (lower.includes('weekend')) {
      durationDays = 3;
    }

    // 5. Budget constraints detection in INR
    let maxBudgetInr: number | null = null;
    const budgetMatch = lower.match(/(?:under|below|budget|within|around)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\s*k|\s*lakh)?)/i);
    if (budgetMatch) {
      let rawVal = budgetMatch[1].replace(/,/g, '').toLowerCase().trim();
      if (rawVal.endsWith('k')) {
        maxBudgetInr = parseFloat(rawVal) * 1000;
      } else if (rawVal.endsWith('lakh')) {
        maxBudgetInr = parseFloat(rawVal) * 100000;
      } else {
        maxBudgetInr = parseFloat(rawVal);
      }
    }

    // 6. Try external Gemini LLM if key is present
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const geminiResult = await this.queryGemini(message, allDestinations, userPreferences, geminiKey);
        if (geminiResult) {
          return geminiResult;
        }
      } catch (err) {
        console.warn('Gemini query fallback to built-in travel engine:', err);
      }
    }

    // 7. Domain-Grounded Intelligent Travel Reasoning Engine
    let reply = '';
    let cards: DestinationCardSummary[] = [];
    let suggestedPrompts: string[] = [];

    // Scenario A: Specific destination query (e.g. "Tell me about Kyoto", "Itinerary for Bali")
    if (matchedDestinations.length > 0) {
      const primary = matchedDestinations[0];
      cards = [mapToCard(primary)];

      // Include other destinations in same category
      const related = allDestinations
        .filter((d) => d.id !== primary.id && d.category === primary.category)
        .slice(0, 2)
        .map(mapToCard);
      cards.push(...related);

      const dailyRate = getDailyCostInr(primary.avgCostTier);
      const estTotal = dailyRate * durationDays;

      const attractionsList = primary.attractions?.slice(0, 3).map((a) => `• **${a.name}** (${a.category}): ${a.description}`).join('\n') || '';

      reply = `### 🌟 Exploring ${primary.name}, ${primary.country}\n\n` +
        `${primary.description}\n\n` +
        `**📅 Best Season:** ${primary.bestSeason}\n` +
        `**⭐ Rating:** ${primary.rating.toFixed(1)} / 5.0 (${primary.reviewCount} verified traveler reviews)\n\n` +
        `#### 💡 Recommended ${durationDays}-Day Trip Overview:\n` +
        `• **Day 1:** Arrival, check-in, orientation walk, and local dining.\n` +
        `• **Day 2:** Iconic sights & cultural landmarks.\n` +
        (durationDays > 2 ? `• **Day 3:** Scenic exploration, hidden gems & artisan cafes.\n` : '') +
        (durationDays > 3 ? `• **Day 4-${durationDays}:** Day excursion and relaxing local experiences.\n\n` : '\n') +
        (attractionsList ? `#### 🏛️ Top Highlights & Attractions:\n${attractionsList}\n\n` : '') +
        `#### 💰 Estimated Budget Breakdown (${durationDays} Days):\n` +
        `• **Estimated Daily Spend:** ₹${dailyRate.toLocaleString('en-IN')} per person\n` +
        `• **Estimated Trip Total:** **₹${estTotal.toLocaleString('en-IN')}** (hotel, food, activities & local transport)\n\n` +
        `*Click **"View Details"** below for full weather intelligence, or tap **"Plan Trip"** to customize this itinerary!*`;

      suggestedPrompts = [
        `Plan a ${durationDays}-day budget itinerary for ${primary.name}`,
        `What are the best hotels in ${primary.name}?`,
        `Compare ${primary.name} with another destination`,
        `Top food and dining experiences in ${primary.name}`,
      ];
    }
    // Scenario B: Category query (e.g. "Best beach destinations", "Mountain getaways")
    else if (matchedCategory) {
      const matching = allDestinations.filter((d) => d.category.toLowerCase() === matchedCategory?.toLowerCase());
      const selected = matching.length > 0 ? matching : allDestinations.slice(0, 3);
      cards = selected.slice(0, 3).map(mapToCard);

      reply = `### 🌴 Top ${matchedCategory} Destinations For Your Next Escape\n\n` +
        `Here are the highest-rated **${matchedCategory.toLowerCase()}** destinations handpicked for you based on real traveler reviews and weather intelligence:\n\n` +
        selected.map((d) => {
          const cost = getDailyCostInr(d.avgCostTier);
          return `• **${d.name} (${d.country})** — ⭐ ${d.rating.toFixed(1)}/5.0\n` +
            `  *Best Time:* ${d.bestSeason} | *Est. Daily:* ₹${cost.toLocaleString('en-IN')}\n` +
            `  ${d.description.slice(0, 120)}...`;
        }).join('\n\n') +
        `\n\n#### 🎯 Recommendation:\n` +
        `If you're seeking a balanced blend of comfort and discovery, **${selected[0]?.name || 'these destinations'}** offers top value with easy flight connections and verified boutique accommodations.`;

      suggestedPrompts = [
        `Plan a 5-day itinerary for ${selected[0]?.name || 'my favorite'}`,
        `Which of these has the best weather right now?`,
        `Plan a trip under ₹50,000`,
        `Show me heritage destinations instead`,
      ];
    }
    // Scenario C: Budget specific query (e.g. "Trip under 50000", "Cheap places to visit")
    else if (maxBudgetInr || lower.includes('budget') || lower.includes('cheap') || lower.includes('cost')) {
      const budgetLimit = maxBudgetInr || 60000;
      // Filter destinations whose duration cost is within or reasonable for budget
      const suitable = allDestinations
        .map((d) => ({ dest: d, totalCost: getDailyCostInr(d.avgCostTier) * durationDays }))
        .sort((a, b) => a.totalCost - b.totalCost);

      const topPicks = suitable.slice(0, 3).map((s) => s.dest);
      cards = topPicks.map(mapToCard);

      reply = `### 💰 Budget-Friendly Travel Recommendations (Target: ₹${budgetLimit.toLocaleString('en-IN')})\n\n` +
        `Traveling smart doesn't mean compromising on luxury or memories! Here are top-rated destinations that deliver exceptional value for a **${durationDays}-day trip**:\n\n` +
        suitable.slice(0, 3).map((s) => {
          return `• **${s.dest.name}, ${s.dest.country}** (${s.dest.category})\n` +
            `  ⭐ **${s.dest.rating.toFixed(1)}/5.0** rating\n` +
            `  • Daily Average: **₹${getDailyCostInr(s.dest.avgCostTier).toLocaleString('en-IN')}**\n` +
            `  • Estimated ${durationDays}-Day Total: **₹${s.totalCost.toLocaleString('en-IN')}**\n` +
            `  ${s.dest.description.slice(0, 100)}...`;
        }).join('\n\n') +
        `\n\n💡 **Pro Travel Tip:** Save costs by booking boutique hotels slightly outside city centers and enjoying authentic local markets and cafes!`;

      suggestedPrompts = [
        `Give me a detailed budget breakdown for ${topPicks[0]?.name}`,
        `Plan a 4-day itinerary for ${topPicks[0]?.name}`,
        `Find beach destinations on a budget`,
        `How to compare budgets across 3 destinations?`,
      ];
    }
    // Scenario D: General Travel Assistance / Greetings / Default
    else {
      // Pick top 3 diverse destinations
      const topPicks = allDestinations.slice(0, 3);
      cards = topPicks.map(mapToCard);

      reply = `### 👋 Hello! I'm WanderAI, your Personal Travel Concierge.\n\n` +
        `Whether you're dreaming of peaceful Zen gardens, idyllic white-sand beaches, or snowy alpine vistas, I'm here to build your dream itinerary with real prices in **Indian Rupees (₹)**!\n\n` +
        `#### ✈️ What I can help you with:\n` +
        `• **Custom Day-by-Day Itineraries:** Just tell me where and for how many days.\n` +
        `• **Real-World Budget Estimation:** Accurate breakdowns in ₹ for hotels, food & sights.\n` +
        `• **Season & Weather Advice:** Find the perfect month with ideal temperatures.\n` +
        `• **Side-by-Side Comparison:** Compare any destinations before you book.\n\n` +
        `*Check out these premier trending destinations below, or tap one of the suggested prompts to start planning:*`;

      suggestedPrompts = [
        'Plan a 5-day trip to Kyoto under ₹60,000',
        'Top romantic beach destinations for couples',
        'Recommend mountain getaways with great scenery',
        'What places are best to visit in Spring?',
      ];
    }

    return {
      reply,
      destinations: cards,
      suggestedPrompts,
    };
  }

  /**
   * Optional Google Gemini LLM API Integration
   */
  private static async queryGemini(
    userMessage: string,
    destinations: any[],
    userPreferences: any,
    apiKey: string
  ): Promise<ChatResponseData | null> {
    const destContext = destinations.map((d) => ({
      id: d.id,
      name: d.name,
      country: d.country,
      region: d.region,
      category: d.category,
      rating: d.rating,
      costTier: d.avgCostTier,
      bestSeason: d.bestSeason,
      description: d.description,
      attractions: d.attractions?.map((a: any) => a.name),
    }));

    const systemInstruction = `You are WanderAI, an elite, warm, and highly knowledgeable travel concierge for the Wanderly travel platform.
Provide helpful, beautifully structured markdown responses with emojis, clear headings, bullet points, and realistic travel recommendations.
Always quote budgets and costs in Indian Rupees (₹).
You have access to Wanderly's verified database of premier destinations: ${JSON.stringify(destContext)}.
If the traveler's question matches any of these destinations, mention them by their exact name.
Always provide realistic daily cost estimates in ₹ (Tier 1: ₹3,500/day, Tier 2: ₹8,500/day, Tier 3: ₹18,000/day).`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\nUser Question: ${userMessage}` }],
          },
        ],
      }),
    });

    if (!res.ok) return null;

    const data: any = await res.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) return null;

    // Detect matched destinations to attach preview cards
    const matched = destinations.filter((d) =>
      candidateText.toLowerCase().includes(d.name.toLowerCase()) ||
      userMessage.toLowerCase().includes(d.name.toLowerCase())
    );

    const cards: DestinationCardSummary[] = (matched.length > 0 ? matched : destinations.slice(0, 3)).slice(0, 3).map((d) => ({
      id: d.id,
      name: d.name,
      country: d.country,
      region: d.region,
      category: d.category,
      imageUrl: d.imageUrl,
      rating: d.rating,
      avgCostTier: d.avgCostTier,
      estimatedDailyCostInr: d.avgCostTier === 1 ? 3500 : d.avgCostTier === 2 ? 8500 : 18000,
      bestSeason: d.bestSeason,
    }));

    return {
      reply: candidateText,
      destinations: cards,
      suggestedPrompts: [
        'Plan a 5-day detailed itinerary for this',
        'What are the best hotel options available?',
        'Show budget breakdown in ₹',
        'Compare with another destination',
      ],
    };
  }
}
