import { useMemo } from 'react';

const Snowflake = () => {
  const snowflakes = useMemo(() => {
    return Array.from({ length: 100 }).map((_, index) => (
      <div
        key={index}
        className="snowflake"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 10}s`,
          fontSize: `${Math.random() * 40 + 10}px`,
          rotate: `${Math.random() * 360}deg`,
        }}
      >
        ❄
      </div>
    ));
  }, []); // The empty array ensures this only runs once

  return <>{snowflakes}</>;
};

export default Snowflake;