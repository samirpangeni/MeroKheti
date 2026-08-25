"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

import Image from "../../components/Image";
import DateSection from "../../components/Date";
import Location from "../../components/Location";
import PriceInput from "../../components/PriceInput";
import BasicInfo from "../../components/BasicInfo";
import Description from "../../components/Description";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";

const Page = () => {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("");
  const [organic, setOrganic] = useState(false);
  const [location, setLocation] = useState("");
  const [farmerLocation, setFarmerLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalStep = 5;
  const router = useRouter();
  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalStep));
  };
  const previousStep = () => {
    setCurrentStep((prev) => Math.min(prev - 1, 1))
  }

  const isValid =
    name.trim() &&
    category &&
    price &&
    quantity &&
    unit &&
    description.trim() &&
    location.trim() &&
    files.length >= 2;


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      toast.error("Please fill all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("expiryDate", expiryDate);
      formData.append("harvestDate", harvestDate);
      formData.append("quantity", quantity);
      formData.append("unit", unit);
      formData.append("category", category);
      formData.append("organic", organic.toString());
      formData.append("location", location);
      formData.append("latitude", farmerLocation.lat)
      formData.append("longitude", farmerLocation.lng)

      files.forEach((file) => {
        formData.append("files", file);
      });
      const res = await axios.post("/api/product", formData);

      setName("");
      setPrice("");
      setDescription("");
      setExpiryDate("");
      setHarvestDate("");
      setQuantity("");
      setUnit("");
      setCategory("");
      setOrganic(false);
      setLocation("");
      setFiles([]);
      if (res.data.success) {
        toast.success("Your product will be live within 24 hours");
        router.push("/")
      }
    } catch (err) {
      console.log(err)
      toast.error(
        err.response?.data?.message || "❌ Failed to add product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    const getLocation = () => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFarmerLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log(error);
        }
      );
    };

    getLocation();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-secondary to-card text-foreground relative overflow-hidden">

      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-10 mt-20">
          <h1 className="text-4xl md:text-5xl font-extrabold mt-5  bg-linear-to-r from-primary via-primary-hover to-primary bg-clip-text text-transparent">
            Add Your Product
          </h1>

          <p className="text-muted mt-3 text-lg max-w-2xl">
            Sell fresh vegetables, fruits and grains directly to customers
          </p>
        </div>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-muted">
                Step {currentStep} of {totalStep}
              </p>

              <h2 className="text-xl font-semibold text-foreground">
                {currentStep === 1 && "Basic Information"}
                {currentStep === 2 && "Price & Quantity"}
                {currentStep === 3 && "Location & Date"}
                {currentStep === 4 && "Description"}
                {currentStep === 5 && "Review & Submit"}
              </h2>
            </div>

            <span className="text-sm font-medium text-primary">
              {Math.round((currentStep / totalStep) * 100)}%
            </span>
          </div>

          <div className="h-2 w-full rounded-full bg-muted-background overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{
                width: `${(currentStep / totalStep) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-linear-to-b from-background to-card border border-border shadow-2xl shadow-green-950/40 rounded-3xl p-6 md:p-10 space-y-8 backdrop-blur-xl"
        >
          {currentStep === 1 && (
            <div>
              <BasicInfo
                name={name}
                setName={setName}
                category={category}
                setCategory={setCategory}
              />

              <Image files={files} setFiles={setFiles} />
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <PriceInput
                price={price}
                setPrice={setPrice}
                quantity={quantity}
                setQuantity={setQuantity}
                unit={unit}
                setUnit={setUnit}
              />
            </div>
          )}
          {currentStep === 3 && (
            <div>
              <Location
                location={location}
                setLocation={setLocation}
              />

              <DateSection
                expiryDate={expiryDate}
                setExpiryDate={setExpiryDate}
                harvestDate={harvestDate}
                setHarvestDate={setHarvestDate}
              />
            </div>
          )}
          {currentStep === 4 && (
            <Description
              description={description}
              setDescription={setDescription}
              organic={organic}
              setOrganic={setOrganic}
            />
          )}

          {/* Submit */}
          {currentStep === 5 && (
            <div className="pt-6 border-t border-border">
              <Button
                name={name}
                category={category}
                price={price}
                quantity={quantity}
                unit={unit}
                location={location}
                harvestDate={harvestDate}
                expiryDate={expiryDate}
                description={description}
                organic={organic}
                files={files}
                isSubmitting={isSubmitting}
                isValid={isValid}
              />
            </div>
          )}
          <div className="flex items-center justify-between border-t border-border pt-6 mt-8">

            {/* BACK */}
            <button
              type="button"
              onClick={previousStep}
              disabled={currentStep === 1}
              className="rounded-xl border border-border bg-card px-5 py-2.5 font-medium text-muted transition hover:bg-muted-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40">
              ← Back
            </button>


            {currentStep < totalStep && (
              <button
                type="button"
                onClick={nextStep}
                className="rounded-xl bg-button px-6 py-2.5 font-semibold text-button-foreground transition hov er:bg-primary-hover"
              >
                Continue →
              </button>
            )}

          </div>
        </form>
      </div >
    </div >
  );
};

export default Page;