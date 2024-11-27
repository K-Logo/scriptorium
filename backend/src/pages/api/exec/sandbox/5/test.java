/* Here is some code to get you started!
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

}asdfadsfadsf

// This class MUST be named test
public class test {
    public static void main(String[] args) throws IOException {
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));

        int n = Integer.parseInt(bufferedReader.readLine().trim());

        System.out.println(Result.fizzBuzz(n));

        bufferedReader.close();
    }
}
