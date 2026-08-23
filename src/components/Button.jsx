"use client";

import React from "react";
import {
  FiPackage,
  FiTag,
  FiDollarSign,
  FiBox,
  FiMapPin,
  FiCalendar,
  FiFeather,
  FiImage,
  FiCheckCircle,
} from "react-icons/fi";

const Button = ({
  name,
  category,
  price,
  quantity,
  unit,
  location,
  harvestDate,
  expiryDate,
  description,
  organic,
  files,
  isValid,
  isSubmitting,
}) => {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <div className="flex items-center gap-2">
          <FiCheckCircle className="text-primary text-xl" />
          <h2 className="text-2xl font-bold text-foreground">
            Review Your Product
          </h2>
        </div>
        <p className="text-sm text-muted mt-1">
          Please check your product information before submitting.
        </p>
      </div>

      {/* PRODUCT PREVIEW */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* IMAGE PREVIEW */}
        {files?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-muted-background">
            {files.slice(0, 4).map((file, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-xl overflow-hidden bg-background"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* PRODUCT NAME */}
        <div className="p-6 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted">
                Product
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-1">
                {name || "Unnamed Product"}
              </h3>
              <span className="inline-flex mt-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {category || "No category"}
              </span>
            </div>
            {organic && (
              <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                <FiFeather />
                Organic
              </span>
            )}
          </div>
        </div>

        {/* INFORMATION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <InfoItem
            icon={<FiDollarSign />}
            label="Price"
            value={`NPR ${price || 0}`}
          />
          <InfoItem
            icon={<FiBox />}
            label="Quantity"
            value={`${quantity || 0} ${unit || ""}`}
          />
          <InfoItem
            icon={<FiTag />}
            label="Category"
            value={category || "Not specified"}
          />
          <InfoItem
            icon={<FiMapPin />}
            label="Location"
            value={location || "Not specified"}
          />
          <InfoItem
            icon={<FiCalendar />}
            label="Harvest Date"
            value={harvestDate || "Not specified"}
          />
          <InfoItem
            icon={<FiCalendar />}
            label="Expiry Date"
            value={expiryDate || "Not specified"}
          />
        </div>
      </div>
      {/* DESCRIPTION */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-3">
          <FiPackage className="text-primary" />
          <h3 className="font-semibold text-foreground">
            Description
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-muted">
          {description || "No description provided."}
        </p>
      </div>

      {/* IMAGES COUNT */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-muted-background px-4 py-3">
        <div className="flex items-center gap-2">
          <FiImage className="text-primary" />
          <span className="text-sm text-foreground">
            Product Images
          </span>
        </div>
        <span className="text-sm font-semibold text-primary">
          {files?.length || 0} images
        </span>
      </div>

      {/* FINAL MESSAGE */}
      <div className="rounded-2xl border border-primary/20 bg-secondary p-5">
        <div className="flex gap-3">
          <FiCheckCircle className="text-primary text-xl shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-foreground">
              Ready to submit?
            </h3>
            <p className="text-sm text-secondary-foreground/80 mt-1">
              Your product will be submitted for approval. Once approved,
              customers will be able to see and purchase it.
            </p>
          </div>
        </div>
      </div>
      <div>
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden border-border
           ${isValid && !isSubmitting
              ? ` bg-button text-button-foreground hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02]`
              : ` bg-card border border-border text-muted cursor-not-allowed opacity-60`}`}>
          {/* Glow effect */}
          {isValid && !isSubmitting && (
            <span className="absolute inset-0 bg-priamry/10 blur-2xl opacity-40" />
          )}

          {/* Loading state */}
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-foreground border-t-transparent rounded-full animate-spin"></div>
              <span>Adding Product...</span>
            </>
          ) : isValid ? (
            <>
              <FiCheckCircle className="w-5 h-5" />
              <span>List Product Now</span>
            </>
          ) : (
            <span>Complete all required fields</span>
          )}
        </button>
      </div>
    </div>
  );
};


/* INFORMATION ITEM */

const InfoItem = ({ icon, label, value }) => {
  return (
    <div className="p-5 border-b border-border md:border-r last:border-r-0">

      <div className="flex items-center gap-2 text-muted text-xs">
        <span className="text-primary">
          {icon}
        </span>

        {label}
      </div>

      <p className="mt-2 font-semibold text-foreground wrap-break-words">
        {value}
      </p>

    </div>
  );
};

export default Button;