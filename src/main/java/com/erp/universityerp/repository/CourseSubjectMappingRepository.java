package com.erp.universityerp.repository;

import com.erp.universityerp.entity.CourseSubjectMapping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseSubjectMappingRepository
        extends JpaRepository<CourseSubjectMapping, Long> {

    List<CourseSubjectMapping> findByCourseId(Long courseId);

    List<CourseSubjectMapping> findByCourseIdAndSemester(
            Long courseId,
            String semester);

    List<CourseSubjectMapping> findByCourseIdAndSemesterAndStatus(
            Long courseId,
            String semester,
            String status);

    boolean existsByCourseIdAndSubjectIdAndSemesterAndAcademicYear(
            Long courseId,
            Long subjectId,
            String semester,
            String academicYear);
}