// components/ManageSubscriptionButton.tsx
"use client";

export default function ManageSubscriptionButton() {
  const handleClick = async () => {
    const res = await fetch("/api/create-portal-session", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <button
      className="border-1 cursor-pointer rounded-[3px] text-sm py-2 px-4"
      onClick={handleClick}
    >
      Manage Subscription
    </button>
  );
}
