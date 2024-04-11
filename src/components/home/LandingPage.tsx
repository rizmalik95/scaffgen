import Image from "next/image";
import NavLink from "@/components/NavLink";
import React from "react";
import LandingCard from "~/components/home/LandingCard";
import SignUpForm from "~/components/home/SignUpForm";

export default function LandingPage() {
  const scrollToDiv = (divId: string) => {
    const divElement = document.getElementById(divId);
    divElement?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="flex flex-col bg-slate-100">
        <div className="mx-auto my-32 flex max-w-5xl flex-col items-center gap-10 px-5 text-center md:px-10">
          <h1 className="text-4xl font-extrabold text-slate-700 sm:text-6xl">
            Generate Classroom Scaffolds in Seconds
          </h1>
          <p className="max-w-2xl text-xl text-slate-500">
            ScaffGen makes it simple for you to generate AI Scaffolds for your
            classroom in seconds, completely for free.
          </p>
          <div className="flex flex-row gap-5">
            <button
              onClick={() => scrollToDiv("signup")}
              className="rounded-lg border border-slate-400 bg-white px-4 py-2.5 text-center font-semibold text-slate-600 duration-150 hover:bg-slate-100 active:bg-slate-200"
            >
              Join our community ∨
            </button>
            <NavLink
              href="/start"
              className="bg-rose-400  font-semibold text-white hover:bg-rose-300 active:bg-rose-500"
            >
              Try It Now
            </NavLink>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-white">
        <div className="mx-auto my-32 flex flex-col items-center gap-10 px-5 text-center sm:gap-20 md:px-10">
          <div className="flex flex-col items-center gap-4 sm:gap-8">
            <h1 className="text-3xl font-bold text-slate-700 sm:text-5xl">
              Why coteach.ai?
            </h1>
            <hr className="h-1 w-40 bg-rose-400" />
          </div>
          <div className="flex flex-row flex-wrap justify-center gap-20">
            <LandingCard
              title="Custom Built for Texas Math teachers"
              content="An activity that helps you find the mystery number from other numbers. It’s super cool and useful for students! This activity is great for students who enjoy visual problems!"
              color="green"
            />
            <LandingCard
              title="Custom Built for Texas Math teachers"
              content="An activity that helps you find the mystery number from other numbers. It’s super cool and useful for students! This activity is great for students who enjoy visual problems!"
              color="yellow"
            />
            <LandingCard
              title="Custom Built for Texas Math teachers"
              content="An activity that helps you find the mystery number from other numbers. It’s super cool and useful for students! This activity is great for students who enjoy visual problems!"
              color="pink"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-slate-100">
        <div className="mx-auto my-32 flex flex-col items-center gap-10 px-5 text-center sm:gap-20 md:px-10">
          <div className="flex flex-col items-center gap-4 sm:gap-8">
            <h1 className="text-3xl font-bold text-slate-700 sm:text-5xl">
              Supported By
            </h1>
            <hr className="h-1 w-40 bg-rose-400" />
          </div>
          <div className="flex flex-row flex-wrap justify-center gap-10 md:gap-20">
            <Image src="/hai_1.png" alt="HAI" width={200} height={100} />
            <Image
              src="/SAL.png"
              alt="Stanford Accelerator for Learning"
              width={200}
              height={150}
            />
            <Image src="/gsb.jpg" alt="HAI" width={300} height={150} />
          </div>
        </div>
      </div>
      <div id="signup" className="flex flex-col bg-white">
        <div className="mx-auto my-32 flex w-full flex-col items-center gap-5 px-5 text-center md:w-1/2 md:px-10">
          <h1 className="text-3xl font-medium text-slate-700">
            Interested in what we're building?
          </h1>
          <p className="mb-10 max-w-md text-xl text-slate-500">
            Join our community to be the first to know about the updates we have
            in store!
          </p>
          <SignUpForm />
        </div>
      </div>
    </>
  );
}
