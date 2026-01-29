import React from "react";
import "./in-progress.css";
import OrderComponent from "../../../../components/main/order-component/OrderComponent";
import { useOrderContext } from "../../../../providers/OrderProvider";
import { useNavigate } from "react-router-dom";
import { HiMiniClipboardDocumentList } from "react-icons/hi2";
import LoadingSkeletonOrder from "../../loading/Loading";
import { useState } from "react";
import ViewMore from "../../../../components/main/more/ScrollMore";

const InProgress = () => {
  const { ordersInProgress, loadingInProgress, getInProgress } =
    useOrderContext();

  const navigate = useNavigate();

  return loadingInProgress ? (
    <LoadingSkeletonOrder />
  ) : ordersInProgress.orders.length > 0 ? (
    <>
      <div className="main-in-progress">
        {ordersInProgress.orders.map((order, index) => {
          return <OrderComponent key={index} content={order} />;
        })}
      </div>
      {ordersInProgress.next && <ViewMore fetch={getInProgress} />}
    </>
  ) : (
    <div className="wrapper-placeholder">
      <div className="create-task-div">
        <div className="child">
          <article>Orders you create will appear here</article>
          <HiMiniClipboardDocumentList
            size={120}
            className="placeholder-icon"
          />
          <button
            className="go-to-order"
            onClick={() => navigate("../create-task")}
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default InProgress;
