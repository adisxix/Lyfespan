const steps = Array.from(document.querySelectorAll('[data-step]'));
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const dob = document.getElementById('dob');
const gender = document.getElementById('gender');
const city = document.getElementById('city');
const country = document.getElementById('country');
const heightValue = document.getElementById('heightValue');
const heightUnit = document.getElementById('heightUnit');
const weightValue = document.getElementById('weightValue');
const weightUnit = document.getElementById('weightUnit');
const dietOptions = Array.from(document.querySelectorAll('input[name="diet"]'));
const mealTwoBtn = document.getElementById('mealTwo');
const mealThreeBtn = document.getElementById('mealThree');
const mealCustomOption = document.getElementById('mealCustomOption');
const mealCustom = document.getElementById('mealCustom');
const mealCustomWrapper = document.getElementById('mealCustomWrapper');
const workoutOptions = Array.from(document.querySelectorAll('input[name="workoutFrequency"]'));
const healthyOptions = Array.from(document.querySelectorAll('input[name="healthyLifestyle"]'));
const diseaseYes = document.getElementById('diseaseYes');
const diseaseNo = document.getElementById('diseaseNo');
const diseaseInput = document.getElementById('diseaseInput');
const diseaseInputContainer = document.getElementById('diseaseInputContainer');
const diseaseOptions = Array.from(document.querySelectorAll('input[name="diseaseStatus"]'));
const stepTitle = document.getElementById('stepTitle');
const submitButton = document.getElementById('submitButton');
const loaderOverlay = document.getElementById('loaderOverlay');

let activeStep = 0;
const stepValidationEnabled = true;

const stepTitleConfigs = [
	{
		text: 'Fill up the details',
		className: 'text-lg md:text-4xl font-bold text-[#0D0A0B] mb-10 text-center',
	},
	{
		text: 'Tell us about your body',
		className: 'text-xl md:text-4xl font-bold text-black mb-5 text-center',
	},
	{
		text: 'Tell us about your lifestyle',
		className: 'text-xl md:text-4xl font-bold text-black mb-5 text-center',
	},
	{
		text: 'Tell us about your health',
		className: 'text-xl md:text-4xl font-bold text-black mb-5 text-center',
	},
];

const letterOnlyFields = [firstName, lastName, city, country];

letterOnlyFields.forEach((field) => {
	field.addEventListener('input', () => {
		field.value = field.value.replace(/[^A-Za-z ]/g, '');
	});
});

dob.max = new Date().toISOString().split('T')[0];

function validateStepOne() {
	const fields = [firstName, lastName, dob, gender, city, country];
	for (const el of fields) {
		if (!el.value || !el.value.trim()) {
			alert('Fill the details to move forward');
			return false;
		}
	}
	return true;
}

function validateStepTwo() {
	if (!heightValue.value || Number(heightValue.value) <= 0 ||
		!heightUnit.value ||
		!weightValue.value || Number(weightValue.value) <= 0 ||
		!weightUnit.value ||
		!dietOptions.find((option) => option.checked)) {
		alert('Fill the details to move forward');
		return false;
	}
	return true;
}

function validateStepThree() {
	const mealSelected = mealTwoBtn.checked || mealThreeBtn.checked || mealCustomOption.checked;
	if (!mealSelected ||
		(mealCustomOption.checked && (!mealCustom.value || Number(mealCustom.value) < 1 || Number(mealCustom.value) > 10)) ||
		!workoutOptions.find((option) => option.checked) ||
		!healthyOptions.find((option) => option.checked)) {
		alert('Fill the details to move forward');
		return false;
	}
	return true;
}

function validateStepFour() {
	const diseaseSelected = diseaseOptions.find((option) => option.checked);
	if (!diseaseSelected) {
		alert('Fill the details to move forward');
		return false;
	}
	if (diseaseYes.checked && !diseaseInput.value.trim()) {
		alert('Fill the details to move forward');
		return false;
	}
	return true;
}


