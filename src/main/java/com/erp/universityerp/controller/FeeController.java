package com.erp.universityerp.controller;

import com.erp.universityerp.entity.Fee;
import com.erp.universityerp.service.FeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fees")
@CrossOrigin(origins = "*")
public class FeeController {

    @Autowired
    private FeeService feeService;

    // =====================================================
    // ADMIN - ADD FEE
    // =====================================================

    @PostMapping
    public Fee saveFee(@RequestBody Fee fee) {
        return feeService.saveFee(fee);
    }

    // =====================================================
    // VIEW ALL FEES
    // =====================================================

    @GetMapping
    public List<Fee> getAllFees() {
        return feeService.getAllFees();
    }

    // =====================================================
    // VIEW SINGLE FEE
    // =====================================================

    @GetMapping("/{id}")
    public Fee getFeeById(@PathVariable Long id) {
        return feeService.getFeeById(id);
    }

    // =====================================================
    // ADMIN - UPDATE FEE
    // =====================================================

    @PutMapping("/{id}")
    public Fee updateFee(
            @PathVariable Long id,
            @RequestBody Fee fee) {

        return feeService.updateFee(id, fee);
    }

    // =====================================================
    // ADMIN - DELETE FEE
    // =====================================================

    @DeleteMapping("/{id}")
    public String deleteFee(@PathVariable Long id) {

        feeService.deleteFee(id);

        return "Fee Deleted Successfully";
    }

    // =====================================================
    // SEARCH
    // =====================================================

    @GetMapping("/search")
    public List<Fee> searchFees(
            @RequestParam String keyword) {

        return feeService.searchFees(keyword);
    }

    // =====================================================
    // FILTER BY STATUS
    // =====================================================

    @GetMapping("/status/{status}")
    public List<Fee> getFeesByStatus(
            @PathVariable String status) {

        return feeService.getFeesByStatus(status);
    }

    // =====================================================
    // FILTER BY SEMESTER
    // =====================================================

    @GetMapping("/semester/{semester}")
    public List<Fee> getFeesBySemester(
            @PathVariable String semester) {

        return feeService.getFeesBySemester(semester);
    }

    // =====================================================
    // STUDENT - OWN FEES
    // =====================================================

    @GetMapping("/student/{enrollmentNo}")
    public List<Fee> getStudentFees(
            @PathVariable String enrollmentNo) {

        return feeService.getStudentFees(enrollmentNo);
    }
}