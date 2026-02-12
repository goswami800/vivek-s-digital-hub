import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  endDate: string;
}

const CountdownTimer = ({ endDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const update = () => {
      const diff = new Date(endDate).getTime() - Date.now();
      if (diff <= 0) {
        setExpired(true);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (expired) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-1.5 mt-2">
      <Clock className="w-3 h-3 text-destructive animate-pulse" />
      <div className="flex gap-1 text-xs font-mono">
        {timeLeft.days > 0 && (
          <span className="bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">{timeLeft.days}d</span>
        )}
        <span className="bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">{pad(timeLeft.hours)}h</span>
        <span className="bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">{pad(timeLeft.minutes)}m</span>
        <span className="bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">{pad(timeLeft.seconds)}s</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
