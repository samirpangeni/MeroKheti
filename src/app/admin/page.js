"use client";
import SlideBarForAdmin from "@/components/SlideBarForAdmin";
import axios from "axios";
import React, { useState, useEffect } from "react";
import UserGrowthChart from "@/components/UserGrowthChart";
import Activity from "@/components/Activity";
import Loading from "@/components/Loading";
const Page = () => {
  const [user, setUser] = useState([]);
  const [product, setProduct] = useState([]);
  const [pPending, setPPending] = useState([]);
  const [pApproved, setPApproved] = useState([]);
  const [pReject, setPReject] = useState([]);
  const [loading, setLoading] = useState(false);
  const customerCount = user?.filter((u) => u.role === "customer")?.length;

  const farmerCount = user?.filter((u) => u.role === "farmer")?.length;
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true)
        const uRes = await axios.get("api/admin/user");
        const pRes = await axios.get("api/admin/?status=All");
        const pending = await axios.get("api/admin?status=pending");
        const approved = await axios.get("api/admin?status=approved");
        const reject = await axios.get("api/admin?status=reject");

        setPPending(pending.data.product || []);
        setPReject(reject.data.product || []);
        setPApproved(approved.data.product || []);
        setUser(uRes.data.user || []);
        setProduct(pRes.data.product || []);
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    };
    getData();
  }, []);
  if (loading) {
    return <Loading />
  }
  return (
    <div className="flex gap-2">
      <SlideBarForAdmin />
      <div className="py-10 w-full pl-70">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 w-full">

          {/* TOTAL USERS */}
          <div className="
    bg-card
    border border-border
    rounded-2xl
    p-5
    shadow-sm
    transition-all duration-300
    hover:-translate-y-1
    hover:shadow-md
  ">
            <div className="space-y-4">

              <p className="text-sm font-medium text-muted">
                Total Users
              </p>

              <h2 className="text-4xl font-bold text-primary">
                {user.length}
              </h2>

              <div>
                <div className="flex justify-between text-xs text-muted mb-2">
                  <span>Users</span>
                  <span>100%</span>
                </div>

                <div className="w-full h-2 bg-muted-background rounded-full overflow-hidden">
                  <div className="w-full h-full bg-primary rounded-full" />
                </div>
              </div>

            </div>
          </div>


          {/* TOTAL PRODUCTS */}
          <div className="
    bg-card
    border border-border
    rounded-2xl
    p-5
    shadow-sm
    transition-all duration-300
    hover:-translate-y-1
    hover:shadow-md
  ">
            <div className="space-y-4">

              <p className="text-sm font-medium text-muted">
                Total Products
              </p>

              <h2 className="text-4xl font-bold text-primary">
                {product.length}
              </h2>

              <div>
                <div className="flex justify-between text-xs text-muted mb-2">
                  <span>Products</span>
                  <span>100%</span>
                </div>

                <div className="w-full h-2 bg-muted-background rounded-full overflow-hidden">
                  <div className="w-full h-full bg-primary rounded-full" />
                </div>
              </div>

            </div>
          </div>


          {/* PENDING PRODUCTS */}
          <div className="
    bg-card
    border border-border
    rounded-2xl
    p-5
    shadow-sm
    transition-all duration-300
    hover:-translate-y-1
    hover:shadow-md
  ">
            <div className="space-y-4">

              <p className="text-sm font-medium text-muted">
                Pending Products
              </p>

              <h2 className="text-4xl font-bold text-yellow-500">
                {pPending.length}
              </h2>

              <div>
                <div className="flex justify-between text-xs text-muted mb-2">
                  <span>Pending</span>
                  <span>
                    {product.length
                      ? Math.round((pPending.length / product.length) * 100)
                      : 0}%
                  </span>
                </div>

                <div className="w-full h-2 bg-muted-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${product.length
                          ? (pPending.length / product.length) * 100
                          : 0
                        }%`,
                    }}
                  />
                </div>
              </div>

            </div>
          </div>


          {/* APPROVED PRODUCTS */}
          <div className="
    bg-card
    border border-border
    rounded-2xl
    p-5
    shadow-sm
    transition-all duration-300
    hover:-translate-y-1
    hover:shadow-md
  ">
            <div className="space-y-4">

              <p className="text-sm font-medium text-muted">
                Approved Products
              </p>

              <h2 className="text-4xl font-bold text-primary">
                {pApproved.length}
              </h2>

              <div>
                <div className="flex justify-between text-xs text-muted mb-2">
                  <span>Approved</span>
                  <span>
                    {product.length
                      ? Math.round((pApproved.length / product.length) * 100)
                      : 0}%
                  </span>
                </div>

                <div className="w-full h-2 bg-muted-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{
                      width: `${product.length
                          ? (pApproved.length / product.length) * 100
                          : 0
                        }%`,
                    }}
                  />
                </div>
              </div>

            </div>
          </div>


          {/* REJECTED PRODUCTS */}
          <div className="
    bg-card
    border border-border
    rounded-2xl
    p-5
    shadow-sm
    transition-all duration-300
    hover:-translate-y-1
    hover:shadow-md
  ">
            <div className="space-y-4">

              <p className="text-sm font-medium text-muted">
                Rejected Products
              </p>

              <h2 className="text-4xl font-bold text-red-500">
                {pReject.length}
              </h2>

              <div>
                <div className="flex justify-between text-xs text-muted mb-2">
                  <span>Rejected</span>
                  <span>
                    {product.length
                      ? Math.round((pReject.length / product.length) * 100)
                      : 0}%
                  </span>
                </div>

                <div className="w-full h-2 bg-muted-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 dark:bg-red-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${product.length
                          ? (pReject.length / product.length) * 100
                          : 0
                        }%`,
                    }}
                  />
                </div>
              </div>

            </div>
          </div>

        </div>
        <div>
          <UserGrowthChart
            customer={customerCount}
            farmer={farmerCount}
            approved={pApproved.length}
            pending={pPending.length}
            reject={pReject.length}
          />
        </div>
        <div>
          <Activity />
        </div>
      </div>
    </div>
  );
};
export default Page;
