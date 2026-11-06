/**
 * SMART EDUCATION SYSTEM - EMBEDDED DEFAULT DATA & OFFLINE ENGINE
 * Provides instant data whether running on Node.js server or standalone browser
 */

const DEFAULT_COURSES = [
  {
    id: "course-1",
    title: "Modern Full-Stack Web Development",
    category: "Computer Science",
    level: "Intermediate",
    rating: 4.9,
    reviewCount: 1280,
    duration: "14.5 Hours",
    totalLessons: 5,
    instructor: {
      name: "Prof. David Miller",
      title: "Senior Software Architect & Educator",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
    },
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80",
    description: "Master responsive HTML5, modern CSS3 styling, JavaScript ES6+, REST APIs, and full stack application design with practical real-world projects.",
    syllabus: [
      {
        id: "c1-l1",
        title: "HTML5 Semantic Structure & Modern Web Standards",
        duration: "24 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        summary: "Introduction to semantic markup, accessibility (a11y), clean document tree, and modern HTML best practices.",
        notes: "Semantic HTML elements give meaning to your markup. Key tags include <header>, <nav>, <main>, <article>, <section>, and <footer>. Always use proper alt attributes for images."
      },
      {
        id: "c1-l2",
        title: "CSS3 Flexbox, Grid & Responsive Layouts",
        duration: "35 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        summary: "Deep dive into CSS Flexbox for 1D layouts and CSS Grid for 2D responsive matrix designs across all screen sizes.",
        notes: "Flexbox (display: flex) distributes items along a main axis and cross axis. CSS Grid (display: grid) creates 2D track layouts. Use media queries for responsive breakpoints: 640px, 768px, 1024px."
      },
      {
        id: "c1-l3",
        title: "JavaScript ES6+: Async/Await, Fetch API & DOM",
        duration: "42 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        summary: "Mastering modern JavaScript asynchronous programming, promises, DOM manipulation, and consuming REST APIs.",
        notes: "Promises handle asynchronous state (pending, fulfilled, rejected). Async/Await provides synchronous-looking syntax on top of Promises. Always use try...catch for robust error handling."
      },
      {
        id: "c1-l4",
        title: "Building Dynamic Single Page Architectures",
        duration: "38 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        summary: "Learn state management, client-side routing, modular components, and persistent storage using LocalStorage.",
        notes: "SPAs avoid full page refreshes by updating the DOM dynamically via client-side routing and reactive UI components."
      },
      {
        id: "c1-l5",
        title: "Backend Integration, RESTful Endpoints & Deployment",
        duration: "45 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        summary: "Connecting frontend with Node.js/Express REST APIs, handling JSON requests, and deploying to cloud production.",
        notes: "REST principles include standard HTTP methods: GET, POST, PUT, DELETE. Always sanitize inputs, validate payloads, and configure CORS headers correctly."
      }
    ]
  },
  {
    id: "course-2",
    title: "Python for Data Science & Machine Learning",
    category: "Artificial Intelligence",
    level: "Beginner to Intermediate",
    rating: 4.95,
    reviewCount: 2150,
    duration: "18.0 Hours",
    totalLessons: 5,
    instructor: {
      name: "Dr. Sarah Chen",
      title: "AI Research Scientist & Stanford Alum",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
    },
    thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&auto=format&fit=crop&q=80",
    description: "Learn Python from scratch to advanced data analysis, NumPy vectorization, Pandas dataframes, Matplotlib visualization, and core Machine Learning algorithms.",
    syllabus: [
      {
        id: "c2-l1",
        title: "Python Core Essentials & Data Structures",
        duration: "30 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
        summary: "Lists, dictionaries, tuples, sets, list comprehensions, and functional programming constructs in Python.",
        notes: "Python lists are mutable, tuples are immutable. Dictionaries offer O(1) average lookup. List comprehensions offer concise syntax: [x**2 for x in nums if x % 2 == 0]."
      },
      {
        id: "c2-l2",
        title: "NumPy Arrays & High Performance Vector Math",
        duration: "36 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        summary: "N-dimensional arrays, broadcasting, vector arithmetic, linear algebra operations, and slicing.",
        notes: "NumPy arrays (ndarrays) are stored contiguously in memory, making them up to 50x faster than standard Python lists."
      },
      {
        id: "c2-l3",
        title: "Pandas DataFrames & Real-world Data Wrangling",
        duration: "48 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        summary: "Data cleaning, missing value imputation, group-by aggregations, merging datasets, and time-series analysis.",
        notes: "Use df.dropna() or df.fillna() for null values. Use df.groupby('col').mean() for aggregation. df.describe() gives statistical distribution."
      },
      {
        id: "c2-l4",
        title: "Exploratory Data Analysis & Visualization",
        duration: "32 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4",
        summary: "Building publication-ready charts using Matplotlib and Seaborn: histograms, heatmaps, and scatter plots.",
        notes: "Heatmaps show correlation matrices. Box plots identify outliers and IQR. Pairplots visualize multi-variable relationships."
      },
      {
        id: "c2-l5",
        title: "Supervised Learning: Regression & Classification",
        duration: "55 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        summary: "Train/test split, Linear Regression, Logistic Regression, Decision Trees, and model evaluation metrics (MSE, F1-Score).",
        notes: "Always split data into train and test sets to prevent overfitting. Evaluate classification models with Precision, Recall, and AUC-ROC."
      }
    ]
  },
  {
    id: "course-3",
    title: "Advanced Engineering Mathematics & Calculus",
    category: "Mathematics",
    level: "Intermediate",
    rating: 4.85,
    reviewCount: 890,
    duration: "16.0 Hours",
    totalLessons: 4,
    instructor: {
      name: "Prof. Marcus Evans",
      title: "Mathematics Chair & Author",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
    },
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80",
    description: "Comprehensive journey through differential calculus, multivariable integration, vector spaces, and differential equations for STEM students.",
    syllabus: [
      {
        id: "c3-l1",
        title: "Limits, Continuity & Derivative Rules",
        duration: "40 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
        summary: "Formal limit definitions, L'Hopital's rule, product/quotient/chain rules, and tangent rate of change.",
        notes: "Derivative represents instantaneous rate of change: f'(x) = lim(h->0) [f(x+h) - f(x)]/h."
      },
      {
        id: "c3-l2",
        title: "Integration Techniques & Fundamental Theorem of Calculus",
        duration: "45 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
        summary: "Integration by parts, trigonometric substitutions, partial fractions, and area under curves.",
        notes: "Integration by parts: integral(u dv) = u*v - integral(v du)."
      },
      {
        id: "c3-l3",
        title: "Multivariable Calculus: Gradients & Multiple Integrals",
        duration: "50 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        summary: "Partial derivatives, gradient vector, directional derivatives, and double/triple integrals.",
        notes: "The gradient vector grad(f) points in the direction of greatest rate of increase."
      },
      {
        id: "c3-l4",
        title: "First & Second Order Differential Equations",
        duration: "48 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        summary: "Separation of variables, integrating factors, homogeneous equations, and harmonic oscillators.",
        notes: "First order linear ODE: dy/dx + P(x)y = Q(x). Integrating factor I(x) = exp(integral(P(x)dx))."
      }
    ]
  },
  {
    id: "course-4",
    title: "Quantum Physics & Modern Mechanics",
    category: "Science",
    level: "Advanced",
    rating: 4.92,
    reviewCount: 740,
    duration: "12.0 Hours",
    totalLessons: 4,
    instructor: {
      name: "Dr. Elena Rostova",
      title: "Theoretical Physicist & CERN Visiting Fellow",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80"
    },
    thumbnail: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80",
    description: "Explore wave-particle duality, Schrödinger wave equation, quantum entanglement, Planck's constant, and atomic models.",
    syllabus: [
      {
        id: "c4-l1",
        title: "Wave-Particle Duality & Photoelectric Effect",
        duration: "35 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        summary: "Einstein's photoelectric equation, de Broglie wavelength, and double slit electron interference experiments.",
        notes: "Light behaves as both a wave and a stream of discrete photons: E = h * f. De Broglie wavelength: lambda = h / p."
      },
      {
        id: "c4-l2",
        title: "Heisenberg Uncertainty Principle & Wave Functions",
        duration: "42 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        summary: "Understanding fundamental limits of measurement: Delta(x) * Delta(p) >= h-bar / 2, and probability density.",
        notes: "You cannot simultaneously measure exact position and momentum with arbitrary precision."
      },
      {
        id: "c4-l3",
        title: "The Schrödinger Equation & Particle in a Box",
        duration: "55 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        summary: "Time-dependent and time-independent Schrödinger equations, infinite potential well, and quantized energy states.",
        notes: "H * Psi = E * Psi. Energy eigenvalues: E_n = (n^2 * pi^2 * hbar^2) / (2 * m * L^2)."
      },
      {
        id: "c4-l4",
        title: "Quantum Tunneling & Quantum Computing Foundations",
        duration: "46 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
        summary: "Transmission coefficients, nuclear alpha decay, scanning tunneling microscopy, and qubit superposition.",
        notes: "Particles have a non-zero probability of penetrating a barrier higher than their kinetic energy."
      }
    ]
  },
  {
    id: "course-5",
    title: "Cybersecurity & Ethical Hacking Essentials",
    category: "Computer Science",
    level: "Beginner",
    rating: 4.88,
    reviewCount: 1420,
    duration: "11.5 Hours",
    totalLessons: 4,
    instructor: {
      name: "Alex Vance",
      title: "Certified Ethical Hacker (CEH) & Red Team Lead",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
    },
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    description: "Learn defensive cybersecurity, network scanning, OWASP Top 10 vulnerabilities, cryptography basics, and penetration testing.",
    syllabus: [
      {
        id: "c5-l1",
        title: "Network Protocols & Port Scanning (Nmap)",
        duration: "30 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        summary: "TCP 3-way handshake, OSI 7-layer model, Wireshark packet capture, and reconnaissance.",
        notes: "TCP handshake: SYN -> SYN-ACK -> ACK. Port 80 (HTTP), 443 (HTTPS), 22 (SSH), 53 (DNS)."
      },
      {
        id: "c5-l2",
        title: "Web Application Security & OWASP Top 10",
        duration: "45 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        summary: "SQL Injection, Cross-Site Scripting (XSS), CSRF, Broken Object Level Authorization, and defense strategies.",
        notes: "Always use parameterized prepared statements to prevent SQLi. Sanitize user input."
      },
      {
        id: "c5-l3",
        title: "Modern Cryptography: RSA, AES & Hashing",
        duration: "38 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4",
        summary: "Symmetric vs Asymmetric encryption, Public-Key infrastructure, TLS certificates, and password hashing.",
        notes: "AES-256 is the gold standard for symmetric encryption. RSA uses large prime factorization."
      },
      {
        id: "c5-l4",
        title: "Defensive Hardening & Incident Response",
        duration: "40 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        summary: "Firewalls, Intrusion Detection Systems (Snort), Zero Trust architecture, and incident handling protocols.",
        notes: "Defense-in-depth ensures that multiple layers of security controls protect crucial assets."
      }
    ]
  },
  {
    id: "course-6",
    title: "Data Structures & Algorithms in Java & C++",
    category: "Programming",
    level: "Intermediate",
    rating: 4.97,
    reviewCount: 3100,
    duration: "22.0 Hours",
    totalLessons: 4,
    instructor: {
      name: "Prof. Rajesh Sharma",
      title: "Competitive Programming Grandmaster",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80"
    },
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    description: "Conquer coding interviews with mastery over Arrays, Trees, Graphs, Dynamic Programming, Big-O analysis, and recursion patterns.",
    syllabus: [
      {
        id: "c6-l1",
        title: "Asymptotic Analysis & Big-O Notation",
        duration: "28 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
        summary: "Time and Space complexity, Best/Average/Worst case analysis, amortized time.",
        notes: "O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n)."
      },
      {
        id: "c6-l2",
        title: "Binary Trees, BSTs & AVL Self-Balancing Trees",
        duration: "50 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
        summary: "Tree traversals (Inorder, Preorder, Postorder, Level-Order), insertion, deletion, and rotation logic.",
        notes: "In a BST, left < root < right. Inorder traversal yields sorted elements."
      },
      {
        id: "c6-l3",
        title: "Graph Traversal: BFS, DFS & Dijkstra's Algorithm",
        duration: "52 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        summary: "Adjacency lists, Queue-based BFS, Recursive DFS, Cycle detection, and shortest path in weighted graphs.",
        notes: "BFS finds shortest paths in unweighted graphs. Dijkstra's algorithm uses Priority Queue."
      },
      {
        id: "c6-l4",
        title: "Dynamic Programming: Memoization & Tabulation",
        duration: "60 mins",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        summary: "Overlapping subproblems, optimal substructure, 0/1 Knapsack, Longest Common Subsequence, and Coin Change.",
        notes: "Memoization is top-down caching. Tabulation is bottom-up table filling."
      }
    ]
  }
];

