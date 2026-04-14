const fs = require('fs');

function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

const companies = ["Google", "Microsoft", "Amazon", "Apple", "Netflix", "Meta", "Tesla", "Adobe", "Uber", "Airbnb", "Stripe", "Dropbox", "Lyft", "Twitter", "Pinterest", "Slack", "Square", "Snap", "Oracle", "IBM", "Intel", "Cisco", "Salesforce"];
const roles = ["Software Engineer", "Data Scientist", "Product Manager", "Machine Learning Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer", "Cloud Architect", "Security Engineer", "Data Analyst", "UI/UX Designer", "Blockchain Developer", "AI Engineer", "Big Data Engineer"];
const skills = ["Python", "Java", "JavaScript", "C++", "Go", "Rust", "React", "Node.js", "AWS", "SQL", "NoSQL", "Docker", "Kubernetes", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Data Analysis", "System Design", "Agile", "GraphQL", "Next.js", "TypeScript", "Spark", "Hadoop", "Kafka"];
const locations = ["San Francisco", "New York", "Seattle", "Austin", "Boston", "Chicago", "Los Angeles", "London", "Toronto", "Berlin", "Bangalore", "Hyderabad", "Singapore", "Pune", "Remote", "Tokyo", "Dublin"];

console.log("Generating 1000 Companies...");
let data1 = "";
for(let i=0; i<1000; i++) {
    const comp = randomChoice(companies) + " " + randomChoice(["Inc", "Corp", "LLC", "Labs", "Studios", "Software", "Tech", ""]);
    const role = randomChoice(roles);
    const reqSkills = [randomChoice(skills), randomChoice(skills), randomChoice(skills), randomChoice(skills)].filter((v, i, a) => a.indexOf(v) === i).join("|");
    const rounds = randomInt(3, 7);
    const loc = randomChoice(locations);
    // Skewing package to higher numbers for optimistic data (10LPA to 50LPA)
    const pack = (Math.random() * 25 + 10 + (Math.random() > 0.7 ? 15 : 0)).toFixed(1); 
    const lvl = randomChoice(["Entry", "Mid", "Senior", "Lead", "Staff"]);
    data1 += `\n${comp},${role},${reqSkills},${rounds},${loc},${pack},${lvl}`;
}
fs.appendFileSync('Data1.txt', data1);

console.log("Generating 10000 Students...");
let data2 = "";
const firstNames = ["Alex", "Jordan", "Taylor", "Casey", "Morgan", "Riley", "Cameron", "Quinn", "Avery", "Skyler", "Sam", "Drew", "Jesse", "Jamie", "Hayden", "Peyton", "Dakota", "Reese", "Rowan", "Charlie", "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Riya", "Diya", "Ananya", "Ishita"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Patel", "Sharma", "Kumar", "Singh", "Reddy", "Rao", "Gupta", "Desai"];
const degrees = ["B.Sc Computer Science", "B.Sc Software Engineering", "B.Sc Data Science", "B.Tech Computer Science", "B.Tech IT", "M.Sc Computer Science", "M.Sc Data Science", "M.Tech AI"];
for(let i=0; i<10000; i++) {
    const name = randomChoice(firstNames) + " " + randomChoice(lastNames);
    const deg = randomChoice(degrees);
    const grad = randomChoice(["2025", "2025", "2026", "2026", "2026", "2027", "2027", "2028"]);
    const topSkills = [randomChoice(skills), randomChoice(skills), randomChoice(skills)].join("|");
    const projs = randomInt(3, 8);
    // Skew CGPA higher for positive graphs (average around 8.5)
    let cgpaRaw = 7.0 + Math.random() * 2.5 + (Math.random() > 0.6 ? 0.3 : 0);
    const cgpaClamped = Math.min(9.95, cgpaRaw).toFixed(2);
    const tRole = randomChoice(roles);
    data2 += `\n${name},${deg},${grad},${topSkills},${projs},${cgpaClamped},${tRole}`;
}
fs.appendFileSync('Data2.txt', data2);

console.log("Generating 5000 Alumni...");
let data3 = "";
for(let i=0; i<5000; i++) {
    const name = randomChoice(firstNames) + " " + randomChoice(lastNames);
    
    // Ensure highly increasing trend over years for optimistic graph (Exponential curve)
    let yearRand = Math.random();
    let year;
    if(yearRand < 0.02) year = 2018;
    else if(yearRand < 0.05) year = 2019;
    else if(yearRand < 0.10) year = 2020;
    else if(yearRand < 0.18) year = 2021;
    else if(yearRand < 0.28) year = 2022;
    else if(yearRand < 0.45) year = 2023;
    else if(yearRand < 0.70) year = 2024;
    else year = 2025;

    const cComp = randomChoice(companies);
    const pComps = randomChoice([randomChoice(companies), randomChoice(companies) + "|" + randomChoice(companies), "None"]);
    const timeline = randomChoice(["Intern->FTE", "SDE1->SDE2", "Grad->Analyst->DS", "Startup->BigTech", "Associate->Consultant", "Junior->Mid->Senior"]);
    data3 += `\n${name},${year},${cComp},${pComps},${timeline}`;
}
fs.appendFileSync('Data3.txt', data3);
console.log("All mocked datasets appended successfully!");
