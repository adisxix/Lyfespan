// form step elements
const steps = Array.from(document.querySelectorAll("[data-step]"));
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const submitButton = document.getElementById("submitButton");
const stepTitle = document.getElementById("stepTitle");
const loaderOverlay = document.getElementById("loaderOverlay");

// step 1 inputs
const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const dob = document.getElementById("dob");
const gender = document.getElementById("gender");
const city = document.getElementById("city");
const country = document.getElementById("country");

// step 2 inputs
const heightValue = document.getElementById("heightValue");
const heightUnit = document.getElementById("heightUnit");
const weightValue = document.getElementById("weightValue");
const weightUnit = document.getElementById("weightUnit");
const dietOptions = Array.from(document.querySelectorAll('input[name="diet"]'));

// step 3 inputs
const mealTwoBtn = document.getElementById("mealTwo");
const mealThreeBtn = document.getElementById("mealThree");
const mealCustomOption = document.getElementById("mealCustomOption");
const mealCustom = document.getElementById("mealCustom");
const mealCustomWrapper = document.getElementById("mealCustomWrapper");
const workoutOptions = Array.from(
  document.querySelectorAll('input[name="workoutFrequency"]'),
);
const healthyOptions = Array.from(
  document.querySelectorAll('input[name="healthyLifestyle"]'),
);

// step 4 inputs
const diseaseYes = document.getElementById("diseaseYes");
const diseaseNo = document.getElementById("diseaseNo");
const diseaseInput = document.getElementById("diseaseInput");
const diseaseInputContainer = document.getElementById("diseaseInputContainer");
const diseaseOptions = Array.from(
  document.querySelectorAll('input[name="diseaseStatus"]'),
);

let activeStep = 0;

const stepTitleConfigs = [
  {
    text: "Fill up the details",
    className:
      "text-2xl sm:text-3xl md:text-4xl font-bold text-[#0D0A0B] mb-6 md:mb-10 text-center",
  },
  {
    text: "Tell us about your body",
    className:
      "text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-5 text-center",
  },
  {
    text: "Tell us about your lifestyle",
    className:
      "text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-5 text-center",
  },
  {
    text: "Tell us about your health",
    className:
      "text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-5 text-center",
  },
];

