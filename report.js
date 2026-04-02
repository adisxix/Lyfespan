import Bytez from "https://esm.sh/bytez.js";

const userData = {
firstName: localStorage.getItem('firstName') || 'User',
lastName: localStorage.getItem('lastName') || '',
dob: localStorage.getItem('dob') || '',
gender: localStorage.getItem('gender') || '',
city: localStorage.getItem('city') || '',
country: localStorage.getItem('country') || '',
heightValue: parseFloat(localStorage.getItem('heightValue')) || 0,
heightUnit: localStorage.getItem('heightUnit') || 'cm',
weightValue: parseFloat(localStorage.getItem('weightValue')) || 0,
weightUnit: localStorage.getItem('weightUnit') || 'kg',
diet: localStorage.getItem('diet') || '',
meals: localStorage.getItem('meals') || '',
workout: localStorage.getItem('workout') || '',
healthy: localStorage.getItem('healthy') || '',
disease: localStorage.getItem('disease') || '',
diseaseDetails: localStorage.getItem('diseaseDetails') || '',
};

document.getElementById('firstName').textContent = userData.firstName;

function calculateAge(dobString) {
const dob = new Date(dobString);
const today = new Date();
let age = today.getFullYear() - dob.getFullYear();
const monthDiff = today.getMonth() - dob.getMonth();
if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
age--;
}
return age;
}

function getHeightInCm() {
if (userData.heightUnit === 'cm') {
return userData.heightValue;
} else if (userData.heightUnit === 'ft-in') {
const parts = userData.heightValue.toString().split('.');
const feet = parseInt(parts[0]) || 0;
const inches = parseInt(parts[1]) || 0;
return (feet * 30.48) + (inches * 2.54);
}
return userData.heightValue;
}

function getWeightInKg() {
if (userData.weightUnit === 'kg') {
return userData.weightValue;
} else if (userData.weightUnit === 'lb') {
return userData.weightValue * 0.453592;
}
return userData.weightValue;
}

function calculateBMI() {
const heightInCm = getHeightInCm();
const heightInM = heightInCm / 100;
const weightInKg = getWeightInKg();
return (weightInKg / (heightInM * heightInM)).toFixed(1);
}

function calculateHealthScore() {
let score = 3;
const bmi = parseFloat(calculateBMI());
if (bmi >= 18.5 && bmi <= 24.9) score += 1;
else if (bmi >= 25 && bmi <= 29.9) score += 0.5;
else score -= 0.5;

if (userData.workout === 'weekly') score += 1;
else if (userData.workout === 'sometimes') score += 0.5;

if (userData.diet === 'veg' || userData.diet === 'vegan') score += 0.5;

if (userData.healthy === 'yes') score += 0.5;
else if (userData.healthy === 'no') score -= 0.5;

if (userData.disease === 'yes') score -= 0.5;

return Math.max(0, Math.min(5, score)).toFixed(1);
}

document.getElementById('bmiValue').textContent = calculateBMI() + ' (BMI)';

document.getElementById('healthScore').textContent = calculateHealthScore() + ' / 5';

function updateLiveCounter() {
const dobDate = new Date(userData.dob);
const now = new Date();

let years = now.getFullYear() - dobDate.getFullYear();
let months = now.getMonth() - dobDate.getMonth();
let days = now.getDate() - dobDate.getDate();
let hours = now.getHours();
let minutes = now.getMinutes();
let seconds = now.getSeconds();

if (days < 0) {
months--;
const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
days += prevMonth.getDate();
}

if (months < 0) {
years--;
months += 12;
}

const totalDays = Math.floor((now - dobDate) / (1000 * 60 * 60 * 24));
const weeks = Math.floor(totalDays / 7);
const daysInCurrentWeek = totalDays % 7;

const decades = Math.floor(years / 10);
const yearsInDecade = years % 10;

const shortText = decades + 'd ' + yearsInDecade + 'y ' + months + 'm ' + weeks + 'w ' + daysInCurrentWeek + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
const longText = decades + ' Decades, ' + yearsInDecade + ' Years, ' + months + ' Months, ' + weeks + ' Weeks, ' + daysInCurrentWeek + ' Days, ' + hours + ' Hours, ' + minutes + ' Minutes, ' + seconds + ' Seconds';

document.getElementById('liveCounterShort').textContent = shortText;
document.getElementById('liveCounterLong').textContent = longText;
}

updateLiveCounter();
setInterval(updateLiveCounter, 1000);

function calculateEstimatedYears() {
let baseLife = 75;

if (userData.gender === 'female') baseLife += 3;
if (userData.gender === 'male') baseLife -= 2;

if (userData.diet === 'veg') baseLife += 2;
if (userData.diet === 'vegan') baseLife += 3;

if (userData.workout === 'weekly') baseLife += 5;
if (userData.workout === 'sometimes') baseLife += 2;
if (userData.workout === 'rarely') baseLife -= 1;

if (userData.healthy === 'yes') baseLife += 5;
if (userData.healthy === 'maybe') baseLife += 2;
if (userData.healthy === 'no') baseLife -= 3;

if (userData.disease === 'yes') baseLife -= 4;

const currentAge = calculateAge(userData.dob);
const additionalYears = Math.max(baseLife - currentAge, 10);

return Math.round(additionalYears);
}

