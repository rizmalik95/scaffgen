import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

export default function TestSlides() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session && typeof window !== 'undefined') router.push(`/login?callbackUrl=/test-slides`); // Redirect if not authenticated
  }, [session, status, router]);

  const [presentationId, setPresentationId] = useState<string>("");
  const [updateLoading, setUpdateLoading] = useState(false);

  const handleCreatePresentation = async () => {
    if (session) {
      const accessToken = session.accessToken as string;
      const response = await axios.post("/api/createPresentation", {
        accessToken,
      });
      const newPresentationId = response.data.presentationId;
      setPresentationId(
        newPresentationId
      );
    }
  };

  const handleUpdatePresentation = async () => {
    if (session && presentationId) {
      setUpdateLoading(true);
      const accessToken = session.accessToken as string;
      const newScaffoldResponse = await axios.post("/api/testGenSlideScaffold");

      const response = await axios.post("/api/updatePresentation", {
        accessToken,
        presentationId: presentationId,
        scaffolds: [newScaffoldResponse.data.newScaffold],
      });

      setUpdateLoading(false);
    }
  };

  const spinner = (
    <svg
      className={`${
        updateLoading ? "animate-spin" : ""
      } -ml-1 mr-3 h-5 w-5 text-white`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-10">
      <button
        className="rounded-lg bg-rose-400 px-4 py-2.5 font-semibold text-white hover:bg-rose-300 active:bg-rose-500"
        onClick={handleCreatePresentation}
      >
        Create Presentation
      </button>
      {presentationId && (
        <a
          href={`https://docs.google.com/presentation/d/${presentationId}`}
          target="_blank"
          className="text-blue-500 underline"
        >
          Open your presentation
        </a>
      )}
      {presentationId !== "" && (
        <button
          className="flex rounded-lg bg-rose-400 px-4 py-2.5 font-semibold text-white hover:bg-rose-300 active:bg-rose-500"
          onClick={handleUpdatePresentation}
        >
          {updateLoading && spinner}
          Update Presentation
        </button>
      )}
    </div>
  );
}
