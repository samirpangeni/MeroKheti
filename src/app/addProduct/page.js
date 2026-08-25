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
  const [farmerLocation, setFarmerLocation] = useState({
    lat: "",
    lng: "",
  });
  const [locationLoading, setLocationLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const totalStep = 5;

  const router = useRouter();

  useEffect(() => {
    const getLocation = () => {
      if (!navigator.geolocation) {
        console.log("Geolocation is not supported");

        setLocationLoading(false);

        toast.error("Geolocation is not supported by your device");

        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFarmerLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          setLocationLoading(false);
        },
        (error) => {
          console.log("Location error:", error);

          setLocationLoading(false);

          switch (error.code) {
            case error.PERMISSION_DENIED:
              toast.error(
                "Please allow location permission to add a product"
              );
              break;

            case error.POSITION_UNAVAILABLE:
              toast.error("Unable to determine your location");
              break;

            case error.TIMEOUT:
              toast.error("Location request timed out");
              break;

            default:
              toast.error("Unable to get your location");
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    getLocation();
  }, []);


  const validateStep = () => {
    if (currentStep === 1) {
      if (!name.trim()) {
        toast.error("Please enter product name");
        return false;
      }

      if (!category) {
        toast.error("Please select a category");
        return false;
      }

      if (files.length < 2) {
        toast.error("Please add at least 2 product images");
        return false;
      }
    }

    if (currentStep === 2) {
      if (!price) {
        toast.error("Please enter product price");
        return false;
      }

      if (!quantity) {
        toast.error("Please enter product quantity");
        return false;
      }

      if (!unit) {
        toast.error("Please select a unit");
        return false;
      }
    }

    if (currentStep === 3) {
      if (!location.trim()) {
        toast.error("Please select your location");
        return false;
      }

      if (!harvestDate) {
        toast.error("Please select harvest date");
        return false;
      }

      if (!expiryDate) {
        toast.error("Please select expiry date");
        return false;
      }
    }

    if (currentStep === 4) {
      if (!description.trim()) {
        toast.error("Please enter product description");
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (!validateStep()) {
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, totalStep));
  };

  const previousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const isValid =
    name.trim() &&
    category &&
    price &&
    quantity &&
    unit &&
    description.trim() &&
    location.trim() &&
    harvestDate &&
    expiryDate &&
    files.length >= 2 &&
    farmerLocation.lat &&
    farmerLocation.lng;


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check all required fields
    if (!isValid) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!farmerLocation.lat || !farmerLocation.lng) {
      toast.error(
        "Your location is not available. Please allow location access."
      );
      return;
    }

    if (files.length < 2) {
      toast.error("Please add at least 2 product images");
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

      formData.append(
        "latitude",
        farmerLocation.lat.toString()
      );

      formData.append(
        "longitude",
        farmerLocation.lng.toString()
      );

      files.forEach((file) => {
        formData.append("files", file);
      });

      const res = await axios.post(
        "/api/product",
        formData
      );

      if (res.data.success) {
        toast.success(
          "Your product will be live within 24 hours"
        );
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

        setCurrentStep(1);

        router.push("/");
      }
    } catch (err) {
      console.error("Product submission error:", err);
      toast.error(
        err.response?.data?.message ||
        "❌ Failed to add product"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Basic Information";
      case 2:
        return "Price & Quantity";
      case 3:
        return "Location & Date";
      case 4:
        return "Description";

      case 5:
        return "Review & Submit";
      default:
        return "";
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-linear-to-br from-background via-secondary to-card text-foreground">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:px-8">
        <div className="mb-10 mt-20">

          <h1
            className="mt-5 text-3xl font-extrabold bg-linear-to-r from-primary via-primary-hover to-primary bg-clip-text text-transparent sm:text-4xl md:text-5xl">
            Add Your Product
          </h1>

          <p className=" mt-3 max-w-2xl text-base text-muted sm:text-lg">
            Sell fresh vegetables, fruits and grains
            directly to customers
          </p>
        </div>

        <div className="mb-8">

          <div className="mb-3 flex items-center justify-between gap-3">

            <div>

              <p className="text-sm text-muted">
                Step {currentStep} of {totalStep}
              </p>

              <h2 className="text-lg font-semibold text-foreground sm:text-xl">
                {getStepTitle()}
              </h2>

            </div>

            <span className="shrink-0 text-sm font-medium text-primary">
              {Math.round(
                (currentStep / totalStep) * 100
              )}
              %
            </span>

          </div>

          <div
            className=" h-2 w-full overflow-hidden rounded-full bg-muted-background ">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{
                width: `${(currentStep / totalStep) * 100
                  }%`,
              }}
            />
          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className=" space-y-8 rounded-3xl border border-border bg-linear-to-b from-background to-card p-5 shadow-2xl shadow-green-950/40 backdrop-blur-xl sm:p-6 md:p-10">

          {currentStep === 1 && (
            <div className="space-y-8">

              <BasicInfo
                name={name}
                setName={setName}
                category={category}
                setCategory={setCategory}
              />

              <Image
                files={files}
                setFiles={setFiles}
              />

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
            <div className="space-y-8">

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

          {currentStep === 5 && (
            <div className="border-t border-border pt-6">

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
          <div className=" mt-8 flex items-center justify-between gap-3 border-t border-border pt-6">
            <button
              type="button"
              onClick={previousStep}
              disabled={currentStep === 1}
              className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted transition hover:bg-muted-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 sm:px-5 sm:text-base">
              ← Back
            </button>

            {currentStep < totalStep && (
              <button
                type="button"
                onClick={nextStep}
                className="rounded-xl bg-button px-5 py-2.5 text-sm font-semibold text-button-foreground transition hover:bg-primary-hover active:scale-95 sm:px-6 sm:text-base">
                Continue →
              </button>
            )}

          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;