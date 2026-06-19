"use client";

import React, { useState } from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";

const labels = {
  0.5: "Poor",
  1: "Poor",
  1.5: "Poor",
  2: "ok",
  2.5: "Ok",
  3: "Good",
  3.5: "Very Good",
  4: "Great",
  4.5: "Excellent",
  5: "Perfect",
};

const Review = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(-1);
  const [review, setReview] = useState("");

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/review", {
       productId,
        rating,
        review
      });
    } catch (error) {
      console.error("Error submitting review:", error);
    }
    setRating(0);
    setReview("");
  }


  return (
    <div className="w-full  bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-xl">

      {/* TITLE */}
      <h2 className="text-2xl font-bold text-white mb-2">
        Leave a Review
      </h2>

      <p className="text-gray-400 text-sm mb-6">
        Share your experience about this product
      </p>
      <form onSubmit={handelSubmit} className="w-full">
        {/* RATING */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Rating
            name="product-rating"
            value={rating}
            precision={0.5}
          
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            onChangeActive={(event, newHover) => {
              setHover(newHover);
            }}
            emptyIcon={
              <StarIcon
                style={{ opacity: 2, color: "gray" }}
                fontSize="inherit"
              />
            }
          />

          {rating !== null && (
            <Box sx={{ ml: 2, color: "white" }} >
              {labels[hover !== -1 ? hover : rating]}
            </Box>
          )}
        </Box>

        {/* REVIEW INPUT */}
        <textarea
          rows={5}
          placeholder="Write your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-400 outline-none focus:border-green-500 transition resize-none"
        />

        {/* BUTTON */}
        <button
          className="mt-5 w-full bg-green-500 hover:bg-green-600 transition-all duration-300 py-3 rounded-2xl font-semibold text-white shadow-lg"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default Review;