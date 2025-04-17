import { GraphData, GraphDataLazyLoad, GraphNode, GraphNodeData, NodeHistory } from "../types";

export const mockData: GraphData = {
  graphId: "approval-hr-001-9876543210",
  domain: "approval",
  status: "ACTIVE",
  definition: {
    events: [
      {
        eventId: "hr-001",
        type: "HR Fills in candidate info",
        dataSchema: {
          title: "A registration form",
          description: "A simple form example.",
          type: "object",
          required: [
            "fullName",
            "contact"
          ],
          properties: {
            fullName: {
              type: "string",
              title: "First name"
            },
            experience: {
              type: "integer",
              title: "Experience"
            },
            bio: {
              type: "string",
              title: "Bio"
            },
            position: {
              type: "string",
              title: "Position"
            },
            contact: {
              type: "string",
              title: "Contact"
            }
          }
        },
        triggers: [{ eventId: "hr-002", triggerType: "Review" }]
      },
      {
        eventId: "hr-002",
        type: "HR double check",
        dataSchema: {
          type: "object",
          properties: {
            status: { type: "string", title: "Verification Status", enum: ["Verified", "Rejected"] },
            remarks: { type: "string", title: "HR Remarks", format: "textarea" }
          },
          required: ["status"]
        },
        triggers: [{ eventId: "hr-003", triggerType: "Approve" }]
      },
      {
        eventId: "hr-003",
        type: "Trainee Contract",
        dataSchema: {
          type: "object",
          properties: {
            candidateStatus: {
              type: "string",
              title: "CandidateStatus",
              enum: ["pending", "responded", "norepsond"],
              enumNames: ['Pending', 'Responded', 'No Respond'],
              default: "pending"
            },
            contractTerms: { type: "string", title: "Contract Terms", format: "textarea" }
          }
        },
        triggers: [{ eventId: "hr-004", triggerType: "Sign" }]
      },
      {
        eventId: "hr-004",
        type: "Training",
        dataSchema: {
          type: "object",
          properties: {
            trainingStatus: { type: "string", title: "Training Completion", enum: ["Completed", "Pending"] }
          }
        },
        triggers: [{ eventId: "hr-005", triggerType: "Validate" }]
      },
      {
        eventId: "hr-005",
        type: "Official Contract",
        dataSchema: {
          type: "object",
          properties: {
            contractSigned: { type: "boolean", title: "Contract Signed" }
          }
        },
        triggers: [{ eventId: "hr-006", triggerType: "Approval" }]
      },
      {
        eventId: "hr-006",
        type: "Admin Approval",
        dataSchema: {
          type: "object",
          properties: {
            adminDecision: { type: "string", title: "Admin Decision", enum: ["Approved", "Rejected"] }
          }
        },
        triggers: [{ eventId: "hr-007", triggerType: "Final Approval" }]
      },
      {
        eventId: "hr-007",
        type: "CEO Approval",
        dataSchema: {
          type: "object",
          properties: {
            ceoDecision: { type: "string", title: "CEO Decision", enum: ["Approved", "Rejected"] }
          }
        },
        triggers: []
      }
    ]
  },
  history: [
    {
      eventId: "hr-001",
      type: "HR Fills in candidate info",
      input: { fullName: "John Doe", position: "Software Engineer", experience: "5 years", bio: "bio this bio that", contact: "abc@xyz.com" },
      output: { message: "Candidate info submitted" },
      timestamp: "1-1-1900"
    },
    {
      eventId: "hr-002",
      type: "HR double check",
      input: { status: "Verified", remarks: "All details correct" },
      output: { message: "Candidate verified" },
      timestamp: "1-1-1900"
    },
    {
      eventId: "hr-003",
      type: "Trainee Contract",
      input: { contractTerms: "6-month probation period" },
      output: { message: "Contract issued" },
      timestamp: "1-1-1900"
    },
    {
      eventId: "hr-004",
      type: "Training",
      input: { trainingStatus: "Completed" },
      output: { message: "Training successfully completed" },
      timestamp: "1-1-1900"
    },
    {
      eventId: "hr-005",
      type: "Official Contract",
      input: { contractSigned: true },
      output: { message: "Contract signed" },
      timestamp: "1-1-1900"
    },
    {
      eventId: "hr-006",
      type: "Admin Approval",
      input: { adminDecision: "Approved" },
      output: { message: "Admin approved the process" },
      timestamp: "1-1-1900"
    },
    {
      eventId: "hr-007",
      type: "CEO Approval",
      input: { ceoDecision: "Approved" },
      output: { message: "Final approval granted by CEO" },
      timestamp: "1-1-1900"
    }
  ],
  currentEvent: "CEO Approval"
};

