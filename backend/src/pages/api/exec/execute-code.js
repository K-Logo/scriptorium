const fs = require('fs');
const { spawn } = require("child_process");
const execSync = require('child_process').execSync;
const path = require("path");

let uid = 0;
export default async function executeCode(req, res) {
  uid++;
  if (req.method === "POST") {
    const { lang, code, data_in } = req.body; // data_in will be passed to stdin
    if (!(lang && code) || !["c", "cpp", "java", "py3", "javascript"].includes(lang)) {
      return res.status(400).json({ error: "You must specify a valid language and provide code." });
    }

    let ext, compileCmd, execCmd, sourceFilePath;
    const filePath = `./src/pages/api/exec/sandbox/${uid}/test`;

    switch (lang) {
      case 'c':
        ext = 'c';
        sourceFilePath = `${filePath}.${ext}`;
        compileCmd = ['gcc', sourceFilePath, '-o', `${filePath}.out`];
        execCmd = [`${filePath}.out`];
        break;
      case 'cpp':
        ext = 'cpp';
        sourceFilePath = `${filePath}.${ext}`;
        compileCmd = ['g++', sourceFilePath, '-o', `${filePath}.out`];
        execCmd = [`${filePath}.out`];
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
        execCmd = `'python3 test.py < test_data_in.txt > test_data_out.txt 2> test_data_err.txt ; echo $? > test_exit_code.txt'`;
        break;
      case 'javascript':
        ext = 'js';
        sourceFilePath = `${filePath}.${ext}`;
        execCmd = `'node test.js < test_data_in.txt > test_data_out.txt 2> test_data_err.txt ; echo $? > test_exit_code.txt'`;
        break;
    }

    // DOCKER TEST START
    fs.mkdir(`./src/pages/api/exec/sandbox/${uid}`, { recursive: true }, (err) => {
      if (err) {
        return res.status(500).json({ error: "I/O failed" });
      }
    });

    fs.writeFile(`${filePath}_data_in.txt`, data_in, { flag: 'w+' }, async (err) => {
      if (err) {
        return res.status(500).json({ error: "I/O failed" });
      }
    });

    fs.writeFile(sourceFilePath, code, { flag: 'w+' }, async (err) => {
      if (err) {
        return res.status(500).json({ error: "I/O failed" });
      }

      const execute = () => {
        try {
          // DONT FORGET TO DOCKER BUILD ON SERVER START
          var absolutePath = path.resolve(".") + `/src/pages/api/exec/sandbox/${uid}`;
          execSync(`docker run --rm -v ${absolutePath}:/usr/src/app --entrypoint '/bin/sh' sandbox -c ${execCmd}`, { encoding: 'utf-8' });  // the default is 'buffer'. add -it flag if running from terminal
        } catch (e) {
          return res.status(503).json({ error: "Service temporarily unavailable" });
        }

        let output = "";
        let errorOutput = "";
        let statusCode = 0;

        fs.readFile(`${filePath}_data_out.txt`, 'utf-8', async (err, data) => {
          if (err) {
            return res.status(503).json({ error: "Service temporarily unavailable" });
          }

          output += data.toString();

          fs.readFile(`${filePath}_data_err.txt`, 'utf-8', async (err, data) => {
            if (err) {
              return res.status(503).json({ error: "Service temporarily unavailable" });
            }
            errorOutput += data.toString();

            fs.readFile(`${filePath}_exit_code.txt`, 'utf-8', async (err, data) => {
              if (err) {
                return res.status(503).json({ error: "Service temporarily unavailable" });
              }
              
              statusCode = parseInt(data);
              try {
                fs.rmSync(`./src/pages/api/exec/sandbox/${uid}`, { recursive: true, force: true });
              } catch (e) {
                return res.status(500).json({ error: "Process error", details: e.message });
              }
              
              if (statusCode === 0) {
                return res.status(200).json({ output, errorOutput }); 
              } else {
                return res.status(200).json({
                  error: "Execution failed",
                  details: errorOutput || "Unknown error",
                });
              }
            });    
          });
        });
      };

      const executeWithCompilation = () => {
        try {
          // DONT FORGET TO DOCKER BUILD ON SERVER START
          var absolutePath = path.resolve(".") + `/src/pages/api/exec/sandbox/${uid}`;
          execSync(`docker run --rm -v ${absolutePath}:/usr/src/app --entrypoint '/bin/sh' sandbox -c ${execCmd}`, { encoding: 'utf-8' });  // the default is 'buffer'. add -it flag if running from terminal
        } catch (e) {
          return res.status(503).json({ error: "Service temporarily unavailable" });
        }

        let output = "";
        let errorOutput = "";
        let statusCode = 0;

        fs.readFile(`${filePath}_data_out.txt`, 'utf-8', async (err, data) => {
          if (err) {
            return res.status(503).json({ error: "Service temporarily unavailable" });
          }

          output += data.toString();

          fs.readFile(`${filePath}_data_err.txt`, 'utf-8', async (err, data) => {
            if (err) {
              return res.status(503).json({ error: "Service temporarily unavailable" });
            }
            errorOutput += data.toString();

            fs.readFile(`${filePath}_exit_code.txt`, 'utf-8', async (err, data) => {
              if (err) {
                return res.status(503).json({ error: "Service temporarily unavailable" });
              }
              
              statusCode = parseInt(data);
              try {
                fs.rmSync(`./src/pages/api/exec/sandbox/${uid}`, { recursive: true, force: true });
              } catch (e) {
                return res.status(500).json({ error: "Process error", details: e.message });
              }
              
              if (statusCode === 0) {
                return res.status(200).json({ output, errorOutput }); 
              } else {
                return res.status(200).json({
                  error: "Execution failed",
                  details: errorOutput || "Unknown error",
                });
              }
            });    
          });
        });
      };

      // DOCKER TEST END
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
        try {
          execute();
        } catch (e) {
          return res.status(500).json({ error: "Process error", details: e.message });
        }
      }
    });
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
