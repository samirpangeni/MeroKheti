
import React from "react";
import { FiDollarSign, FiInfo } from "react-icons/fi";

const PriceInput = ({
  price,
  setPrice,
  quantity,
  setQuantity,
  unit,
  setUnit,
}) => {
  const formattedPrice = price
    ? new Intl.NumberFormat("en-NP").format(price)
    : "";

  const units = [
    "kg",
    "gram",
    "lb",
    "dozen",
    "piece",
    "liter",
    "ml",
    "bunch",
    "box",
    "bag",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card">
          <FiDollarSign className="text-lg text-primary" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-foreground">
            Pricing & Stock
          </h2>
          <p className="text-sm text-muted">
            Set your price and available quantity
          </p>
        </div>
      </div>

      {/* Farmer Tip */}
      <div className="flex gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
        <FiInfo className="mt-0.5 shrink-0 text-lg text-primary" />

        <div>
          <p className="text-sm font-semibold text-foreground">
            Farmer Tip
          </p>

          <p className="mt-1 text-xs leading-5 text-muted">
            Please set a price that you think is fair for your product.
            Consider your production cost, quality, and quantity when
            deciding the price. You don't have to simply follow the current
            market price — you know the value of your own produce best.
          </p>
        </div>
      </div>

      {/* Price & Quantity */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* PRICE */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted">
            Price{" "}
            <span className="text-red-600 dark:text-red-400">*</span>
          </label>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-primary">
              NPR
            </span>

            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-2xl border border-border bg-input px-4 py-3 pl-14 text-foreground outline-none transition-all duration-300 placeholder:text-muted hover:border-primary-hover focus:border-primary focus:ring-4 focus:ring-card"
            />
          </div>

          {formattedPrice && (
            <p className="text-xs text-primary">
              ✓ Formatted: NPR {formattedPrice}
            </p>
          )}
        </div>

        {/* QUANTITY + UNIT */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted">
            Quantity & Unit{" "}
            <span className="text-red-600 dark:text-red-400">*</span>
          </label>

          <div className="flex gap-3">
            {/* Quantity */}
            <input
              type="number"
              min="0"
              step="0.1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Qty"
              className="w-1/2 rounded-2xl border border-border bg-input px-4 py-3 text-foreground outline-none transition-all duration-300 placeholder:text-muted hover:border-primary-hover focus:border-primary focus:ring-4 focus:ring-primary-foreground"
            />

            {/* Unit */}
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-1/2 cursor-pointer rounded-2xl border border-border bg-input px-4 py-3 text-foreground outline-none transition-all duration-300 hover:border-primary-hover focus:border-primary focus:ring-4 focus:ring-primary-foreground"
            >
              <option value="" className="bg-input text-muted">
                Select Unit
              </option>

              {units.map((u) => (
                <option
                  key={u}
                  value={u}
                  className="bg-input text-foreground"
                >
                  {u}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs text-muted">
            Example: 5 kg, 2 dozen, 10 pieces
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceInput;

