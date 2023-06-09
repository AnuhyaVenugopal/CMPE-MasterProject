import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import ChatInput from './ChatInput'
import Logout from './Logout'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
//  import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([])
  const scrollRef = useRef()
  const [arrivalMessage, setArrivalMessage] = useState(null)

  useEffect(() => {
    const callChat = async () => {
      const data = JSON.parse(sessionStorage.getItem('details'))
      const response = await axios.post(
        'http://localhost:8080/chat/getcontactschat',
        {
          from: data.email,
          to: currentChat.email,
        }
      )
      setMessages(response.data)
    }
    callChat()
  }, [currentChat])

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(sessionStorage.getItem('details')).email
      }
    }
    getCurrentChat()
  }, [currentChat])

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(sessionStorage.getItem('details'))
    socket.current.emit('send-msg', {
      to: currentChat.email,
      from: data.email,
      msg,
    })
    await axios.post('http://localhost:8080/chat/addmessage', {
      from: data.email,
      to: currentChat.email,
      message: msg,
    })

    const msgs = [...messages]
    msgs.push({ fromSelf: true, message: msg })
    setMessages(msgs)
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-recieve', (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg })
      })
    }
  }, [])

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage])
    console.log(arrivalMessage)
  }, [arrivalMessage])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              // src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username" style={{ display: 'flex', gap: '0.2rem' }}>
            <h4>{currentChat.firstname}</h4>
            <h4> </h4>
            <h4>{currentChat.lastname}</h4>
          </div>
        </div>
        {/* <Logout /> */}
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? 'sended' : 'recieved'
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h4 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 0.5rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 0.5rem 0.875rem;
        font-size: 1.1rem;
        border-radius: 1.15rem;
        // color: white;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        // background-color: #4f04ff21;
        background-color: #248bf5;
        color: white;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        // background-color: #9900ff20;
        background-color: #fff;
        color: black;
      }
    }
  }
`
