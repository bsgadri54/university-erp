package com.erp.universityerp.service;

import com.erp.universityerp.entity.*;
import com.erp.universityerp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

    @Service
    public class CourseEnrollmentService {

        private final CourseEnrollmentRepository enrollmentRepository;
        private final StudentRepository studentRepository;
        private final CourseRepository courseRepository;

        public CourseEnrollmentService(
                CourseEnrollmentRepository enrollmentRepository,
                StudentRepository studentRepository,
                CourseRepository courseRepository) {

            this.enrollmentRepository = enrollmentRepository;
            this.studentRepository = studentRepository;
            this.courseRepository = courseRepository;
        }

        public List<CourseEnrollment> getAllEnrollments() {
            return enrollmentRepository.findAll();
        }

        public List<CourseEnrollment> getStudentEnrollments(Long studentId) {
            return enrollmentRepository.findByStudentId(studentId);
        }

        public CourseEnrollment createEnrollment(
                Long studentId,
                Long courseId,
                String semester,
                String academicYear,
                String status) {

            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() ->
                            new RuntimeException("Student not found"));

            Course course = courseRepository.findById(courseId)
                    .orElseThrow(() ->
                            new RuntimeException("Course not found"));

            CourseEnrollment enrollment =
                    new CourseEnrollment();

            enrollment.setStudent(student);
            enrollment.setCourse(course);
            enrollment.setSemester(semester);
            enrollment.setAcademicYear(academicYear);
            enrollment.setEnrollmentDate(LocalDate.now());

            if (status == null || status.isBlank()) {
                enrollment.setStatus("Active");
            } else {
                enrollment.setStatus(status);
            }

            return enrollmentRepository.save(enrollment);
        }

        public void deleteEnrollment(Long id) {
            enrollmentRepository.deleteById(id);
        }

    }
}