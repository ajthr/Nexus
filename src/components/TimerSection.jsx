import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

function TimerSection() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(25);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        setMinutes((prevMinutes) => {
          if (prevMinutes === 0 && prevSeconds === 0) {
            // Timer finished
            clearInterval(interval);
            setIsRunning(false);

            if (window.api) {
              window.api.showNotification({
                title: 'Timer Finished!',
                body: 'Your timer has completed.',
              });
            }
            return prevMinutes;
          }

          if (prevSeconds === 0) {
            return prevMinutes - 1;
          }

          return prevMinutes;
        });

        if (prevSeconds === 0) {
          return 59;
        }

        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleReset = () => {
    setIsRunning(false);
    setMinutes(inputMinutes);
    setSeconds(0);
  };

  const handleSetTimer = (e) => {
    e.preventDefault();
    setMinutes(inputMinutes);
    setSeconds(0);
    setIsRunning(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="font-semibold flex items-center gap-2">
          <Clock size={18} />
          Timer
        </h3>
      </div>

      {/* min-h-0 here helps prevent this content from forcing extra height
          when used inside a flex/grid-based layout */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center overflow-y-auto">
        <div className="text-5xl font-bold mb-4 font-mono tabular-nums">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setIsRunning((prev) => !prev)}
            className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded flex items-center gap-2 transition-colors text-sm"
          >
            {isRunning ? (
              <>
                <Pause size={14} />
                Pause
              </>
            ) : (
              <>
                <Play size={14} />
                Start
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 px-5 py-2 rounded flex items-center gap-2 transition-colors text-sm"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        <form onSubmit={handleSetTimer} className="w-full max-w-xs">
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max="999"
              value={inputMinutes}
              onChange={(e) =>
                setInputMinutes(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-center text-sm"
              placeholder="Minutes"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded transition-colors text-sm"
            >
              Set
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TimerSection;
