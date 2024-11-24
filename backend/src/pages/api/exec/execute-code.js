const fs = require('fs');
const execSync = require('child_process').execSync;
const path = require("path");

let uid = 0;
export default async function executeCode(req, res) {
  uid++;
  if (req.method === "POST") {
    const { lang, code, data_in } = req.body; // data_in will be passed to stdin
    if (!(lang && code) || !["c", "cpp", "java", "py3", "javascript", "ruby", "racket", "r", "go", "php", "perl"].includes(lang)) {
      return res.status(400).json({ error: "You must specify a valid language and provide code." });
    }

    let ext, execCmd, sourceFilePath;
    const filePath = `./src/pages/api/exec/sandbox/${uid}/test`;

    switch (lang) {
      case 'c':
        ext = 'c';
        sourceFilePath = `${filePath}.${ext}`;
        execCmd = `'gcc test.c -o test.out 2> test_compile_err.txt ; ./test.out < test_data_in.txt > test_data_out.txt 2> test_data_err.txt ; echo $? > test_exit_code.txt'`;
        break;
      case 'cpp':
        ext = 'cpp';
        sourceFilePath = `${filePath}.${ext}`;
        execCmd = `'g++ test.cpp -o test.out 2> test_compile_err.txt ; ./test.out < test_data_in.txt > test_data_out.txt 2> test_data_err.txt ; echo $? > test_exit_code.txt'`;
        break;
      case 'java':
        ext = 'java';
        sourceFilePath = `${filePath}.${ext}`;
        execCmd = `'javac test.java 2> test_compile_err.txt ; java test < test_data_in.txt > test_data_out.txt 2> test_data_err.txt ; echo $? > test_exit_code.txt'`;
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
      case 'ruby':
        ext = 'rb';
        sourceFilePath = `${filePath}.${ext}`;
        execCmd = `'ruby test.rb < test_data_in.txt > test_data_out.txt 2> test_data_err.txt ; echo $? > test_exit_code.txt'`;
        break;
      case 'racket':
        ext = 'rkt';
        sourceFilePath = `${filePath}.${ext}`;
        execCmd = `'racket test.rkt < test_data_in.txt > test_data_out.txt 2> test_data_err.txt ; echo $? > test_exit_code.txt'`;
        break;
      case 'r':
        ext = 'r';
        sourceFilePath = `${filePath}.${ext}`;
        execCmd = `'Rscript test.r < test_data_in.txt > test_data_out.txt 2> test_data_err.txt ; echo $? > test_exit_code.txt'`;
        break;
      case 'go':
        ext = 'go';
        sourceFilePath = `${filePath}.${ext}`;
        execCmd = `'go build -o test test.go 2> test_compile_err.txt ; ./test < test_data_in.txt > test_data_out.txt 2> test_data_err.txt ; echo $? > test_exit_code.txt'`;
        break;
      case 'php':
        ext = 'php';
        sourceFilePath = `${filePath}.${ext}`;
        execCmd = `'php -f test.php < test_data_in.txt > test_data_out.txt 2> test_data_err.txt ; echo $? > test_exit_code.txt'`;
        break;
      case 'perl':
        ext = 'pl';
        sourceFilePath = `${filePath}.${ext}`;
        execCmd = `'perl test.pl < test_data_in.txt > test_data_out.txt 2> test_data_err.txt ; echo $? > test_exit_code.txt'`;
        break;
    }

    fs.mkdir(`./src/pages/api/exec/sandbox/${uid}`, { recursive: true }, (err) => {
      if (err) {
        return res.status(429).json({ error: "User has sent too many requests at once" });
      }

      fs.writeFile(`${filePath}_data_in.txt`, data_in, { flag: 'w+' }, async (err) => {
        if (err) {
          return res.status(429).json({ error: "User has sent too many requests at once" });
        }

        fs.writeFile(sourceFilePath, code, { flag: 'w+' }, async (err) => {
          if (err) {
            return res.status(429).json({ error: "User has sent too many requests at once" });
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
              
              if (['c', 'cpp', 'java', 'go'].includes(lang)) {
                fs.readFile(`${filePath}_compile_err.txt`, 'utf-8', async (err, data) => {
                  if (err) {
                    return res.status(503).json({ error: "Service temporarily unavailable" });
                  }
    
                  if (data) {  // if compilation failed
                    return res.status(200).json({
                      error: "Compilation failed",
                      details: data.toString() || "Unknown error"
                    });
                  }
    
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
                        return res.status(429).json({ error: "Process error", details: e.message });
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
              } else {
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
                      // return res.status(500).json({ error: "Process error", details: e.message });
                      return res.status(429).json({ error: "User has sent too many requests at once" });
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
              }
            });
          };
    
          try {
            execute();
          } catch (e) {
            // return res.status(500).json({ error: "Process error", details: e.message });
            return res.status(429).json({ error: "User has sent too many requests at once" });
          }
        });    
      });  
    });
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
