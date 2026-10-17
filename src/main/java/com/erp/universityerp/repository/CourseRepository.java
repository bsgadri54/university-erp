package com.erp.universityerp.repository;

import com.erp.universityerp.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository
        extends JpaRepository<Course, Long> {

    List<Course> findByProgramme(String programme);

    Optional<Course> findByCourseName(String courseName);
}