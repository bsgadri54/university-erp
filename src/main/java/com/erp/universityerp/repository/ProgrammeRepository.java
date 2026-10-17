package com.erp.universityerp.repository;

import com.erp.universityerp.entity.Programme;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgrammeRepository
        extends JpaRepository<Programme, Long> {

}