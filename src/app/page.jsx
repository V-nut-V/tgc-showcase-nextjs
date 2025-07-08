"use client";
import { useState, useEffect } from "react";
import client from "@/lib/ApolloClient";
import { gql } from "@apollo/client";
import { motion } from "framer-motion";
import { Cellular } from "./index.style.js";
import { FaSearch } from "react-icons/fa";
import PopupWindow from "./components/popup.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    getProducts();

    // Send the height of the page to the parent window, for iframe resizing in Shopify website
    let count = 0;
    const maxCount = 10;

    function sendHeight() {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: "setHeight", height }, "*");
      count++;
      if (count >= maxCount) clearInterval(timer);
    }

    const timer = setInterval(sendHeight, 1000); // 每秒发送一次
    sendHeight(); // 页面加载时立即发一次

    return () => clearInterval(timer);
  }, []);

  const getProducts = async () => {
    // Get the user's language preference from the browser
    let params = new URLSearchParams(document.location.search);
    let location = params.get("location");
    if (!["zh", "en", "ko", "jp"].includes(location)) location = "zh";
    
    const {
      data: { products },
    } = await client.query({
      query: gql`
        query GetProducts($pagination: PaginationArg, $locale: I18NLocaleCode) {
          products(pagination: $pagination, locale: $locale) {
            documentId
            Name
            SKU
            Date
            Image_URL
            Video_URL
            Description
          }
        }
      `,
      variables: {
        locale: location,
        pagination: {
          limit: 9999,
        },
        status: "PUBLISHED",
      },
    });
    setProducts(products);
  };

  return (
    <Cellular>
      {products.length > 0
        ? products.map((product, index) => (
            <div
              className="image-wrapper"
              onClick={() => {
                if (product?.Video_URL == null) return;
                setCurrentProduct(product);
                setShowPopup(true);
              }}
              key={product.SKU + index}
            >
              <motion.img
                className="demo-image"
                layoutId={product.SKU}
                src={product.Image_URL}
              />
              {product?.Video_URL && <FaSearch className="icon" color="#888" />}
            </div>
          ))
        : "Loading..."}

      {showPopup && (
        <PopupWindow
          product={currentProduct}
          closePopup={() => setShowPopup(false)}
        />
      )}
    </Cellular>
  );
}
