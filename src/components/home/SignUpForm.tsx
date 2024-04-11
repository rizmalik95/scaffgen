import React, { useState } from "react";
import axios from 'axios';

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(1);
    e.preventDefault();
    try {
      const response = await axios.post('/api/mailingList', { email });
      setLoading(2);
    } catch (error) {
      console.log('Error submitting email:', error);
      console.error('Error submitting email:', error);
      // Optionally handle the error, such as showing an error message to the user
    }
    setTimeout(() => {
      setLoading(0);
      setEmail("");
    }, 3000);
  };

  return (
    <div className="flex flex-col w-full max-w-5xl">
      <form
        onSubmit={handleSubmit}
        className="flex min-w-full flex-row flex-wrap gap-5 justify-center"
      >
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email Address"
          className="flex grow rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-600 outline-none duration-150 focus:border-slate-600  shadow-md"
        />
        <button
          type="submit"
          className="rounded-lg bg-rose-400 px-4 py-2.5 font-semibold text-white hover:bg-rose-300 active:bg-rose-500 "
        >
          {loading === 0
            ? "Join our Community"
            : loading === 1
            ? "..."
            : "Success!"}
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
