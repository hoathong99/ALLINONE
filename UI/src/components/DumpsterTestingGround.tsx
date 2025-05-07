import validator from "@rjsf/validator-ajv8/lib/validator.js";
import { Form } from "react-router";

let schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "definitions": {
        "Attendance": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string"
                },
                "employeeCode": {
                    "type": "string"
                },
                "fullName": {
                    "type": "string"
                },
                "department": {
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "position": {
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "periodStart": {
                    "type": "string",
                    "format": "date-time"
                },
                "periodEnd": {
                    "type": "string",
                    "format": "date-time"
                },
                "isFinalized": {
                    "type": "boolean",
                    "default": false
                },
                "records": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/AttendanceRecord"
                    }
                },
                "createdAt": {
                    "type": "string",
                    "format": "date-time"
                },
                "updatedAt": {
                    "type": "string",
                    "format": "date-time"
                }
            }
        },
        "AttendanceRecord": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string"
                },
                "attendance": {
                    "$ref": "#/definitions/Attendance"
                },
                "date": {
                    "type": "string",
                    "format": "date-time"
                },
                "dayOfWeek": {
                    "type": "string",
                    "enum": [
                        "MONDAY",
                        "TUESDAY",
                        "WEDNESDAY",
                        "THURSDAY",
                        "FRIDAY",
                        "SATURDAY",
                        "SUNDAY"
                    ]
                },
                "status": {
                    "type": [
                        "string",
                        "null"
                    ],
                    "enum": [
                        "PRESENT",
                        "ABSENT",
                        "LEAVE",
                        "HOLIDAY"
                    ]
                },
                "hoursWorked": {
                    "type": [
                        "number",
                        "null"
                    ]
                },
                "note": {
                    "type": [
                        "string",
                        "null"
                    ]
                }
            }
        },
        "ShiftSchedule": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string"
                },
                "fromDate": {
                    "type": "string",
                    "format": "date-time"
                },
                "toDate": {
                    "type": "string",
                    "format": "date-time"
                },
                "shifts": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Shift"
                    }
                },
                "createdAt": {
                    "type": "string",
                    "format": "date-time"
                },
                "updatedAt": {
                    "type": "string",
                    "format": "date-time"
                }
            }
        },
        "Shift": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string"
                },
                "schedule": {
                    "$ref": "#/definitions/ShiftSchedule"
                },
                "employeeCode": {
                    "type": "string"
                },
                "fullName": {
                    "type": "string"
                },
                "department": {
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "position": {
                    "type": [
                        "string",
                        "null"
                    ]
                },
                "date": {
                    "type": "string",
                    "format": "date-time"
                },
                "shiftCode": {
                    "type": "string",
                    "enum": [
                        "MORNING",
                        "AFTERNOON",
                        "NIGHT",
                        "CUSTOM"
                    ]
                },
                "shiftName": {
                    "type": "string"
                },
                "startTime": {
                    "type": "string",
                    "format": "date-time"
                },
                "endTime": {
                    "type": "string",
                    "format": "date-time"
                },
                "note": {
                    "type": [
                        "string",
                        "null"
                    ]
                }
            }
        }
    },
    "type": "object",
    "properties": {
        "attendance": {
            "$ref": "#/definitions/Attendance"
        },
        "attendanceRecord": {
            "$ref": "#/definitions/AttendanceRecord"
        },
        "shiftSchedule": {
            "$ref": "#/definitions/ShiftSchedule"
        },
        "shift": {
            "$ref": "#/definitions/Shift"
        }
    }
}

function TestingGround() {

    return (
        // <Form
            // schema={schema}
            // uiSchema={uiSchema}
            // validator={validator}
            // formData={formData}
            // onSubmit={handleFormSubmit}
            // onChange={(e) => {
            //     const updatedFormData = e.formData;
            //     setFormData(updatedFormData); // assuming you have a useState for formData
            // }}
            // disabled={}
        // />
        <iframe width="800" height="600" frameborder="0" allow="clipboard-write;camera;geolocation;fullscreen" src="http://13.212.177.47/embed/hr"></iframe>

    )
}

export default TestingGround;