export const transformedDataForLazyLoad: GraphDataLazyLoad = {
  graphId: "approval-hr-001-9876543210",
  domain: "approval",
  status: "ACTIVE",
  definition: {
    events: [
      {
        eventId: "hr-001",
        type: "HR Fills in candidate info",
        dataSchema: {
          n8nLoader: "c5fd9bf6-19fb-43e5-975f-5c884894d75e"
        },
        triggers: [{ eventId: "hr-002", triggerType: "Review" }]
      },
      {
        eventId: "hr-002",
        type: "HR double check",
        dataSchema: {
          n8nLoader: "c5fd9bf6-19fb-43e5-975f-5c884894d75e"
        },
        triggers: [{ eventId: "hr-003", triggerType: "Approve" }]
      },
      {
        eventId: "hr-003",
        type: "Trainee Contract",
        dataSchema: {
          n8nLoader: "c5fd9bf6-19fb-43e5-975f-5c884894d75e"
        },
        triggers: [{ eventId: "hr-004", triggerType: "Sign" }]
      },
      {
        eventId: "hr-004",
        type: "Training",
        dataSchema: {
          n8nLoader: "c5fd9bf6-19fb-43e5-975f-5c884894d75e"
        },
        triggers: [{ eventId: "hr-005", triggerType: "Validate" }]
      },
      {
        eventId: "hr-005",
        type: "Official Contract",
        dataSchema: {
          n8nLoader: "c5fd9bf6-19fb-43e5-975f-5c884894d75e"
        },
        triggers: [{ eventId: "hr-006", triggerType: "Approval" }]
      },
      {
        eventId: "hr-006",
        type: "Admin Approval",
        dataSchema: {
          n8nLoader: "c5fd9bf6-19fb-43e5-975f-5c884894d75e"
        },
        triggers: [{ eventId: "hr-007", triggerType: "Final Approval" }]
      },
      {
        eventId: "hr-007",
        type: "CEO Approval",
        dataSchema: {
          n8nLoader: "c5fd9bf6-19fb-43e5-975f-5c884894d75e",
        },
        triggers: []
      }
    ]
  },
  history: [
    { n8nLoader: "e10231ed-587a-4ac5-bc77-4d48ef5101f0" },
    { n8nLoader: "e10231ed-587a-4ac5-bc77-4d48ef5101f0" },
    { n8nLoader: "e10231ed-587a-4ac5-bc77-4d48ef5101f0" },
    { n8nLoader: "e10231ed-587a-4ac5-bc77-4d48ef5101f0" },
    { n8nLoader: "e10231ed-587a-4ac5-bc77-4d48ef5101f0" },
    { n8nLoader: "e10231ed-587a-4ac5-bc77-4d48ef5101f0" },
    { n8nLoader: "e10231ed-587a-4ac5-bc77-4d48ef5101f0" }
  ],
  currentEvent: "CEO Approval"
};

