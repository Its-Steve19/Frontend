function getHoursToDeadline(deadline) {
  const now = new Date();
  const date = new Date(deadline);
  const timeDifference = date - now;
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return hours;
}

function getPrice(price, hoursRemain) {
  if (hoursRemain > 2.9 && hoursRemain <= 3.1) {
    return price * 1.35;
  } else if (hoursRemain > 3.1 && hoursRemain < 8.0) {
    return price * 1.2;
  } else if (hoursRemain >= 8.0) {
    return price;
  } else {
    return price;
  }
}

export const calculatePrice = (
  unit,
  orderMilestoneCount,
  deadline = new Date()
) => {
  let milestoneCount = parseInt(orderMilestoneCount);
  if (milestoneCount === 0) {
    milestoneCount = 1;
  }
  const basePrice = 8.0;
  const hoursRemain = getHoursToDeadline(deadline);
  const price = getPrice(basePrice * unit * milestoneCount, hoursRemain);

  return parseFloat(price);
};