const DEFAULT_MATERIALS = [
  {
    id: "mat-1",
    title: "Complete Python Programming Comprehensive Revision Notes",
    subject: "Computer Science",
    type: "PDF Notes",
    pages: 24,
    fileSize: "3.8 MB",
    description: "Condensed cheat-sheet and revision handbook covering syntax, OOP, generators, decorators, exception handling, and standard libraries.",
    content: "=== SMART EDUCATION SYSTEM: PYTHON STUDY GUIDE ===\n\n1. VARIABLES & DATA TYPES\n- Python is dynamically typed: int, float, str, bool, list, tuple, dict, set.\n- Mutable: lists, dicts, sets.\n- Immutable: int, float, str, tuple.\n\n2. FUNCTIONS & SCOPE\n- def func(*args, **kwargs):\n- LEGB Rule: Local -> Enclosing -> Global -> Built-in.\n\n3. OOP ESSENTIALS\n- class definition with __init__ constructor.\n- Polymorphism, Encapsulation, and Inheritance."
  },
  {
    id: "mat-2",
    title: "Calculus & Linear Algebra Formula Sheet & Solved Examples",
    subject: "Mathematics",
    type: "PDF Notes",
    pages: 18,
    fileSize: "2.4 MB",
    description: "Essential calculus derivatives, integrals, trigonometric identities, matrix transformations, and eigenvalues formula handbook.",
    content: "=== SMART EDUCATION SYSTEM: CALCULUS HANDBOOK ===\n\n1. DERIVATIVES\n- d/dx [x^n] = n * x^(n-1)\n- d/dx [sin x] = cos x\n- d/dx [e^x] = e^x\n- Product Rule: (uv)' = u'v + uv'\n- Quotient Rule: (u/v)' = (u'v - uv') / v^2\n\n2. INTEGRALS\n- integral(x^n dx) = (x^(n+1))/(n+1) + C\n- integral(1/x dx) = ln|x| + C"
  },
  {
    id: "mat-3",
    title: "2024 University Board Exam Question Paper: Data Structures & Algorithms",
    subject: "Computer Science",
    type: "Previous Papers",
    pages: 8,
    fileSize: "1.9 MB",
    description: "Full official 2024 semester examination paper with question breakdown, point distribution, and model answer keys.",
    content: "=== 2024 BOARD EXAM QUESTION PAPER: DSA ===\n\nTime: 3 Hours | Total Marks: 100\n\n1. Explain time complexity of Quick Sort vs Merge Sort.\n2. State conditions for Stack Overflow and Underflow.\n3. Write Dijkstra algorithm step-by-step.\n4. Differentiate between AVL tree and Red-Black tree."
  },
  {
    id: "mat-4",
    title: "2023 Board Examination: Physics & Electromagnetic Theory",
    subject: "Physics",
    type: "Previous Papers",
    pages: 12,
    fileSize: "2.1 MB",
    description: "Complete 2023 previous question paper covering electrostatics, magnetostatics, Maxwell equations, and optics with full solutions.",
    content: "=== 2023 PHYSICS BOARD EXAMINATION ===\n\n1. State Gauss's Law in electrostatics.\n2. Derive electric field of infinite line of charge.\n3. Explain Faraday's Law and Lenz's Law of induction."
  },
  {
    id: "mat-5",
    title: "Top 50 Most Important Web Technologies Q&A (Interview & Exam)",
    subject: "Computer Science",
    type: "Important Q&A",
    pages: 15,
    fileSize: "2.8 MB",
    description: "Curated list of high-probability questions with expert verified answers, code snippets, and common pitfalls.",
    content: "=== TOP 50 IMPORTANT WEB TECH Q&A ===\n\nQ1: What is the Event Loop in JavaScript?\nA: Runtime mechanism handling non-blocking async tasks (Microtasks, Macrotasks) on a single thread.\n\nQ2: CSS Grid vs Flexbox?\nA: Flexbox is 1D (rows OR columns). Grid is 2D (rows AND columns)."
  },
  {
    id: "mat-6",
    title: "Machine Learning & Neural Networks Quick Revision Handbook",
    subject: "Artificial Intelligence",
    type: "PDF Notes",
    pages: 20,
    fileSize: "3.2 MB",
    description: "Supervised, unsupervised algorithms, backpropagation math, activation functions (ReLU, Sigmoid, Softmax), and loss functions.",
    content: "=== ML CONCISE CHEATSHEET ===\n\n1. LOSS FUNCTIONS\n- MSE: 1/N * sum((y - y_hat)^2)\n- Binary Cross-Entropy for 2-class classification.\n\n2. ACTIVATIONS\n- ReLU: max(0, x)\n- Softmax: Converts logits into probability distribution."
  }
];

