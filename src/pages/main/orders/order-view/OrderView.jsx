import "./orderview.css";
import { IoMdDownload } from "react-icons/io";
import Chat from "../../../../components/main/chat/Chat";
import { MdModeEdit } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useOrderContext } from "../../../../providers/OrderProvider";
import { timeAgo } from "../../../../utils/helpers/TimeAgo";
import { MdAdd } from "react-icons/md";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useCallback } from "react";
import { useRef } from "react";
import { VscFile } from "react-icons/vsc";
import OrderSkeletonLoading from "../../loading/OrderSkeletonLoading";
import PulseLoader from "react-spinners/PulseLoader";
import { useAuthContext } from "../../../../providers/AuthProvider";
import { formatDeadline } from "../../../../utils/helpers/DeadlineFormat";
import { checkDeadline } from "../../../../utils/helpers/DeadlineFormat";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaypalPayment from "../../payment/PaypalPayment";
import BiddersComponent from "../../../../components/main/bidders/BiddersComponent";
import { Routes, Route } from "react-router-dom";
import Rating from "../../../../components/main/rating/Rating";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { useAddRating } from "../../../../components/main/modal/Ratings-modal/addRating";
import { useDeleteModal } from "../../../../components/main/modal/Ratings-modal/cancelRating";
import StripePayment from "../../payment/StripePayment";
import { FiAlertOctagon } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import ViewMore from "../../../../components/main/more/ScrollMore";
import Support from "../../../../components/main/support/Support";
import { MdHelpOutline } from "react-icons/md";
import { MdContentCopy } from "react-icons/md";

