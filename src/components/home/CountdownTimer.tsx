"use client";

import { useState, useEffect } from "react";

const SEASON_6_DATE = new Date("2026-12-31T20:00:00").getTime();

function calculateTimeLeft() {
  const distance = SEASON_6_DATE - new Date().getTime();
  if (distance < 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
  };
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  const items = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center bg-neutral-900/50 backdrop-blur-md rounded-2xl border border-white/10 mb-3 shadow-xl">
            <span className="text-4xl md:text-6xl font-bold text-bmki-gold">
              {item.value.toString().padStart(2, "0")}
            </span>
          </div>
          <span className="text-white/80 font-medium uppercase tracking-wider">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
