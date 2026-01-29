import { useState } from "react";

const ViewMore = ({ fetch, orderId }) => {
  let [page, setPage] = useState(1);
  const fetchNext = () => {
    setPage((page += 1));
    fetch(page, orderId);
  };

  return (
    <div className="next-wrapper">
      <button onClick={fetchNext} className="next">
        More
      </button>
    </div>
  );
};

export default ViewMore;
