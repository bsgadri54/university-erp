package com.erp.universityerp.service;

import com.erp.universityerp.entity.Attendance;
import com.erp.universityerp.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    public Attendance saveAttendance(Attendance attendance){
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAllAttendance(){
        return attendanceRepository.findAll();
    }

    public void deleteAttendance(Long id){
        attendanceRepository.deleteById(id);
    }
}