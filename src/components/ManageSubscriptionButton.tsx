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
      className="border-2 font-semibold cursor-pointer rounded-[3px] text-sm py-2 px-4 transform transition-transform duration-300 ease-in-out hover:scale-105"
      onClick={handleClick}
    >
      Manage Subscription
    </button>
  );
}