export const transformedHistoryData: NodeHistory[] = [
  {
    eventId: "req-001",
    type: "RequestSubmitted",
    input: {
      requestId: "req-001",
      title: "Vacation Request",
      description: "2 weeks in July",
      priority: "Medium"
    },
    output: {
      message: "Request received"
    },
    timestamp: "2025-04-08T10:22:00.000Z"
  },
  {
    eventId: "req-001-review",
    type: "RequestReviewed",
    input: {
      requestId: "req-001",
      status: "Approved",
      comments: "Dates look good"
    },
    output: {
      message: "Review completed: approved"
    },
    timestamp: "2025-04-08T10:22:00.000Z"
  },
  {
    eventId: "req-001-evt-003",
    type: "RequestApproved",
    input: {
      requestId: "req-001",
      finalNotes: "Approved as requested"
    },
    output: {
      message: "Approved"
    },
    timestamp: "2025-04-08T10:22:00.000Z"
  }
];

export const transformedSchemaData = [
  {
    title: "A registration form",
    description: "A simple form example.",
    type: "object",
    required: ["fullName", "contact"],
    properties: {
      fullName: { type: "string", title: "First name" },
      experience: { type: "integer", title: "Experience" },
      bio: { type: "string", title: "Bio" },
      position: { type: "string", title: "Position" },
      contact: { type: "string", title: "Contact" }
    }
  },
  {
    type: "object",
    properties: {
      status: { type: "string", title: "Verification Status", enum: ["Verified", "Rejected"] },
      remarks: { type: "string", title: "HR Remarks", format: "textarea" }
    },
    required: ["status"]
  },
  {
    type: "object",
    properties: {
      candidateStatus: {
        type: "string",
        title: "CandidateStatus",
        enum: ["pending", "responded", "norepsond"],
        enumNames: ["Pending", "Responded", "No Respond"],
        default: "pending"
      },
      contractTerms: { type: "string", title: "Contract Terms", format: "textarea" }
    }
  },
  {
    type: "object",
    properties: {
      trainingStatus: { type: "string", title: "Training Completion", enum: ["Completed", "Pending"] }
    }
  },
  {
    type: "object",
    properties: {
      contractSigned: { type: "boolean", title: "Contract Signed" }
    }
  },
  {
    type: "object",
    properties: {
      adminDecision: { type: "string", title: "Admin Decision", enum: ["Approved", "Rejected"] }
    }
  },
  {
    type: "object",
    properties: {
      ceoDecision: { type: "string", title: "CEO Decision", enum: ["Approved", "Rejected"] }
    }
  }
];

export const employeeFormSchema = {
  "type": "object",
  "properties": {
    "basicInfo": {
      "type": "object",
      "title": "Basic Info",
      "properties": {
        "employeeCode": { "type": "string", "title": "Employee Code" },
        "timekeepingCode": { "type": "string", "title": "Timekeeping Code" },
        "fullName": { "type": "string", "title": "Full Name" },
        "dob": { "type": "string", "format": "date", "title": "Date of Birth" },
        "gender": {
          "type": "string",
          "title": "Gender",
          "enum": ["Male", "Female"]
        },
        "militaryService": { "type": "string", "title": "Military Service" },
        "placeOfBirth": { "type": "string", "title": "Place of Birth" },
        "hometown": { "type": "string", "title": "Hometown" },
        "nationality": { "type": "string", "title": "Nationality" },
        "maritalStatus": {
          "type": "string",
          "title": "Marital Status",
          "enum": ["Single", "Married"]
        },
        "ethnicity": { "type": "string", "title": "Ethnicity" },
        "religion": { "type": "string", "title": "Religion" },
        "taxCode": { "type": "string", "title": "Personal Tax Code" },
        "joinDate": { "type": "string", "format": "date", "title": "Join Date" },
        "officialContractDate": { "type": "string", "format": "date", "title": "Official Contract Signing Date" },
        "manager": { "type": "string", "title": "Direct Manager" },
        "laborType": { "type": "string", "title": "Labor Type" },
        "email": { "type": "string", "format": "email", "title": "Email" },
        "phone": { "type": "string", "title": "Phone" },
        "bankName": { "type": "string", "title": "Bank Name" },
        "accountNumber": { "type": "string", "title": "Account Number" }
      }
    },
    "contractInfo": {
      "type": "object",
      "title": "Contract Info",
      "properties": {
        "employee": { "type": "string", "title": "Employee" },
        "contractCode": { "type": "string", "title": "Contract Code" },
        "contractName": { "type": "string", "title": "Contract Name" },
        "department": { "type": "string", "title": "Department" },
        "position": { "type": "string", "title": "Position" },
        "workingMode": { "type": "string", "title": "Working Mode" },
        "level": { "type": "string", "title": "Level" },
        "workingPlace": { "type": "string", "title": "Working Place" },
        "expiredDate": { "type": "string", "format": "date", "title": "Expired Date" },
        "workingTime": { "type": "string", "title": "Working Time" },
        "signingDate": { "type": "string", "format": "date", "title": "Signing Date" },
        "signer": { "type": "string", "title": "Signer" },
        "salaryAllowance": { "type": "string", "title": "Salary Allowance" },
        "salaryFrom": { "type": "string", "format": "date", "title": "From" },
        "salaryMode": { "type": "string", "title": "Salary Mode" },
        "amount": { "type": "number", "title": "Amount" },
        "description": { "type": "string", "title": "Description" },
        "attachment": { "type": "string", "format": "data-url", "title": "Attachment" }
      }
    }
  }
};

