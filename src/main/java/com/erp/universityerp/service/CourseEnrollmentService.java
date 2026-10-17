package com.erp.universityerp.service;

import com.erp.universityerp.dto.CourseEnrollmentDTO;
import com.erp.universityerp.entity.Course;
import com.erp.universityerp.entity.CourseEnrollment;
import com.erp.universityerp.entity.Student;
import com.erp.universityerp.repository.CourseEnrollmentRepository;
import com.erp.universityerp.repository.CourseRepository;
import com.erp.universityerp.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CourseEnrollmentService {

    private final CourseEnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public CourseEnrollmentService(
            CourseEnrollmentRepository enrollmentRepository,
            StudentRepository studentRepository,
            CourseRepository courseRepository) {

        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }


    // =========================================================
    // CREATE ENROLLMENT
    // =========================================================

    public CourseEnrollmentDTO createEnrollment(
            Long studentId,
            Long courseId,
            String semester,
            String academicYear,
            String status) {

        if (studentId == null) {
            throw new RuntimeException("Student is required");
        }

        if (courseId == null) {
            throw new RuntimeException("Course is required");
        }

        if (semester == null || semester.isBlank()) {
            throw new RuntimeException("Semester is required");
        }

        if (academicYear == null || academicYear.isBlank()) {
            throw new RuntimeException("Academic year is required");
        }


        Student student =
                studentRepository.findById(studentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"));


        Course course =
                courseRepository.findById(courseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course not found"));


        String finalStatus =
                status == null || status.isBlank()
                        ? "Active"
                        : status;


        // =====================================================
        // DUPLICATE CHECK
        // =====================================================

        boolean exists =
                enrollmentRepository
                        .existsByStudentIdAndSemesterAndAcademicYear(
                                studentId,
                                semester,
                                academicYear
                        );

        if (exists) {

            throw new RuntimeException(
                    "This student is already enrolled in a course for "
                            + semester
                            + " and academic year "
                            + academicYear
            );
        }


        // =====================================================
        // CREATE
        // =====================================================

        CourseEnrollment enrollment =
                new CourseEnrollment();

        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setSemester(semester);
        enrollment.setAcademicYear(academicYear);
        enrollment.setEnrollmentDate(LocalDate.now());
        enrollment.setStatus(finalStatus);


        CourseEnrollment saved =
                enrollmentRepository.save(enrollment);


        return convertToDTO(saved);
    }


    // =========================================================
    // GET ALL ENROLLMENTS
    // =========================================================

    public List<CourseEnrollmentDTO> getAllEnrollments() {

        return enrollmentRepository
                .findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }


    // =========================================================
    // GET STUDENT ENROLLMENTS
    // =========================================================

    public List<CourseEnrollmentDTO> getEnrollmentsByStudent(
            Long studentId) {

        return enrollmentRepository
                .findByStudentId(studentId)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }


    // =========================================================
    // DELETE ENROLLMENT
    // =========================================================

    public void deleteEnrollment(Long id) {

        if (!enrollmentRepository.existsById(id)) {

            throw new RuntimeException(
                    "Enrollment not found");
        }

        enrollmentRepository.deleteById(id);
    }


    // =========================================================
    // UPDATE ENROLLMENT
    // =========================================================

    public CourseEnrollmentDTO updateEnrollment(
            Long id,
            Long studentId,
            Long courseId,
            String semester,
            String academicYear,
            String status) {

        CourseEnrollment existing =
                enrollmentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Enrollment not found"));


        Student student =
                studentRepository.findById(studentId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Student not found"));


        Course course =
                courseRepository.findById(courseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course not found"));


        String finalStatus =
                status == null || status.isBlank()
                        ? "Active"
                        : status;


        // =====================================================
        // DUPLICATE CHECK DURING UPDATE
        // =====================================================

        List<CourseEnrollment> studentEnrollments =
                enrollmentRepository
                        .findByStudentId(studentId);


        boolean duplicate =
                studentEnrollments
                        .stream()
                        .anyMatch(enrollment ->

                                !enrollment
                                        .getId()
                                        .equals(id)

                                        && semester.equalsIgnoreCase(
                                        enrollment.getSemester())

                                        && academicYear.equalsIgnoreCase(
                                        enrollment.getAcademicYear())
                        );


        if (duplicate) {

            throw new RuntimeException(
                    "This student already has another enrollment for "
                            + semester
                            + " and academic year "
                            + academicYear
            );
        }


        existing.setStudent(student);
        existing.setCourse(course);
        existing.setSemester(semester);
        existing.setAcademicYear(academicYear);
        existing.setStatus(finalStatus);


        if (existing.getEnrollmentDate() == null) {
            existing.setEnrollmentDate(LocalDate.now());
        }


        CourseEnrollment saved =
                enrollmentRepository.save(existing);


        return convertToDTO(saved);
    }


    // =========================================================
    // ENTITY -> DTO
    // =========================================================

    private CourseEnrollmentDTO convertToDTO(
            CourseEnrollment enrollment) {

        CourseEnrollmentDTO dto =
                new CourseEnrollmentDTO();


        dto.setId(enrollment.getId());


        if (enrollment.getStudent() != null) {

            dto.setStudentId(
                    enrollment.getStudent().getId()
            );

            dto.setStudentName(
                    enrollment.getStudent().getName()
            );

            dto.setEnrollmentNo(
                    enrollment.getStudent().getEnrollmentNo()
            );
        }


        if (enrollment.getCourse() != null) {

            dto.setCourseId(
                    enrollment.getCourse().getId()
            );

            dto.setCourseCode(
                    enrollment.getCourse().getCourseCode()
            );

            dto.setCourseName(
                    enrollment.getCourse().getCourseName()
            );
        }


        dto.setSemester(
                enrollment.getSemester()
        );

        dto.setAcademicYear(
                enrollment.getAcademicYear()
        );

        dto.setEnrollmentDate(
                enrollment.getEnrollmentDate()
        );

        dto.setStatus(
                enrollment.getStatus()
        );


        return dto;
    }
}