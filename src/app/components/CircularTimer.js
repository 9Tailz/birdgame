"use client";

import { useState, useEffect } from 'react';
import styles from './components.module.css';


export function CircularTimer({ timeLeft, totalTime, size = 80, strokeWidth = 6 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / totalTime) * circumference;

  return (
    <svg width={size} height={size}>
      <circle
        stroke="#555"
        fill="none"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke="orange"
        fill="none"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        style={{ transition: 'stroke-dashoffset 1s linear' }}
      />
      <text
        x="50%"
        y="50%"
        dy="0.3em"
        textAnchor="middle"
        fill="#eee"
        fontSize="1.2em"
        fontFamily="Arial, sans-serif"
      >
        {timeLeft}s
      </text>
    </svg>
  );
}


// ⌛ Main Timer Component — default export
export default function TimerComponent({ RoundTime, isvisable, MessageHandler }) {
  const [timeLeft, setTimeLeft] = useState(RoundTime);
  const [compTIMEOUT,setcompTIMEOUT] = useState(null)
  
  useEffect(() => {
    if (!isvisable) return;
    setTimeLeft(RoundTime); 

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          console.log('TIMEOUT CALLING HANDELER')
          // HandleTimeout?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isvisable, RoundTime]);


  if (!isvisable) return null;

  return (
    <CircularTimer
      timeLeft={timeLeft}
      totalTime={RoundTime}
    />
  );
}