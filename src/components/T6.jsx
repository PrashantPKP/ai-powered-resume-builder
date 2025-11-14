
import styled from "styled-components";
import React from 'react';

// Helper function to convert markdown to HTML
const parseMarkdown = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.+?)\*/g, '<em>$1</em>') // Italic
    .replace(/\n/g, ' '); // Convert line breaks to spaces for continuous text
};

const StyledWrapper=styled.div`body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #d6cece;
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;         /* (W/H) Ratio should be 0.7069 */
}
.resume {
  width: 900px;           /* (W/H) Ratio should be 0.7069 */
  /* height: 1131px; */
  background: #F1F5F9;
  border: 1px solid #ddd;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
ul {
  list-style-type: circle;
  padding-left: 20px;
}
.title{
  font-size: 24px;
  font-weight: bold;
  color: #474646;
  margin-bottom: 10px;
  border-bottom: 1px solid #535351;
  padding-bottom: 5px;
}

.contacts h1{
  font-size: 32px;  /* or whatever you like */
  font-weight: bold;
  color: #333;
}

.NoneDecoration{
  text-decoration: none;
  color: rgb(1, 82, 187);
  padding-left: 20px;
}

.TextGray{
  color:#363636;
  font-weight: bold;
}

.TextLight{
  color:#4e4e4e;
}

.subtitle,.item-title{
  font-size: 18px;
  font-weight: bold;
  color: #474646;
  margin-bottom: 5px;
  margin-top: 15px;
}

.mll-3 {
  margin-left: 0.75rem /* 12px */;
}

.Conts{
  margin-top: 25px;
}

.subcont{
  display: flex;
  /* justify-content: space-between; */
}

.subcont .mid{
  padding-right: 40px;
}

.flexConts{
  display: flex;
}

.mar-30{
  margin: 0 30px 0 30px;
}

.contacts a{
  text-decoration: none;
  color: black;
}

.signature{
  font-family: 'Dancing Script', cursive;
  font-size: 18px;
  font-weight:500;
  display: flex;
  justify-content: end;
  margin-right: 50px;
}

.SpaceBetween{
  display: flex;
  margin-bottom: 2px;
  justify-content: space-between;
  padding: 0 20px 0 20px;
}`;

