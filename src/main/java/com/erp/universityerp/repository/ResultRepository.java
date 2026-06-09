package com.erp.university.repository;

import com.erp.university.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Long> {

    List<Result> findByEnrollmentNo(String enrollmentNo);
}