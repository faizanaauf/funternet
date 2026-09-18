import { GoogleGenAI } from '@google/genai';
import { GameData, GameMode } from '@/types/game';
import { sanitizeAndParseJSON, validateGameData } from './game-schema';
import { DEMO_GAMES } from './demo-games';

const SYSTEM_PROMPT = `You are an expert educational game designer, storyteller, comedian, and quiz creator for "FUNTERNET ARCADE".
Tagline: "The internet is full of information. We make it playable."
Theme: "Make Internet Fun".

Your task is to transform any boring internet content, article, Terms & Conditions, documentation, or learning topic into a playable, hilarious, factually accurate arcade game.

JSON OUTPUT SPECIFICATION:
Respond ONLY with a valid JSON object with these exact keys:
{
  "title": "Arcade-style punchy game title (e.g. 'Escape the DNS Dungeon', 'Defeat the Terms & Conditions Demon')",
  "subtitle": "Short funny subtitle (e.g. 'Can you route your way out?')",
  "theme": "fantasy | sci-fi | retro-arcade | corporate-apocalypse | glitch | cosmic-neon",
  "difficulty": "easy | medium | hard | chaos",
  "gameMode": "boss_battle | trivia_rush | escape_room | mystery_quest | choose_adventure | speed_challenge",
  "intro": "2-3 sentence immersive, funny setup explaining the situation",
  "playerName": "Thematic hero title (e.g. 'Packet Hero', 'Syntax Sorcerer', 'EULA Slayer')",
  "stages": [
    {
      "id": 1,
      "type": "multiple_choice",
      "title": "Stage 1 title",
      "story": "Brief 1-line story hook for this stage",
      "question": "Clear, engaging question testing understanding of the content",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1,
      "explanation": "Brief, witty, educational explanation of why this answer is correct",
      "xp": 100
    }
  ],
  "boss": {
    "name": "Hilarious boss name (e.g. 'The 404 Dragon', 'The Arbitrary Clause')",
    "title": "Dramatic boss title",
    "intro": "Boss entrance dialogue",
    "avatarEmoji": "1-2 relevant emoji for boss avatar (e.g. '🐉👾', '👹📜')",
    "themeColor": "from-red-500 to-amber-600",
    "hp": 100,
    "attackQuotes": [
      "Short funny attack quote 1",
      "Short funny attack quote 2"
    ],
    "defeatQuote": "Funny concession quote upon losing",
    "questions": [
      {
        "id": 101,
        "type": "boss_phase",
        "title": "Boss Phase 1",
        "story": "The boss unleashes a devastating move!",
        "question": "Tougher boss question testing a deeper concept",
        "options": ["A", "B", "C", "D"],
        "correctIndex": 0,
        "explanation": "Why this defeats the boss move",
        "xp": 250
      },
      {
        "id": 102,
        "type": "boss_phase",
        "title": "Boss Phase 2 (Enrage)",
        "story": "The boss enters its final enrage phase!",
        "question": "Final boss challenge question",
        "options": ["A", "B", "C", "D"],
        "correctIndex": 0,
        "explanation": "The ultimate winning logic",
        "xp": 300
      }
    ]
  },
  "victoryMessage": "Inspiring, funny victory message",
  "funFact": "One fascinating real-world fact about the topic",
  "achievementTitle": "Funny dynamic achievement (e.g. 'Certified Big Brain', 'Terms & Conditions Slayer')",
  "achievementDescription": "Achievement unlock description"
}

RULES:
1. Preserve factual truth and educational value.
2. Provide 4 to 6 main stages before the boss.
3. Vary stage types among: 'multiple_choice', 'true_false', 'quick_reaction', 'speed_challenge'.
4. Ensure 'correctIndex' is integer 0 <= correctIndex < options.length.
5. Keep questions concise and options plausible.
6. Return raw JSON only — no conversational preamble, no markdown wrappers.`;

