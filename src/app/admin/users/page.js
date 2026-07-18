"use client";
import React, { useState, useEffect } from "react";
import SlideBarForAdmin from "@/components/SlideBarForAdmin";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loading from "@/components/Loading";
import DeleteModal from "@/components/DeleteModels";
import Suspend from "@/components/Suspend";
const page = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState();
  const [loading, setLoading] = useState(false);
  const [selectionId, setSelectionId] = useState(null)
  const [open, setOpen] = useState(false)
  const [suspend, setSuspend] = useState(false)
  const [reason, setReason] = useState("");
  const [days, setDays] = useState(7);
  const [modal, setModal] = useState({
    open: false,
    type: "", // "delete" | "unsuspend"
  });

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true)
        const url = role ? `/api/admin/user?role=${role}` : `/api/admin/user?role=All`;
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
    setModal({
      open: true,
      type: "delete",
    });
  }
  const SuspendUser = async (id) => {
    setSelectionId(id)
    setSuspend(true)
  }
  const unsuspendUserConfirm = (id) => {
    setSelectionId(id);
    setModal({
      open: true,
      type: "unsuspend",
    });
  };
  const handleConfirm = () => {
    if (modal.type === "delete") {
      confrimDelete();
    } else if (modal.type === "unsuspend") {
      unsuspendUser();
    }
  };
  const unsuspendUser = async () => {
    try {
      const uRes = await axios.put(`/api/admin/user?id=${selectionId}`);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectionId ? uRes.data.user : u
        )
      );
      setModal({
        open: false,
        type: "",
      });
      toast.success("User unsuspended successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to unsuspend user, try again later");
    }
  };
  const confirmSuspend = async (days = 7, reason = "") => {
    try {
      const sRes = await axios.patch(`/api/admin/user?id=${selectionId}`, { days, reason });
      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectionId ? sRes.data : u
        )
      );
      setSuspend(false);
      setReason("");
      setDays();
      setSelectionId(null);
      toast.success("User suspended successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to suspend user, try again later");
    }
  }
  const confrimDelete = async () => {
    try {
      const dRes = await axios.delete(`/api/admin/user?id=${selectionId}`);
      setUsers((prev) => prev.filter((u) => u._id !== selectionId));
      setModal({
        open: false,
        type: "",
      });
      toast.success("User deleted successfully");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete user, try again later");
    }
  };
  const getRemainingDays = (suspendedUntil) => {
    if (!suspendedUntil) return 0;
    const today = new Date();
    const end = new Date(suspendedUntil);
    const diff = end - today;
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
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
          <div className="bg-[#0b0b0b] border border-green-900 rounded-2xl overflow-hidden mt-6 shadow-xl">
            <table className="w-full text-left text-white">
              {/* Table Head */}
              <thead className="bg-green-950 text-green-300 uppercase text-sm">
                <tr>
                  <th className="p-4">Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Suspension</th>
                  <th>Mobile</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className={`border-b transition duration-300
                     ${u.suspended
                        ? "border-red-900 bg-red-950/20 hover:bg-red-950/30"
                        : "border-green-900 hover:bg-green-950/20"
                      }`}
                  >

                    {/* Name */}
                    <td className="p-4">
                      <div>
                        <p className="font-semibold">
                          {u.firstName} {u.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {u._id.slice(-6)}
                        </p>
                      </div>
                    </td>

                    <td>
                      <p className="text-gray-300"> {u.email}</p>
                    </td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
              ${u.role === "admin"
                            ? "bg-red-600"
                            : u.role === "farmer"
                              ? "bg-green-600"
                              : "bg-blue-600"
                          }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      {u.suspended ? (
                        <span className="px-3 py-1 rounded-full bg-red-600 text-xs font-semibold">
                          🔴 Suspended
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-green-600 text-xs font-semibold">
                          🟢 Active
                        </span>
                      )}
                    </td>

                    {/* Suspension */}
                    <td>
                      {u.suspended ? (
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-red-400">
                            {getRemainingDays(u.suspendedUntil)} days left
                          </p>
                          <p className="text-xs text-gray-400">
                            Until{" "}
                            {new Date(
                              u.suspendedUntil
                            ).toLocaleDateString()}
                          </p>
                          {u.suspendedReason && (
                            <p className="text-xs text-gray-500 italic">
                              "{u.suspendedReason}"
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          —
                        </span>
                      )}
                    </td>

                    {/* Mobile */}
                    <td> {u.mobile}  </td>

                    {/* Actions */}
                    <td>
                      <div className="flex justify-center gap-2">
                        {u.suspended ? (
                          <button
                            onClick={() => unsuspendUserConfirm(u._id)}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium hover:bg-green-700 transition"
                          >
                            Unsuspend
                          </button>
                        ) : (
                          <button
                            onClick={() => SuspendUser(u._id)}
                            className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium hover:bg-yellow-600 transition"
                          >
                            Suspend
                          </button>
                        )}
                        <button
                          onClick={() => deleteUser(u._id)}
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
      <DeleteModal
        isOpen={modal.open}
        onClose={() =>
          setModal({
            open: false,
            type: "",
          })
        }
        onConfirm={handleConfirm}
        type={modal.type === "delete" ? "Delete" : "Unsuspend"}
        message={
          modal.type === "delete"
            ? "This action cannot be undone. Are you sure you want to delete this user?"
            : "Are you sure you want to unsuspend this user? They will immediately regain access to their account."
        }
        confirmText={modal.type === "delete" ? "Delete" : "Unsuspend"}
      />
      <Suspend
        isSuspend={suspend}
        reason={reason}
        setReason={setReason}
        days={days}
        setDays={setDays}
        onClose={() => { setSuspend(false) }}
        onConfirm={confirmSuspend}
        type='Suspend'
        message='Are you sure you want to suspend this user?'
      />
    </div>
  );
};
export default page;
