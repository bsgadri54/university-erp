package com.erp.universityerp.service;

import com.erp.universityerp.entity.Attendance;
import com.erp.universityerp.entity.User;
import com.erp.universityerp.repository.AttendanceRepository;
import com.erp.universityerp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private UserRepository userRepository;

    public Attendance saveAttendance(Attendance attendance) {

        User user = userRepository.findByUsername(attendance.getPersonId());

        if (user == null) {
            throw new RuntimeException("User not found : " + attendance.getPersonId());
        }

        // Always save the correct User ID
        attendance.setUserId(user.getId());

        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }

    public List<Attendance> getAttendanceByUserId(Long userId) {
        return attendanceRepository.findByUserId(userId);
    }
}