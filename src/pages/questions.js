export const questionsData = {
  "Frontend Developer": {
    "Technical": [
      // Increased tricky output-based and text questions
      { 
        id: 1, 
        type: 'text', 
        text: "What is the difference between ‘==' and ‘===’ in JavaScript, and when should each be used?" 
      },
      { 
        id: 2, 
        type: 'output', 
        text: "What will be the output of the following code?", 
        code: `const foo = () => ({ bar: 42 });  
               console.log(typeof foo().bar);`,
        options: ["'number'", "'undefined'", "'object'", "'function'"],
        correctAnswer: "'number'"
      },
      { 
        id: 3, 
        type: 'output', 
        text: "What will be the output of this code?", 
        code: `let a = [1, 2, 3];  
               console.log(typeof a === 'array');`,
        options: ["true", "false", "TypeError", "undefined"],
        correctAnswer: "false"
      },
      { 
        id: 4, 
        type: 'output', 
        text: "Predict the output of this snippet:", 
        code: `const x = {};  
               const y = { key: 'y' };  
               const z = { key: 'z' };  
               x[y] = 123;  
               x[z] = 456;  
               console.log(x[y]);`,
        options: ["123", "456", "undefined", "NaN"],
        correctAnswer: "456"
      },
      { 
        id: 5, 
        type: 'output', 
        text: "What is the output?", 
        code: `function test() {  
                  console.log(a);  
                  console.log(b);  
                  var a = 10;  
                  let b = 20;  
               }  
               test();`,
        options: ["undefined and ReferenceError", "10 and 20", "undefined and undefined", "ReferenceError and ReferenceError"],
        correctAnswer: "undefined and ReferenceError"
      },
      { 
        id: 6, 
        type: 'output', 
        text: "What will be logged by this code?", 
        code: `for (var i = 0; i < 3; i++) {  
                  setTimeout(() => console.log(i), 1000);  
               }`,
        options: ["0, 1, 2", "0, 0, 0", "3, 3, 3", "undefined"],
        correctAnswer: "3, 3, 3"
      },
      { 
        id: 7, 
        type: 'output', 
        text: "Predict the output here:", 
        code: `let x = true + false;  
               console.log(x);`,
        options: ["1", "true", "false", "NaN"],
        correctAnswer: "1"
      },
      { 
        id: 8, 
        type: 'output', 
        text: "What does the following return?", 
        code: `console.log(typeof NaN);`,
        options: ["'number'", "'NaN'", "'undefined'", "'object'"],
        correctAnswer: "'number'"
      },
      { 
        id: 9, 
        type: 'output', 
        text: "What will be logged in this code?", 
        code: `const person = { name: 'Alice' };  
               Object.freeze(person);  
               person.age = 30;  
               console.log(person.age);`,
        options: ["30", "undefined", "TypeError", "NaN"],
        correctAnswer: "undefined"
      },
      { 
        id: 10, 
        type: 'output', 
        text: "What will this output?", 
        code: `[...'hello'].reduce((acc, val) => acc + val);`,
        options: ["'hello'", "'olleh'", "'undefined'", "'h'"],
        correctAnswer: "'hello'"
      },
    ],

    "Coding": [
      // Only 2 questions: 1 DSA + 1 Domain (Frontend specific)
      { 
        id: 11, 
        type: 'text', 
        text: "Implement a function in JavaScript to find the longest substring without repeating characters." 
      },
      { 
        id: 12, 
        type: 'text', 
        text: "Create a functional search bar in React that filters and displays items from a given list dynamically." 
      }
    ],

    "Behavioral": [
      { 
        id: 13, 
        type: 'text', 
        text: "Describe a time you had to resolve a conflict while working in a team. How did you handle it?" 
      },
      { 
        id: 14, 
        type: 'text', 
        text: "Tell us about a project that you found challenging and how you overcame the difficulties." 
      },
      { 
        id: 15, 
        type: 'text', 
        text: "How do you ensure that your work as a developer stays aligned with business goals and user needs?" 
      },
      { 
        id: 16, 
        type: 'text', 
        text: "What are your strategies for maintaining a good work-life balance while managing multiple deadlines?" 
      }
    ]
  },
};
