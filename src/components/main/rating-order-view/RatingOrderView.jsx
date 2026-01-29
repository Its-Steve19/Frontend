import "./rating-order.css";
import Rating from "../rating/Rating";
import { IoPersonSharp } from "react-icons/io5";
import { timeAgo } from "../../../utils/helpers/TimeAgo";

const RatingOrderView = ({ order, key }) => {
  return (
    <div key={key} className="rating-order-view">
      <div className="reviewer">
        <div>
          <IoPersonSharp size={50} />
        </div>
        <article>{order.client}</article>
      </div>
      <div className="review-content">
        <div className="review-h">
          <h1>{order.title}</h1>
          <small>{timeAgo(order.rating.created)} ago</small>
        </div>
        {/* <h2>{order.category}</h2> */}
        <article>{order.rating.message}</article>
        <Rating stars={order.rating.stars} />
      </div>
    </div>
  );
};

export default RatingOrderView;
