// components/ui/CourseCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
function CourseCard({ course }) {
  const navigate = useNavigate();
  return (
    <div className="h-[220px] w-[300px] bg-white shadow-2xl shadow-[#A5B4FC] rounded-2xl p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold font-myfamily">{course.title}</h2>
        <p className="text-gray-600 mt-1">{course.category.name}</p>
        <p className="text-sm text-gray-500 mt-2">{course.description}</p>
        <p className="text-sm text-gray-500 mt-2">{course.price}</p>
        <p className="text-sm text-gray-500 mt-2">{course.duration}</p>
      </div>
      <div className="mt-4">
        <p className="text-xs text-right text-gray-400">
          Created: {course.date.slice(0, 10)}
        </p>
      </div>

      <div
        className="cursor-pointer bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
        onClick={() => navigate(`/courses/${course.id}`)}
      >
        <p>{course.instructor_name}</p>
      </div>
    </div>
  );
}

export default CourseCard;