const DEFAULT_EXAMS = [
  {
    id: "exam-1",
    title: "Python Programming & Algorithms Mastery",
    category: "Computer Science",
    durationMinutes: 10,
    totalMarks: 100,
    passingMarks: 60,
    description: "Test your mastery over Python data structures, algorithms, syntax nuance, and object-oriented principles.",
    questions: [
      {
        id: "q1-1",
        question: "What is the output of bool([]) and bool([0]) in Python?",
        options: ["False and True", "True and False", "False and False", "True and True"],
        correctIndex: 0,
        explanation: "An empty list [] evaluates to False, whereas a non-empty list [0] has length 1 and evaluates to True."
      },
      {
        id: "q1-2",
        question: "What is the average time complexity of searching for an element in a Python dictionary?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
        correctIndex: 2,
        explanation: "Python dictionaries are implemented as hash tables, providing average O(1) time complexity for key lookups."
      },
      {
        id: "q1-3",
        question: "Which of the following data structures is immutable in Python?",
        options: ["List", "Dictionary", "Set", "Tuple"],
        correctIndex: 3,
        explanation: "Tuples cannot be altered after creation, making them immutable."
      },
      {
        id: "q1-4",
        question: "What keyword is used to create a generator function in Python?",
        options: ["return", "yield", "generate", "produce"],
        correctIndex: 1,
        explanation: "The yield keyword pauses function execution and returns a generator iterator value."
      },
      {
        id: "q1-5",
        question: "What will [x * 2 for x in range(5) if x % 2 == 0] evaluate to?",
        options: ["[0, 2, 4]", "[0, 4, 8]", "[2, 6, 10]", "[0, 1, 2, 3, 4]"],
        correctIndex: 1,
        explanation: "Even values in range(5) are 0, 2, 4. Multiplying each by 2 yields [0, 4, 8]."
      },
      {
        id: "q1-6",
        question: "Which method is called automatically when an instance of a Python class is instantiated?",
        options: ["__new__", "__start__", "__init__", "__create__"],
        correctIndex: 2,
        explanation: "__init__ is the constructor method used to initialize an instance's state."
      },
      {
        id: "q1-7",
        question: "What does the *args syntax in a function definition indicate?",
        options: ["Pointer reference", "Variable positional arguments as a tuple", "Keyword arguments as a dict", "Default values"],
        correctIndex: 1,
        explanation: "*args collects variable positional arguments into a tuple."
      },
      {
        id: "q1-8",
        question: "What is the purpose of the 'with' statement in Python?",
        options: ["Looping through a file", "Asynchronous coroutines", "Automatic context management and resource release", "Declaring globals"],
        correctIndex: 2,
        explanation: "'with' invokes the context manager protocol (__enter__ and __exit__), ensuring cleanup like closing files."
      },
      {
        id: "q1-9",
        question: "What is the output of type(lambda x: x)?",
        options: ["<class 'function'>", "<class 'lambda'>", "<class 'object'>", "<class 'anonymous'>"],
        correctIndex: 0,
        explanation: "Lambdas in Python are first-class instances of <class 'function'>."
      },
      {
        id: "q1-10",
        question: "Which built-in module is used to accurately measure execution time of small code snippets in Python?",
        options: ["datetime", "time", "timeit", "profiler"],
        correctIndex: 2,
        explanation: "timeit is specifically designed for accurately benchmarking short Python statements."
      }
    ]
  },
  {
    id: "exam-2",
    title: "Calculus & Linear Algebra Final Test",
    category: "Mathematics",
    durationMinutes: 12,
    totalMarks: 100,
    passingMarks: 60,
    description: "Assess your skills in differential calculus, definite integrals, and matrix transformations.",
    questions: [
      {
        id: "q2-1",
        question: "What is the derivative of f(x) = ln(3x^2)?",
        options: ["2/x", "6x", "1/(3x^2)", "3/x"],
        correctIndex: 0,
        explanation: "ln(3x^2) = ln(3) + 2*ln(x). Derivative of 2*ln(x) is 2/x."
      },
      {
        id: "q2-2",
        question: "Evaluate integral from 0 to 1 of (3x^2 + 2x) dx:",
        options: ["1", "2", "3", "5"],
        correctIndex: 1,
        explanation: "Antiderivative is x^3 + x^2. Evaluated from 0 to 1: (1 + 1) - 0 = 2."
      },
      {
        id: "q2-3",
        question: "What is the determinant of matrix [[4, 2], [3, 5]]?",
        options: ["14", "20", "6", "26"],
        correctIndex: 0,
        explanation: "Determinant = (4 * 5) - (2 * 3) = 20 - 6 = 14."
      },
      {
        id: "q2-4",
        question: "If matrix A is invertible, what is det(A^-1)?",
        options: ["-det(A)", "1 / det(A)", "det(A)^2", "0"],
        correctIndex: 1,
        explanation: "det(A * A^-1) = det(I) = 1, so det(A^-1) = 1 / det(A)."
      },
      {
        id: "q2-5",
        question: "What is the limit of (sin x) / x as x approaches 0?",
        options: ["0", "Undefined", "1", "Infinity"],
        correctIndex: 2,
        explanation: "This fundamental trigonometric limit evaluates to 1."
      },
      {
        id: "q2-6",
        question: "What represents the direction of steepest ascent for multivariable f(x, y)?",
        options: ["Tangent vector", "Gradient vector grad(f)", "Laplacian", "Curl"],
        correctIndex: 1,
        explanation: "The gradient vector grad(f) points in the direction of greatest rate of increase."
      },
      {
        id: "q2-7",
        question: "What is the integral of e^(2x) dx?",
        options: ["2 * e^(2x) + C", "(1/2) * e^(2x) + C", "e^(2x) + C", "x * e^(2x) + C"],
        correctIndex: 1,
        explanation: "By u-substitution u = 2x, du = 2 dx, integral is (1/2) * e^(2x) + C."
      },
      {
        id: "q2-8",
        question: "Two non-zero vectors u and v are orthogonal if and only if their dot product u . v is:",
        options: ["1", "-1", "0", "Infinity"],
        correctIndex: 2,
        explanation: "u . v = |u||v| cos(90 deg) = 0."
      },
      {
        id: "q2-9",
        question: "What are the eigenvalues of identity matrix I of size 3x3?",
        options: ["0, 0, 0", "1, 1, 1", "1, 2, 3", "-1, 0, 1"],
        correctIndex: 1,
        explanation: "Since I * v = 1 * v, all eigenvalues are 1."
      },
      {
        id: "q2-10",
        question: "What is the second derivative of f(x) = sin(x)?",
        options: ["cos(x)", "-sin(x)", "-cos(x)", "sin(x)"],
        correctIndex: 1,
        explanation: "f'(x) = cos(x), f''(x) = -sin(x)."
      }
    ]
  },
  {
    id: "exam-3",
    title: "Modern Web Development Fundamentals",
    category: "Computer Science",
    durationMinutes: 10,
    totalMarks: 100,
    passingMarks: 60,
    description: "Evaluate understanding of modern HTML5, CSS Flexbox & Grid, JavaScript Promises, and REST architecture.",
    questions: [
      {
        id: "q3-1",
        question: "Which HTML5 tag is the most semantic choice for self-contained blog posts or news items?",
        options: ["<section>", "<div>", "<article>", "<main>"],
        correctIndex: 2,
        explanation: "<article> represents an independently distributable composition."
      },
      {
        id: "q3-2",
        question: "In CSS Flexbox, which property aligns items along the cross axis?",
        options: ["justify-content", "align-items", "flex-direction", "align-content"],
        correctIndex: 1,
        explanation: "align-items aligns along the cross axis, while justify-content aligns along main axis."
      },
      {
        id: "q3-3",
        question: "Which JavaScript method turns a JSON string into a JavaScript object?",
        options: ["JSON.stringify()", "JSON.toObject()", "JSON.parse()", "JSON.convert()"],
        correctIndex: 2,
        explanation: "JSON.parse() parses a JSON string into an object."
      },
      {
        id: "q3-4",
        question: "What is the primary difference between localStorage and sessionStorage?",
        options: ["localStorage stores only strings", "localStorage persists after tab closes, sessionStorage clears when tab closes", "Size limit difference", "Security differences"],
        correctIndex: 1,
        explanation: "localStorage persists indefinitely; sessionStorage expires when browser tab closes."
      },
      {
        id: "q3-5",
        question: "Which HTTP status code signifies that a resource was successfully created on the server?",
        options: ["200 OK", "201 Created", "204 No Content", "304 Not Modified"],
        correctIndex: 1,
        explanation: "201 Created indicates successful resource creation."
      },
      {
        id: "q3-6",
        question: "What does the async keyword placed before a function declaration do?",
        options: ["Runs in web worker", "Forces the function to return a Promise", "Prevents concurrency", "Makes vars immutable"],
        correctIndex: 1,
        explanation: "async functions wrap return values in a resolved Promise and allow using await."
      },
      {
        id: "q3-7",
        question: "Which CSS unit is relative to the font-size of the root element (<html>)?",
        options: ["em", "rem", "vh", "%"],
        correctIndex: 1,
        explanation: "rem stands for root em, relative to root element font size."
      },
      {
        id: "q3-8",
        question: "What is the purpose of CORS (Cross-Origin Resource Sharing)?",
        options: ["Encrypt packets", "Browser mechanism controlling requests to external domains", "Compress HTTP", "Speed up DNS"],
        correctIndex: 1,
        explanation: "CORS controls cross-domain resource requests securely."
      },
      {
        id: "q3-9",
        question: "What does the JavaScript spread operator ... do when applied to an array?",
        options: ["Reverses array", "Expands array elements into individual arguments/elements", "Deletes falsy values", "Sorts items"],
        correctIndex: 1,
        explanation: "The spread operator ... expands iterables into elements."
      },
      {
        id: "q3-10",
        question: "Which array method creates a new array with elements that pass a test callback?",
        options: ["map()", "reduce()", "filter()", "find()"],
        correctIndex: 2,
        explanation: "filter() creates a new array with items passing condition."
      }
    ]
  }
];

