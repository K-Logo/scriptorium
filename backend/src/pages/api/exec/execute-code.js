/**
 * CITATION: MAJORITY OF CODE GENERATED BY CHATGPT.  
 */

const fs = require('fs');
const { spawn } = require("child_process");
const path = require("path");

export default async function executeCode(req, res) {
  if (req.method === "POST") {
    const { lang, code, data_in } = req.body; // data_in will be passed to stdin
    if (!(lang && code) || !["c", "cpp", "java", "py3", "javascript"].includes(lang)) {
      return res.status(400).json({ error: "You must specify a valid language and provide code." });
    }

    let ext, compileCmd, execCmd,sourceFilePath,execFilePath;
    const filePath = "./src/pages/api/exec/test";

    switch (lang) {
      case 'c':
        ext = 'c';
        sourceFilePath = `${filePath}.${ext}`;
        compileCmd = ['gcc', sourceFilePath, '-o', `${filePath}.out`];
        execCmd = [`${filePath}.out`];
        execFilePath = `${filePath}.out`;
        break;
      case 'cpp':
        ext = 'cpp';
        sourceFilePath = `${filePath}.${ext}`;
        compileCmd = ['gcc', sourceFilePath, '-o', `${filePath}.out`, '-lstdc++'];
        execCmd = [`${filePath}.out`];
        execFilePath = `${filePath}.out`;
        break;
      case 'java':
        ext = 'java';
        sourceFilePath = `${filePath}.${ext}`;
        compileCmd = ['javac', sourceFilePath];
        execCmd = ['java', '-cp', path.dirname(sourceFilePath), path.basename(sourceFilePath, '.java')];
        break;
      case 'py3':
        ext = 'py';
        sourceFilePath = `${filePath}.${ext}`;
        execCmd = ['python3', sourceFilePath];
        break;
      case 'javascript':
        ext = 'js';
        sourceFilePath = `${filePath}.${ext}`;
        execCmd = ['node', sourceFilePath];
        break;
    }

    fs.writeFile(sourceFilePath, code, { flag: 'w+' }, async (err) => {
      if (err) {
        return res.status(500).json({ error: "I/O failed" });
      }

      const execute = () => {
        const process = spawn(execCmd[0], execCmd.slice(1), { timeout: 5000 });

        if (data_in) {
          process.stdin.write(data_in);
          process.stdin.end();
        }

        let output = "";
        let errorOutput = "";

        process.stdout.on("data", (data) => {
          output += data.toString();
        });

        process.stderr.on("data", (data) => {
          errorOutput += data.toString();
        });

        process.on("close", (code) => {
          if (code === 0) {
            res.status(200).json({ output, errorOutput });
          } else {
            res.status(500).json({
              error: "Execution failed",
              details: errorOutput || "Unknown error",
            });
          }
        });

        process.on("error", (err) => {
          res.status(500).json({
            error: "Process error",
            details: err.message,
          });
        });

        setTimeout(() => {
          process.kill();
          res.status(500).json({ error: "Execution timed out" });
        }, 10000);
      };

      if (['c', 'cpp', 'java'].includes(lang)) {
        const compileProcess = spawn(compileCmd[0], compileCmd.slice(1));

        let compileErrorOutput = "";
        compileProcess.stderr.on("data", (data) => {
          compileErrorOutput += data.toString();
        });

        compileProcess.on("close", (code) => {
          if (code === 0) {
            execute();
          } else {
            res.status(500).json({
              error: "Compilation failed",
              details: compileErrorOutput || "Unknown compilation error",
            });
          }
        });

        compileProcess.on("error", (err) => {
          res.status(500).json({
            error: "Compilation process error",
            details: err.message,
          });
        });
      } else {
        execute();
      }
    });
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
