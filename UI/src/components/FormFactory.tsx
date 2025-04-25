import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { HandleGenerateFormSchema } from "../api";
import { TabPanel, TabView } from "primereact/tabview";
import { Input, FormHelperText } from '@mui/material';
import { ChangeEvent } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { JSONSchema7 } from 'json-schema';

interface FileUploadControlProps extends ControlProps { }

const FileUploadControl = ({ data, handleChange, path, label, errors }: FileUploadControlProps) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Convert file to base64 string (or handle differently based on your needs)
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        handleChange(path, base64String); // Update form data with base64 string
      };
      reader.readAsDataURL(file); // Read file as base64
    }
  };

  return (
    <div>
      <Input
        type="file"
        onChange={handleFileChange}
        fullWidth
        error={!!errors}
        inputProps={{ 'aria-label': label }}
      />
      {errors && <FormHelperText error>{errors}</FormHelperText>}
    </div>
  );
};

interface FormInput {
  id: string;
  type: string;
  html: string;
  description: string;
}

interface GenerateFormResponse {
  dataSchema: {
    formSchema: any;
    uiSchema: any;
  }
}

// function processFile(files) {
//   const f = files[0];
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = (event) => resolve(event.target.result);
//     reader.readAsDataURL(f);
//   });
// }

// const FileWidget = (props) => {
//   return (
//     <input type="file"
//       required={props.required}
//       onChange={(event) => processFile(event.target.files).then(props.onChange)} />
//   )
// };

// const temposchema = {
//   type: 'object',
//   required: ['name'],
//   properties: {
//     name: { type: 'string', title: 'Name', default: '' },
//     file: { type: 'string', title: 'File' }
//   }
// }
// const tempoui = {
//   file: {
//     'ui:widget': FileWidget
//   }
// }

const dummyForm = {
  "formSchema": {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
      "employee": {
        "type": "string"
      },
      "contractCode": {
        "type": "string"
      },
      "contractName": {
        "type": "string"
      },
      "department": {
        "type": "string"
      },
      "position": {
        "type": "string"
      },
      "workingMode": {
        "type": "string"
      },
      "level": {
        "type": "string"
      },
      "workingPlace": {
        "type": "string"
      },
      "expiredDate": {
        "type": "string",
        "format": "date"
      },
      "workingTime": {
        "type": "string"
      },
      "signingDate": {
        "type": "string",
        "format": "date"
      },
      "signer": {
        "type": "string"
      },
      "salaryAllowance": {
        "type": "string"
      },
      "salaryFrom": {
        "type": "string",
        "format": "date"
      },
      "salaryMode": {
        "type": "string"
      },
      "salaryAmount": {
        "type": "number"
      },
      "description": {
        "type": "string"
      },
      "attachment": {
        "type": "string",
        "format": "data-url"
      }
    },
    "required": [
      "employee",
      "contractCode",
      "contractName",
      "department",
      "position",
      "level",
      "workingPlace",
      "expiredDate",
      "workingTime",
      "signingDate",
      "signer"
    ]
  },
  "uiSchema": {
    "employee": {
      "ui:widget": "text"
    },
    "contractCode": {
      "ui:widget": "text"
    },
    "contractName": {
      "ui:widget": "text"
    },
    "department": {
      "ui:widget": "text"
    },
    "position": {
      "ui:widget": "text"
    },
    "workingMode": {
      "ui:widget": "text"
    },
    "level": {
      "ui:widget": "text"
    },
    "workingPlace": {
      "ui:widget": "text"
    },
    "expiredDate": {
      "ui:widget": "date"
    },
    "workingTime": {
      "ui:widget": "text"
    },
    "signingDate": {
      "ui:widget": "date"
    },
    "signer": {
      "ui:widget": "text"
    },
    "salaryAllowance": {
      "ui:widget": "text"
    },
    "salaryFrom": {
      "ui:widget": "date"
    },
    "salaryMode": {
      "ui:widget": "text"
    },
    "salaryAmount": {
      "ui:widget": "updown"
    },
    "description": {
      "ui:widget": "textarea"
    },
    "attachment": {
      "ui:widget": "file"
    }
  }
};




