import { GameData, ChaosChallenge } from '@/types/game';

export const DEMO_GAMES: Record<string, GameData> = {
  'terms-and-conditions': {
    id: 'demo-terms-and-conditions',
    title: 'Survive the Terms & Conditions',
    subtitle: 'Can you defeat the 42-page scroll of doom?',
    theme: 'corporate-apocalypse',
    difficulty: 'hard',
    gameMode: 'boss_battle',
    intro: 'You accidentally clicked "Read Terms" instead of "I Agree". Now you are trapped in Section 14.3 of the Digital Underworld!',
    playerName: 'EULA Survivor',
    createdAt: Date.now(),
    sourceTopic: 'Terms and Conditions Fine Print',
    stages: [
      {
        id: 1,
        type: 'multiple_choice',
        title: 'Section 1: The Cookie Consent Labyrinth',
        story: 'A pop-up wall of 284 tracking vendors blocks your browser viewport!',
        question: 'What actually happens when you hit "Accept Essential Cookies Only"?',
        options: [
          'They only store session tokens needed to keep you logged in',
          'They track your location, your refrigerator, and your thoughts',
          'A digital cookie is baked and shipped to your physical address',
          'Nothing, they still secretly track everything under "legitimate interest"'
        ],
        correctIndex: 0,
        explanation: 'Legitimate essential cookies only preserve essential state (like login or cart), though sneaky banners sometimes disguise options under confusing UI!',
        xp: 120,
      },
      {
        id: 2,
        type: 'true_false',
        title: 'Section 4: The Mandatory Arbitration Snare',
        story: 'You notice microscopic 6pt font at the bottom of the page mentioning dispute resolutions.',
        question: 'True or False: A mandatory arbitration clause prevents you from joining a class-action lawsuit in real court against the company.',
        options: [
          'True — it forces private individual arbitration behind closed doors',
          'False — users retain full constitutional rights to trial regardless of terms'
        ],
        correctIndex: 0,
        explanation: 'Mandatory arbitration clauses typically waive your right to participate in jury trials or class action lawsuits against tech providers.',
        xp: 150,
      },
      {
        id: 3,
        type: 'quick_reaction',
        title: 'Section 8: The Unilateral Change Clause',
        story: 'The terms shift before your eyes! The text alters without prior notification!',
        question: 'Under standard SaaS terms, what happens when terms are updated?',
        options: [
          'Continued use of the service constitutes legal acceptance of new terms',
          'The CEO personally calls you to get verbal approval',
          'Your account is frozen until you submit a notarized paper form',
          'All prior terms remain permanently locked to your account forever'
        ],
        correctIndex: 0,
        explanation: 'Almost all online services declare that continuing to use the site after updates constitutes acceptance of the modified terms.',
        xp: 180,
      },
      {
        id: 4,
        type: 'multiple_choice',
        title: 'Section 12: The Intellectual Property Grab',
        story: 'A shadowy claw reaches into your cloud storage locker!',
        question: 'When you upload photos or content to a free social platform, what license do you usually grant them?',
        options: [
          'A worldwide, royalty-free, transferable license to use, host, and display it',
          'They take full copyright ownership and you can never use your photos again',
          'A strict one-time viewing permission that self-destructs in 24 hours',
          'No rights at all, they legally cannot store your pixels'
        ],
        correctIndex: 0,
        explanation: 'You usually retain copyright ownership, but grant the platform an irrevocable, royalty-free worldwide license to distribute and process your content.',
        xp: 200,
      },
    ],
    boss: {
      name: 'The Terms & Conditions Demon',
      title: 'Lord of the 90,000-Word Agreement',
      intro: 'A colossal beast made of floating legal jargon and unclickable opt-out buttons emerges from the void!',
      avatarEmoji: '📜😈',
      themeColor: 'from-amber-500 to-rose-600',
      hp: 100,
      attackQuotes: [
        'You failed to notice subsection 9.4B!',
        'By breathing my air, you have agreed to arbitration!',
        'Prepare to have your data brokered to 1,400 ad networks!'
      ],
      defeatQuote: 'NOOO! You actually read the agreement! My power dissolves into plain English!',
      questions: [
        {
          id: 101,
          type: 'boss_phase',
          title: 'Boss Strike 1: The Severability Shield',
          story: 'The Demon summons a barrier labeled "Severability" to void your defense!',
          question: 'What does a "severability clause" in a contract actually do?',
          options: [
            'If one provision is found unlawful, the remainder of the contract stays in effect',
            'It allows the company to cut off your internet connection immediately',
            'It splits your personal data into several distinct offshore entities',
            'It forces you to pay double if you break any rule'
          ],
          correctIndex: 0,
          explanation: 'Severability ensures that if a judge strikes down one illegal clause, the rest of the agreement remains legally binding.',
          xp: 250,
        },
        {
          id: 102,
          type: 'boss_phase',
          title: 'Boss Strike 2: The GDPR Ultimate Counter',
          story: 'The Demon prepares its ultimate data-harvesting blast!',
          question: 'Under GDPR and privacy laws, which principle requires companies to only collect data strictly required for their service?',
          options: [
            'Data Minimization',
            'Infinite Ingestion',
            'Maximum Retention Policy',
            'Opt-Out Omnipresence'
          ],
          correctIndex: 0,
          explanation: 'Data Minimization dictates that personal data must be adequate, relevant, and limited to what is necessary for the stated purpose.',
          xp: 300,
        },
      ],
    },
    victoryMessage: 'You decoded the legalese and saved humanity from signing away their digital souls!',
    funFact: 'In 2017, a UK WiFi company added a clause requiring users to perform 1,000 hours of community service (cleaning toilets). Over 22,000 people agreed without reading it!',
    achievementTitle: 'Terms & Conditions Slayer',
    achievementDescription: 'Survived all 42 pages of digital fine print without clicking blind acceptance.',
  },

  'javascript-dungeon': {
    id: 'demo-javascript-dungeon',
    title: 'Escape the JavaScript Dungeon',
    subtitle: 'Navigate closures, event loops, and asynchronous traps!',
    theme: 'retro-arcade',
    difficulty: 'medium',
    gameMode: 'escape_room',
    intro: 'You fall through a stack overflow into the depths of the V8 engine. Can you execute your way out without throwing an Uncaught TypeError?',
    playerName: 'Byte Knight',
    createdAt: Date.now(),
    sourceTopic: 'JavaScript Internals & Concepts',
    stages: [
      {
        id: 1,
        type: 'multiple_choice',
        title: 'Room 1: The Scope of Closures',
        story: 'A sealed vault door has an inner function reaching outside its lexical scope.',
        question: 'What is a closure in JavaScript?',
        options: [
          'A function bundled together with references to its surrounding lexical environment',
          'A method that permanently shuts down the Node.js server process',
          'A special tag that marks variables for immediate garbage collection',
          'A syntax error that occurs when you forget a closing brace'
        ],
        correctIndex: 0,
        explanation: 'A closure gives a function access to its outer scope even after the outer function has finished executing.',
        xp: 120,
      },
      {
        id: 2,
        type: 'speed_challenge',
        title: 'Room 2: The Event Loop Gauntlet',
        story: 'Tasks and Microtasks race along conveyor belts. Which one gets executed first?',
        question: 'In the browser event loop, which queue has priority right after synchronous code finishes?',
        options: [
          'Microtask Queue (Promise.then, queueMicrotask)',
          'Macrotask Queue (setTimeout, setInterval)',
          'RequestAnimationFrame Queue',
          'Garbage Collection Queue'
        ],
        correctIndex: 0,
        explanation: 'All microtasks are drained completely before the event loop picks the next macrotask (like setTimeout)!',
        xp: 150,
      },
      {
        id: 3,
        type: 'multiple_choice',
        title: 'Room 3: The Binding of "this"',
        story: 'A shape-shifting mirror reflects different objects depending on how you summon it.',
        question: 'How do ES6 Arrow Functions handle the "this" keyword?',
        options: [
          'They lexically inherit "this" from their enclosing execution context',
          'They automatically bind "this" to the global window object',
          'They throw a ReferenceError if "this" is accessed',
          'They create a new instance of Object.prototype on each call'
        ],
        correctIndex: 0,
        explanation: 'Arrow functions do not have their own "this" binding; they capture the "this" value of the enclosing context.',
        xp: 160,
      },
      {
        id: 4,
        type: 'true_false',
        title: 'Room 4: The Coercion Pitfall',
        story: 'Two stone tablets read: `[] == ![]`. Do they balance?',
        question: 'What does `[] == ![]` evaluate to in JavaScript?',
        options: [
          'true — because ![] becomes false (0), and [] coerces to "" then 0',
          'false — because arrays are reference types and can never equal a boolean'
        ],
        correctIndex: 0,
        explanation: 'Due to JS type coercion rules, `![]` is `false`. Then `[] == false` converts both to numbers (`0 == 0`), producing `true`!',
        xp: 190,
      },
    ],
    boss: {
      name: 'The Undefined Hydra',
      title: 'Terror of the Call Stack',
      intro: 'A multi-headed beast roars: "Cannot read property of undefined!"',
      avatarEmoji: '🐉⚡',
      themeColor: 'from-yellow-400 to-amber-600',
      hp: 100,
      attackQuotes: [
        'Uncaught TypeError: your victory is not a function!',
        'Maximum call stack size exceeded!',
        'NaN! NaN! NaN!'
      ],
      defeatQuote: 'Syntax Error in my neural network! The call stack has successfully cleared!',
      questions: [
        {
          id: 101,
          type: 'boss_phase',
          title: 'Hydra Head 1: The Hoisting Hazard',
          story: 'The Hydra breathes temporal dead zones across the floor!',
          question: 'What happens if you reference a `let` or `const` variable before its line of declaration?',
          options: [
            'Throws a ReferenceError because it resides in the Temporal Dead Zone (TDZ)',
            'Returns undefined like traditional `var` declarations',
            'Automatically initializes it to null',
            'Silently ignores the reference and continues execution'
          ],
          correctIndex: 0,
          explanation: 'Unlike `var`, variables declared with `let` and `const` cannot be accessed before declaration due to the Temporal Dead Zone.',
          xp: 250,
        },
        {
          id: 102,
          type: 'boss_phase',
          title: 'Hydra Head 2: The Garbage Collector Strike',
          story: 'Memory leaks surge from the hydra core! Time to sever the roots!',
          question: 'Which garbage collection algorithm is standard in modern JavaScript engines?',
          options: [
            'Mark-and-Sweep',
            'Reference Counting only',
            'Random Elimination',
            'FIFO Stack Purge'
          ],
          correctIndex: 0,
          explanation: 'Mark-and-Sweep finds unreachable objects by traversing roots (globals, call stack) and sweeping unreached memory.',
          xp: 300,
        },
      ],
    },
    victoryMessage: 'You cleared the call stack and mastered the quirks of modern JavaScript!',
    funFact: 'Brendan Eich created the initial prototype of JavaScript in just 10 days in May 1995 while working at Netscape!',
    achievementTitle: 'Full-Stack Warlock',
    achievementDescription: 'Navigated the Event Loop and escaped the Undefined Hydra without a single runtime crash.',
  },

  'black-hole': {
    id: 'demo-black-hole',
    title: 'Defeat the Black Hole',
    subtitle: 'Survive the singularity at the edge of space-time!',
    theme: 'cosmic-neon',
    difficulty: 'chaos',
    gameMode: 'speed_challenge',
    intro: 'Your starship has drifted past the outer photon sphere. Warp engines are offline. Only astrophysics trivia can fuel the escape thrusters!',
    playerName: 'Astro Pilot',
    createdAt: Date.now(),
    sourceTopic: 'Black Holes & General Relativity',
    stages: [
      {
        id: 1,
        type: 'multiple_choice',
        title: 'Checkpoint 1: The Event Horizon',
        story: 'Gravity pulls at your console. You approach the boundary of no return!',
        question: 'What is the Event Horizon of a black hole?',
        options: [
          'The boundary beyond which nothing, not even light, can escape gravitational pull',
          'The exact physical surface made of solid compressed degenerate iron',
          'The ring of gas glowing with x-rays outside the galaxy',
          'The point where time completely stops for the falling observer'
        ],
        correctIndex: 0,
        explanation: 'The event horizon marks the mathematical threshold where the escape velocity strictly exceeds the speed of light.',
        xp: 140,
      },
      {
        id: 2,
        type: 'quick_reaction',
        title: 'Checkpoint 2: The Spaghettification Zone',
        story: 'Tidal forces stretch your ship along the gravitational axis!',
        question: 'What causes "spaghettification" near a stellar-mass black hole?',
        options: [
          'Extreme differential tidal forces between the front and back of an object',
          'Superheated plasma melting matter into pasta-like strands',
          'Magnetic fields rotating space-time at relativistic speeds',
          'Dark matter colliding with normal baryonic matter'
        ],
        correctIndex: 0,
        explanation: 'Because gravity scales inversely with square distance, the pull on your feet is dramatically stronger than on your head, stretching you vertically and compressing horizontally!',
        xp: 170,
      },
      {
        id: 3,
        type: 'true_false',
        title: 'Checkpoint 3: Gravitational Time Dilation',
        story: 'Mission control signals are shifting into slow motion!',
        question: 'True or False: To a distant observer, an object falling toward a black hole appears to slow down and fade, never quite crossing the event horizon.',
        options: [
          'True — infinite gravitational redshift makes it appear frozen and dim',
          'False — distant observers see it accelerate past lightspeed instantly'
        ],
        correctIndex: 0,
        explanation: 'Due to extreme gravitational time dilation and redshift, light from the infalling object stretches infinitely, making it appear to freeze and fade out to outside observers.',
        xp: 190,
      },
    ],
    boss: {
      name: 'Singularity Prime',
      title: 'Infinite Density Core',
      intro: 'The laws of physics collapse! Infinite curvature threatens to rip reality apart!',
      avatarEmoji: '🕳️🌌',
      themeColor: 'from-purple-600 to-indigo-950',
      hp: 100,
      attackQuotes: [
        'Time does not exist here!',
        'All your photons belong to my accretion disk!',
        'Entropy always increases!'
      ],
      defeatQuote: 'Hawking radiation! I am evaporating into pure quantum thermal fluctuations!',
      questions: [
        {
          id: 101,
          type: 'boss_phase',
          title: 'Singularity Core 1: Hawking Radiation',
          story: 'Quantum vacuum fluctuations sparkle along the horizon boundary!',
          question: 'How do black holes theoretically lose mass over time according to Stephen Hawking?',
          options: [
            'Through quantum pair production near the horizon where one virtual particle escapes',
            'By ejecting massive neutrino beams from their magnetic poles',
            'By slowly converting dark energy into radio waves',
            'They never lose mass; they grow infinitely forever'
          ],
          correctIndex: 0,
          explanation: 'Hawking radiation arises from quantum field effects in curved spacetime, resulting in black holes slowly radiating thermal energy and evaporating.',
          xp: 280,
        },
        {
          id: 102,
          type: 'boss_phase',
          title: 'Singularity Core 2: The No-Hair Theorem',
          story: 'The final barrier of spacetime locks into place!',
          question: 'According to the No-Hair Theorem, an isolated stationary black hole is completely characterized by which three properties?',
          options: [
            'Mass, Electric Charge, and Angular Momentum (Spin)',
            'Temperature, Density, and Magnetic Field',
            'Color, Diameter, and Age',
            'Entropy, Luminosity, and Velocity'
          ],
          correctIndex: 0,
          explanation: 'General relativity posits that black holes have only three externally observable classical parameters: Mass, Charge, and Spin!',
          xp: 320,
        },
      ],
    },
    victoryMessage: 'You activated the quantum warp drive and escaped the gravitational vortex with intact spacetime!',
    funFact: 'If our Sun were replaced with a black hole of the exact same mass, Earth would not get sucked in — it would continue orbiting normally in total darkness!',
    achievementTitle: 'Singularity Surfer',
    achievementDescription: 'Navigated relativistic tidal forces and outmaneuvered a gravitational singularity.',
  }
};