export const T6 = ({ jsonData }) => {
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <StyledWrapper>
    <div className="resume" id="capture-content">
      <div className="contacts">
        <h1>{jsonData.contactInfo.fullName}</h1>
        <p>
          {jsonData.contactInfo.Location} <br />
          {jsonData.contactInfo.phoneNumber} | <a href={`mailto:${jsonData.contactInfo.emailAddress}`} target="_blank" rel="noreferrer">{jsonData.contactInfo.emailAddress}</a> | <a href={isValidUrl(jsonData.contactInfo.portfolio) ? jsonData.contactInfo.portfolio : `https://github.com/${jsonData.contactInfo.portfolio}`} target="_blank" rel="noreferrer"> {jsonData.contactInfo.portfolio.replace(/^https?:\/\//, '')}</a>
        </p>
      </div>

      <div className="Conts">
        <div className="title">Objectives:</div>
              <Description dangerouslySetInnerHTML={{ __html: parseMarkdown(jsonData.Description.UserDescription) }} />
      </div>

      <div className="Conts">
        <div className="title">Education:</div>
        {jsonData.education.map((ed, index) => (
          <div key={index}>
            <div className="subtitle">{ed.degreeName}</div>
            {ed.institutionName} | {ed.graduationYear} | CGPA: {ed.currentCGPA}
          </div>
        ))}
      </div>

      <div className="Conts">
        <div className="title">Technical skills:</div>
        <div className="subcont SpaceBetween">
          <div className="left"><strong style={{ color: "rgb(75, 77, 77)" }}>Tech Skills: </strong> <br /><strong style={{ color: "rgb(75, 77, 77)" }}>Soft Skills: </strong></div>
          <div className="mid">—<br />—<br /></div>
          <div className="right">{jsonData.skills.hardSkills}<br />{jsonData.skills.softSkills} <br /></div>
        </div>
      </div>

      <div className="Conts">
        <div className="title">Academic Projects:</div>
        <ul>
          {jsonData.projects.map((proj, index) => (
            <div key={index} className="Ritem">
              <li>
                <div className="item-title">{proj.projectTitle}</div>
                <div dangerouslySetInnerHTML={{ __html: parseMarkdown(proj.toolsTechUsed) }} />
              </li>
            </div>
          ))}
        </ul>
      </div>

      {jsonData.workExperience && jsonData.workExperience.length > 0 && jsonData.workExperience[0].companyName && (
      <div className="Conts">
        <div className="title">Work Experience:</div>
        {jsonData.workExperience.map((exp, index) => (
          <div key={index}>
            <ul>
              <li>
                <div className="internship TextGray SpaceBetween">
                  <div className="left ">{exp.companyName} | {exp.jobTitle}</div>
                  <div className="Right">{exp.WorkDuration}</div>
                </div>
              </li>
              <span style={{marginLeft:'20px'}} dangerouslySetInnerHTML={{ __html: parseMarkdown(exp.keyAchievements) }} />
            </ul>
            
          </div>
        ))}
      </div>
      )}

      {jsonData.certificates && jsonData.certificates.length > 0 && jsonData.certificates[0].certificateName && (
      <div className="Conts">
        <div className="title">Certifications:</div>
        <div>
          {jsonData.certificates.map((cert, index) => (
            <div key={index} style={{ marginBottom: '12px' }}>
              <div style={{ fontWeight: 'bold', color: '#1a1a1a' }}>
                {cert.certificateName}
              </div>
              <div style={{ color: '#4a4a4a', fontSize: '0.9em' }}>
                {cert.providerName} - ({cert.courseDuration})
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      <div className="Conts">
        <div className="title">Declaration:</div>
        I hereby declare that the above information is true to the best of my knowledge.
      </div>
      
      <p className="signature">{jsonData.contactInfo.fullName}</p>
    </div>
    </StyledWrapper>
  );
};

export const T6Css=`
@media print {
  body {
     font-family: Arial, sans-serif;
     margin: 0;
     padding: 0;
     background-color: #F1F5F9 !important;
     display: flex;
     justify-content: center;
     align-items: center;
     height: auto;        
  }
  @page {
   size: 950px 1300px; 
   margin: 0;
  }
  .resume {
     width: 900px;         
     background: #F1F5F9;
     border: 0px solid #ddd !important;
     border-radius: 15px;
     padding: 20px;
     box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
}

body {
   font-family: Arial, sans-serif;
   margin: 0;
   padding: 0;
   background-color: #d6cece;
   display: flex;
   justify-content: center;
   align-items: center;
   height: auto;         /* (W/H) Ratio should be 0.7069 */
}
.resume {
   width: 900px;           /* (W/H) Ratio should be 0.7069 */
   /* height: 1131px; */
   background: #F1F5F9;
   border: 1px solid #ddd;
   border-radius: 15px;
   padding: 20px;
   box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
ul {
   list-style-type: circle;
   padding-left: 20px;
 }
.title{
   font-size: 24px;
   font-weight: bold;
   color: #474646;
   margin-bottom: 10px;
   border-bottom: 1px solid #535351;
   padding-bottom: 5px;
}

.contacts h1{
   font-size: 32px;  /* or whatever you like */
   font-weight: bold;
   color: #333;
}

.NoneDecoration{
   text-decoration: none;
   color: rgb(1, 82, 187);
   padding-left: 20px;
}

.TextGray{
   color:#363636;
   font-weight: bold;
}

.TextLight{
   color:#4e4e4e;
}

.subtitle,.item-title{
   font-size: 18px;
   font-weight: bold;
   color: #474646;
   margin-bottom: 5px;
   margin-top: 15px;
}

.mll-3 {
   margin-left: 0.75rem /* 12px */;
}

.Conts{
   margin-top: 25px;
}

.subcont{
   display: flex;
   /* justify-content: space-between; */
}

.subcont .mid{
   padding-right: 40px;
}

.flexConts{
   display: flex;
}

.mar-30{
   margin: 0 30px 0 30px;
}

.contacts a{
   text-decoration: none;
   color: black;
}

.signature{
   font-family: 'Dancing Script', cursive;
   font-size: 18px;
   font-weight:500;
   display: flex;
   justify-content: end;
   margin-right: 50px;
}

.SpaceBetween{
   display: flex;
   margin-bottom: 2px;
   justify-content: space-between;
   padding: 0 20px 0 20px;
}`