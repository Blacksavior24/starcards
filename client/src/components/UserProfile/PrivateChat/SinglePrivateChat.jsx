import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "../../../redux/actions/user";
import socket from "./Socket";

import css from "./PrivateChat.module.css";

const SinglePrivateChat = ({ newChatUser }) => {
  const dispatch = useDispatch();

  const userActive = useSelector((state) => state.userReducer.user);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    dispatch(getUser(userActive.id));
  }, []);

  useEffect(() => {
    if (userActive) {
      socket.emit("connectPrivateSocket", userActive.id);
    }

    return () => {
      socket.emit("disconnectPrivateSocket", userActive.id);
    };
  }, [userActive]);

  useEffect(() => {
    socket.on("privateMessage", (user, message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off();
    };
  }, [messages]);

  const divRef = useRef(null);
  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: "auto" });
  }, [divRef.current, messages]);

  const submit = (e) => {
    e.preventDefault();
    socket.emit("privateMessage", userActive, newChatUser, message);
    setMessage("");
  };

  return (
    <div className={css.chatContainer}>
      <div className={css.chatUsers}>{newChatUser.username}</div>

      <div className={css.chatBodyContainer}>
        <div className={css.chatText}>
          {messages.length
            ? messages.map((e, i) => <div key={i}>{e}</div>)
            : ""}
          <div ref={divRef}></div>
        </div>
        <form onSubmit={submit} className={css.chatForm}>
          <textarea
            name=""
            id=""
            cols="30"
            rows="10"
            value={message}
            placeholder="Escribe tu mensaje"
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") submit(e);
            }}
            className={css.textArea}
          />
          <input type="submit" value="Enviar" />
        </form>
      </div>
    </div>
  );
};

export default SinglePrivateChat;