package com.erp.universityerp.repository;

import com.erp.universityerp.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResultRepository
        extends JpaRepository<Result, Long> {

    List<Result> findByEnrollmentNo(
            String enrollmentNo
    );

    Result findByEnrollmentNoAndSubject(
            String enrollmentNo,
            String subject
    );
}