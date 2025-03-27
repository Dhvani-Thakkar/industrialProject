

import Arrow from "../../assets/svg/Arrow.jsx";
import ButtonGradient from "../../assets/svg/ButtonGradient.jsx";

import { Link, useParams } from "react-router-dom";
import { check } from "../../assets/index.js";


import axios from "axios";
import { getCourseDetails, url } from "../../constants/index.js";
import { useEffect, useState } from "react";
import Button2 from "../design/Button2.jsx";
import Button from "../design/Button.jsx";
import HeaderInstructor from "../Headers/HeaderInstructor.jsx";


/**
 * Fetch student list by course ID.
 * @param {string} courseId 
 * @returns {Promise<object>} - The list of students if successful.
 */
export const fetchStudentsByCourseId = async (courseId) => {
  try {
    const response = await axios.get(`${url}/course/${courseId}/get-students`);
    return response.data.students_info;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw new Error('Failed to fetch students');
  }
}

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




  const InstructorCourseMain = () => {
    const { courseId } = useParams(); 
    const [course, setCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const courseDetails = getCourseDetails(course);
    useEffect(() => {
      const fetchCourse = async () => {
        try {
          setLoading(true);
          const response = await fetchCourseById(courseId);
          setCourse(response.course);
        } catch (err) {
          setError("Error fetching course details");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      
      const fetchStudents = async () => {
        try {
          const studentList = await fetchStudentsByCourseId(courseId);
          setStudents(studentList);
        } catch (err) {
          setError("Error fetching students");
          console.error(err);
        }
      };
  
      if (courseId) {
        fetchCourse();
        fetchStudents();
      }
    }, [courseId]);
  
    if (loading) return <p className="text-center mt-20">Loading course details...</p>;
    if (error) return <p className="text-center text-red-500 mt-20">{error}</p>;




  
    return (
      <>
        <HeaderInstructor />
        <div className="container relative z-2 mt-28">
  <h2 className="h2 mb-4 font-bold">{course?.title}</h2>
  <p className="body-2 mb-[1rem] text-n-3">{course?.description}</p>
  
  <div className="flex justify-between items-center gap-x-6">
  {/* Course Details Section - Takes Up 2/3 of the Width */}
  <ul className="body-2 flex justify-between w-2/3">
    {courseDetails.map((detail, index) => (
      <li key={index} className="flex items-center py-4 border-t border-b border-n-6 flex-grow">
        <img width={24} height={24} src={check} alt="check" />
        <p className="ml-4">
          <span className="font-semibold">{detail.label}:</span> {detail.value}
        </p>
      </li>
    ))}
  </ul>

  {/* Assign Material Button - Takes Up 1/3 of the Width */}
  <Button type="submit" className="w-1/4 py-5">
    Assign<br /> Material
  </Button>
</div>


</div>

<div className="container relative z-2 mt-6">

<ButtonGradient/>

      <h2 className="h5 mb-4 font-bold">Class List</h2>
     
      

      <ul className="body-2 flex flex-col space-y-4">
    {students.map((student, index) => (
      <li
        key={index}
        className="flex items-center justify-between py-4 border-t border-b border-n-6 px-4"
      >
        {/* Student Name (Aligned Right) */}
        <p className=" text-start font-semibold w-1/4">{student.name}</p>

        {/* Buttons (Aligned to Right) */}
        <div className="flex space-x-2 ml-auto">
          <Button2 type="button" white className="px-4 py-2">
              See Info
          </Button2>
          
          <Link to={`/join-chat/${courseId}/${student.user_id}`}>
            <Button2 type="button" white className="px-4 py-2">
              Chat
            </Button2>
          </Link>
        </div>
      </li>
    ))}
  </ul>
    </div>
  
      
      </>
    );
  };
  
  export default InstructorCourseMain;
