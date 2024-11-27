import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import { LanguageProvider } from "@/contexts/language";
import CodeEditor from "@/components/CodeEditor";
import LangDropdown from "@/components/LangDropdown";
import { LanguageContext } from "@/contexts/language";
import { useRouter } from 'next/router';

import Link from 'next/link';
import { Editor } from "@monaco-editor/react";


export default function Run() {
  const router = useRouter();
  const { language, setLanguage } = useContext(LanguageContext);
  const [user, setUser] = useState(null);
  type QueryParams = {
    prepopulatedCode?: string;
    predefinedLanguage?: string;
  };
  const { prepopulatedCode, predefinedLanguage } = router.query as QueryParams;
  let codeDefaultValue;
  if (prepopulatedCode) {
    codeDefaultValue = prepopulatedCode;
  } else {
    codeDefaultValue = ""
  }
  const [code, setCode] = useState(codeDefaultValue);

  // Below runs when page is mounted
  useEffect(() => {
    if (predefinedLanguage) {
      setLanguage(predefinedLanguage);
    }

    const userJson = window.localStorage.getItem('user');
    const user = JSON.parse(userJson);
    if (user) {
      setUser(user);
    }
}, []);
  

  const handleCodeChange = (value) => {
    setCode(value);
    console.log(value);
}

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const defaultPythonCode = `# Here is some code to get you started!
#
# Note: Input is passed through stdin, which you must
# appropriately bind in your program. Also, output is read
# from stdout, i.e. you must call print to display your 
# program output.

#!/bin/python3

import math
import os
import random
import re
import sys

#
# The function accepts INTEGER n as parameter.
#
def fizzBuzz(n):
    # Write your code here
    return n
    
if __name__ == '__main__':
    # Read from stdin
    n = int(input().strip())
    print(fizzBuzz(n))
`;

const defaultJavaCode = `/* Here is some code to get you started!
*
* Note: Input is passed through stdin, which you must
* appropriately bind in your program. Also, output is read
* from stdout, i.e. you must call print to display your 
* program output.

* Java-Specific Note: The class containing your main method MUST be named
test.
*/ 

import java.io.*;
import java.math.*;
import java.security.*;
import java.text.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.function.*;
import java.util.regex.*;
import java.util.stream.*;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;

class Result {

    /*
     * The function accepts INTEGER n as parameter.
     */
    public static int fizzBuzz(int n) {
        // Write your code here
        return n;
    }

}

// This class MUST be named test
public class test {
    public static void main(String[] args) throws IOException {
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));

        int n = Integer.parseInt(bufferedReader.readLine().trim());

        System.out.println(Result.fizzBuzz(n));

        bufferedReader.close();
    }
}
`;

const defaultCppCode = `/* Here is some code to get you started!
*
* Note: Input is passed through stdin, which you must
* appropriately bind in your program. Also, output is read
* from stdout, i.e. you must call print to display your 
* program output.
*
*/

#include <bits/stdc++.h>

using namespace std;

string ltrim(const string &);
string rtrim(const string &);

/*
 * The function accepts INTEGER n as parameter.
 */
int fizzBuzz(int n) {
    return n;
}

int main() {
    string n_temp;
    getline(cin, n_temp);

    int n = stoi(ltrim(rtrim(n_temp)));

    cout << fizzBuzz(n);

    return 0;
}

string ltrim(const string &str) {
    string s(str);

    s.erase(
        s.begin(),
        find_if(s.begin(), s.end(), [](unsigned char ch) { return !isspace(ch); })
    );

    return s;
}

string rtrim(const string &str) {
    string s(str);

    s.erase(
        find_if(s.rbegin(), s.rend(), [](unsigned char ch) { return !isspace(ch); }).base(),
        s.end()
    );

    return s;
}
`;

const defaultCCode = `/* Here is some code to get you started!
*
* Note: Input is passed through stdin, which you must
* appropriately bind in your program. Also, output is read
* from stdout, i.e. you must call print to display your 
* program output.
*
*/

#include <assert.h>
#include <ctype.h>
#include <limits.h>
#include <math.h>
#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char* readline();
char* ltrim(char*);
char* rtrim(char*);

int parse_int(char*);

/*
 * The function accepts INTEGER n as parameter.
 */
int fizzBuzz(int n) {
    return n;
}

int main()
{
    int n = parse_int(ltrim(rtrim(readline())));

    printf("%d", fizzBuzz(n));

    return 0;
}

char* readline() {
    size_t alloc_length = 1024;
    size_t data_length = 0;

    char* data = malloc(alloc_length);

    while (true) {
        char* cursor = data + data_length;
        char* line = fgets(cursor, alloc_length - data_length, stdin);

        if (!line) {
            break;
        }

        data_length += strlen(cursor);

        if (data_length < alloc_length - 1 || data[data_length - 1] == '\\n') {
            break;
        }

        alloc_length <<= 1;

        data = realloc(data, alloc_length);

        if (!data) {
            data = '\\0';

            break;
        }
    }

    if (data[data_length - 1] == '\\n') {
        data[data_length - 1] = '\\0';

        data = realloc(data, data_length);

        if (!data) {
            data = '\\0';
        }
    } else {
        data = realloc(data, data_length + 1);

        if (!data) {
            data = '\\0';
        } else {
            data[data_length] = '\\0';
        }
    }

    return data;
}

char* ltrim(char* str) {
    if (!str) {
        return '\\0';
    }

    if (!*str) {
        return str;
    }

    while (*str != '\\0' && isspace(*str)) {
        str++;
    }

    return str;
}

char* rtrim(char* str) {
    if (!str) {
        return '\\0';
    }

    if (!*str) {
        return str;
    }

    char* end = str + strlen(str) - 1;

    while (end >= str && isspace(*end)) {
        end--;
    }

    *(end + 1) = '\\0';

    return str;
}

int parse_int(char* str) {
    char* endptr;
    int value = strtol(str, &endptr, 10);

    if (endptr == str || *endptr != '\\0') {
        exit(EXIT_FAILURE);
    }

    return value;
}
`;

const defaultJSCode = `/* Here is some code to get you started!
*
* Note: Input is passed through stdin, which you must
* appropriately bind in your program. Also, output is read
* from stdout, i.e. you must call print to display your 
* program output.
*
*/

'use strict';

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}

/*
 * The function accepts INTEGER n as parameter.
 */
function fizzBuzz(n) {
    // Write your code here
    return n;
}

function main() {
    const n = parseInt(readLine().trim(), 10);

    console.log(fizzBuzz(n));
}
`;

const defaultRCode = `# Here is some code to get you started!
#
# Note: Input is passed through stdin, which you must
# appropriately bind in your program. Also, output is read
# from stdout, i.e. you must call print to display your 
# program output.

# The function accepts INTEGER n as parameter.
fizzBuzz <- function(n) {
    # Write your code here
    n
}

stdin <- file('stdin')
open(stdin)

n <- as.integer(trimws(readLines(stdin, n = 1, warn = FALSE), which = "both"))

fizzBuzz(n)

close(stdin)

stdin <- file('stdin')
open(stdin)

n <- as.integer(trimws(readLines(stdin, n = 1, warn = FALSE), which = "both"))

fizzBuzz(n)

close(stdin)
`;

const defaultRubyCode = `# Here is some code to get you started!
#
# Note: Input is passed through stdin, which you must
# appropriately bind in your program. Also, output is read
# from stdout, i.e. you must call print to display your 
# program output.

#!/bin/ruby

require 'json'
require 'stringio'

# The function accepts INTEGER n as parameter.
def fizzBuzz(n)
    # Write your code here
    print n
end

n = gets.strip.to_i

fizzBuzz n
`;

const defaultGoCode = `/* Here is some code to get you started!
*
* Note: Input is passed through stdin, which you must
* appropriately bind in your program. Also, output is read
* from stdout, i.e. you must call print to display your 
* program output.
*
*/

package main

import (
    "bufio"
    "fmt"
    "io"
    "os"
    "strconv"
    "strings"
)

/*
 * The function accepts INTEGER n as parameter.
 */
func fizzBuzz(n int32) {
    // Write your code here
    fmt.Print(n)
}

func main() {
    reader := bufio.NewReaderSize(os.Stdin, 16 * 1024 * 1024)

    nTemp, err := strconv.ParseInt(strings.TrimSpace(readLine(reader)), 10, 64)
    checkError(err)
    n := int32(nTemp)

    fizzBuzz(n)
}

func readLine(reader *bufio.Reader) string {
    str, _, err := reader.ReadLine()
    if err == io.EOF {
        return ""
    }

    return strings.TrimRight(string(str), "\\r\\n")
}

func checkError(err error) {
    if err != nil {
        panic(err)
    }
}
`;

const defaultPHPCode = `
<?php
/* Here is some code to get you started!
*
* Note: Input is passed through stdin, which you must
* appropriately bind in your program. Also, output is read
* from stdout, i.e. you must call print to display your 
* program output.
*
*/

/*
 * The function accepts INTEGER n as parameter.
 */

function fizzBuzz($n) {
    // Write your code here
    echo $n;
}

$n = intval(trim(fgets(STDIN)));

fizzBuzz($n);
`;

const defaultPerlCode = `# Here is some code to get you started!
#
# Note: Input is passed through stdin, which you must
# appropriately bind in your program. Also, output is read
# from stdout, i.e. you must call print to display your 
# program output.

#!/usr/bin/perl

use strict;
use warnings;

#
# The function accepts INTEGER n as parameter.
#
my $n = ltrim(rtrim(my $n_temp = <STDIN>));

sub fizzBuzz {
    # Write your code here
    print $n;
}

fizzBuzz \"$n\";

sub ltrim {
    my $str = shift;

    $str =~ s/^\\s+//;

    return $str;
}

sub rtrim {
    my $str = shift;

    $str =~ s/\\s+$//;

    return $str;
}
`;

const defaultRacketCode = `; Here is some code to get you started!
;
; Note: Input is passed through stdin, which you must
; appropriately bind in your program. Also, output is read
; from stdout, i.e. you must call print to display your 
; program output.

#lang racket

; Define the fizzBuzz function
(define (fizzBuzz n)
  (display n)
)

; Main function to read input and call fizzBuzz
(define (main)
  (define n (string->number (read-line)))
  (fizzBuzz n)
)

; Run the main function
(main)
`;



  useEffect(() => {
    if (language === "py3") {
      setCode(defaultPythonCode); // Set default code when language is py3
    } else if (language === "java") {
      setCode(defaultJavaCode);
    } else if (language === "cpp") {
      setCode(defaultCppCode);
    } else if (language === "c") {
      setCode(defaultCCode);
    } else if (language === "javascript") {
      setCode(defaultJSCode);
    } else if (language === "r") {
      setCode(defaultRCode);
    } else if (language === "ruby") {
      setCode(defaultRubyCode);
    } else if (language === "go") {
      setCode(defaultGoCode);
    } else if (language === "php") {
      setCode(defaultPHPCode);
    } else if (language === "perl") {
      setCode(defaultPerlCode);
    } else if (language === "racket") {
      setCode(defaultRacketCode);
    }
  }, [language]);

  const handleRun = async () => {
    try {
      const requestBody = {
        lang: language,
        code: code,
        data_in: input,
      };

      const response = await fetch("/api/exec/execute-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const responseBody = await response.json();
      if (responseBody.error) {
        if (responseBody.details === "Unknown error") {
          setOutput(`Error: ${responseBody.error}\n\nDetails: Please check your input and try again`);
        } else {
          setOutput(`Error: ${responseBody.error}\n\nDetails: ${responseBody.details}`);
        }
      } else {
        let cleanedOutput = responseBody.output;
        if (cleanedOutput.startsWith('\"') && cleanedOutput.endsWith('\"', cleanedOutput.length - 1)) {
          cleanedOutput = cleanedOutput.slice(1, -2);
        } else if (cleanedOutput.startsWith('\'') && cleanedOutput.endsWith('\'', cleanedOutput.length - 1)) {
          cleanedOutput = cleanedOutput.slice(1, -2);
        }
        setOutput(cleanedOutput || "No output received.");
      }
    } catch (error) {
      console.error("Failed to execute code:", error);
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <Head>
        <title>Scriptorium Run Code</title>
      </Head>
      <main>
        <div id="run-container">
          <div id="editor-container">
              <div className="run-headers">
                <LangDropdown/>
                  <button id="run-button" className="blue-button" onClick={handleRun}>
                    Run
                  </button>
                  {user &&
                  <Link href={`/code-templates/create?codeTyped=${encodeURIComponent(code)}&languagePassed=${language}`}>
                    <button className="blue-button">
                      Save
                    </button>
                  </Link>
                  }
                  
              </div>
            <CodeEditor value={code} onChange={(value: string) => setCode(value)} />
            <textarea
              id="input"
              placeholder="Insert input here (each input on its own line)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div id="output-container">
            <div className="run-headers">
              <h2>Output</h2>
              <button className="blue-button" onClick={() => setOutput("")}>
                Clear
              </button>
            </div>
            <div id="output">{output}</div>
          </div>
        </div>
      </main>
    </>
  );
}
