package com.erp.universityerp.repository;

import com.erp.universityerp.entity.Fee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeeRepository extends JpaRepository<Fee, Long> {

    List<Fee> findByEnrollmentNoContainingIgnoreCaseOrStudentNameContainingIgnoreCase(
            String enrollmentNo,
            String studentName
    );

    List<Fee> findByPaymentStatus(String paymentStatus);

    List<Fee> findBySemester(String semester);

    List<Fee> findByEnrollmentNo(String enrollmentNo);
}