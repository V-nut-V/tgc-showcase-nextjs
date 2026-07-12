"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import client from "@/lib/ApolloClient";
import { gql } from "@apollo/client";
import { motion } from "framer-motion";
import { Cellular } from "./index.style.js";
import { FaSearch } from "react-icons/fa";
import PopupWindow from "./components/popup.jsx";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Select, Space } from "antd";
import BackToTopButton from "./components/backToTopBtn.jsx";

export default function Home() {
  const [originalProducts, setOriginalProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const scrollableRef = useRef(null);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [language, setLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      let params = new URLSearchParams(document.location.search);
      let loc = params.get("location");
      if (!["zh", "en", "ko", "jp"].includes(loc)) loc = "zh";
      return loc;
    }
    return "zh";
  });

  const getProducts = async () => {
    setLoading(true);
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
            rank
          }
        }
      `,
      variables: {
        locale: language,
        pagination: {
          limit: 9999,
        },
        status: "PUBLISHED",
      },
    });
    setOriginalProducts(products);
    setLoading(false);
  };

  useEffect(() => {
    // Fetch-on-mount/language-change pattern; intentionally sets loading state synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getProducts();

    // Send the height of the page to the parent window, for iframe resizing in Shopify website
    let count = 0;
    const maxCount = 10;

    const sendHeight = () => {
      const height = scrollableRef.current?.scrollHeight || 0;
      window.parent.postMessage({ type: "setHeight", height }, "*");
      count++;
      if (count >= maxCount) clearInterval(timer);
    };

    const timer = setInterval(sendHeight, 1000);
    sendHeight();

    return () => clearInterval(timer);
  }, [language]);

  const getFilteredList = (baseList, searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "") {
      return baseList;
    }
    const q = searchTerm.toLowerCase();
    return baseList.filter((p) =>
      (p?.Name || "").toLowerCase().includes(q),
    );
  };

  const applySortToList = (base, sortMode) => {
    // Default: sort by `rank` ascending (0,1,2...). Missing/invalid ranks go to the end.
    if (sortMode === "default") {
      return [...base].sort((a, b) => {
        const ra = parseFloat(a?.rank);
        const rb = parseFloat(b?.rank);
        const va = !isNaN(ra) ? ra : Infinity;
        const vb = !isNaN(rb) ? rb : Infinity;
        return va - vb;
      });
    }

    return [...base].sort((a, b) => {
      // Parse dates and check if valid
      const dateA = a?.Date ? new Date(a.Date) : null;
      const dateB = b?.Date ? new Date(b.Date) : null;
      
      const timeA = dateA && !isNaN(dateA.getTime()) ? dateA.getTime() : -1;
      const timeB = dateB && !isNaN(dateB.getTime()) ? dateB.getTime() : -1;

      // If both have valid dates, sort by date
      if (timeA !== -1 && timeB !== -1) {
        return sortMode === "newest" ? timeB - timeA : timeA - timeB;
      }

      // If only one has a valid date, put the valid one first
      if (timeA !== -1) return -1;
      if (timeB !== -1) return 1;

      // If neither has a valid date, maintain original order
      return 0;
    });
  };

  const products = useMemo(() => {
    const filtered = getFilteredList(originalProducts, search);
    return applySortToList(filtered, sortOrder);
  }, [search, originalProducts, sortOrder]);

  const handleSort = (value) => {
    setSortOrder(value);
  };

  const getSortOptions = () => {
    const labels = {
      zh: { default: "默认顺序", newest: "最新", oldest: "最旧" },
      en: { default: "Default Order", newest: "Newest", oldest: "Oldest" },
      ko: { default: "기본 순서", newest: "최신", oldest: "가장 오래됨" },
      jp: { default: "デフォルト順", newest: "最新", oldest: "最古" },
    };
    const lang = labels[language] || labels["zh"];
    return [
      { value: "default", label: lang.default },
      { value: "newest", label: lang.newest },
      { value: "oldest", label: lang.oldest },
    ];
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
    setSearch("");
  };

  return (
    <div
      className="page-wrapper"
      style={{
        margin: 0,
        padding: 0,
        overflow: "hidden", // 页面本身不滚动
        background: "white",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          background: "white",
          padding: "1.2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Space.Compact size="medium">
          <Space.Addon>
            <SearchOutlined />
          </Space.Addon>
          <Input
            value={search}
            placeholder="input search text"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            style={{ display: "none" }} // Hide the sort dropdown, as per your request
            value={sortOrder}
            onChange={handleSort}
            options={getSortOptions()}
          />
          <Select
            style={{ width: 150 }}
            value={language}
            onChange={handleLanguageChange}
            options={[
              { value: "zh", label: "中文" },
              { value: "en", label: "English" },
              { value: "ko", label: "한국어" },
              { value: "jp", label: "日本語" },
            ]}
          />
        </Space.Compact>
      </div>

      <Cellular
        ref={scrollableRef}
        // style={{
        //   maxHeight: "100vh",
        //   overflowY: "scroll",
        //   scrollbarWidth: "none", // Firefox
        //   msOverflowStyle: "none", // IE 10+
        // }}
        className="scrollable"
      >
        {loading
          ? "Loading..."
          : products.length > 0
            ? products.map((product, index) => (
                <div
                  className="image-wrapper"
                  onClick={() => {
                    if (product?.Video_URL == null) return;
                    const isEmbedded =
                      typeof window !== "undefined" &&
                      window.top !== window.self;
                    if (isEmbedded) {
                      window.parent.postMessage(
                        {
                          type: "openPopup",
                          product,
                        },
                        "*",
                      );
                      return;
                    }

                    setCurrentProduct(product);
                    setShowPopup(true);
                  }}
                  key={product.SKU + index}
                >
                  <motion.img
                    className="demo-image"
                    layoutId={product.SKU}
                    src={product?.Image?.url || product.Image_URL}
                  />
                  {product?.Video_URL && (
                    <FaSearch className="icon" color="#888" />
                  )}
                </div>
              ))
            : "No result found，没找到相关产品"}

        {showPopup && (
          <PopupWindow
            product={currentProduct}
            closePopup={() => setShowPopup(false)}
          />
        )}
      </Cellular>
      <BackToTopButton />
    </div>
  );
}