export const employeeFormUISchema = {
  type: 'Categorization',
  elements: [
    {
      type: 'Category',
      label: 'Basic Info',
      elements: [
        { type: 'Control', scope: '#/properties/basicInfo/properties/employeeCode' },
        { type: 'Control', scope: '#/properties/basicInfo/properties/timekeepingCode' },
        { type: 'Control', scope: '#/properties/basicInfo/properties/fullName' },
        { type: 'Control', scope: '#/properties/basicInfo/properties/dob' },
        { type: 'Control', scope: '#/properties/basicInfo/properties/gender' },
        { type: 'Control', scope: '#/properties/basicInfo/properties/militaryService' },
        { type: 'Control', scope: '#/properties/basicInfo/properties/placeOfBirth' },
        { type: 'Control', scope: '#/properties/basicInfo/properties/hometown' },
        { type: 'Control', scope: '#/properties/basicInfo/properties/nationality' },
        { type: 'Control', scope: '#/properties/basicInfo/properties/maritalStatus' },
        { type: 'Control', scope: '#/properties/basicInfo/properties/ethnicity' },
        { type: 'Control', scope: '#/properties/basicInfo/properties/religion' },
        { type: 'Control', scope: '#/properties/basicInfo/properties/taxCode' },
        { type: 'Control', scope: '#/properties/basicInfo/properties/joinDate' },
        { type: 'Control', scope: '#/properties/basicInfo/properties/officialContractDate' },
        { type: 'Control', scope: '#/properties/basicInfo/properties/manager' },
        { type: 'Control', scope: '#/properties/basicInfo/properties/laborType' },
        { type: 'Control', scope: '#/properties/basicInfo/properties/email' },
        { type: 'Control', scope: '#/properties/basicInfo/properties/phone' },
        { type: 'Control', scope: '#/properties/basicInfo/properties/bankName' },
        { type: 'Control', scope: '#/properties/basicInfo/properties/accountNumber' }
      ]
    },
    {
      type: 'Category',
      label: 'Contract Info',
      elements: [
        { type: 'Control', scope: '#/properties/contractInfo/properties/employee' },
        { type: 'Control', scope: '#/properties/contractInfo/properties/contractCode' },
        { type: 'Control', scope: '#/properties/contractInfo/properties/contractName' },
        { type: 'Control', scope: '#/properties/contractInfo/properties/department' },
        { type: 'Control', scope: '#/properties/contractInfo/properties/position' },
        { type: 'Control', scope: '#/properties/contractInfo/properties/workingMode' },
        { type: 'Control', scope: '#/properties/contractInfo/properties/level' },
        { type: 'Control', scope: '#/properties/contractInfo/properties/workingPlace' },
        { type: 'Control', scope: '#/properties/contractInfo/properties/expiredDate' },
        { type: 'Control', scope: '#/properties/contractInfo/properties/workingTime' },
        { type: 'Control', scope: '#/properties/contractInfo/properties/signingDate' },
        { type: 'Control', scope: '#/properties/contractInfo/properties/signer' },
        { type: 'Control', scope: '#/properties/contractInfo/properties/salaryAllowance' },
        { type: 'Control', scope: '#/properties/contractInfo/properties/salaryFrom' },
        { type: 'Control', scope: '#/properties/contractInfo/properties/salaryMode' },
        { type: 'Control', scope: '#/properties/contractInfo/properties/amount' },
        { type: 'Control', scope: '#/properties/contractInfo/properties/description' },
        { type: 'Control', scope: '#/properties/contractInfo/properties/attachment' }
      ]
    }
  ]
};