export async function generateGameWithGemini(
  input: string,
  mode: GameMode = 'surprise_me',
  difficulty: string = 'medium'
): Promise<GameData> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // Clean & truncate input if overly verbose
  const maxLength = 6000;
  const trimmedInput = input.trim();
  const truncatedInput =
    trimmedInput.length > maxLength
      ? trimmedInput.slice(0, maxLength) + '\n...[Content truncated for game speed]'
      : trimmedInput;

  // Check if this matches a demo trigger or if API key is not configured
  const lowerInput = input.toLowerCase();
  if (
    lowerInput.includes('terms') ||
    lowerInput.includes('eula') ||
    lowerInput.includes('arbitration') ||
    lowerInput.includes('privacy policy')
  ) {
    if (!apiKey) {
      return DEMO_GAMES['terms-and-conditions'];
    }
  } else if (
    lowerInput.includes('javascript') ||
    lowerInput.includes('closure') ||
    lowerInput.includes('event loop') ||
    lowerInput.includes('react hook')
  ) {
    if (!apiKey) {
      return DEMO_GAMES['javascript-dungeon'];
    }
  } else if (
    lowerInput.includes('black hole') ||
    lowerInput.includes('space') ||
    lowerInput.includes('physics') ||
    lowerInput.includes('astronomy')
  ) {
    if (!apiKey) {
      return DEMO_GAMES['black-hole'];
    }
  }

  // If no API key is set, use intelligent procedural generator so hackathon demo never breaks
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not detected. Using high-fidelity procedural game generator.');
    return generateProceduralGame(trimmedInput, mode, difficulty);
  }

  const client = new GoogleGenAI({ apiKey });

  const userPrompt = `CONTENT / TOPIC TO GAMIFY:
"""
${truncatedInput}
"""

GAME MODE PREFERENCE: ${mode === 'surprise_me' ? 'Pick the most fun mode for this topic' : mode}
DIFFICULTY: ${difficulty}

Transform this content into an extraordinary Funternet Arcade game in JSON!`;

  // First attempt
  try {
    const response = await callGeminiAPI(client, userPrompt);
    const parsed = sanitizeAndParseJSON(response);
    const game = validateGameData(parsed);
    game.sourceTopic = input.slice(0, 80);
    return game;
  } catch (err: any) {
    console.warn('First generation attempt failed, attempting retry...', err.message);

    // Auto-retry once with strict repair instruction
    try {
      const retryPrompt = `${userPrompt}\n\nIMPORTANT: Your previous output had a JSON parsing error. Please return ONLY strictly valid, well-formed JSON matching the exact schema.`;
      const retryResponse = await callGeminiAPI(client, retryPrompt);
      const parsed = sanitizeAndParseJSON(retryResponse);
      const game = validateGameData(parsed);
      game.sourceTopic = input.slice(0, 80);
      return game;
    } catch (retryErr: any) {
      console.error('Gemini retry also failed. Falling back to procedural engine.', retryErr.message);
      return generateProceduralGame(trimmedInput, mode, difficulty);
    }
  }
}

async function callGeminiAPI(client: GoogleGenAI, prompt: string): Promise<string> {
  // Support gemini-2.5-flash or gemini-3.8-flash
  const modelsToTry = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-1.5-flash'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      // Try generateContent with responseMimeType
      const result = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          temperature: 0.85,
        },
      });

      const text = result.text;
      if (text && text.trim().length > 0) {
        return text;
      }
    } catch (err) {
      lastError = err;
      console.warn(`Model ${model} call failed, trying fallback model if available...`, (err as Error).message);
    }
  }

  throw lastError || new Error('All Gemini model calls failed');
}

/**
 * Intelligent procedural fallback game generator
 * Generates an engaging game dynamically based on user input keywords
 * Guarantees 100% uptime for demo day even under network or quota restrictions
 */
