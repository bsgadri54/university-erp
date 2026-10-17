package com.erp.universityerp.controller;

import com.erp.universityerp.entity.Subject;
import com.erp.universityerp.service.SubjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    // GET ALL
    @GetMapping
    public List<Subject> getAllSubjects() {
        return subjectService.getAllSubjects();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Subject> getSubjectById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                subjectService.getSubjectById(id)
        );
    }

    // CREATE
    @PostMapping
    public ResponseEntity<Subject> createSubject(
            @RequestBody Subject subject) {

        return ResponseEntity.ok(
                subjectService.createSubject(subject)
        );
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Subject> updateSubject(
            @PathVariable Long id,
            @RequestBody Subject subject) {

        return ResponseEntity.ok(
                subjectService.updateSubject(id, subject)
        );
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubject(
            @PathVariable Long id) {

        subjectService.deleteSubject(id);

        return ResponseEntity.ok(
                "Subject deleted successfully"
        );
    }
}