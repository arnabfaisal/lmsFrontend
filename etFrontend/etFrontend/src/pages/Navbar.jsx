import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

function Navbar() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (token) {
      setIsAuthenticated(true);
      fetchUserProfile(token);
    }
  }, [location]);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("access");
    try {
      const res = await fetch("https://lms-backend-xpwc.onrender.com/api/user/profile/teacher/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch user");

      const data = await res.json();
      setUserData(data);
    } catch (err) {
      setIsAuthenticated(false);
      setUserData(null);
    }
  };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("https://lms-backend-xpwc.onrender.com/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      await fetchUserProfile();
      setIsAuthenticated(true);
      setIsDialogOpen(false);
      toast.success("Successfully logged in");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed");
    }

    setFormData({ username: "", password: "" });
  };

  const handleLogout = () => {

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    toast.success("Successfully logged out");
    setIsAuthenticated(false);
    setUserData(null);
    navigate("/");
  };

  return (
    <div className="container max-w-6xl mx-auto px-4">
      <nav className="flex justify-between items-center h-20 px-4 sm:px-6">
        <h1
          className="logo cursor-pointer text-5xl font-bold"
          onClick={() => navigate("/dashboard")}
        >
          LMS
        </h1>

        {isAuthenticated ? (
          <div className="flex items-center gap-6">
            {/* Navigation Links */}
            <div className="flex gap-4 text-sm">
              <button
                onClick={() => navigate("/dashboard")}
                className="hover:underline"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate("/courses")}
                className="hover:underline"
              >
                Courses
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="hover:underline"
              >
                Profile
              </button>
            </div>

            {/* User Info */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="w-8 h-8 bg-maati rounded-full flex items-center justify-center text-white uppercase font-semibold">
                    {userData?.email?.[0]}
                  </div>
                  <span className="text-sm">{userData?.email}</span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-64 space-y-2 text-sm">
                <div>
                  <p>
                    <strong>Name:</strong>{" "}
                    {`${userData?.first_name} ${userData?.last_name}` || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {userData?.email}
                  </p>
                </div>
                <Button className="bg-laal" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>Login</Button>
            </DialogTrigger>
            <DialogContent className="mydivdesign">
              <DialogHeader>
                <DialogTitle className="text-center text-xl">Login</DialogTitle>
                <DialogDescription className="text-center">
                  LMS
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col md:gap-4 md:mt-4"
              >
                <div className="flex flex-col">
                  <label
                    htmlFor="username"
                    className="mb-1 font-medium myfamily text-gray-800"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="border text-gray-800 border-mycolor rounded-2xl px-3 py-2 bg-gray-100 focus:outline-none focus:ring-mycolor"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="password"
                    className="mb-1 font-medium myfamily text-gray-800"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="border text-gray-800 border-mycolor rounded-2xl px-3 py-2 bg-gray-100 focus:outline-none focus:ring-mycolor"
                  />
                </div>
                <Button type="submit" className="w-full mt-3">
                  Login
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
