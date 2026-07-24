package com.erp.universityerp.service;

import com.erp.universityerp.entity.Result;
import com.erp.universityerp.entity.Student;
import com.erp.universityerp.repository.ResultRepository;
import com.erp.universityerp.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResultService {

    @Autowired
    private ResultRepository repository;

    @Autowired
    private StudentRepository studentRepository;

    // =============================
    // Save Result
    // =============================

    public String saveResult(Result result) {

        Result existing = repository.findByEnrollmentNoAndSubject(
                result.getEnrollmentNo(),
                result.getSubject());

        if (existing != null) {
            return "Marks already updated";
        }

        Student student =
                studentRepository.findByEnrollmentNo(
                        result.getEnrollmentNo());

        if (student == null) {
            return "Student Not Found";
        }

        result.setStudentName(student.getName());
        result.setCourse(student.getCourse());

        int maxMarks = 100;

        if (result.getSubject().toUpperCase().contains("LAB")
                || result.getSubject().toUpperCase().contains("PRACTICAL")) {

            maxMarks = 50;
        }

        result.setMaxMarks(maxMarks);

        double percentage =
                (result.getMarks() * 100.0) / maxMarks;

        result.setPercentage(percentage);

        if (percentage >= 90)
            result.setGrade("A+");
        else if (percentage >= 80)
            result.setGrade("A");
        else if (percentage >= 70)
            result.setGrade("B");
        else if (percentage >= 60)
            result.setGrade("C");
        else if (percentage >= 40)
            result.setGrade("D");
        else
            result.setGrade("F");

        result.setStatus(
                percentage >= 40 ? "PASS" : "FAIL");

        repository.save(result);

        return "Result Saved Successfully";
    }

    // =============================
    // Get All Results
    // =============================

    public List<Result> getAllResults() {

        return repository.findAll();

    }

    // =============================
    // Get Result By Id
    // =============================

    public Result getResultById(Long id) {

        return repository.findById(id).orElse(null);

    }

    // =============================
    // Get Student Results
    // =============================

    public List<Result> getStudentResults(String enrollmentNo) {

        return repository.findByEnrollmentNo(enrollmentNo);

    }

    // =============================
    // Update Result
    // =============================

    public String updateResult(Long id, Result updated) {

        Result result = repository.findById(id).orElse(null);

        if (result == null) {
            return "Result Not Found";
        }

        // Update fields
        result.setMarks(updated.getMarks());
        result.setSubject(updated.getSubject());
        result.setSemester(updated.getSemester());

        // =============================
        // Maximum Marks
        // =============================

        int maxMarks = 100;

        if (result.getSubject().toUpperCase().contains("LAB")
                || result.getSubject().toUpperCase().contains("PRACTICAL")) {

            maxMarks = 50;
        }

        result.setMaxMarks(maxMarks);

        // =============================
        // Percentage
        // =============================

        double percentage =
                (result.getMarks() * 100.0) / maxMarks;

        result.setPercentage(percentage);

        // =============================
        // Grade
        // =============================

        if (percentage >= 90)
            result.setGrade("A+");
        else if (percentage >= 80)
            result.setGrade("A");
        else if (percentage >= 70)
            result.setGrade("B");
        else if (percentage >= 60)
            result.setGrade("C");
        else if (percentage >= 40)
            result.setGrade("D");
        else
            result.setGrade("F");

        // =============================
        // Status
        // =============================

        result.setStatus(percentage >= 40 ? "PASS" : "FAIL");

        repository.save(result);

        return "Result Updated Successfully";
    }

    // =============================
    // Delete Result
    // =============================

    public String deleteResult(Long id) {

        if (!repository.existsById(id))
            return "Result Not Found";

        repository.deleteById(id);

        return "Result Deleted Successfully";
    }

}