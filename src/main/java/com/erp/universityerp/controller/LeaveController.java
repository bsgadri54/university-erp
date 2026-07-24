package com.erp.universityerp.controller;

import com.erp.universityerp.entity.Leave;
import com.erp.universityerp.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leave")
@CrossOrigin("*")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    // Apply Leave
    @PostMapping
    public ResponseEntity<Leave> applyLeave(@RequestBody Leave leave) {
        Leave savedLeave = leaveService.saveLeave(leave);
        return ResponseEntity.ok(savedLeave);
    }

    // Get All Leave Requests
    @GetMapping
    public ResponseEntity<List<Leave>> getAllLeaves() {
        return ResponseEntity.ok(leaveService.getAllLeaves());
    }

    // Student Leave History
    @GetMapping("/student/{userId}")
    public ResponseEntity<List<Leave>> getStudentLeave(@PathVariable Long userId) {
        return ResponseEntity.ok(leaveService.getLeaveByUserId(userId));
    }

    // Employee Leave History
    @GetMapping("/employee/{userId}")
    public ResponseEntity<List<Leave>> getEmployeeLeave(@PathVariable Long userId) {
        return ResponseEntity.ok(leaveService.getLeaveByUserId(userId));
    }

    // ============================================
// Approve Leave
// ============================================

    @PutMapping("/{id}/approve")
    public ResponseEntity<Leave> approveLeave(
            @PathVariable Long id,
            @RequestParam(required = false) String remarks) {

        return ResponseEntity.ok(
                leaveService.approveLeave(id, remarks)
        );

    }

// ============================================
// Reject Leave
// ============================================

    @PutMapping("/{id}/reject")
    public ResponseEntity<Leave> rejectLeave(
            @PathVariable Long id,
            @RequestParam(required = false) String remarks) {

        return ResponseEntity.ok(
                leaveService.rejectLeave(id, remarks)
        );

    }

    // ============================================
// Update Leave Status
// ============================================

    @PutMapping("/{id}/status")
    public ResponseEntity<Leave> updateLeaveStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String remarks) {

        return ResponseEntity.ok(
                leaveService.updateLeaveStatus(id, status, remarks)
        );
    }

    // Delete Leave
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLeave(@PathVariable Long id) {
        leaveService.deleteLeave(id);
        return ResponseEntity.ok("Leave deleted successfully.");
    }
}