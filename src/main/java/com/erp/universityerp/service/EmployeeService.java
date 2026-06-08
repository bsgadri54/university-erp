package com.erp.universityerp.service;

import com.erp.universityerp.entity.Employee;
import com.erp.universityerp.repository.EmployeeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public Employee saveEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    public Employee updateEmployee(Long id, Employee employee) {

        Employee existingEmployee =
                employeeRepository.findById(id).orElse(null);

        if (existingEmployee != null) {

            existingEmployee.setEmployeeCode(employee.getEmployeeCode());
            existingEmployee.setName(employee.getName());
            existingEmployee.setDesignation(employee.getDesignation());
            existingEmployee.setDepartment(employee.getDepartment());

            return employeeRepository.save(existingEmployee);
        }

        return null;
    }
}