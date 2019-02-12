const configs={
    "API_BASE":"http://crashoverride.dlinkddns.com:2000",
    "CREATE_QUESTIONS":"/faculty/manage-exam/create-question",
    "GET_QUESTION_BY_TAG":"/faculty/manage-exam/get-question",
    "UPDATE_QUESTION":"/faculty/manage-exam/update-question",
    "GET_QUESTION_BY_ID":"/faculty/manage-exam/get-question-by-id",
    "GET_ALL_EXAMS":"/faculty/manage-exam/get-all-exams",
    "GET_EXAM":"/faculty/manage-exam/get-exam",
    "UPDATE_EXAM":"/faculty/manage-exam/edit-exam",
    "ENTITY_DETAILS":"/faculty/entity-details",
    "GET_ALL_YEARS":"/get-all-years",
    "GET_ALL_DEPARTMENTS":"/get-all-departments",
    "GET_ALL_LABS":"/faculty/get-labs",
    "GET_LAB_DETAILS":"/faculty/get-lab-details",
    "GET_FACULTY_STUDENTS":"/faculty/get-students",
    "GET_LAB_KEYS":"/faculty/generate-lab-keys",
    "GET_STUDENTS_ALLOCATED_TO_FACULTY":"/faculty/get-students",
    "ALLOCATE_STUDENTS":"/faculty/allocate-students",
    "LAB_REPORT":"/faculty/lab-reports",
    "GET_COURSES":"/faculty-dashboard/get-courses",
    "GET_LEADERBOARD":"/faculty-dashboard/courses/leaderboard",
    "NOTIFICATION_API":"/faculty/send-notification",
    "UPDATE_ATTEMPTS":"/faculty-dashboard/labs/update-student-attempts"
}

export const getApiConfig = (suffix)=>{
    return configs["API_BASE"]+configs[suffix];
}