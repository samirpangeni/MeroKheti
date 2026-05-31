"use client";
import React, { useState, useEffect } from "react";
import SlideBarForAdmin from "@/components/SlideBarForAdmin";
import axios from "axios";
const page = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState();
  useEffect(() => {
    const getData = async () => {
      try {
        const uRes = await axios.get(`/api/admin?role=${role}`);
        setUsers(uRes.data.user);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, [role]);
  const handelData = async (id) => {
    try {
      const dRes = await axios.delete(`/api/admin?id=${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex">
      <SlideBarForAdmin />
      <div className="pl-70 py-10 w-full">
        <div className="w-full">
          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-green-400">
              Users Management
            </h1>
            <p className="text-gray-400">Manage all registered users</p>
          </div>
          <div className="flex justify-end md-5">
            <div className="border-2 w-fit p-2 rounded-lg ">
              <select
                className="text-white outline-none"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                }}
              >
                {["All", "customer", "farmer"].map((item, idx) => (
                  <option
                    key={idx}
                    value={item}
                    className="text-black outline-none"
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* TABLE */}
          <div className="bg-black border border-green-900 rounded-2xl overflow-hidden mt-5">
            <table className="w-full text-left text-white">
              <thead className="bg-green-950 text-green-300">
                <tr>
                  <th className="p-4">Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Mobile</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b border-green-900 hover:bg-green-950/40"
                  >
                    <td className="p-4">
                      {u.firstName} {u.lastName}
                    </td>

                    <td>{u.email}</td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          u.role === "admin"
                            ? "bg-red-500"
                            : u.role === "farmer"
                              ? "bg-green-600"
                              : "bg-blue-600"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td>{u.mobile}</td>

                    <td className="flex gap-2 p-2">
                      <button className="bg-blue-600 px-3 py-1 rounded-lg text-sm">
                        View
                      </button>

                      <button
                        className="bg-red-600 px-3 py-1 rounded-lg text-sm"
                        onClick={() => {
                          handelData(u._id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default page;
