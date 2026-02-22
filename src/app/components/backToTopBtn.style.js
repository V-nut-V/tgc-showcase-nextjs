"use client";
import styled from "styled-components";

export const BackToTopBtn = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.3rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  opacity: ${(props) => (props.visible ? "1" : "0")};
  transition: opacity 0.3s ease-in-out;

  &:hover {
    background-color: #005bb5;
  }
`;