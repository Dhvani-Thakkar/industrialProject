const Services = require("../Utility/Services");
const { v4: uuidv4 } = require("uuid");
const {
    validateString,
    validateDate,
    validateUserExist,
    validateNonEmptyList,
    validatePositiveNumber,
    validateCourseExist,
    validateStudentInCourse
} = require("../Utility/validator");

/**
 * @module Handler
 */

/**
 * Represents the Room handler
 * @class
 *
 */
class StudentHandler {
    /**
     * The user persistence object used by the info handler.
     * @type {string}
     * @private
     */
    #user_persistence;
 
    /**
     * The notificaion persistence object used by the info handler.
     * @type {string}
     * @private
     */
    #notification_persistence;
    /**
     * The student persistence object used by the info handler.
     * @type {string}
     * @private
     */
    #student_persistence;

    /**         
     * The course persistence object used by the info handler.
     * @type {string}
     * @private
     */
    #course_persistence;

    /**
     * Create a new UserInfoHandler object
     * @constructor
     */
    constructor() {
        this.#student_persistence = Services.get_student_persistence();
        this.#user_persistence = Services.get_user_persistence();
        this.#notification_persistence = Services.get_notification_persistence();
        this.#course_persistence = Services.get_course_persistence();
    }

    get_student_persistence() {
        return this.#student_persistence;
    }

    get_user_persistence() {
        return this.#user_persistence;
    }

    get_notification_persistence() {
        return this.#notification_persistence;
    }

    get_course_persistence() {
        return this.#course_persistence;
    }

    async create_student(request, response) {
        try {
            let user_id = request.params.id;
            let degree = request.body.degree.trim().toLowerCase();
            let dob = request.body.dob.trim().toLowerCase();
            let gpa = parseFloat(request.body.gpa); // Ensure GPA is a number
            let preferred_learning_style = request.body.preferred_learning_style.trim().toLowerCase();
            let preferred_language = request.body.preferred_language.trim().toLowerCase();
            let location = request.body.city.trim().toLowerCase();
    
            // Synchronous validation
            try {
                validateString(user_id, "user");
                validateString(degree, "degree");
                validateDate(dob);
                validatePositiveNumber(gpa, "number");
                validateString(preferred_learning_style, "preferred learning style");
                validateString(preferred_language, "preferred language");
                validateString(location, "location");
            } catch (error) {
                return response.status(422).json({ message: error.message });
            }
    
            // Check if the user already exists
            try {
                await validateUserExist(this.#user_persistence, user_id);
            } catch (error) {
                return response.status(404).json({ message: error.message });
            }
    
            // Create student in database
            let result = await this.#student_persistence.create_student(
                user_id,
                degree,
                dob,
                gpa,
                preferred_learning_style,
                preferred_language,
                location
            );
    
            return response.status(200).json({ message: "Student profile successfully created" });
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }
    
    async update_student(request, response) {
        try {
            let user_id = request.params.id.trim().toLowerCase();
            let degree = request.body.degree.trim().toLowerCase();
            let dob = request.body.dob.trim().toLowerCase();
            let gpa = parseFloat(request.body.gpa); // Ensure GPA is a number
            let preferred_learning_style = request.body.preferred_learning_style.trim().toLowerCase();
            let preferred_language = request.body.preferred_language.trim().toLowerCase();
            let location = request.body.location.trim().toLowerCase();
    
            // Synchronous validation
            try {
                validateString(user_id, "user");
                validateString(degree, "degree");
                validateDate(dob);
                validatePositiveNumber(gpa, "number");
                validateString(preferred_learning_style, "preferred learning style");
                validateString(preferred_language, "preferred language");
                validateString(location, "location");
            } catch (error) {
                return response.status(422).json({ message: error.message });
            }
    
            // Check if the user exists
            try {
                await validateUserExist(this.#user_persistence, user_id);
            } catch (error) {
                return response.status(404).json({ message: error.message });
            }
    
            // Update student in the database
            let result = await this.#student_persistence.update_student(
                user_id,
                degree,
                dob,
                gpa,
                preferred_learning_style,
                preferred_language,
                location
            );
    
            return response.status(200).json({ message: "Student profile successfully updated" });
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }
    
    async get_student(request, response) {
        try {
            let user_id = request.params.id.trim().toLowerCase();
    
            // Synchronous validation
            try {
                validateString(user_id, "user");
            } catch (error) {
                return response.status(422).json({ message: error.message });
            }
    
            // Check if the user exists
            try {
                await validateUserExist(this.#user_persistence, user_id);
            } catch (error) {
                return response.status(404).json({ message: error.message });
            }
    
            // Retrieve student from the database
            let student = await this.#student_persistence.get_student(user_id);
            if (!student) {
                return response.status(404).json({ message: "Student not found" });
            }
    
            return response.status(200).json({ student });
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }

    async get_courses_enrolled(request, response) {
        try {
            let user_id = request.params.id.trim().toLowerCase();
            try {
                validateString(user_id, "user");
            } catch (error) {
                return response.status(422).json({ message: error.message });
            }
            try {
               await validateUserExist(this.#user_persistence, user_id);
            } catch (error) {
                return response.status(404).json({ message: error.message });
            }
            try {
                let courses_enrolled = await this.#student_persistence.get_courses_enrolled(user_id);
                
                return response.status(200).json({ courses_enrolled });
            } catch (error) {
                return response.status(404).json({ message: "You are not enrolled in any course yet" });
            }
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }
    
    async join_course(request, response) {
        try {
            let user_id = request.body.user_id;
            let course_id = request.body.course_id.trim().toLowerCase();
            try {
                validateString(user_id, "user");
                validateString(course_id, "course");
            } catch (error) {
                return response.status(422).json({ message: error.message });
            }

            // check if user exists
            try {
                await validateUserExist(this.#user_persistence, user_id);
            } catch (error) {
                return response.status(404).json({ message: error.message });
            }
            // check if course exists
            try {
                await validateCourseExist(this.#course_persistence, course_id);
            } catch (error) {
                return response.status(404).json({ message: error.message });
            }

            // check if student is already in the course
            try {
                await validateStudentInCourse(this.#course_persistence, course_id, user_id);
            } catch (error) {
                return response.status(400).json({ message: "You are already enrolled in this course" });
            }
            try {
                // update student list in course
                await this.#course_persistence.add_student(user_id, course_id);

                let result = await this.#student_persistence.add_course(user_id, course_id);
                return response.status(result.status).json({ message: result.message });
            } catch (error) {
                return response.status(500).json({ message: error.message });
            }
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }
    
    
}

module.exports = StudentHandler;
