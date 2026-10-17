package com.erp.universityerp.controller;

import com.erp.universityerp.dto.CourseEnrollmentDTO;
import com.erp.universityerp.service.CourseEnrollmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course-enrollments")
@CrossOrigin
public class CourseEnrollmentController {

    private final CourseEnrollmentService enrollmentService;

    public CourseEnrollmentController(
            CourseEnrollmentService enrollmentService) {

        this.enrollmentService = enrollmentService;
    }


    // =========================================================
    // GET ALL
    // =========================================================

    @GetMapping
    public List<CourseEnrollmentDTO> getAllEnrollments() {

        return enrollmentService.getAllEnrollments();
    }


    // =========================================================
    // GET BY STUDENT
    // =========================================================

    @GetMapping("/student/{studentId}")
    public List<CourseEnrollmentDTO> getStudentEnrollments(
            @PathVariable Long studentId) {

        return enrollmentService
                .getEnrollmentsByStudent(studentId);
    }


    // =========================================================
    // CREATE
    // =========================================================

    @PostMapping
    public ResponseEntity<CourseEnrollmentDTO> createEnrollment(

            @RequestParam Long studentId,

            @RequestParam Long courseId,

            @RequestParam String semester,

            @RequestParam String academicYear,

            @RequestParam(required = false) String status) {


        CourseEnrollmentDTO enrollment =
                enrollmentService.createEnrollment(
                        studentId,
                        courseId,
                        semester,
                        academicYear,
                        status
                );


        return ResponseEntity.ok(enrollment);
    }


    // =========================================================
    // UPDATE
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<CourseEnrollmentDTO> updateEnrollment(

            @PathVariable Long id,

            @RequestParam Long studentId,

            @RequestParam Long courseId,

            @RequestParam String semester,

            @RequestParam String academicYear,

            @RequestParam(required = false) String status) {


        CourseEnrollmentDTO enrollment =
                enrollmentService.updateEnrollment(
                        id,
                        studentId,
                        courseId,
                        semester,
                        academicYear,
                        status
                );


        return ResponseEntity.ok(enrollment);
    }


    // =========================================================
    // DELETE
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEnrollment(
            @PathVariable Long id) {

        enrollmentService.deleteEnrollment(id);

        return ResponseEntity.ok(
                "Enrollment deleted successfully"
        );
    }
}