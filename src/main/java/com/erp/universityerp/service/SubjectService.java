package com.erp.universityerp.service;

import com.erp.universityerp.entity.Subject;
import com.erp.universityerp.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    // Get all subjects
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    // Get subject by ID
    public Subject getSubjectById(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Subject not found"));
    }

    // Create subject
    public Subject createSubject(Subject subject) {

        if (subjectRepository
                .findBySubjectCode(subject.getSubjectCode())
                .isPresent()) {

            throw new RuntimeException(
                    "Subject code already exists");
        }

        return subjectRepository.save(subject);
    }

    // Update subject
    public Subject updateSubject(Long id, Subject subject) {

        Subject existing = subjectRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Subject not found"));

        existing.setSubjectCode(subject.getSubjectCode());
        existing.setSubjectName(subject.getSubjectName());
        existing.setSubjectType(subject.getSubjectType());
        existing.setCredits(subject.getCredits());
        existing.setDepartment(subject.getDepartment());
        existing.setStatus(subject.getStatus());

        return subjectRepository.save(existing);
    }

    // Delete subject
    public void deleteSubject(Long id) {

        if (!subjectRepository.existsById(id)) {
            throw new RuntimeException("Subject not found");
        }

        subjectRepository.deleteById(id);
    }
}