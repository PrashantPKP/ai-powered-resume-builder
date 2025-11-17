
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { UploadCloud } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { parseResume } from './ResumeParser';
// import Switch from './TechNontechButton.jsx'

const FileUploadPage = () => {
  const [jsonUploaded, setJsonUploaded] = useState(false);
  const [docUploaded, setDocUploaded] = useState(false);
  const [htmlUploaded, setHtmlUploaded] = useState(false);
  // const [isTech, setIsTech] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [htmlFile, setHtmlFile] = useState(null);
  const navigate=useNavigate();

  const handleJSONUpload = async (event) => {
    const expectedKeys=["contactInfo","skills","workExperience","projects","education","certificates","Description"]
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      try {
        const text = await file.text();
        const parsedData = JSON.parse(text);
        
        // Check if it has the old metadata wrapper format
        const dataToCheck = parsedData.resumeData ? parsedData.resumeData : parsedData;
        const actualKeys = Object.keys(dataToCheck);
        
        if (expectedKeys.every((key) => actualKeys.includes(key))){
           setJsonData(dataToCheck);
           toast.success("JSON file uploaded successfully! and matched with our format", { duration: 3000 , position: "top-right"});
           setJsonUploaded(true);
         }else{
            toast.error("The provided JSON is not ours. Missing keys: " + expectedKeys.filter(k => !actualKeys.includes(k)).join(', '), { duration: 4000,position: "top-right"});
         }
      } catch (err) {
        toast.error("Invalid JSON file!", { duration: 3000,position: "top-right" });
      }
    } else {
      toast.error("Please upload a valid JSON file.", { duration: 3000,position: "top-right" });
    }
  };

  async function ParseData(file) {
    const formData = new FormData();
    formData.append("file", file);
  
    const res = await fetch("http://127.0.0.1:5000/parse-resume", {
      method: "POST",
      body: formData,
    });
  
    const json = await res.json();
    console.log(json);
  
    // Convert JSON to blob
    const blob = new Blob([JSON.stringify(json, null, 2)], {
      type: "application/json",
    });
  
    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "parsed_resume.json";  // Download filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const handleDocUpload = async (event) => {
    const file = event.target.files[0];
    if (file && (file.type.includes("pdf") || file.type.includes("word") || file.name.endsWith('.docx'))) {
      setDocUploaded(false);
      const loadingToast = toast.loading("Parsing resume... This may take a few seconds.", { position: "top-right" });
      
      try {
        const result = await parseResume(file);
        
        if (result.success) {
          setJsonData(result.data);
          setDocUploaded(true);
          toast.dismiss(loadingToast);
          toast.success("Resume parsed successfully! Review and edit the extracted data.", { 
            duration: 4000, 
            position: "top-right" 
          });
        } else {
          toast.dismiss(loadingToast);
          toast.error(`Parsing failed: ${result.error}`, { 
            duration: 4000, 
            position: "top-right" 
          });
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Failed to parse resume. Please try again or fill manually.", { 
          duration: 4000, 
          position: "top-right" 
        });
      }
    } else {
      toast.error("Please upload a PDF or DOCX file.", { duration: 3000, position: "top-right" });
    }
  };

  const handleHTMLUpload = async (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "text/html" || file.name.endsWith('.html'))) {
      try {
        const text = await file.text();
        
        // Try to extract JSON data from HTML comments
        const jsonMatch = text.match(/<!--\s*RESUME_DATA:\s*({[\s\S]*?})\s*-->/);
        
        if (jsonMatch && jsonMatch[1]) {
          // Clean up the JSON string (remove HTML entities if any)
          const jsonString = jsonMatch[1].replace(/--&gt;/g, '-->');
          const parsedData = JSON.parse(jsonString);
          const expectedKeys = ["contactInfo", "skills", "workExperience", "projects", "education", "certificates", "Description"];
          const dataToCheck = parsedData.resumeData ? parsedData.resumeData : parsedData;
          const actualKeys = Object.keys(dataToCheck);
          
          if (expectedKeys.every((key) => actualKeys.includes(key))) {
            setJsonData(dataToCheck);
            setHtmlUploaded(true);
            toast.success("HTML file uploaded and data extracted successfully!", { duration: 3000, position: "top-right" });
          } else {
            // HTML doesn't have valid embedded data
            toast.error("This HTML file doesn't contain valid resume data. Please upload our generated HTML file.", { duration: 4000, position: "top-right" });
          }
        } else {
          // No embedded data found
          toast.error("This HTML file doesn't contain embedded resume data. Please upload our generated HTML file.", { duration: 4000, position: "top-right" });
        }
      } catch (err) {
        console.error('HTML parsing error:', err);
        toast.error("Error processing HTML file!", { duration: 3000, position: "top-right" });
      }
    } else {
      toast.error("Please upload a valid HTML file.", { duration: 3000, position: "top-right" });
    }
  };

  return (
    <div className="min-h-screen bg-white flex dark:bg-slate-900 flex-col items-center justify-center space-y-6 px-4">
    <Toaster position="top-right" />
{/* 
    <div className="w-[90%] lg:w-4/5 mx-4 bg-gray-200 dark:bg-slate-800 rounded-xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 space-y-4 sm:space-y-0 hover:shadow-lg transition-shadow duration-300">
      <div className="w-full sm:w-auto lg:ml-14">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Are You a tech persion ? 
        </p>
        <p className="text-md mt-1 font-semibold text-gray-500 dark:text-gray-400">
          {isTech ? "Okay.. you are a non-tech persion" : "By default we let you are from tech background"}
        </p>
      </div>
      <Switch
          className="w-full lg:mr-20 sm:w-auto rounded-xl"
          onClick={() => setIsTech(prev => !prev)}
        >
        </Switch>
    </div> */}

   {/* Fill Form */}
    <div className="w-[90%] lg:w-4/5 mx-4 bg-gray-200 dark:bg-slate-800 rounded-xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 space-y-4 sm:space-y-0 hover:shadow-lg transition-shadow duration-300">
      <div className="w-full sm:w-auto lg:ml-14">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Start by filling your details...
        </p>
        <p className="text-md mt-1 font-semibold text-gray-500 dark:text-gray-400">
          it mostly take 8 to 10 minutes
        </p>
      </div>
      <button
        className="w-full sm:w-auto px-5 py-2 lg:mr-14 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        onClick={() => navigate("/GetInfo")}
      >
        Continue &gt;
      </button>
    </div>

  
    {/* JSON Upload Container */}
    <div className="w-[90%] lg:w-4/5 mx-4 bg-gray-200 dark:bg-slate-800 rounded-xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 space-y-4 sm:space-y-0 hover:shadow-lg transition-shadow duration-300">
      <div className="w-full sm:w-auto lg:ml-14">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {jsonUploaded ? "JSON uploaded" : "Upload json data..  Structured by us"}
        </p>
        <p className="text-md mt-1 font-semibold text-gray-500 dark:text-gray-400">
          {jsonUploaded ? "You can now proceed further" : "The fastest way to redesign resume without filling whole details again"}
        </p>
      </div>
      {jsonUploaded ? (
        <button
          className="w-full lg:mr-14 sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          onClick={() => navigate("/GetInfo", { state: { jsonData } })}
        >
          Continue &gt;
        </button>
      ) : (
        <label className="w-full lg:mr-12 sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md cursor-pointer hover:bg-blue-700 transition duration-300">
        <UploadCloud className="w-5 h-5 mr-2" /> Our&nbsp;JSON
          <input
            type="file"
            accept=".json"
            onChange={handleJSONUpload}
            className="hidden"
          />
        </label>
      )}
    </div>
  
 
  
    {/* PDF/DOCX Upload Container */}
    <div className="w-[90%] lg:w-4/5 mx-4 bg-gray-200 dark:bg-slate-800 rounded-xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 space-y-4 sm:space-y-0 hover:shadow-lg transition-shadow duration-300">
      <div className="w-full sm:w-auto lg:ml-14">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Convert manually edited HTML to PDF
        </p>
        <p className="text-md mt-1 font-semibold text-gray-500 dark:text-gray-400">
          If you manually edited the downloaded HTML file, you can convert it to PDF using our HTML-to-PDF converter tool.
        </p>
      </div>
      <button
        className="w-full sm:w-auto px-5 py-2 lg:mr-14 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        onClick={() => navigate("/HTML-PDF")}
      >
        Convert&nbsp;&gt;
      </button>
    </div>
    <div className="w-[90%] lg:w-4/5 mx-4 bg-gray-200 dark:bg-slate-800 rounded-xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 space-y-4 sm:space-y-0 hover:shadow-lg transition-shadow duration-300">
      <div className="w-full sm:w-auto lg:ml-14">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {docUploaded ? "Resume parsed successfully!" : "Upload your existing resume to parse data from it"}
        </p>
        <p className="text-md mt-1 font-semibold text-gray-500 dark:text-gray-400">
          {docUploaded
            ? "Data extracted! Review and edit before proceeding."
            : "Upload PDF or DOCX resume. Our AI will extract and structure the data automatically (Free!)"}
        </p>
      </div>
      {docUploaded ? (
        <button
          className="w-full lg:mr-14 sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          onClick={() => navigate("/GetInfo", { state: { jsonData } })}
        >
          Review & Edit &gt;
        </button>
      ) : (
        <label className="w-full lg:mr-12 sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md cursor-pointer hover:bg-blue-700 transition duration-300">
          <UploadCloud className="w-5 h-5 mr-2" /> .pdf/.docx
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleDocUpload}
            className="hidden"
          />
        </label>
      )}
    </div>
    <div className="w-[90%] lg:w-4/5 mx-4 bg-gray-200 dark:bg-slate-800 rounded-xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 space-y-4 sm:space-y-0 hover:shadow-lg transition-shadow duration-300">
      <div className="w-full sm:w-auto lg:ml-14">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {htmlUploaded ? "HTML uploaded successfully" : "Upload HTML to extract and edit data"}
        </p>
        <p className="text-md mt-1 font-semibold text-gray-500 dark:text-gray-400">
          {htmlUploaded 
            ? "Data extracted successfully! You can now proceed to edit." 
            : "Upload our generated HTML file to extract resume data and make edits."}
        </p>
      </div>
      {htmlUploaded ? (
        <button
          className="w-full lg:mr-14 sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          onClick={() => navigate("/GetInfo", { state: { jsonData } })}
        >
          Proceed to Edit &gt;
        </button>
      ) : (
        <label className="w-full lg:mr-12 sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md cursor-pointer hover:bg-blue-700 transition duration-300">
          <UploadCloud className="w-5 h-5 mr-2" /> Our&nbsp;HTML
          <input
            type="file"
            accept=".html,.htm"
            onChange={handleHTMLUpload}
            className="hidden"
          />
        </label>
      )}
    </div>
  </div>
  
  );
};

export default FileUploadPage;
