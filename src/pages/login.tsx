import React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";


export default function Login() {

  const router = useRouter();
  const { callbackUrl } = router.query as { callbackUrl: string };
  
  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-slate-100 pt-48">
      <h1 className="my-10 text-4xl font-bold text-slate-700">Login</h1>
      <button
        aria-label="Sign in with Google"
        className="border-button-border-light flex w-64 items-center justify-center gap-2 rounded-lg border bg-white py-2"
        onClick={() => signIn('google', { callbackUrl: callbackUrl })}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-l bg-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-5 w-5"
          >
            <title>Sign in with Google</title>
            <desc>Google G Logo</desc>
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              className="fill-google-logo-blue"
            ></path>
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              className="fill-google-logo-green"
            ></path>
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              className="fill-google-logo-yellow"
            ></path>
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              className="fill-google-logo-red"
            ></path>
          </svg>
        </div>
        <span className="text-google-text-gray text-lg tracking-wider">
          Sign in with Google
        </span>
      </button>
      <button
        aria-label="Continue as Guest"
        className=" w-64 rounded-md bg-rose-400 px-4  py-2.5 text-center text-sm font-medium text-white duration-150 hover:bg-rose-300"
        onClick={() => window.location.href = callbackUrl}
      >
        <div className="flex items-center justify-center">
          <span className="text-lg font-normal text-white">
            Continue as Guest
          </span>
        </div>
      </button>
      <span className="text-md w-64 text-slate-500 text-center">
        (If continuing in as a guest, you won't be able to export to Google slides)
      </span>
    </div>
  );
}
