import { OpenAI } from 'langchain/llms/openai';
import { BaseChain, LLMChain } from 'langchain/chains';
import { NextResponse } from 'next/server';
import { PromptTemplate } from 'langchain/prompts';

export const config = {
  runtime: 'edge',
};

const llm = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  streaming: true,
});

const synopsisTemplate = new PromptTemplate({
  template: `You are a playwright. Given the title of play, it is your job to write a synopsis for that title.
  Title: {title}
  Playwright: This is a synopsis for the above play:`,
  inputVariables: ['title'],
});
const synopsisChain = new LLMChain({ llm, prompt: synopsisTemplate });

async function runLLMChain(chain: BaseChain, input: any) {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  chain.run(input, [
    {
      async handleLLMNewToken(token) {
        await writer.ready;
        await writer.write(encoder.encode(`${token}`));
      },
      async handleLLMEnd() {
        await writer.ready;
        await writer.close();
      },
    },
  ]);

  return stream.readable;
}

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json({ message: 'Missing prompt' }, { status: 400 });
  }

  const stream = runLLMChain(synopsisChain, prompt);

  return new NextResponse(await stream);
}
