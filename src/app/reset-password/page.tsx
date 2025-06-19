import ResetPasswordClient from "@/components/ResetPasswordClient";
import React, { Suspense } from "react";

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
};

export default ResetPasswordPage;
