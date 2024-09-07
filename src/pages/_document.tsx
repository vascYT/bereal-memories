import { Html, Head, Main, NextScript } from "next/document";
import { env } from "~/env";

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
        <footer className="my-3">
          <p className="text-center text-sm text-gray-300">
            v{env.NEXT_PUBLIC_VERSION} •{" "}
            <a href="https://github.com/vascYT/bereal-memories" target="_blank">
              Source
            </a>
            <br />
            Made with 💖 by vasc
          </p>
        </footer>
        <NextScript />
      </body>
    </Html>
  );
}
