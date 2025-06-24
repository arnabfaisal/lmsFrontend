import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const fetchUserData = async () => {
    const role = "teacher";
    try {
      const res = await fetch(`https://lms-backend-xpwc.onrender.com/api/user/profile/${role}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch user data");

      const data = await res.json();
      setUserData(data);
      setFormData({
        username: data.username || "",
        email: data.email || "",
      });
    } catch (err) {
      toast.error("Unable to load profile");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://lms-backend-xpwc.onrender.com/api/me/update/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Profile updated successfully");
      setEditing(false);
      fetchUserData();
    } catch (error) {
      toast.error("Profile update failed");
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;

    try {
      const res = await fetch("https://lms-backend-xpwc.onrender.com/api/me/delete/", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Deletion failed");

      toast.success("Account deleted");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      navigate("/");
    } catch (err) {
      toast.error("Failed to delete account");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Profile</h1>

      {userData && !editing ? (
        <div className="space-y-4">
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>

          <div className="flex gap-4 mt-4">
            <Button onClick={() => setEditing(true)} className="bg-asmani">Edit Profile</Button>
            <Button onClick={handleLogout} className="bg-yellow-500">Logout</Button>
            <Button onClick={handleDelete} className="bg-laal">Delete Account</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-gray-300"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-gray-300"
            />
          </div>
          <div className="flex gap-4 mt-4">
            <Button type="submit" className="bg-asmani">Save</Button>
            <Button onClick={() => setEditing(false)} type="button" className="bg-gray-400">Cancel</Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Profile;
