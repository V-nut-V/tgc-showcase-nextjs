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
  }, []);

  const getProducts = async () => {
    const {
      data: { products },
    } = await client.query({
      query: gql`
        query GetProducts($pagination: PaginationArg) {
          products(pagination: $pagination) {
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
        pagination: {
          limit: 9999,
        },
        status: "PUBLISHED",
      },
    });
    console.log(products);
    setProducts(products);
  };

  return (
    <Cellular>
      {products.length > 0
        ? products.map((product, index) => (
            <div
              className="image-wrapper"
              onClick={() => {
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
              <FaSearch className="icon" color="#888" />
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
