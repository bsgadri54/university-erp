package com.erp.universityerp.service;

import com.erp.universityerp.entity.Programme;
import com.erp.universityerp.repository.ProgrammeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgrammeService {

    private final ProgrammeRepository programmeRepository;

    public ProgrammeService(
            ProgrammeRepository programmeRepository) {

        this.programmeRepository =
                programmeRepository;
    }


    public List<Programme> getAllProgrammes() {

        return programmeRepository.findAll();

    }


    public Programme getProgrammeById(Long id) {

        return programmeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Programme not found with ID: " + id
                        ));

    }


    public Programme saveProgramme(
            Programme programme) {

        if (programme.getStatus() == null ||
                programme.getStatus().isBlank()) {

            programme.setStatus("Active");

        }

        return programmeRepository.save(
                programme
        );

    }


    public Programme updateProgramme(
            Long id,
            Programme updatedProgramme) {

        Programme existing =
                getProgrammeById(id);


        existing.setProgrammeCode(
                updatedProgramme.getProgrammeCode()
        );

        existing.setProgrammeName(
                updatedProgramme.getProgrammeName()
        );

        existing.setDepartment(
                updatedProgramme.getDepartment()
        );

        existing.setDegreeType(
                updatedProgramme.getDegreeType()
        );

        existing.setDuration(
                updatedProgramme.getDuration()
        );

        existing.setStatus(
                updatedProgramme.getStatus()
        );


        return programmeRepository.save(
                existing
        );

    }


    public void deleteProgramme(Long id) {

        programmeRepository.deleteById(id);

    }

}