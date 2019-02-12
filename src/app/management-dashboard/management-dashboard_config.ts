const configs={
    "API_BASE":"http://crashoverride.dlinkddns.com:2000",
    "GET_PERFORMANCE_REPORT":"/management/contest-report/get-performance-report",
    "GET_CONTESTS":"/management/get-all-contests",
    "GET_LANGUAGE_REPORT":"/management/contest-report/get-language-report",
    "GET_STUDENT_WISE_REPORT":"/management/contest-report/student-wise-report",
    "GET_PER_CHALLENGE_REPORT":"/management/contest-report/per-challenge-report",
    "GET_PER_CHALLENGE_TIME_REPORT":"/management/contest-report/per-challenge-time-report",
    "GET_CONTEST_DETAIL":"/management/get-contest-detail",
    "GET_COURSE_REPORT":"/management/course-report",
    "GET_ALL_COURSES":"/courses/get-all-courses",
    "GET_ALL_DEPARTMENTS":"/get-all-departments",
    "GET_ALL_YEARS":"/get-all-years",
    "GET_PRACTICE_REPORT":"/management/practice-report",
    "GET_ALL_EXAMS":"/management/get-all-exams",
    "GET_EXAM_DETAILS":"/management/exam-report",
    "GET_STUDENT_CONTEST_REPORT":"/management/student-report/contest-report",
    "GET_STUDENT_COURSE_REPORT":"/management/student-report/course-report",
    "GET_STUDENT_PRACTICE_REPORT":"/management/student-report/practice-report",
    "GET_STUDENT_EXAM_REPORT":"/management/student-report/exam-report",
    "GET_STUDENT_DETAILS":"/management/get-student-details",
    "GET_ALL_LABS": "/management/get-all-labs",
    "GET_ALL_FACULTIES":"/management/get-all-faculties",
    "GET_LAB_REPORTS":"/management/lab-reports",
    // "GET_STUDENT_LAB_REPORT":"/management/lab-reports",
    "NOTIFICATION_API":"/management/send-notification",
    "GET_STUDENT_LABS":"/management/get-student-labs",
    "GET_YEARS_DEPT":"/management-dashboard/get-years-departments"
}

export const getApiConfig = (suffix)=>{
    return configs["API_BASE"]+configs[suffix];
}