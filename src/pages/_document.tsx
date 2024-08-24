import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="https://fav.farm/📸" />
      </Head>
      <body className="dark flex min-h-screen flex-col bg-neutral-950 text-white">
        <h1 className="py-3 text-center text-3xl font-bold">
          BeReal Memories 📸
        </h1>
        <main className="grow px-5">
          <Main />
        </main>
        <NextScript />
      </body>
    </Html>
  );
}
