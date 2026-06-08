package com.erp.universityerp.repository;

import com.erp.universityerp.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {
}