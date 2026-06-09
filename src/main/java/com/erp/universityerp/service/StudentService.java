package com.erp.universityerp.service;

import com.erp.universityerp.entity.Student;
import com.erp.universityerp.entity.User;
import com.erp.universityerp.repository.StudentRepository;
import com.erp.universityerp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    public Student saveStudent(Student student) {

        Student savedStudent = studentRepository.save(student);

        User user = userRepository.findByUsername(student.getEnrollmentNo());

        if(user == null) {
            user = new User();
            user.setUsername(student.getEnrollmentNo());
            user.setPassword("Gadri@#09");
            user.setRole("STUDENT");

            userRepository.save(user);
        }

        return savedStudent;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id).orElse(null);
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    public Student updateStudent(Long id, Student student) {

        Student existingStudent =
                studentRepository.findById(id).orElse(null);

        if(existingStudent != null) {

            existingStudent.setName(student.getName());
            existingStudent.setEmail(student.getEmail());
            existingStudent.setPhone(student.getPhone());
            existingStudent.setCourse(student.getCourse());
            existingStudent.setSemester(student.getSemester());
            existingStudent.setEnrollmentNo(student.getEnrollmentNo());

            return studentRepository.save(existingStudent);
        }

        return null;
    }
}