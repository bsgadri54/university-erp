package com.erp.universityerp.service;

import com.erp.universityerp.entity.Fee;
import com.erp.universityerp.repository.FeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeeService {

    @Autowired
    private FeeRepository feeRepository;

    // =========================
    // SAVE FEE
    // =========================

    public Fee saveFee(Fee fee) {

        calculateFeeDetails(fee);

        return feeRepository.save(fee);
    }

    // =========================
    // GET ALL FEES
    // =========================

    public List<Fee> getAllFees() {

        return feeRepository.findAll();
    }

    // =========================
    // GET FEE BY ID
    // =========================

    public Fee getFeeById(Long id) {

        return feeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Fee record not found with ID: " + id)
                );
    }

    // =========================
    // UPDATE FEE
    // =========================

    public Fee updateFee(Long id, Fee fee) {

        Fee existingFee = getFeeById(id);

        existingFee.setEnrollmentNo(fee.getEnrollmentNo());
        existingFee.setStudentName(fee.getStudentName());
        existingFee.setCourse(fee.getCourse());
        existingFee.setSemester(fee.getSemester());
        existingFee.setTotalFee(fee.getTotalFee());
        existingFee.setPaidAmount(fee.getPaidAmount());
        existingFee.setPaymentDate(fee.getPaymentDate());
        existingFee.setPaymentMode(fee.getPaymentMode());

        calculateFeeDetails(existingFee);

        return feeRepository.save(existingFee);
    }

    // =========================
    // DELETE FEE
    // =========================

    public void deleteFee(Long id) {

        if (!feeRepository.existsById(id)) {

            throw new RuntimeException(
                    "Fee record not found with ID: " + id
            );
        }

        feeRepository.deleteById(id);
    }

    // =========================
    // SEARCH
    // =========================

    public List<Fee> searchFees(String keyword) {

        return feeRepository
                .findByEnrollmentNoContainingIgnoreCaseOrStudentNameContainingIgnoreCase(
                        keyword,
                        keyword
                );
    }

    // =========================
    // FILTER BY STATUS
    // =========================

    public List<Fee> getFeesByStatus(String status) {

        return feeRepository.findByPaymentStatus(status);
    }

    // =========================
    // FILTER BY SEMESTER
    // =========================

    public List<Fee> getFeesBySemester(String semester) {

        return feeRepository.findBySemester(semester);
    }

    // =========================
// STUDENT OWN FEES
// =========================

    public List<Fee> getStudentFees(String enrollmentNo) {

        return feeRepository.findByEnrollmentNo(enrollmentNo);
    }

    // =========================
    // CALCULATE FEE DETAILS
    // =========================

    private void calculateFeeDetails(Fee fee) {

        double totalFee = fee.getTotalFee() != null
                ? fee.getTotalFee()
                : 0.0;

        double paidAmount = fee.getPaidAmount() != null
                ? fee.getPaidAmount()
                : 0.0;

        // Prevent invalid negative values
        if (totalFee < 0) {
            totalFee = 0;
        }

        if (paidAmount < 0) {
            paidAmount = 0;
        }

        // Paid amount cannot be greater than total fee
        if (paidAmount > totalFee) {
            paidAmount = totalFee;
        }

        double remainingAmount = totalFee - paidAmount;

        fee.setTotalFee(totalFee);
        fee.setPaidAmount(paidAmount);
        fee.setRemainingAmount(remainingAmount);

        // Automatically determine payment status
        if (totalFee == 0) {

            fee.setPaymentStatus("PENDING");

        } else if (paidAmount == 0) {

            fee.setPaymentStatus("PENDING");

        } else if (paidAmount < totalFee) {

            fee.setPaymentStatus("PARTIAL");

        } else {

            fee.setPaymentStatus("PAID");
        }
    }
}