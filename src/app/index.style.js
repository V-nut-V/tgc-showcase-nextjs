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
`;