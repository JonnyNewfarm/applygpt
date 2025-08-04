import RegisterPage from "@/components/RegisterClient";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Create an Account – Start Using AI Career Tools",
  description:
    "Sign up to generate professional resumes and cover letters with AI. Track your applications and search for jobs faster.",
  icons: {
    icon: "/og-image-v2.png",
  },
  openGraph: {
    images: [
      {
        url: "https://www.jobscriptor.com/og-image-v2.png",
        width: 1200,
        height: 630,
        alt: "AI Cover Letter Tool by Jobscriptor",
      },
    ],
  },
};

const page = () => {
  return (
    <>
      <RegisterPage />
    </>
  );
};

export default page;
