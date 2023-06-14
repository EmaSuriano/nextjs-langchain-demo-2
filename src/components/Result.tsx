import React from 'react';

type Props = {
  prompt: string;
};

const API = 'http://localhost:3000/api?';

const Result = async ({ prompt }: Props) => {
  const params = new URLSearchParams();
  params.set('prompt', prompt);

  const url = API + params.toString();
  console.log(url);

  const response = await fetch(url);

  const { text } = await response.json();

  return <p>{text}</p>;
};

export default Result;