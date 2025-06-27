"use client";
import styled from "styled-components";

export const Popup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .popup-container {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 80%;
    height: 80%;
    background-color: white;
    border-radius: 1rem;
    overflow: hidden;

    .top-bar {
      border-bottom: 1px solid #eee;
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;

      img.demo-pop {
        width: 4rem;
        height: 4rem;
        object-fit: contain;
      }

      h3 {
        font-size: 2rem;
        padding: 0 1rem;
      }

      button {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: auto;
        cursor: pointer;
        background-color: transparent;
        border: 0;
        font-size: 3rem;
        height: fit-content;
        transform: rotate(0deg);
        opacity: 0.4;
        transition: all 0.2s ease-out;

        &:hover {
          opacity: 0.8;
          transform: rotate(90deg);
        }
      }
    }

    .content {
      display: grid;
      grid-template-columns: 3fr 1fr;
      flex-grow: 1;
      background-color: black;

      @media only screen and (max-width: 900px) {
        grid-template-columns: 1fr;

        .description {
          display: none;
        }
      }

      &.no-description {
        grid-template-columns: 1fr;
      }

      .description {
        overflow-y: scroll;
        padding: 1rem;
        padding-top: 0.5rem;
        background-color: white;
        height: 200px;

        * {
          color: #555;
          font-weight: 300;
        }

        p.sku {
          padding: 0.5rem 1.2rem;
          padding-top: 0;
          border-bottom: 1px solid #eee;
          width: fit-content;
          width: 100%;
          text-align: center;
          font-size: 0.8rem;
          margin-bottom: 1rem;
        }

        p:not(p.sku) {
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }
      }
    }
  }
`;