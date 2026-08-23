import React from "react";
import { FiAlignLeft, FiFeather, FiCheck } from "react-icons/fi";

const Description = ({
  description,
  setDescription,
  organic,
  setOrganic,
}) => {
  const maxLength = 500;
  const characterPercentage = description.length / maxLength;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <FiAlignLeft className="text-primary" />
          Product Details
        </h2>

        <p className="mt-1 text-sm text-muted">
          Tell customers about your product and highlight if it is organic.
        </p>
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Product Description
          </label>
          <span
            className={`
              text-xs
              ${characterPercentage > 0.9
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-muted"
              }`}>
            {description.length}/{maxLength}
          </span>
        </div>

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value.slice(0, maxLength))
          }
          placeholder="Example: Fresh organic tomatoes grown locally. Juicy, naturally sweet, and perfect for salads and cooking..."
          className="min-h-36 w-full resize-none rounded-2xl border border-input-border bg-input px-4 py-3 text-foreground placeholder:text-muted outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-primary/50" />

        <p className="text-xs text-muted">
          Include details such as quality, size, taste, storage,
          benefits, or how the product is grown.
        </p>

      </div>

      {/* ORGANIC OPTION */}
      <div>
        <label
          className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all duration-200
            ${organic
              ? "border-primary bg-secondary"
              : "border-border bg-card hover:border-primary/50"
            }`}>
          {/* CHECKBOX */}
          <div className="relative mt-0.5">

            <input
              type="checkbox"
              checked={organic}
              onChange={(e) => setOrganic(e.target.checked)}
              className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-input-border bg-input transition checked:border-primary checked:bg-primary" />

            {organic && (
              <FiCheck className="pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 text-primary-foreground" />
            )}
          </div>
          {/* ORGANIC CONTENT */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <FiFeather className="text-lg text-primary" />
              <span className="font-semibold text-foreground">
                Organic Product
              </span>
              {organic && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                  SELECTED
                </span>
              )}
            </div>

            <p className="mt-1 text-sm leading-relaxed text-muted">
              Mark this option if your product is grown without
              chemical fertilizers or pesticides.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default Description;