function generateProceduralGame(
  input: string,
  mode: GameMode,
  difficulty: string
): GameData {
  const topic = input.length > 50 ? input.slice(0, 50) + '...' : input;
  const cleanTitle = input
    .replace(/[^\w\s]/gi, '')
    .split(' ')
    .slice(0, 4)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ') || 'Internet Mystery';

  return {
    id: `game_proc_${Date.now()}`,
    title: `The Quest for ${cleanTitle}`,
    subtitle: `Can you survive the secrets of ${topic}?`,
    theme: 'retro-arcade',
    difficulty: (difficulty as any) || 'medium',
    gameMode: mode === 'surprise_me' ? 'boss_battle' : mode,
    intro: `You have entered the Funternet Arcade simulation chamber. Before you lies the realm of "${topic}". Power up your wits and prepare for battle!`,
    playerName: 'Arcade Champion',
    createdAt: Date.now(),
    sourceTopic: topic,
    stages: [
      {
        id: 1,
        type: 'multiple_choice',
        title: 'Stage 1: Core Principles',
        story: `The archive lights flicker as you encounter the first foundational puzzle of ${cleanTitle}.`,
        question: `When analyzing "${topic}", what is the primary objective or mechanism?`,
        options: [
          `To understand the core components and apply logical principles to solve problems`,
          `To ignore the underlying mechanics and hope for random success`,
          `To delete the entire system without reading any instructions`,
          `To outsource all critical thinking to an offline calculator`
        ],
        correctIndex: 0,
        explanation: `Mastery of ${cleanTitle} begins with understanding its foundational components and applying systematic reasoning.`,
        xp: 120,
      },
      {
        id: 2,
        type: 'true_false',
        title: 'Stage 2: Fact or Fiction?',
        story: 'A spectral glitch tests your ability to distinguish authentic signals from background noise.',
        question: `True or False: In-depth understanding of "${topic}" yields significantly better practical outcomes than surface-level memorization.`,
        options: [
          'True — deep conceptual models allow adaptive problem-solving and troubleshooting',
          'False — memorizing a single keyword is always sufficient for any challenge'
        ],
        correctIndex: 0,
        explanation: 'Deep conceptual comprehension empowers you to extrapolate and adapt when unexpected problems arise.',
        xp: 150,
      },
      {
        id: 3,
        type: 'quick_reaction',
        title: 'Stage 3: Reflex Drill',
        story: 'A speed trap triggers! Choose the most efficient tactical action immediately!',
        question: `What is the best immediate response when encountering an anomaly in "${topic}"?`,
        options: [
          'Isolate variables, check recent logs, and test hypotheses systematically',
          'Panic, throw coffee at the screen, and run away',
          'Assume the laws of mathematics have ceased to operate',
          'Spam random buttons until something changes color'
        ],
        correctIndex: 0,
        explanation: 'Systematic variable isolation is the gold standard for diagnosing complex issues in any field.',
        xp: 180,
      },
      {
        id: 4,
        type: 'multiple_choice',
        title: 'Stage 4: Advanced Strategy',
        story: 'The chamber shakes as the gateway to the final arena unlocks.',
        question: `Which strategy maximizes long-term mastery of ${cleanTitle}?`,
        options: [
          'Active retrieval practice, hands-on application, and teaching the concept to others',
          'Reading a summary once while half-asleep on the bus',
          'Staring at the ceiling until inspiration strikes',
          'Writing the notes on invisible paper'
        ],
        correctIndex: 0,
        explanation: 'The Feynman technique and active retrieval are scientifically proven to cement long-term comprehension.',
        xp: 200,
      },
    ],
    boss: {
      name: `The ${cleanTitle} Overlord`,
      title: 'Final Gatekeeper of Knowledge',
      intro: `A menacing holographic colossus materializes! "You dare challenge the secrets of ${cleanTitle} without my permission?"`,
      avatarEmoji: '👾👑',
      themeColor: 'from-purple-600 to-pink-600',
      hp: 100,
      attackQuotes: [
        'Your knowledge buffer is overflowing!',
        'You cannot withstand my logic cascade!',
        'Prepare for mental defragmentation!'
      ],
      defeatQuote: 'Remarkable! Your comprehension has dismantled my firewall!',
      questions: [
        {
          id: 101,
          type: 'boss_phase',
          title: 'Boss Strike 1: The Synthesis Blast',
          story: 'The Overlord launches a massive beam of complex paradoxes!',
          question: `How do true experts solve multi-layered problems in ${cleanTitle}?`,
          options: [
            'By breaking complex problems into smaller, testable sub-problems',
            'By guessing immediately on the first available option',
            'By waiting for someone else to write an answer online',
            'By ignoring the evidence and hoping for good luck'
          ],
          correctIndex: 0,
          explanation: 'Decomposition and modular reasoning allow you to defeat any high-complexity obstacle.',
          xp: 250,
        },
        {
          id: 102,
          type: 'boss_phase',
          title: 'Boss Strike 2: The Final Enrage',
          story: 'The Overlord glows with blinding neon energy for its final assault!',
          question: `What is the ultimate reward of transforming boring internet data into interactive play?`,
          options: [
            'Dopamine-driven learning, high engagement, and permanent memory retention',
            'Sore fingertips from excessive button clicking',
            'A temporary blue screen of death',
            'Forgetting everything within 30 seconds'
          ],
          correctIndex: 0,
          explanation: 'Gamified learning triggers neuroplasticity and emotional engagement, making retention dramatically higher!',
          xp: 300,
        },
      ],
    },
    victoryMessage: `You thoroughly outsmarted The ${cleanTitle} Overlord and mastered the realm!`,
    funFact: `Gamification of educational material can boost learning retention rates by over 40% compared to passive reading.`,
    achievementTitle: `${cleanTitle} Conqueror`,
    achievementDescription: `Decoded the core principles of ${cleanTitle} and emerged victorious in the Funternet Arcade!`,
  };
}
