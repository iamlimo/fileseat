import React, { useState } from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import BackgroundImage from "../assets/images/bg.png";
import { Navbar } from "./Navbar";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { useDropzone } from "react-dropzone";
import { Uploading, Uploaded } from "../utils/index";

const LoginStyles = {
  background: {
    backgroundImage: "url(" + BackgroundImage + ")",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat"
  }
};

const Fileseat = () => {
  const [fileData, setFileData] = useState(false);
  const [err, setErr] = useState(false);
  const [success, setSuccess] = useState(false);
  let [receipient, setReceipient] = useState("");
  const [progress, setProgress] = useState(null);
  const handleSubmit = async values => {
    console.log(values);
    let { receipientEmail, senderEmail, files, message } = values;
    setReceipient(receipientEmail);

    let config = {
      headers: { Accept: "multipart/form-data" },
      onUploadProgress: progressEvent => {
        let percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
        if (percentCompleted === 100) {
          setProgress(false);
          setSuccess(true);
        }
      }
    };
    const data = new FormData();
    data.append("senderEmail", senderEmail);
    data.append("file", files[0]);
    data.append("receipientEmail", receipientEmail);
    data.append("message", message);
    try {
      let response = await axios.post(
        "https://api.fileseat.com/api/v1/files",
        data,
        config
      );
      console.log(response);
    } catch (err) {
      console.log(err);
      setErr(err);
    }
  };
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone();
  const files = acceptedFiles.map(file => (
    <li key={file.name.toString()}>{file.name}</li>
  ));
  return (
    <div className="m-0 p-16" style={LoginStyles.background}>
      <Navbar />
      <div className="text-red-800">{err ? err.message : null}</div>
      <div className="max-w-md sm:mx-2 ">
        <div className="px-10 pt-6 pb-8 my-8">
          {" "}
          {progress ? (
            <Uploading
              progress={progress}
              fileName={fileData[0].name}
              receipient={receipient}
            />
          ) : success ? (
            <Uploaded />
          ) : (
            <Formik
              onSubmit={handleSubmit}
              initialValues={{
                receipientEmail: "",
                message: "",
                senderEmail: "",
                files: []
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                setFieldValue
              }) => (
                <Form className="rounded-larger bg-white w-4-5 shadow-lg rounded p-6">
                  <div>
                    <h3 className="text-center text-xl font-bold tracking-normal">
                      TRANSFER FILES
                    </h3>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="receipientEmail"
                      className="block text-gray-700 text-sm font-bold mb-2 mt-8"
                    >
                      Send files to this email:
                    </label>
                    <Field
                      type="email"
                      className="bg-indigo-100 focus:bg-white shadow-sm appearance-none border-b-2  w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-500 "
                      name="receipientEmail"
                      id="receipientEmail"
                    />
                  </div>
                  <div className="mb-2">
                    <label
                      htmlFor="senderEmail"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Your email:
                    </label>
                    <Field
                      type="email"
                      className="bg-indigo-100 focus:bg-white shadow-sm appearance-none border-b-2 w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline border-blue-500 "
                      name="senderEmail"
                      id="senderEmail"
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="message"
                    >
                      Message:
                    </label>
                    <Field
                      name="message"
                      className="bg-indigo-100 focus:bg-white shadow-sm appearance-none border-b-2 border-blue-500  w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      row="7"
                      id="message"
                      component="textarea"
                    />
                  </div>
                  <div
                    className="border-dashed border-indigo-600 border-2 h-24 mb-4 focus:outline-none"
                    {...getRootProps()}
                  >
                    <div className="text-center text-indigo-700 py-5">
                      <input
                        name="files "
                        {...getInputProps({
                          onChange: event => {
                            setFieldValue("files", event.currentTarget.files);
                            setFileData(event.currentTarget.files);
                          }
                        })}
                      />
                      {fileData ? (
                        <span className="w-full p-0 m-0">
                          <ul>{files}</ul>
                        </span>
                      ) : (
                        <CloudUploadIcon color="inherit" fontSize="large" />
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="hover:bg-indigo-500 rounded-full shadow-lg w-full bg-indigo-700 rounded-lg text-white font-bold p-2"
                  >
                    Transfer <i></i>
                  </button>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fileseat;
