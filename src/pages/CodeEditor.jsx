// import React from 'react';
// import { FaPlay } from 'react-icons/fa';
// import Editor from '@monaco-editor/react';

// const CodeEditor = ({ 
//   code, 
//   onCodeChange, 
//   onRun, 
//   language, 
//   onLanguageChange, 
//   output 
// }) => {
//   return (
//     <div className="code-editor-wrapper">
//       <div className="editor-controls">
//         <select
//           value={language}
//           onChange={(e) => onLanguageChange(e.target.value)}
//           className="language-select"
//         >
//           <option value="javascript">JavaScript</option>
//           <option value="python">Python</option>
//           <option value="java">Java</option>
//         </select>
//         <button onClick={onRun} className="run-button">
//           <FaPlay /> Run Code
//         </button>
//       </div>

//       <div className="code-editor-container">
//         <Editor
//           height="300px"
//           language={language}
//           value={code}
//           onChange={onCodeChange}
//           theme="vs-dark"
//           options={{
//             minimap: { enabled: false },
//             scrollBeyondLastLine: false,
//             fontSize: 14,
//             wordWrap: 'on',
//             automaticLayout: true,
//             readOnly: false,
//             contextmenu: false
//           }}
//         />
//       </div>

//       {output && (
//         <div className="output-container">
//           <div className="output-header">Output:</div>
//           <pre className="output-content">
//             {output.split('\n').map((line, i) => (
//               <div key={i} className="output-line">
//                 {line}
//                 {i < output.split('\n').length - 1 && <br />}
//               </div>
//             ))}
//           </pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CodeEditor;

import React, { useState, useRef } from "react";
import { FaPlay } from "react-icons/fa";
import Editor from "@monaco-editor/react";

const CodeEditor = () => {
  const [code, setCode] = useState("// Write your JavaScript code here\nconsole.log('Hello, World!');");
  const [output, setOutput] = useState([]);
  const iframeRef = useRef(null);

  const handleRun = () => {
    const iframe = iframeRef.current;
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    
    setOutput([]);

    const captureLogs = [];
    iframe.contentWindow.console.log = (...args) => {
      captureLogs.push(args.join(" "));
      setOutput([...captureLogs]); 
    };

    try {
      iframeDocument.open();
      iframeDocument.write(`
        <script>
          (function() {
            try {
              ${code}
            } catch (err) {
              console.log('Error: ' + err.message);
            }
          })();
        </script>
      `);
      iframeDocument.close();
    } catch (error) {
      setOutput((prev) => [...prev, "Execution Error: " + error.message]);
    }
  };

  return (
    <div className="code-editor-wrapper">
      <div className="editor-controls">
        <button onClick={handleRun} className="run-button">
          <FaPlay /> Run Code
        </button>
      </div>

      <div className="code-editor-container">
        <Editor
          height="300px"
          language="javascript"
          value={code}
          onChange={(value) => setCode(value)}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: "on",
            automaticLayout: true,
            readOnly: false,
            contextmenu: false,
          }}
        />
      </div>

      <div className="output-container">
        <iframe ref={iframeRef} id="output-frame" className="output-frame"></iframe>
        <pre className="output-message">
          {output.length > 0 ? output.join("\n") : "No output yet"}
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;
