package com.erp.universityerp.repository;

import com.erp.universityerp.entity.Leave;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRepository extends JpaRepository<Leave, Long> {

    List<Leave> findByUserId(Long userId);

}