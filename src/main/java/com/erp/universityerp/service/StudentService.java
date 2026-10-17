package com.erp.universityerp.service;

import com.erp.universityerp.dto.StudentCourseSubjectDTO;
import com.erp.universityerp.entity.Course;
import com.erp.universityerp.entity.CourseSubjectMapping;
import com.erp.universityerp.entity.Student;
import com.erp.universityerp.entity.Subject;
import com.erp.universityerp.entity.User;
import com.erp.universityerp.repository.CourseRepository;
import com.erp.universityerp.repository.CourseSubjectMappingRepository;
import com.erp.universityerp.repository.StudentRepository;
import com.erp.universityerp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseSubjectMappingRepository mappingRepository;


    // =========================================================
    // SAVE STUDENT
    // =========================================================
    public Student saveStudent(Student student) {

        Student savedStudent =
                studentRepository.save(student);

        User user =
                userRepository.findByUsername(
                        student.getEnrollmentNo()
                );

        if (user == null) {

            user = new User();

            user.setUsername(
                    student.getEnrollmentNo()
            );

            user.setPassword("Gadri@#09");

            user.setRole("STUDENT");

            userRepository.save(user);
        }

        return savedStudent;
    }


    // =========================================================
    // GET ALL STUDENTS
    // =========================================================

    public List<Student> getAllStudents() {

        return studentRepository.findAll();
    }


    // =========================================================
    // GET STUDENT BY ID
    // =========================================================

    public Student getStudentById(Long id) {

        return studentRepository
                .findById(id)
                .orElse(null);
    }


    // =========================================================
    // GET STUDENT BY ENROLLMENT NUMBER
    // =========================================================

    public Student getStudentByEnrollmentNo(
            String enrollmentNo) {

        return studentRepository
                .findByEnrollmentNo(enrollmentNo);
    }


    // =========================================================
    // GET STUDENT COURSE SUBJECTS
    // =========================================================

    public List<StudentCourseSubjectDTO> getStudentCourseSubjects(
            String enrollmentNo) {

        // -----------------------------------------------------
        // 1. Find student
        // -----------------------------------------------------

        Student student =
                studentRepository
                        .findByEnrollmentNo(enrollmentNo);

        if (student == null) {

            throw new RuntimeException(
                    "Student not found: " + enrollmentNo
            );
        }


        // -----------------------------------------------------
        // 2. Check student's course
        // -----------------------------------------------------

        if (student.getCourse() == null ||
                student.getCourse().trim().isEmpty()) {

            throw new RuntimeException(
                    "Course is not assigned to student"
            );
        }


        // -----------------------------------------------------
        // 3. Check student's semester
        // -----------------------------------------------------

        if (student.getSemester() == null ||
                student.getSemester().trim().isEmpty()) {

            throw new RuntimeException(
                    "Semester is not assigned to student"
            );
        }


        String studentProgramme =
                student.getCourse().trim();

        String studentSemester =
                student.getSemester().trim();


        // -----------------------------------------------------
        // 4. Find matching course
        // -----------------------------------------------------

        List<Course> courses =
                courseRepository.findAll();

        Course matchedCourse = null;

        for (Course course : courses) {

            if (course.getProgramme() == null) {
                continue;
            }

            String courseProgramme =
                    course.getProgramme().trim();

            if (programmesMatch(
                    studentProgramme,
                    courseProgramme)) {

                matchedCourse = course;

                break;
            }
        }


        // -----------------------------------------------------
        // 5. Course not found
        // -----------------------------------------------------

        if (matchedCourse == null) {

            throw new RuntimeException(
                    "No matching course found for student programme: "
                            + studentProgramme
            );
        }


        // -----------------------------------------------------
        // 6. Get ONLY ACTIVE mapped subjects
        // -----------------------------------------------------

        List<CourseSubjectMapping> mappings =
                mappingRepository
                        .findByCourseIdAndSemesterAndStatus(
                                matchedCourse.getId(),
                                studentSemester,
                                "Active"
                        );


        // -----------------------------------------------------
        // 7. Convert Entity -> DTO
        // -----------------------------------------------------

        return mappings.stream()
                .map(mapping -> {

                    Subject subject =
                            mapping.getSubject();

                    return new StudentCourseSubjectDTO(
                            subject.getSubjectCode(),
                            subject.getSubjectName(),
                            subject.getCredits(),
                            subject.getSubjectType(),
                            mapping.getSemester(),
                            mapping.getAcademicYear()
                    );
                })
                .toList();
    }


    // =========================================================
    // PROGRAMME MATCHING
    // =========================================================

    private boolean programmesMatch(
            String studentProgramme,
            String courseProgramme) {

        String student =
                normalizeProgramme(
                        studentProgramme
                );

        String course =
                normalizeProgramme(
                        courseProgramme
                );


        // Exact match
        if (student.equals(course)) {
            return true;
        }


        // One contains the other
        if (student.contains(course) ||
                course.contains(student)) {

            return true;
        }


        // CSE / Computer Science & Engineering
        boolean studentCse =
                student.contains("computer science")
                        || student.contains("cse");


        boolean courseCse =
                course.contains("computer science")
                        || course.contains("cse");


        if (studentCse && courseCse) {
            return true;
        }


        return false;
    }


    // =========================================================
    // NORMALIZE PROGRAMME
    // =========================================================

    private String normalizeProgramme(
            String programme) {

        if (programme == null) {
            return "";
        }

        return programme
                .toLowerCase()
                .replace("&", "and")
                .replace("-", " ")
                .replace("_", " ")
                .replaceAll(
                        "\\s+",
                        " "
                )
                .trim();
    }


    // =========================================================
    // DELETE STUDENT
    // =========================================================
    public void deleteStudent(Long id) {

        studentRepository.deleteById(id);
    }


    // =========================================================
    // UPDATE STUDENT
    // =========================================================
    public Student updateStudent(
            Long id,
            Student student) {

        Student existingStudent =
                studentRepository
                        .findById(id)
                        .orElse(null);


        if (existingStudent != null) {

            existingStudent.setName(
                    student.getName()
            );

            existingStudent.setEmail(
                    student.getEmail()
            );

            existingStudent.setPhone(
                    student.getPhone()
            );

            existingStudent.setCourse(
                    student.getCourse()
            );

            existingStudent.setSemester(
                    student.getSemester()
            );

            existingStudent.setEnrollmentNo(
                    student.getEnrollmentNo()
            );


            studentRepository.save(
                    existingStudent
            );

            return existingStudent;
        }


        return null;
    }
}