const DEFAULT_FEEDBACKS = [
  {
    id: "fb-1",
    name: "Sophia Martinez",
    role: "Computer Science Student",
    rating: 5,
    message: "The interactive video player and instant AI tutor helped me ace my semester finals! The notes and previous papers were right on point.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    date: "2026-11-01"
  },
  {
    id: "fb-2",
    name: "Liam Davies",
    role: "Aspiring Data Scientist",
    rating: 5,
    message: "The online exam simulator with immediate result evaluation and explanations is a game changer. The purple and blue UI is gorgeous and easy to navigate.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    date: "2026-10-29"
  },
  {
    id: "fb-3",
    name: "Amina Al-Mansoor",
    role: "High School Senior",
    rating: 5,
    message: "I love how easily I can download PDF revision guides. The AI explains tricky math formulas without any confusing jargon. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    date: "2026-10-25"
  }
];

const DEFAULT_USER = {
  id: "usr_demo",
  name: "Alex Johnson",
  email: "alex.student@smartedu.com",
  password: "password123",
  role: "student",
  grade: "Undergraduate - 2nd Year",
  major: "Computer Science & AI",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  streak: 7,
  studyHours: 42.5,
  enrolledCourses: [
    {
      courseId: "course-1",
      completedLessons: ["c1-l1", "c1-l2", "c1-l3"],
      progress: 60
    },
    {
      courseId: "course-2",
      completedLessons: ["c2-l1", "c2-l2"],
      progress: 40
    },
    {
      courseId: "course-4",
      completedLessons: ["c4-l1", "c4-l2", "c4-l3", "c4-l4"],
      progress: 100
    }
  ],
  examResults: [
    {
      examId: "exam-1",
      examTitle: "Python Programming & Algorithms Mastery",
      score: 90,
      totalQuestions: 10,
      correctAnswers: 9,
      timeSpent: "08:45",
      date: "2026-11-02",
      grade: "A+",
      status: "Passed"
    },
    {
      examId: "exam-2",
      examTitle: "Calculus & Linear Algebra Final Test",
      score: 80,
      totalQuestions: 10,
      correctAnswers: 8,
      timeSpent: "11:20",
      date: "2026-10-28",
      grade: "A",
      status: "Passed"
    }
  ],
  badges: [
    {
      id: "b1",
      title: "Fast Starter",
      icon: "fa-bolt",
      desc: "Enrolled in 3 courses in your first month"
    },
    {
      id: "b2",
      title: "Quiz Champion",
      icon: "fa-trophy",
      desc: "Scored 90%+ in Python Mastery Exam"
    },
    {
      id: "b3",
      title: "Consistent Learner",
      icon: "fa-fire",
      desc: "Achieved a 7-day continuous study streak"
    }
  ]
};

