package com.erp.universityerp.controller;

import com.erp.universityerp.entity.Result;
import com.erp.universityerp.repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class ResultController {

    @Autowired
    private ResultRepository repository;

    // SAVE MARKS
    @PostMapping("/results")
    public ResponseEntity<?> saveResult(
            @RequestBody Result result){

        Result existing =
                repository.findByEnrollmentNoAndSubject(
                        result.getEnrollmentNo(),
                        result.getSubject());

        if(existing != null){
            return ResponseEntity.badRequest()
                    .body("Marks already updated");
        }

        repository.save(result);

        return ResponseEntity.ok("Marks Saved");
    }

    // GET ALL RESULTS
    @GetMapping("/results")
    public List<Result> getAllResults(){

        return repository.findAll();
    }

    // GET STUDENT RESULTS
    @GetMapping("/results/{enrollmentNo}")
    public List<Result> getStudentResults(
            @PathVariable String enrollmentNo){

        return repository.findByEnrollmentNo(
                enrollmentNo
        );
    }

    // UPDATE MARKS
    @PutMapping("/results/{id}")
    public ResponseEntity<?> updateResult(
            @PathVariable Long id,
            @RequestBody Result updatedResult){

        Result result =
                repository.findById(id)
                        .orElse(null);

        if(result == null){
            return ResponseEntity
                    .badRequest()
                    .body("Result Not Found");
        }

        result.setMarks(updatedResult.getMarks());

        repository.save(result);

        return ResponseEntity.ok("Marks Updated Successfully");
    }

    @DeleteMapping("/results/{id}")
    public ResponseEntity<?> deleteResult(
            @PathVariable Long id){

        if(!repository.existsById(id)){
            return ResponseEntity
                    .badRequest()
                    .body("Result Not Found");
        }

        repository.deleteById(id);

        return ResponseEntity.ok("Result Deleted Successfully");
    }

    // TEST API
    @GetMapping("/test-result")
    public String testResult(){

        return "Result Controller Working";
    }
}