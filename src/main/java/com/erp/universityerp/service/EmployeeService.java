package com.erp.universityerp.service;

import com.erp.universityerp.entity.Employee;
import com.erp.universityerp.entity.User;
import com.erp.universityerp.repository.EmployeeRepository;
import com.erp.universityerp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    // ============================================
    // Save Employee
    // ============================================

    public Employee saveEmployee(Employee employee) {

        Employee savedEmployee = employeeRepository.save(employee);

        User user = userRepository.findByUsername(employee.getEmployeeCode());

        if (user == null) {

            user = new User();

            user.setUsername(employee.getEmployeeCode());

            user.setPassword("Gadri@#09");

            user.setRole("EMPLOYEE");

            user = userRepository.save(user);

            // Link Employee with User
            savedEmployee.setUserId(user.getId());

            savedEmployee = employeeRepository.save(savedEmployee);

        }

        return savedEmployee;
    }

    // ============================================
    // Get All Employees
    // ============================================

    public List<Employee> getAllEmployees() {

        return employeeRepository.findAll();

    }

    // ============================================
    // Get Employee By Id
    // ============================================

    public Employee getEmployeeById(Long id) {

        return employeeRepository.findById(id).orElse(null);

    }

    // ============================================
    // Get Employee By User Id
    // ============================================

    public Employee getEmployeeByUserId(Long userId) {

        return employeeRepository.findByUserId(userId);

    }

    // ============================================
    // Delete Employee
    // ============================================

    public void deleteEmployee(Long id) {

        employeeRepository.deleteById(id);

    }

    // ============================================
    // Update Employee
    // ============================================

    public Employee updateEmployee(Long id, Employee employee) {

        Employee emp = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee Not Found"));

        emp.setEmployeeCode(employee.getEmployeeCode());
        emp.setName(employee.getName());
        emp.setEmail(employee.getEmail());
        emp.setMobile(employee.getMobile());
        emp.setDesignation(employee.getDesignation());
        emp.setDepartment(employee.getDepartment());

        return employeeRepository.save(emp);

    }

}