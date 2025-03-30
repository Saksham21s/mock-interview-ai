export const questionBank = {
    // Frontend Developer questions starts here 
  "Frontend Developer": {
    "Technical": [
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

  // Backend Developer questions starts here 
 "Backend Developer": {
  "Technical": [
    // Increased tricky output-based and text questions
    { 
      id: 1, 
      type: 'text', 
      text: "What are the key differences between Monolithic and Microservices architectures? Which one would you recommend for a high-traffic application and why?" 
    },
    { 
      id: 2, 
      type: 'output', 
      text: "What will be the output of this code?", 
      code: `const obj = { a: 1, b: 2 };  
             const clone = { ...obj, a: 42 };  
             console.log(clone.a, clone.b);`,
      options: ["1, 2", "42, 2", "1, undefined", "42, undefined"],
      correctAnswer: "42, 2"
    },
    { 
      id: 3, 
      type: 'output', 
      text: "Predict the output of the following code:", 
      code: `const express = require('express');  
             const app = express();  
             app.get('/test', (req, res) => res.send('Hello'));  
             app.listen(3000);  
             console.log(app.get('port'));`,
      options: ["3000", "undefined", "0", "null"],
      correctAnswer: "undefined"
    },
    { 
      id: 4, 
      type: 'output', 
      text: "What will this snippet log?", 
      code: `const promise = new Promise((resolve, reject) => {  
                resolve('Success');  
                reject('Error');  
             });  
             promise.then(console.log).catch(console.error);`,
      options: ["Success", "Error", "Success and Error", "undefined"],
      correctAnswer: "Success"
    },
    { 
      id: 5, 
      type: 'text', 
      text: "Explain the concept of middleware in Express.js. How does it help in building scalable backend applications?" 
    },
    { 
      id: 6, 
      type: 'output', 
      text: "What will be the output of this code snippet?", 
      code: `console.log('1');  
             process.nextTick(() => console.log('2'));  
             console.log('3');`,
      options: ["1, 2, 3", "1, 3, 2", "2, 1, 3", "3, 1, 2"],
      correctAnswer: "1, 3, 2"
    },
    { 
      id: 7, 
      type: 'output', 
      text: "What is the output here?", 
      code: `const x = new Map();  
             x.set([], 'A');  
             console.log(x.get([]));`,
      options: ["A", "undefined", "null", "TypeError"],
      correctAnswer: "undefined"
    },
    { 
      id: 8, 
      type: 'output', 
      text: "What does the following log?", 
      code: `console.log(Buffer.from('123').toString('hex'));`,
      options: ["313233", "123", "3c78e", "TypeError"],
      correctAnswer: "313233"
    },
    { 
      id: 9, 
      type: 'text', 
      text: "What is the role of CORS in backend development? How can it be enabled in an Express.js application?" 
    },
    { 
      id: 10, 
      type: 'output', 
      text: "What will this output?", 
      code: `async function test() {  
                return 42;  
             }  
             console.log(typeof test());`,
      options: ["'number'", "'object'", "'promise'", "'function'"],
      correctAnswer: "'promise'"
    }
  ],

  "Coding": [
    // 1 DSA + 1 Backend Domain-specific
    { 
      id: 11, 
      type: 'text', 
      text: "Write a function in Node.js to implement rate-limiting middleware that limits the number of requests from a given IP address within a specific time window." 
    },
    { 
      id: 12, 
      type: 'text', 
      text: "Implement a function to find the kth largest element in an unsorted array of integers. Optimize the solution for time and space complexity." 
    }
  ],

  "Behavioral": [
    { 
      id: 13, 
      type: 'text', 
      text: "Tell me about a time when you encountered a critical bug in production. How did you diagnose the issue and resolve it under pressure?" 
    },
    { 
      id: 14, 
      type: 'text', 
      text: "Describe a project where you had to implement a major backend optimization. What specific changes did you make, and what was the impact on performance?" 
    },
    { 
      id: 15, 
      type: 'text', 
      text: "How do you approach testing in backend development? What strategies do you use to ensure code quality and reduce technical debt?" 
    },
    { 
      id: 16, 
      type: 'text', 
      text: "What are some key lessons you’ve learned from working on large-scale backend systems, and how have they shaped your development approach?" 
    }
  ]
},

// Full Stack Developer questions starts here 
"Full Stack Developer": {
  "Technical": [
    // Challenging and output-based questions covering both frontend and backend
    {
      id: 1,
      type: 'text',
      text: "Explain the differences between REST and GraphQL. Which one would you choose for a real-time application and why?"
    },
    {
      id: 2,
      type: 'output',
      text: "What will be the output of the following code?",
      code: `const arr = [1, 2, 3, 4];  
             const result = arr.reduce((acc, val) => acc + val, 0);  
             console.log(result);`,
      options: ["10", "9", "NaN", "undefined"],
      correctAnswer: "10"
    },
    {
      id: 3,
      type: 'output',
      text: "Predict the output of the following code snippet:",
      code: `const express = require('express');  
             const app = express();  
             app.use((req, res, next) => {  
               console.log('Middleware');  
               next();  
             });  
             app.get('/', (req, res) => res.send('Hello World!'));  
             app.listen(3000);  
             console.log('Server started');`,
      options: [
        "'Middleware' followed by 'Server started'",
        "'Server started' and then no further output",
        "'Server started' and 'Middleware' when a request is made",
        "'Middleware' and then an error"
      ],
      correctAnswer: "'Server started' and 'Middleware' when a request is made"
    },
    {
      id: 4,
      type: 'text',
      text: "What is server-side rendering (SSR) in React? How does it improve SEO and performance for web applications?"
    },
    {
      id: 5,
      type: 'output',
      text: "What will this snippet output?",
      code: `const a = {};  
             const b = { key: 'value' };  
             a[b] = 42;  
             console.log(a[b]);`,
      options: ["42", "undefined", "Error", "NaN"],
      correctAnswer: "42"
    },
    {
      id: 6,
      type: 'output',
      text: "What will be the output of this async code?",
      code: `async function fetchData() {  
               return Promise.resolve('Data Loaded');  
             }  
             fetchData().then(console.log);`,
      options: ["'Data Loaded'", "Promise { <pending> }", "undefined", "null"],
      correctAnswer: "'Data Loaded'"
    },
    {
      id: 7,
      type: 'output',
      text: "What is logged by this code?",
      code: `console.log([...'hello'].reverse().join(''));`,
      options: ["'hello'", "'olleh'", "'h'", "'undefined'"],
      correctAnswer: "'olleh'"
    },
    {
      id: 8,
      type: 'output',
      text: "What will be the output?",
      code: `console.log(typeof null);`,
      options: ["'object'", "'null'", "'undefined'", "'boolean'"],
      correctAnswer: "'object'"
    },
    {
      id: 9,
      type: 'text',
      text: "What is the difference between SQL and NoSQL databases? Provide examples of scenarios where each type of database is preferable."
    },
    {
      id: 10,
      type: 'output',
      text: "What is the output of this code snippet?",
      code: `function* generatorFunc() {  
               yield 'First';  
               yield 'Second';  
               yield 'Third';  
             }  
             const gen = generatorFunc();  
             console.log(gen.next().value);  
             console.log(gen.next().value);`,
      options: ["'First' and 'Second'", "'First' and 'undefined'", "'First' and 'Third'", "'undefined'"],
      correctAnswer: "'First' and 'Second'"
    }
  ],

  "Coding": [
    // 1 DSA problem and 1 Full Stack-specific task
    {
      id: 11,
      type: 'text',
      text: "Implement a function in JavaScript to check if a string is a valid palindrome, considering only alphanumeric characters and ignoring cases."
    },
    {
      id: 12,
      type: 'text',
      text: "Create a basic CRUD API using Node.js and Express to manage a list of products. Implement GET, POST, PUT, and DELETE routes."
    }
  ],

  "Behavioral": [
    // Focused on teamwork, problem-solving, and adaptability
    {
      id: 13,
      type: 'text',
      text: "Tell us about a time when you had to collaborate closely with frontend and backend teams to solve a major technical issue. How did you manage communication and ensure a successful outcome?"
    },
    {
      id: 14,
      type: 'text',
      text: "Describe a challenging bug or bottleneck you encountered in a full stack project. How did you debug and optimize the system to improve performance?"
    },
    {
      id: 15,
      type: 'text',
      text: "How do you stay updated with the latest trends and best practices in full stack development? Share examples of any recent technologies or tools you’ve adopted."
    },
    {
      id: 16,
      type: 'text',
      text: "What steps do you take to ensure that the code you write is clean, maintainable, and scalable? How do you handle technical debt in long-term projects?"
    }
  ]
},

// Data Scientist questions starts here 
"Data Scientist": {
  "Technical": [
    // Mixture of theory, statistics, machine learning, and output-based Python questions
    {
      id: 1,
      type: 'text',
      text: "Explain the difference between supervised, unsupervised, and reinforcement learning. Provide real-world use cases for each."
    },
    {
      id: 2,
      type: 'output',
      text: "What will be the output of the following Python code?",
      code: `import numpy as np  
             a = np.array([1, 2, 3])  
             b = a * 2  
             print(b.sum())`,
      options: ["6", "9", "12", "15"],
      correctAnswer: "12"
    },
    {
      id: 3,
      type: 'text',
      text: "What are p-values in hypothesis testing? How do you interpret a p-value of 0.03?"
    },
    {
      id: 4,
      type: 'output',
      text: "Predict the output of this code snippet:",
      code: `from sklearn.preprocessing import StandardScaler  
             import numpy as np  
             X = np.array([[1, 2], [3, 4], [5, 6]])  
             scaler = StandardScaler()  
             X_scaled = scaler.fit_transform(X)  
             print(X_scaled.mean())`,
      options: ["0.0", "1.0", "2.0", "Error"],
      correctAnswer: "0.0"
    },
    {
      id: 5,
      type: 'text',
      text: "What is overfitting in machine learning? How can it be prevented?"
    },
    {
      id: 6,
      type: 'output',
      text: "What will this code output?",
      code: `import pandas as pd  
             data = {'A': [10, 20, 30], 'B': [40, 50, 60]}  
             df = pd.DataFrame(data)  
             print(df.loc[1, 'B'])`,
      options: ["40", "50", "60", "Error"],
      correctAnswer: "50"
    },
    {
      id: 7,
      type: 'text',
      text: "Explain the difference between L1 and L2 regularization in machine learning models."
    },
    {
      id: 8,
      type: 'output',
      text: "What will be logged by this Python code?",
      code: `import math  
             print(math.sqrt(49) + math.log(100, 10))`,
      options: ["9.0", "16.0", "17.0", "10.0"],
      correctAnswer: "16.0"
    },
    {
      id: 9,
      type: 'text',
      text: "What are the key differences between bagging and boosting in ensemble learning? How do these techniques help improve model performance?"
    },
    {
      id: 10,
      type: 'output',
      text: "What is the output of this Python snippet?",
      code: `import numpy as np  
             x = np.array([1, 0, 1, 0])  
             y = np.array([1, 1, 0, 0])  
             print(np.dot(x, y))`,
      options: ["1", "2", "3", "4"],
      correctAnswer: "1"
    }
  ],

  "Coding": [
    // Real-world and DSA-specific coding questions focused on data manipulation, ML, and DSA
    {
      id: 11,
      type: 'text',
      text: "Write a Python function to calculate the mean, median, and mode of a given list of numbers."
    },
    {
      id: 12,
      type: 'text',
      text: "Given a dataset with missing values, implement a Python function to handle missing data using mean imputation for numerical features."
    }
  ],

  "Behavioral": [
    // Questions to assess problem-solving, communication, teamwork, and adaptability
    {
      id: 13,
      type: 'text',
      text: "Describe a data science project you worked on from start to finish. How did you gather, clean, and analyze the data, and what were the key insights or outcomes?"
    },
    {
      id: 14,
      type: 'text',
      text: "Tell us about a time when your data analysis or model predictions were challenged by stakeholders. How did you handle the situation and defend your work?"
    },
    {
      id: 15,
      type: 'text',
      text: "How do you prioritize tasks and manage time when working on multiple projects with tight deadlines?"
    },
    {
      id: 16,
      type: 'text',
      text: "What steps do you take to ensure that the data you work with is reliable, accurate, and free from bias?"
    }
  ]
},

// UI/UX Designer questions starts here 
"UX/UI Designer": {
  "Technical": [
    {
      id: 1,
      type: 'text',
      text: "What is the difference between User Experience (UX) Design and User Interface (UI) Design?"
    },
    {
      id: 2,
      type: 'text',
      text: "Explain the key principles of usability in UX design. How do these impact user engagement?"
    },
    {
      id: 3,
      type: 'text',
      text: "What are wireframes, and how do they contribute to the design process?"
    },
    {
      id: 4,
      type: 'text',
      text: "What is the importance of color theory in UI/UX design? How would you apply it to improve the user experience?"
    },
    {
      id: 5,
      type: 'output',
      text: "What is the output of this CSS code snippet?",
      code: `body {  
                display: flex;  
                justify-content: center;  
                align-items: center;  
                height: 100vh;  
             }`,
      options: ["Content will be centered horizontally", "Content will be centered vertically", "Content will be centered both horizontally and vertically", "Content will stretch to full width"],
      correctAnswer: "Content will be centered both horizontally and vertically"
    },
    {
      id: 6,
      type: 'text',
      text: "What is a design system? How does it help streamline the UI/UX process for large-scale projects?"
    },
    {
      id: 7,
      type: 'output',
      text: "Predict the output of this HTML code:",
      code: `<button class="btn">Click Me</button>  
             <style>  
               .btn:hover { background-color: #3498db; color: white; }  
               .btn:active { transform: scale(0.95); }  
             </style>`,
      options: ["The button will change color on hover", "The button will scale down when clicked", "Both A and B", "None of the above"],
      correctAnswer: "Both A and B"
    },
    {
      id: 8,
      type: 'text',
      text: "What are affordances in UI design, and why are they important for creating intuitive user interfaces?"
    },
    {
      id: 9,
      type: 'text',
      text: "Explain the difference between responsive design and adaptive design. When would you choose one over the other?"
    },
    {
      id: 10,
      type: 'output',
      text: "What is the output of the following CSS snippet?",
      code: `div {  
               grid-template-columns: repeat(3, 1fr);  
               gap: 10px;  
             }`,
      options: ["A 3-column grid layout with no gap", "A 3-column grid layout with a 10px gap", "A single-column layout", "An undefined grid layout"],
      correctAnswer: "A 3-column grid layout with a 10px gap"
    }
  ],

  "Coding": [
    {
      id: 11,
      type: 'text',
      text: "Write a function in JavaScript to create a modal pop-up that opens on clicking a button and closes when clicking outside the modal."
    },
    {
      id: 12,
      type: 'text',
      text: "Create a CSS-based animation that makes a button change color and scale up slightly on hover."
    }
  ],

  "Behavioral": [
    {
      id: 13,
      type: 'text',
      text: "Tell us about a project where you had to deal with conflicting design feedback from stakeholders. How did you resolve the situation?"
    },
    {
      id: 14,
      type: 'text',
      text: "Describe a time when you improved a product’s user experience based on user research and feedback. What changes did you implement, and what was the impact?"
    },
    {
      id: 15,
      type: 'text',
      text: "How do you handle tight deadlines while ensuring high-quality UI/UX output?"
    },
    {
      id: 16,
      type: 'text',
      text: "What is your approach to staying updated with the latest design trends, tools, and technologies?"
    }
  ]
},
};
