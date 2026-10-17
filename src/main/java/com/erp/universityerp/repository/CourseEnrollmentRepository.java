package com.erp.universityerp.repository;

import com.erp.universityerp.entity.CourseEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseEnrollmentRepository
        extends JpaRepository<CourseEnrollment, Long> {

    List<CourseEnrollment> findByStudentId(Long studentId);

    boolean existsByStudentIdAndSemesterAndAcademicYear(
            Long studentId,
            String semester,
            String academicYear
    );

    boolean existsByStudentIdAndCourseIdAndSemesterAndAcademicYear(
            Long studentId,
            Long courseId,
            String semester,
            String academicYear
    );

    boolean existsByStudentIdAndSemesterAndAcademicYearAndStatus(
            Long studentId,
            String semester,
            String academicYear,
            String status
    );
}