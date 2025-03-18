import Heading from "./Heading";
import Section from "./Section";

import Arrow from "../assets/svg/Arrow";
import { GradientLight } from "./design/Benefits";
import ClipPath from "../assets/svg/ClipPath";
import Button from "./Button";
import ButtonGradient from "../assets/svg/ButtonGradient";
import { Link } from "react-router-dom";
import { cardbg, check } from "../assets";
import HeaderStudent from "./HeaderStudent.jsx";
import Services from "./Services";
import axios from "axios";
import { url } from "../constants/index.js";
import { useEffect, useState } from "react";

/**
 * Fetch course details by course ID.
 * @param {string} courseId - The ID of the course to fetch.
 * @returns {Promise<object>} - The course object if successful.
 */
export const fetchCourseById = async (courseId) => {
  try {
    const response = await axios.get(`${url}/course/${courseId}/get-course`);
    return response.data;
  } catch (error) {
    console.error('Error fetching course:', error);
    throw new Error('Failed to fetch course details');
  }
};




  const CourseMain = () => {
    const courseId = "stat3000";
    const [course, setCourse] = useState(null);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchCourse = async () => {
        try {
          setLoading(true);
          const response = await fetchCourseById(courseId);
          setCourse(response.course);
          setUnits(response.course.unit_list || []);
        } catch (err) {
          setError("Error fetching course details");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      if (courseId) {
        fetchCourse();
      }
    }, [courseId]);
  
    if (loading) return <p className="text-center mt-20">Loading course details...</p>;
    if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;
  
    return (
      <>
        <HeaderStudent />
        <div className="container relative z-2 mt-28">
          <h2 className="h2 mb-4 font-bold">{course?.title}</h2>
          <p className="body-2 mb-[1rem] text-n-3">{course?.description}</p>
          <ul className="body-2 flex justify-between">
            <li className="flex items-center py-4 border-t border-b border-n-6 flex-grow">
              <img width={24} height={24} src={check} alt="check" />
              <p className="ml-4">
                <span className="font-semibold">Course Code:</span> {course?.course_id}
              </p>
            </li>
            <li className="flex items-center py-4 border-t border-b border-n-6 flex-grow">
              <img width={24} height={24} src={check} alt="check" />
              <p className="ml-4">
                <span className="font-semibold">Instructor:</span> {course?.instructor}
              </p>
            </li>
            <li className="flex items-center py-4 border-t border-b border-n-6 flex-grow">
              <img width={24} height={24} src={check} alt="check" />
              <p className="ml-4">
                <span className="font-semibold">Enrolled On:</span> 09/11/2024
              </p>
            </li>
          </ul>
        </div>
  
        <div className="container relative z-2">
          <div className="flex flex-col gap-6 mt-10 mb-6 w-full">
            {units.map((unit, index) => (
              <div
                key={index}
                className="group block relative bg-no-repeat bg-[length:100%_100%] w-full sm:max-w-[60%] md:max-w-[90rem] mx-auto"
                style={{
                  backgroundImage: `url(${
                    index % 2 === 0
                      ? "src/assets/course_cards/card-1.svg"
                      : "src/assets/course_cards/card-2.svg"
                  })`,
                }}
              >
                <div className="flex justify-between items-center w-full px-6 py-4">
                  <h5 className="h5 mt-7 mb-2">
                    <span className="font-extrabold">Unit {index + 1} </span>
                    <span className="ml-3">{unit}</span>
                  </h5>
                  <div className="flex items-center space-x-2">
                    <Link to="/chat" className="z-50">
                      Start chat
                    </Link>
                    <Arrow className="w-6 h-6 text-white" />
                  </div>
                </div>
  
                <div className="absolute inset-0.5" style={{ clipPath: "url(#benefits)" }}>
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-25">
                    <img src={cardbg} width={380} height={362} className="w-full h-full object-cover" alt="card background" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };
  
  export default CourseMain;
