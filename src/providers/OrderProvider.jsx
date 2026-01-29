import { useContext } from "react";
import { createContext } from "react";
import { useAuthContext } from "./AuthProvider";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useJwt } from "react-jwt";
import { toast } from "react-toastify";

export const OrderContext = createContext();

export const OrderProvider = (props) => {
  const navigate = useNavigate();

  const isSecureConnection = window.location.protocol === "https:";

  const ordersUrl = `${import.meta.env.VITE_API_URL}/orders/`;

  const { userToken } = useAuthContext();
  const { decodedToken } = useJwt(userToken);

  const [orders, setOrders] = useState([]);
  const [ordersAvailable, setOrdersAvailable] = useState({
    orders: [],
    count: 0,
    next: null,
  });
  const [ordersInProgress, setOrdersInProgress] = useState({
    orders: [],
    count: 0,
    next: null,
  });
  const [ordersCompleted, setOrdersCompleted] = useState({
    orders: [],
    count: 0,
    next: null,
  });

  const [bidders, setBidders] = useState({
    count: null,
    list: null,
    next: null,
  });

  const [loadingAvailable, setLoadingAvailable] = useState(true);

  const [loadingAttachemnt, setLoadingAttachment] = useState(false);

  const [loadingInProgress, setLoadingInProgress] = useState(true);
  const [loadingCompleted, setLoadingCompleted] = useState(true);

  const [submitLoading, setSubmitLoading] = useState(false);

  const [loadingBidders, setLoadingBidders] = useState(true);

  const [user, setUser] = useState();
  const [socket, setSocket] = useState(null);
  const [bidSocket, setBidSocket] = useState(null);

  const headersContent = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userToken}`,
  };

  const getAvailable = async (page_number) => {
    try {
      const getAvaialable = await fetch(
        `${ordersUrl}?status=available&page=${page_number}`,
        {
          headers,
        }
      );
      const available = await getAvaialable.json();

      setOrdersAvailable((prev) => ({
        orders: prev.orders.concat(available.results),
        count: available.count,
        next: available.next,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingAvailable(false);
    }
  };

  const getInProgress = async (page_number) => {
    try {
      const getInProgress = await fetch(
        `${ordersUrl}?status=in_progress&page=${page_number}`,
        {
          headers,
        }
      );
      const inProgress = await getInProgress.json();
      setOrdersInProgress((prev) => ({
        orders: prev.orders.concat(inProgress.results),
        count: inProgress.count,
        next: inProgress.next,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingInProgress(false);
    }
  };

  const getCompleted = async (page_number) => {
    try {
      const getCompleted = await fetch(
        `${ordersUrl}?status=completed&page=${page_number}`,
        {
          headers,
        }
      );
      const completed = await getCompleted.json();
      setOrdersCompleted((prev) => ({
        orders: prev.orders.concat(completed.results),
        count: completed.count,
        next: completed.next,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCompleted(false);
    }
  };

  const getAllOrders = async (page_number) => {
    // setLoading(false);
  };

  const createOrder = async (e) => {
    try {
      setSubmitLoading(true);
      e.preventDefault();
      const title = e.target.title?.value;
      const category = e.target.category?.value;
      const deadline = new Date(e.target.deadline?.value);
      const instructions = e.target.instructions?.value;
      const subject = e.target.subCategory?.value;
      const pages = e.target.pages?.value;
      const amount = e.target.amount?.value;
      let milestones = 1;

      if (e.target.milestones) {
        milestones = e.target.milestones?.value;
      }

      const headers = {
        Authorization: `Bearer ${userToken}`,
      };

      let bodyData;

      if (e.target.attachment.files.length > 0) {
        const attachment = e.target.attachment.files[0];
        const data = new FormData();
        data.append("title", title);
        data.append("category", category);
        data.append("attachment", attachment);
        data.append("deadline", deadline.toISOString());
        data.append("instructions", instructions);
        data.append("subCategory", subject);
        data.append("milestones", milestones);
        data.append("pages", pages);
        data.append("amount", amount);

        bodyData = data;
        console.log(data);
      } else {
        const jsonPayload = {
          title,
          category,
          deadline: deadline.toISOString(),
          instructions,
          amount,
          subject: subject,
          milestones: milestones,
          page_count: pages,
        };

        bodyData = JSON.stringify(jsonPayload);
        headers["Content-Type"] = "application/json";
      }

      const createOrder = await fetch(ordersUrl, {
        method: "post",
        headers,
        body: bodyData,
      });

      const status = createOrder.status;

      if (status === 201) {
        const createdOrder = await createOrder.json();

        toast.success("Your task has been created.");
        setSubmitLoading(false);
        // setOrdersAvailable((prev) => {
        //   return {
        //     ...prev,
        //     orders: [createdOrder].concat(prev.orders),
        //     count: prev.count + 1,
        //   };
        // });
        navigate("../available");
      } else if (status === 401) {
        navigate("/login?redirect=create-task");
      }
    } catch (error) {
      toast.error("Error occured while creating your order");
      console.error(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const updateInstructions = async (instructions, orderId) => {
    try {
      const updateOrder = await fetch(`${ordersUrl}${orderId}/`, {
        method: "put",
        headers: headersContent,
        body: JSON.stringify({
          instructions: instructions,
        }),
      });

      if (updateOrder.ok) {
        const data = updateOrder.json();
        return data;
      } else {
        const status = updateOrder.status;
        if (status === 401) {
          navigate(`../login?order=${orderId}`);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const uploadAttachment = async (file, orderId) => {
    setLoadingAttachment(true);
    try {
      const data = new FormData();
      data.append("attachment", file);
      const response = await fetch(`${ordersUrl}${orderId}/`, {
        method: "put",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: data,
      });

      if (response.ok) {
        const dataRes = await response.json();
        return dataRes;
      } else {
        const status = response.status;
        if (status === 401) {
          console.log("NOT ALLOWED");
          navigate(`../login?order=${orderId}`);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAttachment(false);
    }
  };

  const completeOrder = async (orderId) => {
    try {
      const completeOrderStatus = await fetch(`${ordersUrl}${orderId}/`, {
        method: "put",
        headers: headersContent,
        body: JSON.stringify({
          status: "Completed",
        }),
      });

      if (completeOrderStatus.ok) {
        const data = await completeOrderStatus.json();

        setOrdersInProgress((prev) => {
          console.log(prev);
          const updatedOrders = prev.orders.filter((order) => {
            return order.id !== orderId;
          });
          console.log(updatedOrders);
          return {
            ...prev,
            orders: updatedOrders,
            count: prev.count - 1,
          };
        });

        getInProgress(1);

        setOrdersCompleted((prev) => {
          const updatedOrders = [data].concat(prev.orders);

          return {
            ...prev,
            orders: updatedOrders,
            count: prev.count + 1,
          };
        });
        return data;
      } else {
        const status = completeOrderStatus.status;
        if (status === 401) {
          navigate(`../login?order=${orderId}`);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const updateOrdersAvailable = (orderRes) => {
    setOrdersAvailable((prev) => {
      const updatedOrders = prev.orders.filter((order) => {
        return order.id !== orderRes?.id;
      });
      return {
        ...prev,
        orders: updatedOrders,
        count: prev.count - 1,
      };
    });

    getAvailable(1);

    setOrdersInProgress((prev) => {
      const updatedOrders = [orderRes].concat(prev.orders);
      return {
        ...prev,
        orders: updatedOrders,
        count: prev.count + 1,
      };
    });
  };

  const getBiddersForOrder = async (page, orderId) => {
    try {
      const getBidders = await fetch(
        `${ordersUrl}${orderId}/bidders?page=${page}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (getBidders.ok) {
        const response = await getBidders.json();
        setBidders((prev) => {
          return {
            ...prev,
            list: prev.list
              ? prev.list?.concat(response.results)
              : response.results,
            next: response.next,
            count: response.count,
          };
        });
      } else {
        toast.error("Failed to load available bidders!");
      }
    } catch (error) {
      console.log(error);
      toast.error("We could not find any bidders at the moment!");
    } finally {
      setLoadingBidders(false);
    }
  };

  useEffect(() => {
    setUser(decodedToken?.user_id);
    if (user) {
      const newSocket = new WebSocket(
        `${
          isSecureConnection
            ? import.meta.env.VITE_WSS_URL
            : import.meta.env.VITE_WS_URL
        }/bid/${user}/`
      );
      setBidSocket(newSocket);
      newSocket.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);
        console.log(receivedData);

        const newBid = receivedData.message.bid;

        fetch(`${ordersUrl}${newBid.order}`, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else {
              throw new Error("Error occurred");
            }
          })
          .then((data) => {
            return data;
          })
          .then((newOrder) => {
            if (!receivedData.message.delete) {
              setBidders((prev) => {
                const bidsForOrder = prev?.list?.filter((p) => {
                  return p.order === newOrder.order;
                });
                return {
                  ...prev,
                  list: bidsForOrder?.concat([newBid]),
                  count: prev.count + 1,
                };
              });
            }

            if (receivedData.message.delete) {
              setBidders((prev) => {
                const bidsForOrder = prev?.list?.filter((p) => {
                  return p.order === newBid.order;
                });

                const newBidList = bidsForOrder?.filter((bid) => {
                  return bid.id !== newBid.id;
                });
                return {
                  list: newBidList,
                  count: prev.count - 1,
                };
              });
              console.log("Delete");
            }

            // setOrdersAvailable((prev) => {
            //   console.log(prev);
            // });

            setOrdersAvailable((prev) => ({
              ...prev,
              orders: prev.orders.map((order) => {
                if (order.id === newOrder.id) {
                  return {
                    ...order,
                    ...newOrder,
                  };
                }
                return order;
              }),
            }));

            // setOrdersAvailable.orders.map((order) => {
            //   console.log(order.id, newOrder.id);
            //   if (order.id === newOrder.id) {
            //     console.log("True");
            //     return {
            //       ...order,
            //       ...newOrder,
            //     };
            //   }
            //   return order;
            // });
          })
          .catch((error) => {
            console.log(error);
          });
      };
      setBidSocket(newSocket);
    } else {
      bidSocket?.close();
    }

    return () => {
      if (bidSocket) {
        bidSocket.close();
      }
    };
  }, [decodedToken, user]);

  useEffect(() => {
    setUser(decodedToken?.user_id);
    if (user) {
      const newSocket = new WebSocket(
        `${
          isSecureConnection
            ? import.meta.env.VITE_WSS_URL
            : import.meta.env.VITE_WS_URL
        }/order/${user}/`
      );
      setSocket(newSocket);
      newSocket.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);
        const newOrder = receivedData.message.order;
        setOrdersAvailable((prev) => {
          return {
            ...prev,
            orders: [newOrder].concat(prev.orders),
          };
        });
      };
      setSocket(newSocket);
    } else {
      socket?.close();
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [decodedToken, user]);

  useEffect(() => {
    setUser(decodedToken?.user_id);
    if (user) {
      const newSocket = new WebSocket(
        `${
          isSecureConnection
            ? import.meta.env.VITE_WSS_URL
            : import.meta.env.VITE_WS_URL
        }/solutions/${user}/`
      );
      setSocket(newSocket);
      newSocket.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);
        const newOrder = receivedData.message.solution;
        console.log(receivedData);
        // setOrdersAvailable((prev) => {
        //   return {
        //     ...prev,
        //     orders: [newOrder].concat(prev.orders),
        //   };
        // });
      };
      setSocket(newSocket);
    } else {
      socket?.close();
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [decodedToken, user]);
  // const [orderDetails, setOrderDetails] = useState();

  useEffect(() => {
    userToken && getAllOrders();
    if (userToken) {
      getAvailable(1);
      getInProgress(1);
      getCompleted(1);
    }
  }, [userToken]);

  const [openHelp, setOpenHelp] = useState(false);

  const help = () => {
    setOpenHelp(true);
  };

  const closeHelp = () => {
    setOpenHelp(false);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        ordersAvailable,
        ordersInProgress,
        ordersCompleted,
        loadingAvailable,
        loadingInProgress,
        loadingCompleted,
        submitLoading,
        loadingAttachemnt,
        bidders,
        loadingBidders,
        openHelp,
        help,
        closeHelp,
        createOrder,
        updateInstructions,
        completeOrder,
        getAvailable,
        getInProgress,
        getCompleted,
        uploadAttachment,
        updateOrdersAvailable,
        getBiddersForOrder,
      }}
    >
      {props.children}
    </OrderContext.Provider>
  );
};

export function useOrderContext() {
  return useContext(OrderContext);
}
