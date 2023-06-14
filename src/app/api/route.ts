import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanChatMessage } from 'langchain/schema';

import { NextResponse } from 'next/server';

const chat = new ChatOpenAI({
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: Request) {
  const prompt = new URL(request.url).searchParams.get('prompt');

  if (!prompt) {
    return NextResponse.json({ message: 'Missing prompt' }, { status: 400 });
  }

  const response = await chat
    .call([new HumanChatMessage(prompt)])
    .catch((error) => {
      console.log(error);
      return new Response(JSON.stringify({ error }));
    });

  return NextResponse.json({ text: response.text });
}