function showStep(stepIndex) {
	activeStep = stepIndex;
	const stepTitleConfig = stepTitleConfigs[activeStep] ?? stepTitleConfigs[0];
	stepTitle.textContent = stepTitleConfig.text;
	stepTitle.className = stepTitleConfig.className;

	steps.forEach((step, index) => {
		step.style.display = index === activeStep ? 'block' : 'none';
	});

	if (activeStep === steps.length - 1) {
		nextButton.style.display = 'none';
		submitButton.style.display = 'inline-block';
	} else {
		nextButton.style.display = '';
		submitButton.style.display = 'none';
	}

	prevButton.disabled = false;
}

prevButton.addEventListener('click', () => {
	if (activeStep > 0) {
		showStep(activeStep - 1);
		return;
	}

	window.location.href = 'index.html';
});

nextButton.addEventListener('click', () => {
	if (stepValidationEnabled) {
		if (activeStep === 0 && !validateStepOne()) {
			return;
		}

		if (activeStep === 1 && !validateStepTwo()) {
			return;
		}

		if (activeStep === 2 && !validateStepThree()) {
			return;
		}
	}

	if (activeStep < steps.length - 1) {
		showStep(activeStep + 1);
	}
});

submitButton.addEventListener('click', () => {
	if (stepValidationEnabled && !validateStepFour()) {
		return;
	}

	localStorage.setItem('firstName', firstName.value || '');
	localStorage.setItem('lastName', lastName.value || '');
	localStorage.setItem('dob', dob.value || '');
	localStorage.setItem('gender', gender.value || '');
	localStorage.setItem('city', city.value || '');
	localStorage.setItem('country', country.value || '');
	localStorage.setItem('heightValue', heightValue.value || '');
	localStorage.setItem('heightUnit', heightUnit.value || '');
	localStorage.setItem('weightValue', weightValue.value || '');
	localStorage.setItem('weightUnit', weightUnit.value || '');
	localStorage.setItem('diet', dietOptions.find(opt => opt.checked)?.value || '');
	localStorage.setItem('meals', mealTwoBtn.checked ? '2' : mealThreeBtn.checked ? '3' : mealCustomOption.checked ? mealCustom.value : '');
	localStorage.setItem('workout', workoutOptions.find(opt => opt.checked)?.value || '');
	localStorage.setItem('healthy', healthyOptions.find(opt => opt.checked)?.value || '');
	localStorage.setItem('disease', diseaseOptions.find(opt => opt.checked)?.value || '');
	localStorage.setItem('diseaseDetails', diseaseInput.value || '');

	loaderOverlay.style.display = 'flex';

	setTimeout(() => {
		window.location.href = 'report.html';
	}, 2000);
});

diseaseYes.addEventListener('change', () => {
	if (diseaseYes.checked) {
		diseaseInputContainer.style.display = 'block';
	}
});

diseaseNo.addEventListener('change', () => {
	if (diseaseNo.checked) {
		diseaseInputContainer.style.display = 'none';
		diseaseInput.value = '';
	}
});

function toggleMealCustomInput() {
	if (mealCustomOption.checked) {
		mealCustomWrapper.style.display = 'flex';
		mealCustom.focus();
	} else {
		mealCustomWrapper.style.display = 'none';
		mealCustom.value = '';
	}
}

mealCustomOption.addEventListener('change', toggleMealCustomInput);
mealTwoBtn.addEventListener('change', toggleMealCustomInput);
mealThreeBtn.addEventListener('change', toggleMealCustomInput);
toggleMealCustomInput();

function addToggleToRadioGroup(radioButtons) {
	radioButtons.forEach((button) => {
		button.addEventListener('mousedown', (e) => {
			if (button.checked) {
				e.preventDefault();
				button.checked = false;
			}
		});
	});
}


addToggleToRadioGroup(dietOptions);
addToggleToRadioGroup([mealTwoBtn, mealThreeBtn, mealCustomOption]);
addToggleToRadioGroup(workoutOptions);
addToggleToRadioGroup(healthyOptions);
addToggleToRadioGroup(diseaseOptions);

showStep(0);
