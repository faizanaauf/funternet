import { NextRequest, NextResponse } from 'next/server';
import { generateGameWithGemini } from '@/lib/gemini';
import { GameMode } from '@/types/game';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { input, gameMode, difficulty } = body;

    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide something to gamify! Paste text, an article, or a topic you want to master.',
        },
        { status: 400 }
      );
    }

    const mode: GameMode = gameMode || 'surprise_me';
    const diff = difficulty || 'medium';

    const game = await generateGameWithGemini(input, mode, diff);

    return NextResponse.json({
      success: true,
      game,
    });
  } catch (error: any) {
    console.error('Game generation route error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          'The internet goblins tripped over a wire! Try again with a different topic or click "Try Demo" to play immediately.',
      },
      { status: 500 }
    );
  }
}
