import React from "react";
import { FiAlignLeft, FiFeather } from "react-icons/fi";

const Description = ({
  description,
  setDescription,
  organic,
  setOrganic,
}) => {
  const maxLength = 500;

  return (
    <div className="space-y-6">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Description */}
        <div className="md:col-span-2 space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <FiAlignLeft className="text-green-400" />
            Product Description
            <span className="text-red-400">*</span>
          </label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value.slice(0, maxLength))
            }
            placeholder="Describe your product... quality, taste, size, benefits, storage, etc."
            className="
              w-full
              h-32
              px-4
              py-3
              rounded-2xl
              bg-black/40
              border
              border-green-900/40
              text-white
              placeholder:text-gray-500
              outline-none
              transition-all
              duration-300
              resize-none
              focus:border-green-500
              focus:ring-4
              focus:ring-green-500/10
              hover:border-green-700/50
            "
          />

          {/* Counter */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              Help customers understand your product better
            </span>
            <span
              className={
                description.length > maxLength * 0.9
                  ? "text-yellow-400"
                  : "text-green-400"
              }
            >
              {description.length}/{maxLength}
            </span>
          </div>
        </div>

        {/* Organic Card */}
        <div className="flex">
          <div className="w-full bg-black/40 border border-green-900/40 rounded-2xl p-5 hover:border-green-700/50 transition-all duration-300">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={organic}
                onChange={(e) => setOrganic(e.target.checked)}
                className="
                  w-5
                  h-5
                  accent-green-500
                  cursor-pointer
                "
              />

              <div className="flex items-center gap-2">
                <FiFeather className="text-green-400 text-lg" />
                <span className="text-white font-medium">
                  Organic Product
                </span>
              </div>
            </label>

            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              Mark this if your product is grown without
              chemical fertilizers or pesticides.
            </p>

            {/* Badge */}
            {organic && (
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-500/10 border border-green-500/30 text-green-400">
                ✓ Organic Certified
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;