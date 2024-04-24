import React from "react";

// Define the type for your color classes object
type ColorClass = {
  [key: string]: string;
};

const colorClasses: ColorClass = {
  green: "bg-gradient-to-b from-emerald-100 to-white",
  yellow: "bg-gradient-to-b from-amber-100 to-white",
  pink: "bg-gradient-to-b from-pink-200 to-white",
  // Add more color mappings as needed
};

export default function LandingCard({
  title,
  content,
  color,
}: {
  title: string;
  content: string;
  color: string;
}) {
  // Use a fallback class if the color does not match
  const gradientClass = colorClasses[color] || "bg-gradient-to-b from-gray-100 to-white";

  return (
    <div className={`${gradientClass} rounded-xl shadow-xl border border-slate-200 max-w-xs`}>
      <div className="flex flex-col gap-10 px-10 py-20 text-left">
        <h2 className="text-3xl font-bold text-slate-700">{title}</h2>
        <p>{content}</p>
      </div>
    </div>
  );
}