const FormFactory: React.FC = () => {
  const { register, handleSubmit, reset, watch } = useForm<FormInput>();
  const [schema, setSchema] = useState<any | null>(null);
  const [formData, setFormData] = useState({});
  const [formPreviewData, setFormPreviewData] = useState({});
  const [loading, setLoading] = useState(false);
  const [formSchema, setFormSchema] = useState<any | null>(null);
  const [uiSchema, setUISchema] = useState<any | null>(null);
  const [htmlPreview, setHtmlPreview] = useState<string>("");

  function downloadJSON(data: object, filename = 'schema.json') {
    const json = JSON.stringify(data, null, 2); // Pretty print with 2-space indentation
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  
    URL.revokeObjectURL(url);
  }

  const onGenerateSchema = async (data: FormInput) => {
    if (!loading) {
      setLoading(true);
      try {
        setSchema(null);
        const result = await HandleGenerateFormSchema(data);
        setSchema(result);
        console.log(result);
        setFormSchema(result.dataSchema.formSchema);
        setUISchema(result.dataSchema.uiSchema);
      } catch (error) {
        console.error("Schema generation failed:", error);
      } finally {
        setFormPreviewData({})
        setLoading(false);
      }
    } else {
      console.log("WAIT A SECOND");
    }
    // setSchema(dummyForm);
    // setFormSchema(dummyForm.formSchema);
    // setUISchema(dummyForm.uiSchema);
    setLoading(false);
  };

  const SubmitForm = () => {
    console.log("Submitting schema:", schema);
    downloadJSON(schema);
  };

  return (
    <div style={{ width: "100%", padding: "2rem", maxHeight: "100%", overflowY: "auto" }}>
      <h2 style={{ fontSize: "calc(1.325rem + .9vw)", fontWeight: "500" }}>Form Factory</h2>
      <div className="MainContent" style={{ display: "flex", gap: "2rem", height: "calc(100vh - 120px)" }}>
        <TabView style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <TabPanel header="Form Input" style={{ flex: 1 }}>
            <form onSubmit={handleSubmit(onGenerateSchema)} style={{ display: "flex", flexDirection: "column", height: '100%' }}>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <input
                  {...register("id")}
                  type="text"
                  placeholder="ID (ex: hr-01)"
                  className="form-control"
                  required
                />
                <input
                  {...register("type")}
                  type="text"
                  placeholder="Type (ex: HR Fills in candidate info)"
                  className="form-control"
                  required
                />
              </div>

              <label style={{ fontWeight: 500 }}>HTML</label>
              <textarea
                {...register("html")}
                className="form-control mb-3"
                placeholder="Enter HTML here"
                style={{ flex: 1, minHeight: 120, resize: "vertical", overflowY: "auto" }}
                required
              />

              <label style={{ fontWeight: 500 }}>Description</label>
              <textarea
                {...register("description")}
                className="form-control mb-3"
                placeholder="Enter description here"
                style={{ flex: 1, minHeight: 120, resize: "vertical", overflowY: "auto" }}
                required
              />

              <button type="submit" className="btn btn-primary w-100 mt-auto">
                Generate Schema
              </button>
            </form>
          </TabPanel>

          <TabPanel header="HTML Preview" style={{ flex: 1 }}>
            <button
              type="button"
              className="btn btn-secondary mb-3"
              onClick={() => {
                setHtmlPreview(watch("html") || "");
                // console.log(watch("html"));
              }}
            >
              Sync HTML Preview
            </button>
            <div
              style={{
                flex: 1,
                padding: "1rem",
                backgroundColor: "#fff",
                border: "1px solid #dee2e6",
                borderRadius: "6px",
                overflowY: "auto",
                minHeight: "300px"
              }}
              dangerouslySetInnerHTML={{ __html: htmlPreview }}
            />
          </TabPanel>
        </TabView>

        {/* Right Panel */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "#f1f3f5",
            padding: "1rem",
            borderRadius: "8px"
          }}
        >
          <TabView>
            <TabPanel header="Preview">
              <div
                style={{
                  height: "calc(100vh - 300px)",
                  overflowY: "auto",
                  background: "white",
                  padding: "1rem",
                  borderRadius: "6px"
                }}
              >
                {loading ? (
                  <div style={{ textAlign: "center", padding: "2rem", color: "#007bff" }}>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <div>Generating schema...</div>
                  </div>
                ) : schema && formSchema && uiSchema ? (
                    <Form
                      schema={formSchema}
                      uiSchema={uiSchema}
                      validator={validator}
                    />
                ) : (
                  <div style={{ textAlign: "center", color: "#aaa", fontStyle: "italic" }}>
                    Your form preview will appear here.
                  </div>
                )}
              </div>
            </TabPanel>

            <TabPanel header="JSON">
              <div
                style={{
                  background: "#fff",
                  padding: "1rem",
                  height: "calc(100vh - 300px)",
                  overflowY: "auto",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  fontFamily: "monospace"
                }}
              >
                {schema ? (
                  <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                    {JSON.stringify(schema.dataSchema, null, 2)}
                  </pre>
                ) : (
                  <div style={{ textAlign: "center", color: "#aaa", fontStyle: "italic" }}>
                    Schema JSON will be shown here after generation.
                  </div>
                )}
              </div>
            </TabPanel>

            <TabPanel header="Example json render">
              <div
                style={{
                  height: "calc(100vh - 300px)",
                  overflowY: "auto",
                  background: "white",
                  padding: "1rem",
                  borderRadius: "6px"
                }}
              >
                <Form
                  schema={dummyForm.formSchema}
                  uiSchema={dummyForm.uiSchema}
                  validator={validator}
                />
              </div>
            </TabPanel>
            <TabPanel header="Example json schema">
              <div
                style={{
                  height: "calc(100vh - 300px)",
                  overflowY: "auto",
                  background: "white",
                  padding: "1rem",
                  borderRadius: "6px"
                }}
              >
                <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                  {JSON.stringify(dummyForm, null, 2)}
                  </pre>
              </div>
            </TabPanel>
          </TabView>

          <button onClick={SubmitForm} className="btn btn-primary w-100 mt-3">
            Download Json
          </button>
        </div>

      </div>
    </div>
  );
};

export default FormFactory;
