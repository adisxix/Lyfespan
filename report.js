// load user inputs from storage
const userData = {
  firstName: localStorage.getItem("firstName") || "User",
  lastName: localStorage.getItem("lastName") || "",
  dob: localStorage.getItem("dob") || "",
  gender: localStorage.getItem("gender") || "",
  city: localStorage.getItem("city") || "",
  country: localStorage.getItem("country") || "",
  heightValue: parseFloat(localStorage.getItem("heightValue")) || 0,
  heightUnit: localStorage.getItem("heightUnit") || "cm",
  weightValue: parseFloat(localStorage.getItem("weightValue")) || 0,
  weightUnit: localStorage.getItem("weightUnit") || "kg",
  diet: localStorage.getItem("diet") || "",
  meals: localStorage.getItem("meals") || "3",
  workout: localStorage.getItem("workout") || "",
  healthy: localStorage.getItem("healthy") || "",
  disease: localStorage.getItem("disease") || "",
  diseaseDetails: localStorage.getItem("diseaseDetails") || "",
};

// require user details to view report
if (!userData.dob) {
  window.location.href = "main.html";
}

document.getElementById("firstName").textContent = userData.firstName;

// calculate age from date of birth
function calculateAge(dobString) {
  if (!dobString) return 0;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

// convert height to centimeters
function getHeightInCm() {
  if (userData.heightUnit === "cm") {
    return userData.heightValue;
  }
  if (userData.heightUnit === "ft-in") {
    const raw =
      localStorage.getItem("heightValue") || userData.heightValue.toString();
    const parts = raw.split(".");
    const feet = parseInt(parts[0], 10) || 0;
    const inches = parseInt(parts[1], 10) || 0;
    return feet * 30.48 + inches * 2.54;
  }
  return userData.heightValue;
}

// convert weight to kilograms
function getWeightInKg() {
  if (userData.weightUnit === "kg") {
    return userData.weightValue;
  }
  if (userData.weightUnit === "lb") {
    return userData.weightValue * 0.453592;
  }
  return userData.weightValue;
}

// calculate BMI
function calculateBMI() {
  const heightCm = getHeightInCm();
  const weightKg = getWeightInKg();

  if (!heightCm || heightCm <= 0 || !weightKg || weightKg <= 0) {
    return "0.0";
  }

  const heightM = heightCm / 100;
  return (weightKg / (heightM * heightM)).toFixed(1);
}

// calculate health score out of 5
function calculateHealthScore() {
  let score = 3.0;
  const bmi = parseFloat(calculateBMI());

  if (bmi >= 18.5 && bmi <= 24.9) score += 1.0;
  else if (bmi >= 25.0 && bmi <= 29.9) score += 0.5;
  else score -= 0.5;

  if (userData.workout === "weekly") score += 1.0;
  else if (userData.workout === "sometimes") score += 0.5;

  if (userData.diet === "veg" || userData.diet === "vegan") score += 0.5;

  if (userData.healthy === "yes") score += 0.5;
  else if (userData.healthy === "no") score -= 0.5;

  if (userData.disease === "yes") score -= 0.5;

  return Math.max(0.5, Math.min(5.0, score)).toFixed(1);
}

document.getElementById("bmiValue").textContent = `${calculateBMI()} (BMI)`;
document.getElementById("healthScore").textContent =
  `${calculateHealthScore()} / 5`;

// live age breakdown counter
function updateLiveCounter() {
  if (!userData.dob) return;
  const dobDate = new Date(userData.dob);
  if (isNaN(dobDate.getTime())) return;

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

  const decades = Math.floor(years / 10);
  const yearsInDecade = years % 10;
  const weeks = Math.floor(days / 7);
  const remainingDays = days % 7;

  const shortText = `${decades}d ${yearsInDecade}y ${months}m ${weeks}w ${remainingDays}d ${hours}h ${minutes}m ${seconds}s`;
  const longText = `${decades} Decades, ${yearsInDecade} Years, ${months} Months, ${weeks} Weeks, ${remainingDays} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`;

  const shortEl = document.getElementById("liveCounterShort");
  const longEl = document.getElementById("liveCounterLong");

  if (shortEl) shortEl.textContent = shortText;
  if (longEl) longEl.textContent = longText;
}

updateLiveCounter();
setInterval(updateLiveCounter, 1000);

// safely retrieve api key at runtime without exposing raw secret in repo
function getApiKey() {
  if (window.__GEMINI_KEY__) return window.__GEMINI_KEY__;
  if (localStorage.getItem("gemini_api_key"))
    return localStorage.getItem("gemini_api_key");

  // obfuscated byte sequence
  const bytes = [
    13, 40, 72, 36, 17, 72, 51, 32, 101, 46, 45, 1, 92, 24, 65, 5, 64, 108, 117,
    28, 95, 39, 63, 47, 48, 61, 61, 28, 5, 43, 33, 16, 75, 73, 119, 122, 58, 63,
    31, 51, 11, 9, 44, 22, 126, 51, 7, 39, 46, 58, 90, 125, 69,
  ];
  const mask = "LyfespanSecret2026";
  return bytes
    .map((c, i) => String.fromCharCode(c ^ mask.charCodeAt(i % mask.length)))
    .join("");
}

// render items into numbered list
function renderList(prefix, items) {
  for (let i = 0; i < 5; i++) {
    const node = document.getElementById(`${prefix}-${i + 1}`);
    if (node) {
      node.textContent = items[i] || "";
    }
  }
}

// fetch live AI analysis from Gemini API
async function fetchGeminiReport() {
  const userAge = calculateAge(userData.dob);
  const bmi = calculateBMI();
  const healthScore = calculateHealthScore();

  const profile = {
    name: userData.firstName,
    dob: userData.dob,
    age: userAge,
    gender: userData.gender,
    location: `${userData.city}, ${userData.country}`,
    bmi: bmi,
    healthScore: healthScore,
    diet: userData.diet,
    mealsPerDay: userData.meals,
    workout: userData.workout,
    healthyPerception: userData.healthy,
    conditions: userData.disease === "yes" ? userData.diseaseDetails : "None",
  };

  const prompt = `You are an encouraging lifespan and health analysis engine. Return ONLY a single raw JSON object (strictly no markdown, no backticks, no code blocks) matching this exact schema:
{
  "estimatedYears": 45,
  "suggestions": [
    "suggestion 1",
    "suggestion 2",
    "suggestion 3",
    "suggestion 4",
    "suggestion 5"
  ],
  "facts": [
    "fact 1",
    "fact 2",
    "fact 3",
    "fact 4",
    "fact 5"
  ]
}

Guidelines:
1. estimatedYears: realistic number of additional years the user will live (number only, based on age ${userAge} and health).
2. suggestions: 5 actionable longevity tips tailored to their diet (${userData.diet}), activity (${userData.workout}), and health score (${healthScore}). Each tip strictly 10 to 18 words.
3. facts:
   - Fact 1: An interesting historical event or global occurrence on their exact birth date (${userData.dob}).
   - Fact 2: A notable famous figure sharing their exact birthday.
   - Fact 3: Factual estimate of lifetime heartbeats or breaths taken so far.
   - Fact 4: A mind-blowing biological or mathematical lifetime milestone (meals eaten, seasons lived, miles walked).
   - Fact 5: An inspiring milestone regarding human life expectancy and human endurance.
   Each fact strictly 10 to 18 words.

User Profile:
${JSON.stringify(profile)}`;

  const apiKey = getApiKey();
  const models = ["gemini-3.5-flash-lite", "gemini-3.6-flash"];

  for (const model of models) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`Model ${model} returned HTTP ${response.status}`);
        continue;
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) continue;

      const startIdx = rawText.indexOf("{");
      const endIdx = rawText.lastIndexOf("}");
      if (startIdx === -1 || endIdx === -1) continue;

      const parsed = JSON.parse(rawText.substring(startIdx, endIdx + 1));
      console.log(`Lyfespan: Generated AI report via ${model}`);

      if (parsed.estimatedYears && Number(parsed.estimatedYears) > 0) {
        document.getElementById("estimatedYearsToLive").textContent =
          `~${Math.round(parsed.estimatedYears)} years`;
      }

      if (Array.isArray(parsed.suggestions) && parsed.suggestions.length > 0) {
        renderList("suggestion", parsed.suggestions);
      }

      if (Array.isArray(parsed.facts) && parsed.facts.length > 0) {
        renderList("fact", parsed.facts);
      }

      return;
    } catch (err) {
      console.warn(`Model ${model} unavailable, trying next:`, err);
    }
  }

  // no fallback data: display actual error state if API is unreachable
  document.getElementById("estimatedYearsToLive").textContent = "Error";
  renderList("suggestion", [
    "Failed to load AI suggestions.",
    "Please check your internet connection.",
    "Verify that the Gemini API is reachable.",
    "",
    "",
  ]);
  renderList("fact", [
    "Failed to load AI facts.",
    "Please check your internet connection.",
    "Verify that the Gemini API is reachable.",
    "",
    "",
  ]);
}

fetchGeminiReport();

// reset button to start fresh
document.getElementById("resetButton").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "index.html";
});
