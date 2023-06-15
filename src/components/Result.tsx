'use client';

import React, { useEffect, useState } from 'react';

type Props = {
  prompt: string;
};

const API =
  process.env.NODE_ENV === 'production'
    ? 'https://nextjs-langchain-demo-2.vercel.app/api/stream'
    : 'http://localhost:3000/api/stream';

const fetchStreamingData = async (
  request: Request,
  onRead: (value: Uint8Array | undefined) => void,
) => {
  const response = await fetch(request);

  if (!response.ok || !response.body) {
    throw new Error('Network response was not OK');
  }

  const reader = response.body.getReader();

  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    onRead(value);
  }
};

const Result = ({ prompt }: Props) => {
  const [response, setResponse] = useState('');

  useEffect(() => {
    setResponse('');

    const request = new Request(API, {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });

    fetchStreamingData(request, (value) => {
      const text = new TextDecoder().decode(value);
      setResponse((prevData) => prevData + text);
    }).catch((err) => setResponse(err.toString()));
  }, [prompt]);

  return (
    response && (
      <article className="transition-all max-w-screen-lg p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          AI Assistant
        </h2>

        <p className="mb-5 font-light text-gray-500 dark:text-gray-400">
          {response}
        </p>
        <div className="flex justify-between items-center">
          <button
            onClick={() => setResponse('')}
            className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline"
          >
            Clear
          </button>
        </div>
      </article>
    )
  );
};

export default Result;
