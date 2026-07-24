package com.erp.universityerp.controller;

import com.erp.universityerp.entity.Employee;
import com.erp.universityerp.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    // ============================================
    // Get All Employees
    // ============================================

    @GetMapping
    public List<Employee> getAllEmployees() {

        return employeeService.getAllEmployees();

    }

    // ============================================
    // Get Employee By ID
    // ============================================

    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable Long id) {

        return employeeService.getEmployeeById(id);

    }

    // ============================================
    // Get Employee By User ID
    // ============================================

    @GetMapping("/user/{userId}")
    public Employee getEmployeeByUserId(@PathVariable Long userId) {

        return employeeService.getEmployeeByUserId(userId);

    }

    // ============================================
    // Save Employee
    // ============================================

    @PostMapping
    public Employee saveEmployee(@RequestBody Employee employee) {

        return employeeService.saveEmployee(employee);

    }

    // ============================================
    // Update Employee
    // ============================================

    @PutMapping("/{id}")
    public Employee updateEmployee(
            @PathVariable Long id,
            @RequestBody Employee employee) {

        return employeeService.updateEmployee(id, employee);

    }

    // ============================================
    // Delete Employee
    // ============================================

    @DeleteMapping("/{id}")
    public String deleteEmployee(@PathVariable Long id) {

        employeeService.deleteEmployee(id);

        return "Employee Deleted Successfully";

    }

}