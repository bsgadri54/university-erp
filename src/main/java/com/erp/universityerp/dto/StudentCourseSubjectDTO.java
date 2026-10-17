package com.erp.universityerp.dto;

public class StudentCourseSubjectDTO {

    private String subjectCode;
    private String subjectName;
    private Integer credits;
    private String subjectType;
    private String semester;
    private String academicYear;


    public StudentCourseSubjectDTO(
            String subjectCode,
            String subjectName,
            Integer credits,
            String subjectType,
            String semester,
            String academicYear) {

        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.credits = credits;
        this.subjectType = subjectType;
        this.semester = semester;
        this.academicYear = academicYear;
    }


    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }


    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }


    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }


    public String getSubjectType() {
        return subjectType;
    }

    public void setSubjectType(String subjectType) {
        this.subjectType = subjectType;
    }


    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }


    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }
}