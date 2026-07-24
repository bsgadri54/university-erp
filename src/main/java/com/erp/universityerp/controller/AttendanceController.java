package com.erp.universityerp.controller;

import com.erp.universityerp.entity.Attendance;
import com.erp.universityerp.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attendance")
@CrossOrigin("*")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping
    public Attendance saveAttendance(@RequestBody Attendance attendance){
        return attendanceService.saveAttendance(attendance);
    }

    @GetMapping
    public List<Attendance> getAllAttendance(){
        return attendanceService.getAllAttendance();
    }

    @GetMapping("/student/{userId}")
    public List<Attendance> getStudentAttendance(@PathVariable Long userId) {

        return attendanceService.getAttendanceByUserId(userId);

    }
    @GetMapping("/employee/{userId}")
    public List<Attendance> getEmployeeAttendance(@PathVariable Long userId) {

        return attendanceService.getAttendanceByUserId(userId);

    }

    @DeleteMapping("/{id}")
    public String deleteAttendance(@PathVariable Long id){

        attendanceService.deleteAttendance(id);

        return "Attendance Deleted";
    }
}