import React from "react";
import "./completed.css";
import OrderComponent from "../../../../components/main/order-component/OrderComponent";
import { useOrderContext } from "../../../../providers/OrderProvider";
import { HiMiniClipboardDocumentList } from "react-icons/hi2";
import LoadingSkeletonOrder from "../../loading/Loading";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ViewMore from "../../../../components/main/more/ScrollMore";
const Completed = () => {
  const navigate = useNavigate();
  const { ordersCompleted, loadingCompleted, getCompleted } = useOrderContext();

  return loadingCompleted ? (
    <LoadingSkeletonOrder />
  ) : ordersCompleted.orders.length > 0 ? (
    <>
      <div className="completed">
        {ordersCompleted.orders.map((order, index) => {
          return <OrderComponent content={order} key={index} />;
        })}
      </div>
      {ordersCompleted.next && <ViewMore fetch={getCompleted} />}
    </>
  ) : (
    <div className="wrapper-placeholder">
      <div className="create-task-div">
        <div className="child">
          <article>Find orders you complete here</article>
          <HiMiniClipboardDocumentList
            size={120}
            className="placeholder-icon"
          />
          <button className="go-to-order" onClick={() => navigate("/")}>
            Go to Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default Completed;