export const DAILY_CHAOS_CHALLENGES: ChaosChallenge[] = [
  {
    id: 'captcha-goblin',
    title: 'Can you beat the CAPTCHA Goblin?',
    category: 'Internet Folklore',
    badge: '🤖 CAPTCHA GOBLIN',
    description: 'The goblin demands you prove you possess human biological consciousness!',
    question: 'Why do modern CAPTCHAs often only require checking a single box instead of typing wavy distorted letters?',
    options: [
      'They track your micro-mouse movements, timing, and browser telemetry before the click',
      'They measure the electrical impedance of your finger on the trackpad',
      'The company checks your government ID linked secretly to your IP address',
      'It’s just an honor system and anyone can lie'
    ],
    correctIndex: 0,
    explanation: 'reCAPTCHA v2 and v3 analyze subtle human subconscious mouse dynamics, acceleration curves, and browser headers rather than just the click itself!',
    xp: 150,
  },
  {
    id: 'headline-real-or-ridiculous',
    title: 'Real News or Absurd Internet Fabrication?',
    category: 'Viral Internet History',
    badge: '📰 REAL OR FAKE',
    description: 'One of these wild headlines actually happened in real life.',
    question: 'Which of these absurd headlines actually occurred in real internet history?',
    options: [
      'A smart refrigerator once joined an IoT botnet to send spam emails',
      'A gamer successfully legally married an NPC character in a multiplayer game court',
      'The United Nations officially declared Comic Sans a cyberweapon',
      'NASA accidentally deleted the internet backup of the Moon landing on floppy disk'
    ],
    correctIndex: 0,
    explanation: 'In 2014, cybersecurity researchers uncovered an IoT botnet that included over 100,000 smart devices — including at least one smart fridge broadcasting malicious phishing emails!',
    xp: 175,
  },
  {
    id: 'decode-internet-slang',
    title: 'Decode Modern Internet Slang',
    category: 'Net Linguistics',
    badge: '🗣️ SLANG EXPERT',
    description: 'Internet slang moves fast. Prove your digital fluency!',
    question: 'What does an internet citizen mean when they say that you "cooked"?',
    options: [
      'You did something remarkably well, impressive, or delivered excellence',
      'You accidentally burned your computer CPU through overheating',
      'You were defeated in an argument and need to log off',
      'You ordered delivery food while playing ranked matches'
    ],
    correctIndex: 0,
    explanation: '“Let him cook” and “You cooked” is high internet praise meaning someone performed exceptionally well or had great creative insight!',
    xp: 125,
  }
];
