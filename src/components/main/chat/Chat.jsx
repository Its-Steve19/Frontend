import React from "react";
import "./chat.css";
import { IoSend } from "react-icons/io5";
import { useEffect } from "react";
import { useChatContext } from "../../../providers/ChatProvider";
import { useAuthContext } from "../../../providers/AuthProvider";
import { timeFormater } from "../../../utils/helpers/TimeFormater";
import { IoChatbubblesSharp } from "react-icons/io5";
import { useRef } from "react";
import { useState } from "react";
import { useLayoutEffect } from "react";
import { GoDash } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";

const Chat = ({ orderId, client, freelancer, showChat, setShowChat }) => {
  const navigate = useNavigate();
  const { loadedUserProfile, loadingUserProfile } = useAuthContext();
  const { loadingChats, chats, getChats, sendChat, socket, typingData } =
    useChatContext();

  const [typing, setTyping] = useState(false);

  const messageRef = useRef();
  const [msg, setMsg] = useState();

  const chatBoxRef = useRef();

  useEffect(() => {
    const bidderParam = new URLSearchParams(location.search).get("bid");
    if (bidderParam) {
      setShowChat(true);
    }
  }, []);

  const getReceiver = () => {
    return freelancer?.user?.username;
    // if  (loadedUserProfile.username === client.user.username) {
    //     return freelancer.user.username
    // } else if (loadedUserProfile.username === freelancer.user.username) {
    //     return client.user.username
    // }
  };

  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const handleFocus = () => {
      setIsKeyboardVisible(true);
    };

    const handleBlur = () => {
      setIsKeyboardVisible(false);
    };

    window.addEventListener("focus", handleFocus, true);
    window.addEventListener("blur", handleBlur, true);

    return () => {
      window.removeEventListener("focus", handleFocus, true);
      window.removeEventListener("blur", handleBlur, true);
    };
  }, []);

  const checkMsg = () => {
    setMsg(messageRef.current.value);

    const data = JSON.stringify({
      message: "typing",
      orderId: orderId,
      receiver: getReceiver(),
    });
    if (socket.OPEN) {
      socket.send(data);
    }
  };

  useLayoutEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight * 2;
    }
  }, [chats.list]);

  const submitMessage = (e) => {
    e.preventDefault();
    if (msg) {
      sendChat(msg, orderId, getReceiver()).then(() => {
        setMsg("");
      });
    }
  };

  const chatRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setShowChat(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (typingData?.order_id === orderId) {
      setTyping(typingData.typing);
    } else {
      setTyping(false);
    }
  }, [typingData, orderId]);

  useEffect(() => {
    orderId && getChats(orderId);
  }, [orderId]);

  return (
    <div
      className={`chat ${showChat ? "show-chat-box" : "hide-chat-box"} ${
        isKeyboardVisible && isMobile ? "minimize" : "maximize"
      }`}
      ref={chatRef}
    >
      <div className="chat-header">
        <div className="receiver-profile">
          <article
            className="img-chat"
            onClick={() => navigate(`../freelancer-prof/${getReceiver()}`)}
          >{`${
            getReceiver()?.charAt(0)?.toUpperCase() +
            getReceiver()?.slice(1).slice(0, 1)
          }`}</article>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <article>{getReceiver()}</article>
            {typing && <span>Typing...</span>}
          </div>
        </div>
        <div className="hide-icon-chat" onClick={() => setShowChat(false)}>
          <GoDash size={30} title="Click to hide chatbox" />
        </div>
      </div>
      {loadingChats || loadingUserProfile ? (
        <div>
          <span className="chat-loader">
            <PulseLoader color="#7fc2f5" />
          </span>
        </div>
      ) : chats.list?.length > 0 && loadedUserProfile ? (
        <div className="messages-box" id="msg" ref={chatBoxRef}>
          {chats.list?.map((msg, index) => {
            return (
              <>
                <div
                  key={index}
                  className={
                    msg.sender?.username === loadedUserProfile?.username
                      ? "send-message"
                      : "received-message"
                  }
                >
                  <article>{msg.message}</article>
                  <div className="time">
                    <small className="sent-at">
                      {timeFormater(msg.timestamp)}
                    </small>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      ) : (
        <div className="empty-inbox">
          <IoChatbubblesSharp color="#fff" size={50} />
          <article>Start chat</article>
        </div>
      )}
      <form className="message-reply-box" onSubmit={submitMessage}>
        <textarea
          rows="2"
          id="chat-input"
          required
          type="text"
          value={msg}
          ref={messageRef}
          onChange={checkMsg}
          placeholder="Type your message"
        />
        <IoSend
          title={!msg && "Type a message"}
          size={25}
          type="button"
          className={msg ? "submit-message active" : "submit-message inactive"}
          onClick={submitMessage}
        />
      </form>
    </div>
  );
};

export default Chat;
