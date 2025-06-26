"use client";

import { useState, useRef, useEffect } from "react";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import { IoClose } from "react-icons/io5";
import { Popup } from "./popup.style";

const PopupWindow = ({ product, closePopup }) => {
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);
  const container = useRef(null);
  const topBar = useRef(null);
  const videoContainer = useRef(null);

  useEffect(() => {
    console.log(product)
    setHeight(container.current.offsetHeight - topBar.current.offsetHeight);
    setWidth(videoContainer.current.offsetWidth);
  }, []);

  return (
    <Popup onClick={() => closePopup()}>
      <div
        className="popup-container"
        onClick={(e) => e.stopPropagation()}
        ref={container}
      >
        <div className="top-bar" ref={topBar}>
          <motion.img
            draggable="false"
            className="demo-pop"
            src={product?.Image_URL}
            layoutId={product?.SKU}
          />
          <h3>{product?.Name}</h3>
          <button onClick={() => closePopup()}>
            <IoClose />
          </button>
        </div>
        <div
          className={`content ${
            product?.Description[0]?.children[0]?.text != ""
              ? ""
              : "no-description"
          }`}
        >
          <div className="video-container" ref={videoContainer}>
            <ReactPlayer
              controls
              loop
              autoPlay
              height={height}
              width={width}
              url={
                product?.Video_URL ||
                "https://www.youtube.com/watch?v=FWepS03YbFU"
              }
            />
          </div>
          {product?.Description[0]?.children[0]?.text != "" && (
            <div className="description" style={{ height: height + 1 }}>
              <p className="sku">SKU: {product?.SKU}</p>
              <BlocksRenderer content={product?.Description} />
            </div>
          )}
        </div>
      </div>
    </Popup>
  );
};

export default PopupWindow;
