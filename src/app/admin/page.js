"use client"
import axios from "axios";
import React, { useEffect, useState } from "react";

const page = () => {
  const [user, setUser] = useState([]);
  const [product, setProduct] = useState([]);
  const [review, setReview] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const response = await axios.get("/api/user");
      setUser(response.data)
    };
  },[]);
  return <div>{user.firstName}</div>;
};

export default page;
