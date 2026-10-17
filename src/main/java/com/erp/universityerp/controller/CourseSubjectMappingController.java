package com.erp.universityerp.controller;

import com.erp.universityerp.dto.CourseSubjectMappingDTO;
import com.erp.universityerp.dto.StudentCourseSubjectDTO;
import com.erp.universityerp.entity.CourseSubjectMapping;
import com.erp.universityerp.service.CourseSubjectMappingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course-subject-mappings")
@CrossOrigin
public class CourseSubjectMappingController {

    private final CourseSubjectMappingService mappingService;

    public CourseSubjectMappingController(
            CourseSubjectMappingService mappingService) {

        this.mappingService = mappingService;
    }

    // =========================================================
    // GET ALL MAPPINGS
    // =========================================================

    @GetMapping
    public List<CourseSubjectMappingDTO> getAllMappings() {

        return mappingService.getAllMappings();
    }

    // =========================================================
    // GET MAPPINGS BY COURSE
    // =========================================================

    @GetMapping("/course/{courseId}")
    public List<CourseSubjectMapping> getMappingsByCourse(
            @PathVariable Long courseId) {

        return mappingService
                .getMappingsByCourse(courseId);
    }

    // =========================================================
    // GET MAPPINGS BY COURSE + SEMESTER
    // =========================================================

    @GetMapping("/course/{courseId}/semester/{semester}")
    public List<CourseSubjectMapping>
    getMappingsByCourseAndSemester(
            @PathVariable Long courseId,
            @PathVariable String semester) {

        return mappingService
                .getMappingsByCourseAndSemester(
                        courseId,
                        semester);
    }

    // =========================================================
    // GET STUDENT SUBJECTS
    // =========================================================

    @GetMapping("/student")
    public List<StudentCourseSubjectDTO> getStudentSubjects(
            @RequestParam String courseName,
            @RequestParam String semester) {

        return mappingService.getStudentSubjects(
                courseName,
                semester);
    }

    // =========================================================
    // CREATE MAPPING
    // =========================================================

    @PostMapping
    public ResponseEntity<?> createMapping(
            @RequestParam Long courseId,
            @RequestParam Long subjectId,
            @RequestParam String semester,
            @RequestParam String academicYear,
            @RequestParam(required = false) String status) {

        try {

            return ResponseEntity.ok(
                    mappingService.createMapping(
                            courseId,
                            subjectId,
                            semester,
                            academicYear,
                            status));

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =========================================================
    // DELETE MAPPING
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMapping(
            @PathVariable Long id) {

        mappingService.deleteMapping(id);

        return ResponseEntity.ok(
                "Subject mapping deleted successfully");
    }
}