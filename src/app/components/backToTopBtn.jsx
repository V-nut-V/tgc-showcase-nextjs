"use client";

import { useState, useEffect } from "react";
import { BackToTopBtn } from "./backToTopBtn.style";
import { TbArrowBigUpFilled } from "react-icons/tb";

const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <BackToTopBtn visible={visible} onClick={scrollToTop}>
      <TbArrowBigUpFilled />
    </BackToTopBtn>
  );
};

export default BackToTopButton;