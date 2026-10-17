package com.erp.universityerp.controller;

import com.erp.universityerp.entity.Programme;
import com.erp.universityerp.service.ProgrammeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programmes")
@CrossOrigin
public class ProgrammeController {

    private final ProgrammeService programmeService;


    public ProgrammeController(
            ProgrammeService programmeService) {

        this.programmeService =
                programmeService;

    }


    @GetMapping
    public List<Programme> getAllProgrammes() {

        return programmeService
                .getAllProgrammes();

    }


    @GetMapping("/{id}")
    public Programme getProgrammeById(
            @PathVariable Long id) {

        return programmeService
                .getProgrammeById(id);

    }


    @PostMapping
    public Programme createProgramme(
            @RequestBody Programme programme) {

        return programmeService
                .saveProgramme(programme);

    }


    @PutMapping("/{id}")
    public Programme updateProgramme(
            @PathVariable Long id,
            @RequestBody Programme programme) {

        return programmeService
                .updateProgramme(
                        id,
                        programme
                );

    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProgramme(
            @PathVariable Long id) {

        programmeService
                .deleteProgramme(id);

        return ResponseEntity.ok(
                "Programme deleted successfully"
        );

    }

}