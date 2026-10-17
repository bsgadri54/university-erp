package com.erp.universityerp.service;

import com.erp.universityerp.entity.Course;
import com.erp.universityerp.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Course not found with ID: " + id));
    }

    public Course saveCourse(Course course) {
        if (course.getStatus() == null ||
                course.getStatus().isBlank()) {
            course.setStatus("Active");
        }

        return courseRepository.save(course);
    }

    public Course updateCourse(Long id, Course updatedCourse) {

        Course existingCourse = getCourseById(id);

        existingCourse.setCourseCode(
                updatedCourse.getCourseCode());

        existingCourse.setCourseName(
                updatedCourse.getCourseName());

        existingCourse.setCourseType(
                updatedCourse.getCourseType());

        existingCourse.setCredits(
                updatedCourse.getCredits());

        existingCourse.setDepartment(
                updatedCourse.getDepartment());

        existingCourse.setProgramme(
                updatedCourse.getProgramme());

        existingCourse.setStatus(
                updatedCourse.getStatus());

        return courseRepository.save(existingCourse);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }
}