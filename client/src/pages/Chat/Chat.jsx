import socketIOClient from "socket.io-client";
import React, { useRef, useState, useEffect } from "react";
import { /* useDispatch, */ useSelector } from "react-redux";

// api
import { userChats, createChat } from "../../api/ChatRequests";

// component
import ChatBox from "../../components/ChatBox/ChatBox";
import Conversation from "../../components/Coversation/Conversation";
import LogoSearch from "../../components/LogoSearch/LogoSearch";
import NavIcons from "../../components/NavIcons/NavIcons";

// style
import "./Chat.css";

const Chat = () => {
  const socket = useRef();
  const isCallAPICreateChatRef = useRef(false);
  const { user } = useSelector((state) => state.authReducer.authData);

  const [chats, setChats] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);

  const addChat = async (receiverId) => {
    try {
      const {data} = await createChat(user._id, receiverId);
      if(data) {
        setChats((prevState) => {
          prevState[receiverId] = data;
          return {...prevState};
        })
        setCurrentChat(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // const
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const receiverId = searchParams.get('receiverId')
    const arrayChat =  Object.keys(chats);
    if(receiverId && arrayChat.length > 0 && !isCallAPICreateChatRef.current) {
      isCallAPICreateChatRef.current = true
      if(arrayChat.includes(receiverId)) {
        setCurrentChat(chats[receiverId]);
      } else {
        addChat(receiverId).then()
      }
    }
  }, [chats])

  // Get the chat in chat section
  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user._id);
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [user._id]);

  // Connect to Socket.io
  useEffect(() => {
    const server = process.env.SERVER_API_CHAT;
    socket.current = socketIOClient.connect(server);
    // socket.current = socketIOClient.connect(server);
    socket.current.emit("new-user-add", user._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);}
  }, [sendMessage]);


  // Get the message from socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      console.log(data)
      setReceivedMessage(data);
    });
    return () => {
      socket.current.disconnect();
    };
  }, []);


  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return !!online;
  };

  return (
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat">
        <LogoSearch />
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {Object.values(chats).map((chat) => (
              <div
                onClick={() => {
                  setCurrentChat(chat);
                }}
              >
                <Conversation
                  data={chat}
                  currentUser={user._id}
                  online={checkOnlineStatus(chat)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="Right-side-chat">
        <div style={{ width: "20rem", alignSelf: "flex-end" }}>
          <NavIcons />
        </div>
        <ChatBox
          chat={currentChat}
          currentUser={user._id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
