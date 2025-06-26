import RegisterPage from "@/components/RegisterClient";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Create an Account – Start Using AI Career Tools",
  description:
    "Sign up to generate professional resumes and cover letters with AI. Track your applications and search for jobs faster.",
};

const page = () => {
  return (
    <>
      <RegisterPage />
    </>
  );
};

export default page;
