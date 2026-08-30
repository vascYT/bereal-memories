import { ArrowRight, ShieldCheck } from "lucide-react";

export default function Info() {
  return (
    <div className="flex flex-col items-center">
      <div className="text-green-300/60 flex items-center justify-center gap-2 my-5">
        <ShieldCheck className="size-20" />
        <div>
          <p>
            100% free. 100% private. <br /> Your data never leaves your device.
            <br /> Everything is processed in your browser.
          </p>
        </div>
      </div>
      <div className="text-center mt-4 max-w-lg">
        <h1 className="text-2xl font-bold">How do I get that file?</h1>
        <p className="mt-1">
          The zip file can be obtained by submitting a GDPR data request to
          BeReal. This can be done in the app by navigating to...
        </p>
        <p className="flex flex-wrap items-center gap-2 my-4 text-sm">
          Profile <ArrowRight className="size-4" /> Settings{" "}
          <ArrowRight className="size-4" /> Help{" "}
          <ArrowRight className="size-4" /> Contact Us{" "}
          <ArrowRight className="size-4" /> Ask a Question{" "}
          <ArrowRight className="size-4" /> Troubleshooting{" "}
          <ArrowRight className="size-4" /> Other
          <ArrowRight className="size-4" /> Still need help?
          <ArrowRight className="size-4" /> Select "I'd like to request a copy
          of my data"
          <ArrowRight className="size-4" /> Send
        </p>
        <p>
          After a few hours your should receive a response with the "Profile &
          Activity" file.
        </p>
      </div>
    </div>
  );
}