const estimatedYears = calculateEstimatedYears();
document.getElementById('estimatedYearsToLive').textContent = '~' + estimatedYears + ' years';

const BYTEZ_API_KEY = "d1d04d44ff2deef52ed1857aec0e5f71";
const sdk = new Bytez(BYTEZ_API_KEY);
const model = sdk.model("openai/gpt-4o-mini");

function renderFixedList(prefix, items) {
for (let i = 0; i < 5; i++) {
const node = document.getElementById(prefix + '-' + (i + 1));
if (node) {
node.textContent = items[i] || '';
}
}
}

function normalizeAiList(items) {
if (Array.isArray(items)) {
return items
.map((item) => (typeof item === 'string' ? item.trim() : ''))
.filter((item) => item.length > 0)
.slice(0, 5);
}
if (typeof items === 'string') {
return items
.split(/\n+/)
.map((item) => item.replace(/^[\s\d.\-*)]+/, '').trim())
.filter((item) => item.length > 0)
.slice(0, 5);
}
return [];
}

async function callBytezAI(messages) {
const { error, output } = await model.run(messages);
console.log("Bytez SDK run:", { error, output });

if (error) {
console.error("Bytez SDK error:", error);
throw new Error(error.message || "Unknown error from Bytez");
}

if (typeof output === 'string') return output;

if (output && output.choices && Array.isArray(output.choices) && output.choices[0]) {
if (output.choices[0].message && output.choices[0].message.content) {
return output.choices[0].message.content;
}
}

if (Array.isArray(output)) {
const first = output[0];
if (typeof first === 'string') return first;
if (first && first.content) return first.content;
if (first && first.text) return first.text;
if (first && first.message && first.message.content) return first.message.content;
}

if (output && output.content) return output.content;
if (output && output.text) return output.text;

return typeof output === 'object' ? JSON.stringify(output) : String(output);
}

async function applyAiReport() {
const promptPayload = {
firstName: userData.firstName,
dob: userData.dob,
age: calculateAge(userData.dob),
gender: userData.gender,
city: userData.city,
country: userData.country,
bmi: calculateBMI(),
healthScore: calculateHealthScore(),
diet: userData.diet,
mealsPerDay: userData.meals,
workout: userData.workout,
healthy: userData.healthy,
disease: userData.disease,
diseaseDetails: userData.diseaseDetails,
};

const messages = [
{
role: "system",
content: `You are a health and history API. Return ONLY valid JSON, no markdown. Shape: {"estimatedYears":number,"suggestions":["string","string","string","string","string"],"facts":["string","string","string","string","string"]}.
Rules for Facts:
1: Look at the "dob" field (Date of Birth). Extract the exact Month and Day. State an interesting historical event or festival that happened on this specific date in the world.
2: Name a highly famous person in the world who precisely shares this same exact birthday matching the "dob".
3: Factually estimate how many times the user has breathed and how many times their heart has beaten in their life so far based on their age.
4 & 5: State mind-blowing biological/mathematical facts about their exact lifetime. Examples: "You have spent X years of your life sleeping", "You have eaten approx X meals", "You have lived through X seasons or full moons". DO NOT give advice or talk about their city's air quality/weather.
Rules for length: CRITICAL: Keep every single suggestion and fact strictly between 10 to 18 words maximum. Get straight to the point. The text must be concise so it does not overflow the UI boxes.`
},
{
role: "user",
content: "Analyze this user health profile and return the JSON response: " + JSON.stringify(promptPayload)
}
];

const AI_TIMEOUT_MS = 25000;

try {
const aiPromise = callBytezAI(messages);
const timeoutPromise = new Promise((_, reject) =>
setTimeout(() => reject(new Error('AI request timed out')), AI_TIMEOUT_MS)
);

const raw = await Promise.race([aiPromise, timeoutPromise]);

if (!raw) {
document.getElementById('estimatedYearsToLive').textContent = 'Error';
renderFixedList('suggestion', ['Error loading suggestions']);
renderFixedList('fact', ['Error loading facts']);
return;
}

const jsonStart = raw.indexOf('{');
const jsonEnd = raw.lastIndexOf('}');
if (jsonStart === -1 || jsonEnd === -1) {
document.getElementById('estimatedYearsToLive').textContent = 'Error';
renderFixedList('suggestion', ['Error loading suggestions']);
renderFixedList('fact', ['Error loading facts']);
return;
}

const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));

const aiYears = Number(parsed.estimatedYears);
if (!Number.isNaN(aiYears) && aiYears > 0) {
document.getElementById('estimatedYearsToLive').textContent = '~' + Math.round(aiYears) + ' years';
}

const aiSuggestions = normalizeAiList(parsed.suggestions ?? parsed.suggestion ?? parsed.recommendations);
const aiFacts = normalizeAiList(parsed.facts ?? parsed.fact ?? parsed.insights);

if (aiSuggestions.length > 0) {
renderFixedList('suggestion', aiSuggestions);
}

if (aiFacts.length > 0) {
renderFixedList('fact', aiFacts);
}
} catch (err) {
console.error('AI failed:', err);
document.getElementById('estimatedYearsToLive').textContent = 'Error';
renderFixedList('suggestion', ['Error loading suggestions']);
renderFixedList('fact', ['Error loading facts']);
}
}

applyAiReport();

document.getElementById('resetButton').addEventListener('click', () => {
localStorage.clear();
window.location.href = 'index.html';
});

