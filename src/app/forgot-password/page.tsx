import ForgotPassword from "@/components/ForgotPassword";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Forgot password",
  description: "Update you password.",
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

const ForgotPasswordPage = () => {
  return (
    <>
      <ForgotPassword />
    </>
  );
};

export default ForgotPasswordPage;
