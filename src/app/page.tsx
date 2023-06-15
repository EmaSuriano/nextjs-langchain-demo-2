import Result from '@/components/Result';

type Props = {
  searchParams: { prompt?: string };
};

export default function Home(props: Props) {
  const { prompt = '' } = props.searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
      <h1 className="font-extrabold text-6xl text-center mb-10">
        LangChain JS Demo 🦜🔗
      </h1>

      <form className="flex gap-2">
        <input
          className="block w-full rounded-md border-0 py-1.5 pl-2 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="text"
          name="prompt"
          defaultValue={prompt}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
      {prompt && <Result prompt={prompt} />}
    </main>
  );
}
