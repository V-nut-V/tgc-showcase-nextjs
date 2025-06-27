"use client";
import styled from "styled-components";

export const Cellular = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding: 4rem;

  .image-wrapper {
    position: relative;
    cursor: pointer;

    .demo-image {
      width: 100%;
    }

    .icon {
      position: absolute;
      top: 2rem;
      right: 2rem;
    }
  }

  @media only screen and (max-width: 980px) {
    grid-template-columns: repeat(3, 1fr);
    padding: 2rem;
    gap: 1.5rem;

    .icon {
      top: 1.5rem;
      right: 1.5rem;
    }
  }

  @media only screen and (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding: 1rem;

    .icon {
      top: 1rem;
      right: 1rem;
    }
  }
`;