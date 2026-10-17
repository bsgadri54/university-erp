package com.erp.universityerp.controller;

import com.erp.universityerp.dto.StudentCourseSubjectDTO;
import com.erp.universityerp.entity.Student;
import com.erp.universityerp.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentService studentService;


    // =========================================================
    // SAVE STUDENT
    // =========================================================

    @PostMapping
    public Student saveStudent(
            @RequestBody Student student) {

        return studentService.saveStudent(student);
    }


    // =========================================================
    // GET ALL STUDENTS
    // =========================================================

    @GetMapping
    public List<Student> getAllStudents() {

        return studentService.getAllStudents();
    }


    // =========================================================
    // GET STUDENT BY ID
    // =========================================================

    @GetMapping("/{id}")
    public Student getStudentById(
            @PathVariable Long id) {

        return studentService.getStudentById(id);
    }


    // =========================================================
    // GET STUDENT BY ENROLLMENT NUMBER
    // =========================================================

    @GetMapping("/enrollment/{enrollmentNo}")
    public Student getStudentByEnrollmentNo(
            @PathVariable String enrollmentNo) {

        return studentService
                .getStudentByEnrollmentNo(
                        enrollmentNo
                );
    }


    // =========================================================
    // GET STUDENT COURSE SUBJECTS
    // =========================================================

    @GetMapping("/enrollment/{enrollmentNo}/course-subjects")
    public List<StudentCourseSubjectDTO> getStudentCourseSubjects(
            @PathVariable String enrollmentNo) {

        return studentService
                .getStudentCourseSubjects(enrollmentNo);
    }


    // =========================================================
    // DELETE STUDENT
    // =========================================================

    @DeleteMapping("/{id}")
    public String deleteStudent(
            @PathVariable Long id) {

        studentService.deleteStudent(id);

        return "Student Deleted Successfully";
    }


    // =========================================================
    // UPDATE STUDENT
    // =========================================================

    @PutMapping("/{id}")
    public Student updateStudent(
            @PathVariable Long id,
            @RequestBody Student student) {

        return studentService.updateStudent(
                id,
                student
        );
    }
}