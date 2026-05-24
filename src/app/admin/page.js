"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import SlideBarForAdmin from "@/components/SlideBarForAdmin";
const page = () => {
  const [user, setUser] = useState([]);
  const [product, setProduct] = useState([]);
  const [review, setReview] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const response = await axios.get("/api/user");
      setUser(response.data);
    };
  }, []);
  return (
    <div className="flex gap-3">
      <SlideBarForAdmin />
      <div className="w-full">
        <h2>hello world</h2>
      </div>
    </div>
  );
};

export default page;