// allow letters, spaces, hyphens and apostrophes for names and locations
const textFields = [firstName, lastName, city, country];
textFields.forEach((field) => {
  field.addEventListener("input", () => {
    field.value = field.value.replace(/[^A-Za-z\s'-]/g, "");
  });
});

// date of birth limits
const todayDate = new Date().toISOString().split("T")[0];
dob.max = todayDate;
dob.min = "1900-01-01";

// step validations
function validateStepOne() {
  const fields = [firstName, lastName, dob, gender, city, country];
  for (const el of fields) {
    if (!el.value || !el.value.trim()) {
      alert("Please fill all details to continue");
      el.focus();
      return false;
    }
  }
  if (dob.value > todayDate || dob.value < "1900-01-01") {
    alert("Please enter a valid date of birth");
    dob.focus();
    return false;
  }
  return true;
}

function validateStepTwo() {
  const h = parseFloat(heightValue.value);
  const w = parseFloat(weightValue.value);
  if (!heightValue.value || isNaN(h) || h <= 0 || !heightUnit.value) {
    alert("Please enter a valid height and unit");
    heightValue.focus();
    return false;
  }
  if (!weightValue.value || isNaN(w) || w <= 0 || !weightUnit.value) {
    alert("Please enter a valid weight and unit");
    weightValue.focus();
    return false;
  }
  const dietSelected = dietOptions.some((opt) => opt.checked);
  if (!dietSelected) {
    alert("Please select your diet type");
    return false;
  }
  return true;
}

function validateStepThree() {
  const mealSelected =
    mealTwoBtn.checked || mealThreeBtn.checked || mealCustomOption.checked;
  if (!mealSelected) {
    alert("Please choose your daily meals");
    return false;
  }
  if (mealCustomOption.checked) {
    const customVal = parseInt(mealCustom.value, 10);
    if (
      !mealCustom.value ||
      isNaN(customVal) ||
      customVal < 1 ||
      customVal > 15
    ) {
      alert("Please enter a meal count between 1 and 15");
      mealCustom.focus();
      return false;
    }
  }
  if (!workoutOptions.some((opt) => opt.checked)) {
    alert("Please select your exercise frequency");
    return false;
  }
  if (!healthyOptions.some((opt) => opt.checked)) {
    alert("Please select your lifestyle perception");
    return false;
  }
  return true;
}

function validateStepFour() {
  const diseaseSelected = diseaseOptions.some((opt) => opt.checked);
  if (!diseaseSelected) {
    alert("Please select whether you have any health conditions");
    return false;
  }
  if (diseaseYes.checked && !diseaseInput.value.trim()) {
    alert("Please briefly specify your condition");
    diseaseInput.focus();
    return false;
  }
  return true;
}

// display specific step
function showStep(stepIndex) {
  activeStep = stepIndex;
  const config = stepTitleConfigs[activeStep] || stepTitleConfigs[0];
  stepTitle.textContent = config.text;
  stepTitle.className = config.className;

  steps.forEach((step, index) => {
    step.style.display = index === activeStep ? "block" : "none";
  });

  if (activeStep === steps.length - 1) {
    nextButton.style.display = "none";
    submitButton.style.display = "inline-block";
  } else {
    nextButton.style.display = "inline-block";
    submitButton.style.display = "none";
  }

  prevButton.disabled = false;
}

// navigation clicks
prevButton.addEventListener("click", () => {
  if (activeStep > 0) {
    showStep(activeStep - 1);
    return;
  }
  window.location.href = "index.html";
});

nextButton.addEventListener("click", () => {
  if (activeStep === 0 && !validateStepOne()) return;
  if (activeStep === 1 && !validateStepTwo()) return;
  if (activeStep === 2 && !validateStepThree()) return;

  if (activeStep < steps.length - 1) {
    showStep(activeStep + 1);
  }
});

// submit and save data
submitButton.addEventListener("click", () => {
  if (!validateStepFour()) return;

  localStorage.setItem("firstName", firstName.value.trim() || "User");
  localStorage.setItem("lastName", lastName.value.trim() || "");
  localStorage.setItem("dob", dob.value || "");
  localStorage.setItem("gender", gender.value || "");
  localStorage.setItem("city", city.value.trim() || "");
  localStorage.setItem("country", country.value.trim() || "");
  localStorage.setItem("heightValue", heightValue.value || "");
  localStorage.setItem("heightUnit", heightUnit.value || "");
  localStorage.setItem("weightValue", weightValue.value || "");
  localStorage.setItem("weightUnit", weightUnit.value || "");
  localStorage.setItem(
    "diet",
    dietOptions.find((opt) => opt.checked)?.value || "",
  );
  localStorage.setItem(
    "meals",
    mealTwoBtn.checked
      ? "2"
      : mealThreeBtn.checked
        ? "3"
        : mealCustomOption.checked
          ? mealCustom.value
          : "3",
  );
  localStorage.setItem(
    "workout",
    workoutOptions.find((opt) => opt.checked)?.value || "",
  );
  localStorage.setItem(
    "healthy",
    healthyOptions.find((opt) => opt.checked)?.value || "",
  );
  localStorage.setItem(
    "disease",
    diseaseOptions.find((opt) => opt.checked)?.value || "",
  );
  localStorage.setItem("diseaseDetails", diseaseInput.value.trim() || "");

  loaderOverlay.style.display = "flex";

  setTimeout(() => {
    window.location.href = "report.html";
  }, 800);
});

// disease condition toggle
diseaseYes.addEventListener("change", () => {
  if (diseaseYes.checked) {
    diseaseInputContainer.style.display = "block";
  }
});

diseaseNo.addEventListener("change", () => {
  if (diseaseNo.checked) {
    diseaseInputContainer.style.display = "none";
    diseaseInput.value = "";
  }
});

// custom meal toggle
function toggleMealCustomInput() {
  if (mealCustomOption.checked) {
    mealCustomWrapper.style.display = "flex";
    mealCustom.focus();
  } else {
    mealCustomWrapper.style.display = "none";
    mealCustom.value = "";
  }
}

mealCustomOption.addEventListener("change", toggleMealCustomInput);
mealTwoBtn.addEventListener("change", toggleMealCustomInput);
mealThreeBtn.addEventListener("change", toggleMealCustomInput);

// restore previous entries if user reloads
function restoreSavedData() {
  if (localStorage.getItem("firstName"))
    firstName.value = localStorage.getItem("firstName");
  if (localStorage.getItem("lastName"))
    lastName.value = localStorage.getItem("lastName");
  if (localStorage.getItem("dob")) dob.value = localStorage.getItem("dob");
  if (localStorage.getItem("gender"))
    gender.value = localStorage.getItem("gender");
  if (localStorage.getItem("city")) city.value = localStorage.getItem("city");
  if (localStorage.getItem("country"))
    country.value = localStorage.getItem("country");
  if (localStorage.getItem("heightValue"))
    heightValue.value = localStorage.getItem("heightValue");
  if (localStorage.getItem("heightUnit"))
    heightUnit.value = localStorage.getItem("heightUnit");
  if (localStorage.getItem("weightValue"))
    weightValue.value = localStorage.getItem("weightValue");
  if (localStorage.getItem("weightUnit"))
    weightUnit.value = localStorage.getItem("weightUnit");

  const savedDiet = localStorage.getItem("diet");
  if (savedDiet) {
    const opt = dietOptions.find((d) => d.value === savedDiet);
    if (opt) opt.checked = true;
  }

  const savedMeals = localStorage.getItem("meals");
  if (savedMeals === "2") mealTwoBtn.checked = true;
  else if (savedMeals === "3") mealThreeBtn.checked = true;
  else if (savedMeals) {
    mealCustomOption.checked = true;
    mealCustom.value = savedMeals;
  }

  const savedWorkout = localStorage.getItem("workout");
  if (savedWorkout) {
    const opt = workoutOptions.find((w) => w.value === savedWorkout);
    if (opt) opt.checked = true;
  }

  const savedHealthy = localStorage.getItem("healthy");
  if (savedHealthy) {
    const opt = healthyOptions.find((h) => h.value === savedHealthy);
    if (opt) opt.checked = true;
  }

  const savedDisease = localStorage.getItem("disease");
  if (savedDisease === "yes") {
    diseaseYes.checked = true;
    diseaseInputContainer.style.display = "block";
    diseaseInput.value = localStorage.getItem("diseaseDetails") || "";
  } else if (savedDisease === "no") {
    diseaseNo.checked = true;
  }

  toggleMealCustomInput();
}

restoreSavedData();
showStep(0);
