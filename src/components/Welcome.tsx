import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
export default function Welcome() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const getData = () => {
      const data: any = localStorage.getItem("chat-app-current-user");
      if (!data) navigate("/login");
      setUserName(JSON.parse(data)?.username);
    };
    getData();
  }, []);
  return (
    <div className="flex h-screen justify-center items-center text-white flex-col">
      <img src={Robot} alt="" className="h-96" />
      <h1>
        Welcome, <span className="text-indigo-400">{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </div>
  );
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  color: black;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
