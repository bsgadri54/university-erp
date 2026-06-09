package com.erp.university.controller;

import com.erp.university.entity.Result;
import com.erp.university.repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class ResultController {

    @Autowired
    private ResultRepository repository;

    @PostMapping("/results")
    public Result saveResult(
            @RequestBody Result result){

        return repository.save(result);
    }

    @GetMapping("/results")
    public List<Result> getAllResults(){

        return repository.findAll();
    }

    @GetMapping("/results/{enrollmentNo}")
    public List<Result> getStudentResults(
            @PathVariable String enrollmentNo){

        return repository.findByEnrollmentNo(
                enrollmentNo
        );
    }
}