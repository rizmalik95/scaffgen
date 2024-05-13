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
          Scaffold Your Curriculum in Seconds
          </h1>
          <p className="max-w-3xl text-xl text-slate-500">
          Your district-provided curriculum does not serve every student. <br />
          Coteach.ai helps tailor your curriculum so every student can access and succeed. 
          </p>
          <div className="flex flex-row gap-5">
            <button
              onClick={() => scrollToDiv("signup")}
              className="rounded-lg border border-slate-400 bg-white px-4 py-2.5 text-center font-semibold text-slate-600 duration-150 hover:bg-slate-100 active:bg-slate-200"
            >
              Join our community ∨
            </button>
            <NavLink
              href="/login"
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
              Why Coteach.ai?
            </h1>
            <hr className="h-1 w-40 bg-rose-400" />
          </div>
          <div className="flex flex-row flex-wrap justify-center gap-20">
            <LandingCard
              title="Integration with leading curriculums"
              content="Coteach.ai works seamlessly with Illustrative Mathematics and other leading middle-school curriculums"
              color="green"
            />
            <LandingCard
              title="Ensure compliance with IEPs and 504s"
              content="Students with specific learning needs get the materials and supports they need to succeed"
              color="yellow"
            />
            <LandingCard
              title="Built by experts in Universal Design for Learning (UDL)"
              content="Our platform is designed by curriculum and special education experts at Stanford University"
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
