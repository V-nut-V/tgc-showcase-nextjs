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
  const [location, setLocation] = useState("zh");

  useEffect(() => {
    getProducts();
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
