package com.erp.universityerp.controller;

import com.erp.universityerp.entity.Result;
import com.erp.universityerp.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/results")
public class ResultController {

    @Autowired
    private ResultService resultService;

    // =============================
    // Save Result
    // =============================
    @PostMapping
    public ResponseEntity<String> saveResult(@RequestBody Result result) {

        String message = resultService.saveResult(result);

        if (message.equals("Marks already updated")) {
            return ResponseEntity.badRequest().body(message);
        }

        return ResponseEntity.ok(message);
    }

    // =============================
    // Get All Results
    // =============================
    @GetMapping
    public List<Result> getAllResults() {

        return resultService.getAllResults();

    }

    // =============================
    // Get Result By ID
    // =============================
    @GetMapping("/{id}")
    public ResponseEntity<Result> getResultById(@PathVariable Long id) {

        Result result = resultService.getResultById(id);

        if (result == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(result);

    }

    // =============================
    // Get Student Results
    // =============================
    @GetMapping("/student/{enrollmentNo}")
    public List<Result> getStudentResults(
            @PathVariable String enrollmentNo) {

        return resultService.getStudentResults(enrollmentNo);

    }

    // =============================
    // Update Result
    // =============================
    @PutMapping("/{id}")
    public ResponseEntity<String> updateResult(
            @PathVariable Long id,
            @RequestBody Result result) {

        String message = resultService.updateResult(id, result);

        if (message.equals("Result Not Found")) {
            return ResponseEntity.badRequest().body(message);
        }

        return ResponseEntity.ok(message);

    }

    // =============================
    // Delete Result
    // =============================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteResult(
            @PathVariable Long id) {

        String message = resultService.deleteResult(id);

        if (message.equals("Result Not Found")) {
            return ResponseEntity.badRequest().body(message);
        }

        return ResponseEntity.ok(message);

    }

    // =============================
    // Test API
    // =============================
    @GetMapping("/test")
    public String test() {

        return "Result Controller Working";

    }

}