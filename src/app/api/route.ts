import { OpenAI } from 'langchain/llms/openai';
import { LLMChain, SimpleSequentialChain } from 'langchain/chains';
import { NextResponse } from 'next/server';
import { PromptTemplate } from 'langchain/prompts';

const llm = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const promptTemplate = new PromptTemplate({
  template: `You are a playwright. Given the title of play, it is your job to write a synopsis for that title.
  Title: {title}
  Playwright: This is a synopsis for the above play:`,
  inputVariables: ['title'],
});
const synopsisChain = new LLMChain({ llm, prompt: promptTemplate });

const reviewPromptTemplate = new PromptTemplate({
  template: `You are a play critic from the New York Times. Given the synopsis of play, it is your job to write a review for that play.
  Play Synopsis:
  {synopsis}
  Review from a New York Times play critic of the above play:`,
  inputVariables: ['synopsis'],
});
const reviewChain = new LLMChain({ llm, prompt: reviewPromptTemplate });

export async function GET(request: Request) {
  const prompt = new URL(request.url).searchParams.get('prompt');

  if (!prompt) {
    return NextResponse.json({ message: 'Missing prompt' }, { status: 400 });
  }

  const overallChain = new SimpleSequentialChain({
    chains: [synopsisChain, reviewChain],
  });

  const review = await overallChain.run(prompt);
  console.log(review);

  return NextResponse.json({ text: review });
}