const OrderView = () => {
  const ordersUrl = `${import.meta.env.VITE_API_URL}/orders/`;

  const { userToken } = useAuthContext();

  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const iconSize = 20;

  const { orderId } = useParams();

  const [solution, setSolution] = useState({
    count: null,
    list: null,
    next: null,
  });

  const {
    loadingAttachemnt,
    updateInstructions,
    openHelp,
    help,
    completeOrder,
    uploadAttachment,
  } = useOrderContext();

  const [orderContent, setOrderContent] = useState();

  const { AddRating, setShowAddRatingModal } = useAddRating(
    orderId,
    setOrderContent
  );

  const [loading, setLoading] = useState();

  const uploadedAt = timeAgo(orderContent?.solution?.created);

  const deadline = formatDeadline(orderContent?.deadline);

  const deadlinePassed = checkDeadline(orderContent?.deadline);

  const [showBidders, setShowBidders] = useState(false);

  const [editInstructions, setEditInstructions] = useState(false);
  const [editedInstructions, setEditedInstructions] = useState(
    orderContent?.instructions
  );

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const bidderParam = new URLSearchParams(location.search).get("bid");

  const [showPaypal, setshowPaypal] = useState(true);
  const checkChatParam = (bidderParam) => {
    if (bidderParam) {
      return true;
    } else {
      return false;
    }
  };
  const [showChat, setShowChat] = useState(checkChatParam(bidderParam));

  const toggleInstructionMode = () => {
    setEditedInstructions(orderContent?.instructions);
    setEditInstructions(!editInstructions);
  };

  const handleInstructionChange = (e) => {
    setEditedInstructions(e.target.value);
  };

  const updateNewInstructions = () => {
    updateInstructions(editedInstructions, orderId).then((data) => {
      if (data) {
        const updatedOrder = {
          ...orderContent,
          instructions: data.instructions,
        };
        updatedOrder.instructions = data.instructions;
        setOrderContent(updatedOrder);
      }
    });
    setEditInstructions(false);
    // setOrder(getOrder(orderId));coi

    // useCallback(()=>{
    //     setRefresh((prev)=>prev+1);
    // },[])
  };

  const changeOrderStatus = () => {
    if (solution?.list?.length > 0) {
      // check not paid
      if (!orderContent.paid) {
        setShowPaymentModal(true);
      } else if (orderContent.paid) {
        completeOrder(orderId).then((data) => {
          const updatedOrder = {
            ...orderContent,
            status: data.status,
          };
          orderContent.status = data.status;
          setOrderContent(updatedOrder);
          toast.success("Order completed successfully");
        });
      }
    } else {
      toast.error("The order has no solution");
    }
  };

  const openFileDialog = () => {
    console.log("Opening file dialog");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadAttachmentFile = (e) => {
    const attachment = e.target.files[0];
    console.log("Submitted");
    if (attachment) {
      if (attachment.size <= 20 * 1024 * 1024) {
        uploadAttachment(attachment, orderId).then((res) => {
          console.log(res);
          const attachmentUrl = res?.attachment;

          const updatedOrder = {
            ...orderContent,
            attachment: attachmentUrl,
          };

          orderContent.attachment = attachmentUrl;

          setOrderContent(updatedOrder);
        });
      } else {
        console.log("Select lower size file");
      }
    } else {
      console.log("Select correct file format");
    }
  };

  const downloadFile = () => {
    const link = document.getElementById("solution-file");
    link.download = solution?.list?.substring(
      solution?.list?.lastIndexOf("/") + 1
    );
    link.click();
  };

  const getOrder = async (orderId) => {
    try {
      setLoading(true);
      const getOrderById = await fetch(`${ordersUrl}${orderId}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (getOrderById.ok) {
        const orderDetails = await getOrderById.json();
        setOrderContent(orderDetails);
        return orderDetails;
      } else {
        const status = getOrderById.status;
        if (status === 401) {
          navigate(`/login?order=${orderId}`);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (orderID) => {
    try {
      const performDelete = await fetch(`${ordersUrl}${orderID}`, {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (performDelete.ok) {
        toast.success("Order deleted successfully");
        navigate("../available");
      } else {
        toast.error("Failed to delete order");
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
    }
  };

  const getSolutionForOrder = async (page) => {
    const getSolution = await fetch(
      `${ordersUrl}${orderId}/solution?page=${page}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    if (getSolution.ok) {
      const response = await getSolution.json();

      setSolution((prev) => {
        return {
          ...prev,
          list: prev?.list
            ? response.results.concat(prev?.list)
            : response.results,
          count: response.count,
          next: response.next,
        };
      });
    }
  };

  useEffect(() => {
    getOrder(orderId);
    orderId && getSolutionForOrder(1);
  }, [orderId]);

  // FIXME: Order creation price update
  // FIXME: Fix order not loading to dashboard
  return (
    <div className="order-view">
      {!openHelp && (
        <span className="help-icon">
          Help
          <MdHelpOutline
            style={{ cursor: "pointer" }}
            size={30}
            title="Contact support team"
            onClick={help}
          />
        </span>
      )}

      {loading ? (
        <OrderSkeletonLoading />
      ) : (
        orderContent && (
          <>
            <div className="order-details">
              <AddRating />
              <strong style={{ fontWeight: "bold" }}>
                {orderContent?.title}
              </strong>
              <article
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                Order ID{" "}
                <span
                  style={{
                    fontSize: "1.4rem",
                    cursor: "pointer",
                    display: "flex",
                    gap: "0.25rem",
                  }}
                >
                  {orderContent.unique_code}
                  <span>
                    <MdContentCopy
                      size={15}
                      onClick={() => {
                        toast.success("Copied to clipboard!");
                        navigator.clipboard.writeText(orderContent.unique_code);
                      }}
                      title="Click to copy"
                    />
                  </span>
                </span>
              </article>

              <div className="order-elements">
                <li>{orderContent?.category}</li>
                {orderContent?.category === "Writing" ? (
                  <li>{orderContent?.milestones} Pages</li>
                ) : (
                  <li>{orderContent?.milestones} Milestones</li>
                )}
                <strong style={{ fontWeight: "bold" }}>
                  {!loading && "$" + orderContent?.amount}
                </strong>
                <article className="status">{orderContent?.status}</article>
                {orderContent.status == "Available" && (
                  <RiDeleteBin6Line
                    title="Delete order"
                    onClick={() => deleteOrder(orderId)}
                    size={iconSize}
                    color="red"
                    style={{ cursor: "pointer" }}
                  />
                )}
                {orderContent?.status === "In Progress" && (
                  <button
                    style={{
                      cursor: !solution?.list?.length && "not-allowed",
                    }}
                    title={
                      !solution?.list?.length &&
                      "Cannot complete order without solution"
                    }
                    onClick={changeOrderStatus}
                    className="complete-order"
                  >
                    Complete Order
                  </button>
                )}
                {!showChat && (bidderParam || orderContent?.freelancer) && (
                  <div
                    title="Click to view chats"
                    className="chat-toggle"
                    onClick={() => setShowChat(true)}
                    style={{
                      padding: "4px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IoChatbubbleEllipsesOutline size={25} />
                  </div>
                )}
                {!bidderParam && orderContent?.status === "Available" && (
                  <div className="bidders-toggle" title="Show bidders">
                    <button
                      className="bidders"
                      onClick={() => setShowBidders(true)}
                    >
                      Bidders
                    </button>
                  </div>
                )}
              </div>
              {orderContent?.status != "Completed" && (
                <div>
                  {deadlinePassed && (
                    <article
                      style={{
                        color: "red",
                      }}
                    >
                      {deadline}
                      <span className="ml-2"> overdue</span>
                    </article>
                  )}
                  {!deadlinePassed && (
                    <article style={{ color: "green" }}>
                      {deadline} Remain
                    </article>
                  )}
                </div>
              )}
              {orderContent?.status === "Completed" &&
                (orderContent?.rating ? (
                  <div className="rating">
                    {
                      <>
                        <article>{orderContent.rating.message}</article>
                        <Rating stars={orderContent?.rating.stars} />
                      </>
                    }
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddRatingModal(true)}
                    className="rating-btn"
                  >
                    Add Rating
                  </button>
                ))}

              {(orderContent.status === "Completed" ||
                orderContent.status === "In Progress") && (
                <div className="order-soln">
                  {solution?.list ? (
                    <>
                      {showPaymentModal && (
                        <div className="payment-box ">
                          <div className="payment-info">
                            <article
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <div>
                                <FiAlertOctagon size={20} />
                              </div>
                              You're a step away, let's checkout your order
                              first
                            </article>
                            <IoIosClose
                              onClick={() => {
                                setShowPaymentModal(false);
                                setshowPaypal(true);
                              }}
                              className="close-pay"
                              size={25}
                            />
                          </div>
                          <div className="payment-options">
                            <StripePayment
                              show={setShowPaymentModal}
                              order_id={orderId}
                              showPaypal={setshowPaypal}
                            />
                            {showPaypal && (
                              <PaypalPayment
                                show={setShowPaymentModal}
                                orderId={orderId}
                                getOrder={getOrder}
                              />
                            )}
                          </div>
                        </div>
                      )}
                      <strong>Uploaded solution</strong>
                      <div className="solutions">
                        {solution?.list?.map((sln) => {
                          return (
                            <table className="sln-table">
                              <tbody>
                                <td className="solution">
                                  <a
                                    href={`${sln?.solution}`}
                                    id="solution-file"
                                  >
                                    {sln?.solution?.substring(
                                      sln?.solution?.lastIndexOf("/") + 1
                                    )}
                                  </a>
                                </td>
                                <td className="type">
                                  <article
                                    style={{
                                      color:
                                        sln?._type === "Final"
                                          ? "green"
                                          : "orange",
                                    }}
                                  >
                                    {sln?._type}
                                  </article>
                                </td>
                                <td className="dnload">
                                  <>
                                    <IoMdDownload
                                      className="download-icon"
                                      onClick={downloadFile}
                                      style={{ cursor: "pointer" }}
                                      size={iconSize}
                                    />
                                  </>
                                </td>
                                <td className="timeago">
                                  <article className="">
                                    {timeAgo(sln?.created)}{" "}
                                  </article>
                                </td>
                              </tbody>
                            </table>
                          );
                        })}
                      </div>
                      {solution.next && (
                        <ViewMore fetch={getSolutionForOrder} />
                      )}
                    </>
                  ) : (
                    <strong style={{ color: "orange" }}>
                      Solution will be uploaded soon
                    </strong>
                  )}
                </div>
              )}
              <div className="instructions">
                <strong>
                  {orderContent?.status === "In Progress" ||
                  orderContent.status === "Available"
                    ? orderContent?.instructions
                      ? "Instructions"
                      : "Add Instructions"
                    : orderContent?.status === "Completed" && "Instructions"}
                  {(orderContent?.status === "In Progress" ||
                    orderContent.status === "Available") &&
                    (editInstructions &&
                    orderContent?.instructions != editedInstructions ? (
                      <button
                        className="submit-instructions"
                        onClick={updateNewInstructions}
                      >
                        Submit
                      </button>
                    ) : (
                      <MdModeEdit
                        className="edit-icon"
                        style={{ cursor: "pointer" }}
                        size={iconSize}
                        onClick={toggleInstructionMode}
                      />
                    ))}
                </strong>
                {editInstructions ? (
                  <div style={{ width: "100%" }}>
                    <textarea
                      placeholder="Tell us about your order!"
                      name="instructions"
                      id="instructions"
                      value={editedInstructions}
                      style={{
                        width: "100%",
                        padding: "0.5rem 0",
                        outline: "none",
                        border: "none",
                        resize: "none",
                        borderRadius: "4px",
                        padding: "0 4px",
                      }}
                      rows={5}
                      readOnly={false}
                      onChange={handleInstructionChange}
                    />
                  </div>
                ) : (
                  orderContent?.instructions && (
                    <div>
                      <article>{orderContent?.instructions}</article>
                    </div>
                  )
                )}
              </div>
              {orderContent?.status === "Completed" &&
              !orderContent?.attachment ? null : (
                <div className="attachments">
                  {orderContent?.attachment && loadingAttachemnt ? (
                    <div style={{ height: "1.5rem" }}>
                      <PulseLoader size={10} color="#7fc2f5" />
                    </div>
                  ) : (
                    <strong style={{ height: "1.5rem" }}>
                      {orderContent?.attachment ? "Attachments" : "Attachments"}
                      {(orderContent?.status === "In Progress" ||
                        orderContent.status === "Available") && (
                        <MdAdd
                          onClick={openFileDialog}
                          style={{ cursor: "pointer" }}
                          size={20}
                        />
                      )}
                      <input
                        onChange={uploadAttachmentFile}
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        size={20 * 1024 * 1024}
                        type="file"
                        name=""
                        id=""
                      />
                    </strong>
                  )}
                  {!orderContent?.attachment &&
                    (orderContent?.status === "In Progress" ||
                      orderContent.status === "Available") && (
                      <div className="upload-div">
                        <article onClick={openFileDialog}>
                          <VscFile className="file-icon" size={iconSize} />
                          Upload an attachment
                          <input
                            onChange={uploadAttachmentFile}
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            size={20 * 1024 * 1024}
                            type="file"
                            name=""
                            id=""
                          />
                        </article>
                      </div>
                    )}
                  {orderContent?.attachment && (
                    <div>
                      <a href={orderContent?.attachment} target="_blank">
                        {(orderContent?.attachment).substring(
                          orderContent?.attachment.lastIndexOf("/") + 1
                        )}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
            <Routes>
              <Route to="bidders" element={<BiddersComponent />} />
              <Route to="chats" element={<Chat />} />
            </Routes>
            {orderContent.status === "Available" ? (
              !openHelp ? (
                <BiddersComponent
                  orderId={orderId}
                  client={orderContent.client}
                  // bidders={orderContent.bidders}
                  getOrder={getOrder}
                  setShowBidders={setShowBidders}
                  showBidders={showBidders}
                  showChat={showChat}
                  setShowChat={setShowChat}
                />
              ) : (
                <Support />
              )
            ) : !openHelp ? (
              <Chat
                orderId={orderId}
                client={orderContent.client}
                freelancer={orderContent.freelancer}
                showChat={showChat}
                setShowChat={setShowChat}
              />
            ) : (
              <Support />
              // <Support client={orderContent.client} />
            )}
            {/* <Chat orderId={orderId} client={orderContent.client} freelancer={orderContent.freelancer} /> */}
          </>
        )
      )}
    </div>
  );
};

export default OrderView;