export const employmentNodeTempoData: GraphNodeData = {
  eventId: "ER-01",
  type: "HR Fills in candidate info",
  dataSchema: {
    formSchema: {
      "type": "object",
      "properties": {
        "basicInfo": {
          "type": "object",
          "title": "Basic Info",
          "properties": {
            "employeeCode": { "type": "string", "title": "Employee Code" },
            "timekeepingCode": { "type": "string", "title": "Timekeeping Code" },
            "fullName": { "type": "string", "title": "Full Name" },
            "dob": { "type": "string", "format": "date", "title": "Date of Birth" },
            "gender": {
              "type": "string",
              "title": "Gender",
              "enum": ["Male", "Female"]
            },
            "militaryService": { "type": "string", "title": "Military Service" },
            "placeOfBirth": { "type": "string", "title": "Place of Birth" },
            "hometown": { "type": "string", "title": "Hometown" },
            "nationality": { "type": "string", "title": "Nationality" },
            "maritalStatus": {
              "type": "string",
              "title": "Marital Status",
              "enum": ["Single", "Married"]
            },
            "ethnicity": { "type": "string", "title": "Ethnicity" },
            "religion": { "type": "string", "title": "Religion" },
            "taxCode": { "type": "string", "title": "Personal Tax Code" },
            "joinDate": { "type": "string", "format": "date", "title": "Join Date" },
            "officialContractDate": { "type": "string", "format": "date", "title": "Official Contract Signing Date" },
            "manager": { "type": "string", "title": "Direct Manager" },
            "laborType": { "type": "string", "title": "Labor Type" },
            "email": { "type": "string", "format": "email", "title": "Email" },
            "phone": { "type": "string", "title": "Phone" },
            "bankName": { "type": "string", "title": "Bank Name" },
            "accountNumber": { "type": "string", "title": "Account Number" }
          }
        },
        "contractInfo": {
          "type": "object",
          "title": "Contract Info",
          "properties": {
            "employee": { "type": "string", "title": "Employee" },
            "contractCode": { "type": "string", "title": "Contract Code" },
            "contractName": { "type": "string", "title": "Contract Name" },
            "department": { "type": "string", "title": "Department" },
            "position": { "type": "string", "title": "Position" },
            "workingMode": { "type": "string", "title": "Working Mode" },
            "level": { "type": "string", "title": "Level" },
            "workingPlace": { "type": "string", "title": "Working Place" },
            "expiredDate": { "type": "string", "format": "date", "title": "Expired Date" },
            "workingTime": { "type": "string", "title": "Working Time" },
            "signingDate": { "type": "string", "format": "date", "title": "Signing Date" },
            "signer": { "type": "string", "title": "Signer" },
            "salaryAllowance": { "type": "string", "title": "Salary Allowance" },
            "salaryFrom": { "type": "string", "format": "date", "title": "From" },
            "salaryMode": { "type": "string", "title": "Salary Mode" },
            "amount": { "type": "number", "title": "Amount" },
            "description": { "type": "string", "title": "Description" },
            "attachment": { "type": "string", "format": "data-url", "title": "Attachment" }
          }
        }
      }
    },
    uiSchema: {
      type: 'Categorization',
      elements: [
        {
          type: 'Category',
          label: 'Basic Info',
          elements: [
            { type: 'Control', scope: '#/properties/basicInfo/properties/employeeCode' },
            { type: 'Control', scope: '#/properties/basicInfo/properties/timekeepingCode' },
            { type: 'Control', scope: '#/properties/basicInfo/properties/fullName' },
            { type: 'Control', scope: '#/properties/basicInfo/properties/dob' },
            { type: 'Control', scope: '#/properties/basicInfo/properties/gender' },
            { type: 'Control', scope: '#/properties/basicInfo/properties/militaryService' },
            { type: 'Control', scope: '#/properties/basicInfo/properties/placeOfBirth' },
            { type: 'Control', scope: '#/properties/basicInfo/properties/hometown' },
            { type: 'Control', scope: '#/properties/basicInfo/properties/nationality' },
            { type: 'Control', scope: '#/properties/basicInfo/properties/maritalStatus' },
            { type: 'Control', scope: '#/properties/basicInfo/properties/ethnicity' },
            { type: 'Control', scope: '#/properties/basicInfo/properties/religion' },
            { type: 'Control', scope: '#/properties/basicInfo/properties/taxCode' },
            { type: 'Control', scope: '#/properties/basicInfo/properties/joinDate' },
            { type: 'Control', scope: '#/properties/basicInfo/properties/officialContractDate' },
            { type: 'Control', scope: '#/properties/basicInfo/properties/manager' },
            { type: 'Control', scope: '#/properties/basicInfo/properties/laborType' },
            { type: 'Control', scope: '#/properties/basicInfo/properties/email' },
            { type: 'Control', scope: '#/properties/basicInfo/properties/phone' },
            { type: 'Control', scope: '#/properties/basicInfo/properties/bankName' },
            { type: 'Control', scope: '#/properties/basicInfo/properties/accountNumber' }
          ]
        },
        {
          type: 'Category',
          label: 'Contract Info',
          elements: [
            { type: 'Control', scope: '#/properties/contractInfo/properties/employee' },
            { type: 'Control', scope: '#/properties/contractInfo/properties/contractCode' },
            { type: 'Control', scope: '#/properties/contractInfo/properties/contractName' },
            { type: 'Control', scope: '#/properties/contractInfo/properties/department' },
            { type: 'Control', scope: '#/properties/contractInfo/properties/position' },
            { type: 'Control', scope: '#/properties/contractInfo/properties/workingMode' },
            { type: 'Control', scope: '#/properties/contractInfo/properties/level' },
            { type: 'Control', scope: '#/properties/contractInfo/properties/workingPlace' },
            { type: 'Control', scope: '#/properties/contractInfo/properties/expiredDate' },
            { type: 'Control', scope: '#/properties/contractInfo/properties/workingTime' },
            { type: 'Control', scope: '#/properties/contractInfo/properties/signingDate' },
            { type: 'Control', scope: '#/properties/contractInfo/properties/signer' },
            { type: 'Control', scope: '#/properties/contractInfo/properties/salaryAllowance' },
            { type: 'Control', scope: '#/properties/contractInfo/properties/salaryFrom' },
            { type: 'Control', scope: '#/properties/contractInfo/properties/salaryMode' },
            { type: 'Control', scope: '#/properties/contractInfo/properties/amount' },
            { type: 'Control', scope: '#/properties/contractInfo/properties/description' },
            { type: 'Control', scope: '#/properties/contractInfo/properties/attachment' }
          ]
        }
      ]
    }
  },
  triggers: []
}

export const employmentSamepleWorkFlow: GraphDataLazyLoad = {
  graphId: "graph-001",
  domain: "hr",
  status: "active",
  currentEvent: "ER-01",
  history: [],
  definition: {
    events: [
      {
        eventId: "ER-01",
        type: "HR Fills in candidate info",
        dataSchema: {
          n8nLoader:"ER-01"
        },
        triggers: []
      }
    ]
  }
};
