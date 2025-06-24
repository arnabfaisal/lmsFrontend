import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useCourseStore } from "../../store/useCourses";
import CourseCard from "../components/ui/CourseCard"; // Adjust the path if needed
import { Skeleton } from "@/components/ui/skeleton";

// Inside Dashboard function

function Dashboard() {
  const { loading: courseLoading, courses, fetchCourses } = useCourseStore();

  useEffect(() => {
    fetchCourses();
  }, []);

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;

    fetch("https://lms-backend-xpwc.onrender.com/api/enrollments/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setEnrolledCourses(data);
        const completed = data.filter((course) => course.completed).length;
        const inProgress = data.filter((course) => !course.completed).length;

        setCompletedCount(completed);
        setInProgressCount(inProgress);
      })
      .catch((err) => {
        toast.error("Failed to fetch enrolled courses");
      });
  }, []);

  return (
    <div className="container max-w-6xl mx-auto px-4 min-h-screen">
      {/* Hero / Quick Buttons */}
      <section className="twobuttons mt-6 flex flex-col md:flex-row gap-4">
        <Button
          className="bg-asmani text-xl"
          onClick={() => navigate("/profile")}
        >
          Go to Profile
        </Button>
      </section>

      {/* Summary Cards */}
      <section className="summary mt-6 grid md:grid-cols-3 gap-4">
        <div className="bg-maati h-24 shadow rounded-2xl flex flex-col items-center justify-center">
          <h1 className="text-xl font-semibold">Enrolled Courses</h1>
          <p className="text-lg">{enrolledCourses.length}</p>
        </div>
        <div className="bg-shobuj h-24 shadow rounded-2xl flex flex-col items-center justify-center">
          <h1 className="text-xl font-semibold">Completed</h1>
          <p className="text-lg">{completedCount}</p>
        </div>
        <div className="bg-laal h-24 shadow rounded-2xl flex flex-col items-center justify-center">
          <h1 className="text-xl font-semibold">In Progress</h1>
          <p className="text-lg">{inProgressCount}</p>
        </div>
      </section>

      <section className="all-courses mt-10">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl mb-2 font-semibold font-myfamily">
            Available Courses
          </h1>
          <p className="text-gray-600 mb-4">Explore what you can learn</p>
          <hr className="border-black border w-1/2 mb-6" />
        </div>

        {courseLoading ? (
          <div className="flex items-center justify-center">
            <Skeleton className="h-12 w-12 rounded-full bg-mycolor" />
            <div className="space-y-2 ml-4">
              <Skeleton className="h-4 w-[250px] bg-mycolor" />
              <Skeleton className="h-4 w-[200px] bg-mycolor" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-6 justify-items-center">
            {courses.length > 0 ? (
              courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <p className="text-gray-500 col-span-full">
                No courses available right now...
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
