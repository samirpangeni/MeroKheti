import React from "react";
import { FiCalendar, FiTruck } from "react-icons/fi";

const DateSection = ({
  expiryDate,
  setExpiryDate,
  harvestDate,
  setHarvestDate,
}) => {
  // Auto format DD/MM/YYYY
  const formatDate = (value) => {
    let v = value.replace(/\D/g, "");
    if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
    if (v.length > 5) v = v.slice(0, 5) + "/" + v.slice(5, 9);
    return v;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
          <FiCalendar className="text-primary text-lg" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-foreground">
            Important Dates
          </h2>
          <p className="text-sm text-muted">
            Harvest and expiry information
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Harvest Date */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-muted">
            <FiTruck className="text-primary" />
            Harvest Date
          </label>

          <input
            type="text"
            placeholder="DD/MM/YYYY"
            value={harvestDate}
            maxLength={10}
            onChange={(e) =>
              setHarvestDate(formatDate(e.target.value))
            }
            className="
              w-full
              px-4
              py-3
              rounded-2xl
              bg-input
              border
              border-border
              text-foreground
              placeholder:text-muted
              outline-none
              transition-all
              duration-300
              focus:border-primary
              focus:ring-4
              focus:ring-primary/10
              hover:border-primary-hover
            "
          />

          <p className="text-xs text-muted">
            When was this product harvested?
          </p>
        </div>

        {/* Expiry Date */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-muted">
            <FiCalendar className="text-primary" />
            Expiry Date
          </label>

          <input
            type="text"
            placeholder="DD/MM/YYYY"
            value={expiryDate}
            maxLength={10}
            onChange={(e) =>
              setExpiryDate(formatDate(e.target.value))
            }
            className="w-full px-4 py-3 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted outline-none transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-primary-hover"/>
          <p className="text-xs text-muted">
            Best before / expiry date (if applicable)
          </p>
        </div>
      </div>
    </div>
  );
};

export default DateSection;