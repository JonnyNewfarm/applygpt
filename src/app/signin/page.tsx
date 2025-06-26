import React from "react";
import SignInClient from "../../components/SignInClient";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Login – Access Your AI Career Dashboard",
  description:
    "Sign in to your account to generate resumes, cover letters, and access saved job application documents.",
};

const page = () => {
  return (
    <>
      <SignInClient />
    </>
  );
};

export default page;
