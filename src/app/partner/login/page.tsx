"use client";

import { PartnerAuthForm } from "@/components/PartnerAuthForm";

export default function PartnerLoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center px-4 py-12">
      <PartnerAuthForm mode="login" onSuccessRedirect="/" />
    </div>
  );
}
