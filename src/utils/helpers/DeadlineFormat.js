import { useState } from "react";

// export const [deadlinePassed, setDeadlinePassed] = useState(false);

export function checkDeadline(deadlineString) {
  const now = new Date();
  const deadline = new Date(deadlineString);
  const timeDifference = deadline - now;

  if (timeDifference < 0) {
    return true;
  } else {
    return false;
  }
}

export function formatDeadline(deadlineString) {
  const now = new Date();
  const deadline = new Date(deadlineString);
  const timeDifference = deadline - now;

  const seconds = Math.floor(Math.abs(timeDifference) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (timeDifference < 0) {
    // setDeadlinePassed(true)
    if (seconds < 60) {
      return `${seconds} sec${seconds !== 1 ? "s" : ""}`;
    } else if (minutes < 60) {
      return `${minutes} min${minutes !== 1 ? "s" : ""}`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""}`;
    } else if (days < 31) {
      return `${days} day${days !== 1 ? "s" : ""}`;
    } else {
      return `${months} month${months !== 1 ? "s" : ""}`;
    }
  } else {
    // setDeadlinePassed(false)
    if (seconds < 60) {
      return `${seconds} sec${seconds !== 1 ? "s" : ""}`;
    } else if (minutes < 60) {
      return `${minutes} min${minutes !== 1 ? "s" : ""}`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""}`;
    } else if (days < 31) {
      return `${days} day${days !== 1 ? "s" : ""}`;
    } else {
      return `${months} month${months !== 1 ? "s" : ""}`;
    }
  }
}
