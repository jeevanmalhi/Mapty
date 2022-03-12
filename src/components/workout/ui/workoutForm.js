//Element selectors
const form = document.querySelector(".form");
const overlay = document.querySelector(".overlay");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
const workoutModal = document.querySelector(".workout__modal");
const btnHideForm = document.querySelector(".form__btn--exit");

let eventCoords;
let isEdit;

const showForm = (e) => {
  if (e.originalEvent) eventCoords = e;
  else isEdit = e.target.closest(".workout");
  workoutModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  inputDistance.focus();
};

const hideForm = () => {
  eventCoords = "";
  isEdit = "";
  inputDistance.value =
    inputDuration.value =
    inputCadence.value =
    inputElevation.value =
      "";
  workoutModal.classList.add("hidden");
  overlay.classList.add("hidden");
};

const toggleElevationField = () => {
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
};

export {
  isEdit,
  eventCoords,
  form,
  showForm,
  hideForm,
  toggleElevationField,
  overlay,
  inputType,
  btnHideForm,
  inputDistance,
  inputDuration,
  inputCadence,
  inputElevation,
};
