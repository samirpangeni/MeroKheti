import React from "react";
import { FiMapPin } from "react-icons/fi";

const Location = ({ location, setLocation }) => {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
          <FiMapPin className="text-primary text-lg" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-foreground">
            Origin & Location
          </h2>
          <p className="text-sm text-muted">
            Specify where your product comes from
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted flex items-center gap-2">
          <FiMapPin className="text-primary" />
          Product Origin / Location
          <span className="dark:text-red-400 text-red-600">*</span>
        </label>

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Pokhara, Chitwan, Kathmandu Valley..."
          className="w-full px-4 py-3 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted outline-none transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-primary-hover"/>

        <p className="text-xs text-muted">
          Mention the exact place where the product was grown or produced.
        </p>
      </div>

      {/* Quick Suggestions */}
      <div className="flex flex-wrap gap-2">
        {["Kathmandu", "Pokhara", "Chitwan", "Biratnagar", "Lalitpur"].map(
          (place) => (
            <button
              key={place}
              type="button"
              onClick={() => setLocation(place)}
              className="px-3 py-1.5 text-xs rounded-full bg-card border border-border text-primary hover:bg-primary/40 hover:border-priamry-hover transition">
              {place}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Location;