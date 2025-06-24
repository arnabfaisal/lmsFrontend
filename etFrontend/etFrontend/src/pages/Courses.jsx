import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://lms-backend-xpwc.onrender.com/api/courses/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setCourse(data);
      } catch (error) {
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    try {
      const res = await fetch(`http://lms-backend-xpwc.onrender.com/api/enroll/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course_id: id }),
      });

      if (!res.ok) throw new Error("Enroll failed");
      toast.success("Enrolled successfully");
    } catch {
      toast.error("Failed to enroll");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://lms-backend-xpwc.onrender.com/api/courses/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");
      toast.success("Deleted successfully");
      navigate("/courses");
    } catch {
      toast.error("Failed to delete course");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!course) return <p>Course not found</p>;

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold mb-4">{course.title}</h1>
      <p className="text-lg mb-2">Instructor: {course.instructor_name}</p>
      <p className="mb-4">{course.description}</p>

      <h2 className="text-xl font-semibold mb-2">Modules / Lessons</h2>
      <ul className="list-disc pl-6 mb-4">
        {course.lessons?.map((lesson, index) => (
          <li key={index}>{lesson.title}</li>
        ))}
      </ul>

      <div className="flex gap-4">
        <Button onClick={handleEnroll} className="bg-shobuj">
          Enroll
        </Button>
        <Button onClick={handleDelete} className="bg-laal">
          Delete Course
        </Button>
      </div>
    </div>
  );
}

export default CourseDetails;

