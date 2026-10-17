package com.erp.universityerp.service;

import com.erp.universityerp.dto.CourseSubjectMappingDTO;
import com.erp.universityerp.dto.StudentCourseSubjectDTO;
import com.erp.universityerp.entity.Course;
import com.erp.universityerp.entity.CourseSubjectMapping;
import com.erp.universityerp.entity.Subject;
import com.erp.universityerp.repository.CourseRepository;
import com.erp.universityerp.repository.CourseSubjectMappingRepository;
import com.erp.universityerp.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseSubjectMappingService {

    private final CourseSubjectMappingRepository mappingRepository;
    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;

    public CourseSubjectMappingService(
            CourseSubjectMappingRepository mappingRepository,
            CourseRepository courseRepository,
            SubjectRepository subjectRepository) {

        this.mappingRepository = mappingRepository;
        this.courseRepository = courseRepository;
        this.subjectRepository = subjectRepository;
    }

    // =========================================================
    // GET ALL MAPPINGS
    // =========================================================

    public List<CourseSubjectMappingDTO> getAllMappings() {

        return mappingRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // =========================================================
    // GET MAPPINGS BY COURSE
    // =========================================================

    public List<CourseSubjectMapping> getMappingsByCourse(
            Long courseId) {

        return mappingRepository.findByCourseId(courseId);
    }

    // =========================================================
    // GET MAPPINGS BY COURSE + SEMESTER
    // =========================================================

    public List<CourseSubjectMapping> getMappingsByCourseAndSemester(
            Long courseId,
            String semester) {

        return mappingRepository
                .findByCourseIdAndSemester(
                        courseId,
                        semester);
    }

    // =========================================================
    // CREATE MAPPING
    // =========================================================

    public CourseSubjectMapping createMapping(
            Long courseId,
            Long subjectId,
            String semester,
            String academicYear,
            String status) {

        boolean exists =
                mappingRepository
                        .existsByCourseIdAndSubjectIdAndSemesterAndAcademicYear(
                                courseId,
                                subjectId,
                                semester,
                                academicYear);

        if (exists) {

            throw new RuntimeException(
                    "This subject is already mapped to this course, semester and academic year.");
        }

        Course course =
                courseRepository.findById(courseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course not found"));

        Subject subject =
                subjectRepository.findById(subjectId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Subject not found"));

        CourseSubjectMapping mapping =
                new CourseSubjectMapping();

        mapping.setCourse(course);
        mapping.setSubject(subject);
        mapping.setSemester(semester);
        mapping.setAcademicYear(academicYear);

        mapping.setStatus(
                status == null || status.isBlank()
                        ? "Active"
                        : status);

        return mappingRepository.save(mapping);
    }

    // =========================================================
    // DELETE MAPPING
    // =========================================================

    public void deleteMapping(Long id) {

        mappingRepository.deleteById(id);
    }

    // =========================================================
    // GET STUDENT SUBJECTS
    // =========================================================

    public List<StudentCourseSubjectDTO> getStudentSubjects(
            String courseName,
            String semester) {

        Course course =
                courseRepository.findByCourseName(courseName)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Course not found: "
                                                + courseName));

        List<CourseSubjectMapping> mappings =
                mappingRepository
                        .findByCourseIdAndSemesterAndStatus(
                                course.getId(),
                                semester,
                                "Active");

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
    // CONVERT ENTITY TO DTO
    // =========================================================

    private CourseSubjectMappingDTO convertToDTO(
            CourseSubjectMapping mapping) {

        CourseSubjectMappingDTO dto =
                new CourseSubjectMappingDTO();

        dto.setId(mapping.getId());

        Course course =
                mapping.getCourse();

        Subject subject =
                mapping.getSubject();

        dto.setCourseId(
                course.getId());

        dto.setCourseCode(
                course.getCourseCode());

        dto.setCourseName(
                course.getCourseName());

        dto.setSubjectId(
                subject.getId());

        dto.setSubjectCode(
                subject.getSubjectCode());

        dto.setSubjectName(
                subject.getSubjectName());

        dto.setSubjectType(
                subject.getSubjectType());

        dto.setCredits(
                subject.getCredits());

        dto.setSemester(
                mapping.getSemester());

        dto.setAcademicYear(
                mapping.getAcademicYear());

        dto.setStatus(
                mapping.getStatus());

        return dto;
    }
}