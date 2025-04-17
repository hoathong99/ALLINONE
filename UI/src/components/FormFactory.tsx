import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { JsonForms } from '@jsonforms/react';
import { materialCells, materialRenderers } from "@jsonforms/material-renderers";
import { HandleGenerateFormSchema } from "../api";
import { TabPanel, TabView } from "primereact/tabview";
import { withJsonFormsControlProps } from '@jsonforms/react';
import { ControlProps } from '@jsonforms/core';
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

const dummyForm: JSONSchema7 = {
  title: "Upload Form",
  type: "object",
  properties: {
    file: {
      type: "string",
      format: "data-url",
      title: "Single File Upload"
    },
    email: {
      type: "string",
      format: "email",
      title: "Your Email"
    }
  },
  required: ["file", "email"]
};


const dummyUi = {
  file: {
    "ui:widget": "file"
  },
  email: {
    "ui:widget": "email"
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


  const onGenerateSchema = async (data: FormInput) => {
    if (!loading) {
      setLoading(true);
      try {
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
    // setSchema({});
    // setFormSchema(dummpuFrom);
    // setUISchema(dummyUi);
    // setLoading(false);
  };

  const SubmitForm = () => {
    console.log("Submitting schema:", schema);
  };

  return (
    <div style={{ width: "100%", padding: "2rem", maxHeight: "100%", overflowY: "auto" }}>
      <h2 style={{ fontSize: "calc(1.325rem + .9vw)", fontWeight: "500" }}>Form Factory</h2>
      <div className="MainContent" style={{ display: "flex", gap: "2rem", height: "calc(100vh - 120px)" }}>
        {/* Left Panel */}
        {/* <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "#f8f9fa",
            padding: "1rem",
            borderRadius: "8px"
          }}
        >
          <form onSubmit={handleSubmit(onGenerateSchema)} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
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
        </div> */}
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
                  // <JsonForms
                  //   schema={formSchema}
                  //   uischema={uiSchema}
                  //   renderers={materialRenderers}
                  //   cells={materialCells}
                  //   data={formPreviewData}
                  //   onChange={({ data }) => setFormPreviewData(data)}
                  // />
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
          </TabView>

          <button onClick={SubmitForm} className="btn btn-primary w-100 mt-3">
            Submit
          </button>
        </div>

      </div>
    </div>
  );
};

export default FormFactory;
