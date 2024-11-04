process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}

function fizzBuzz(n) {
    // Write your code here
    console.log(n % 3);
}

function main() {
    const n = parseInt(readLine().trim(), 10);

    fizzBuzz(n);
}
