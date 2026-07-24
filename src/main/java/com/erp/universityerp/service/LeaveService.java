package com.erp.universityerp.service;

import com.erp.universityerp.entity.Leave;
import com.erp.universityerp.repository.LeaveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class LeaveService {

    @Autowired
    private LeaveRepository leaveRepository;

    // ============================================
    // Apply Leave
    // ============================================

    public Leave saveLeave(Leave leave) {

        leave.setStatus("PENDING");
        leave.setAppliedDate(LocalDate.now());

        return leaveRepository.save(leave);
    }

    // ============================================
    // Get All Leave
    // ============================================

    public List<Leave> getAllLeaves() {
        return leaveRepository.findAll();
    }

    // ============================================
    // Get Leave By User
    // ============================================

    public List<Leave> getLeaveByUserId(Long userId) {
        return leaveRepository.findByUserId(userId);
    }

    // ============================================
    // Approve Leave
    // ============================================

    public Leave approveLeave(Long id, String remarks) {

        Leave leave = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave Not Found"));

        leave.setStatus("APPROVED");
        leave.setRemarks(remarks);
        leave.setApprovalDate(LocalDate.now());

        return leaveRepository.save(leave);
    }

    // ============================================
    // Reject Leave
    // ============================================

    public Leave rejectLeave(Long id, String remarks) {

        Leave leave = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave Not Found"));

        leave.setStatus("REJECTED");
        leave.setRemarks(remarks);
        leave.setApprovalDate(LocalDate.now());

        return leaveRepository.save(leave);
    }

    // ============================================
    // Update Leave Status (Edit)
    // ============================================

    public Leave updateLeaveStatus(Long id,
                                   String status,
                                   String remarks) {

        Leave leave = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave Not Found"));

        leave.setStatus(status.toUpperCase());
        leave.setRemarks(remarks);
        leave.setApprovalDate(LocalDate.now());

        return leaveRepository.save(leave);
    }

    // ============================================
    // Delete Leave
    // ============================================

    public void deleteLeave(Long id) {
        leaveRepository.deleteById(id);
    }

}