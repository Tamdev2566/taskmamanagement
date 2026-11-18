import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update the time state every second
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(timerId);
  }, []);

  // Calculate rotation degrees
  // 360 degrees / 12 hours = 30 degrees per hour
  // 30 degrees / 60 minutes = 0.5 degrees per minute
  const hours = time.getHours() % 12; // 12-hour format
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = (hours * 30) + (minutes * 0.5);
  // 360 degrees / 60 minutes = 6 degrees per minute
  const minuteDeg = (minutes * 6) + (seconds * 0.1);
  // 360 degrees / 60 seconds = 6 degrees per second
  const secondDeg = seconds * 6;

  // Inline style objects for hands
  const hourStyle = {
    transform: `translateX(-50%) rotate(${hourDeg}deg)`,
  };

  const minuteStyle = {
    transform: `translateX(-50%) rotate(${minuteDeg}deg)`,
  };

  const secondStyle = {
    transform: `translateX(-50%) rotate(${secondDeg}deg)`,
  };

  return (
    <StyledWrapper>
      <div className="realistic-clock">
        <div className="clock-face">
          <div className="glass-cover" />
          {/* Apply dynamic rotation styles */}
          <div className="hour hand" style={hourStyle} />
          <div className="minute hand" style={minuteStyle} />
          <div className="second hand" style={secondStyle} />
          <div className="center-circle" />
          <div className="clock-numbers">
            <p style={{top: '0.5px', left: 135}} className="number">12</p>
            <p style={{top: 100, right: 10}} className="number">3</p>
            <p style={{bottom: '0.5px', left: 135}} className="number">6</p>
            <p style={{top: 100, left: 10}} className="number">9</p>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .realistic-clock {
    position: relative;
    width: 300px;
    height: 300px;
    margin: 50px auto;
  }

  .clock-face {
    position: relative;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, #333, #111);
    border-radius: 50%;
    border: 10px solid #cec5c5;
    box-shadow:
      0 0 30px rgba(0, 0, 0, 0.5),
      inset 0 0 20px rgba(255, 255, 255, 0.1);
  }

  .glass-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.3);
    pointer-events: none;
  }

  .center-circle {
    position: absolute;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, #666, #333);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
  }

  .hand {
    position: absolute;
    background: #222;
    border-radius: 2px;
    left: 50%;
    transform-origin: bottom;
    /* Remove 'transform: translateX(-50%);' here.
       The full transform is now applied by the inline style.
       Adding a transition will make the movement smooth. */
    transition: transform 0.1s linear; /* Smooth movement for second hand */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
  }

  .hour {
    width: 10px;
    height: 100px;
    top: 70px;
    background: linear-gradient(to bottom, #1d6981, #444);
    /* animation: rotate-hour... REMOVED */
  }

  .minute {
    width: 6px;
    height: 100px;
    top: 60px;
    background: linear-gradient(to bottom, #bbb, #666);
    /* animation: rotate-minute... REMOVED */
  }

  .second {
    width: 3px;
    height: 100px;
    top: 45px;
    background: red;
    /* animation: rotate-second... REMOVED */
  }

  .number {
    position: absolute;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
  }

  /* Keyframes are no longer needed and have been removed */
`;

export default Clock;