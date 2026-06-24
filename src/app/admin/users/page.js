"use client";
import React, { useState, useEffect } from "react";
import SlideBarForAdmin from "@/components/SlideBarForAdmin";
import axios from "axios";
import Loading from "@/components/Loading";
import DeleteModal from "@/components/DeleteModels";
const page = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState();
  const [loading, setLoading] = useState(false);
  const [selectionId, setSelectionId] = useState(null)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true)
        const url = role ? `/api/admin?role=${role}` : `/api/admin?role=All`;
        const uRes = await axios.get(url);
        setUsers(uRes.data.user);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false)
      }
    };
    getData();
  }, [role]);
  if (loading) {
    return <Loading />
  }
  const deleteUser = async (id) => {
    setSelectionId(id)
    setOpen(true)
  }
  const confrimDelete = async () => {
    try {
      const dRes = await axios.delete(`/api/admin?id=${selectionId}`);
      setUsers((prev) => prev.filter((u) => u._id !== selectionId));
      setOpen(false)
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
                        className={`px-3 py-1 rounded-full text-xs ${u.role === "admin"
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
                          deleteUser(u._id);
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
      <DeleteModal
      isOpen={open}
      onClose={()=>{setOpen(false)}}
      onConfirm={confrimDelete}
      type='Delete'
      message='This action cannot be undone. Are you sure you want to delete User'
      confirmText='Delete'/>

    </div>
  );
};
export default page;
