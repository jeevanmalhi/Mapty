import {
  eventCoords,
  inputType,
  inputDistance,
  inputDuration,
  inputCadence,
  inputElevation,
  hideForm,
  showForm,
  isEdit,
  toggleElevationField,
} from "./workoutForm.js";
import {
  renderWorkoutMarker,
  deleteWorkoutMarkers,
  markers,
  panTo,
} from "../../map/map.js";

import { validNumber, allPositive } from "../../../util/helper.js";

import { Running, Cycling } from "../repo/workout.js";
const containerWorkouts = document.querySelector(".workouts");
const sortOption = document.querySelector(".workout__sort--options");

let workouts = [];

function newWorkout(e) {
  if (e.submitter.classList.contains("form__btn--exit")) return;

  const type = inputType.value;
  const distance = +inputDistance.value;
  const duration = +inputDuration.value;
  const coords = eventCoords.latlng;

  let workout;

  if (type === "cycling") {
    const elevationGain = +inputElevation.value;

    if (
      !validNumber(distance, duration, elevationGain) ||
      !allPositive(distance, duration)
    ) {
      alert("All inputs must be positive numbers!");
    }
    workout = new Cycling(distance, duration, coords, elevationGain);
  }
  if (type === "running") {
    const cadence = +inputCadence.value;

    if (
      !validNumber(distance, duration, cadence) ||
      !allPositive(distance, duration, cadence)
    ) {
      alert("All inputs must be positive numbers!");
    }
    workout = new Running(distance, duration, coords, cadence);
  }
  workouts.push(workout);
  setLocalStorage();
  renderWorkoutMarker(workout);
  renderWorkout(workout);
  hideForm();
}

function updateWorkout(e) {
  if (e.submitter.classList.contains("form__btn--exit")) return;

  const index = workouts.findIndex((work) => work.id === +isEdit.dataset.id);
  workouts[index].distance = +inputDistance.value;
  workouts[index].duration = +inputDuration.value;
  workouts[index].type === "cycling"
    ? (workouts[index].elevationGain = +inputElevation.value)
    : (workouts[index].cadence = +inputCadence.value);
  setLocalStorage();
  deleteSidebarWorkout(isEdit);
  renderWorkout(workouts[index]);
  hideForm();
}

function setLocalStorage() {
  localStorage.setItem("workouts", JSON.stringify(workouts));
}

function getlocalStorage() {
  const data = JSON.parse(localStorage.getItem("workouts"));

  if (!data) return;

  workouts = data;
}

function renderWorkout(workout) {
  let html = `
    <li class="workout workout--${workout.type}" data-id=${workout.id}>
      <div class="workout__header">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__btns">
          <button class="workout__btn workout__btn--edit"><i class='fa fa-edit'></i></button>
          <button class="workout__btn workout__btn--remove"><i class="fa fa-trash"></i></button>
        </div>
      </div>
      <div class="workout__details">
        <span class="workout__icon">${
          workout.type === "running" ? " 🏃‍♂️ " : " 🚴‍♀️ "
        }</span>
        <span class="workout__value">${workout.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>`;

  if (workout.type === "running")
    html += `
        <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.pace.toFixed(1)}</span>
        <span class="workout__unit">min/km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value">${workout.cadence}</span>
        <span class="workout__unit">spm</span>
      </div>
    </li>`;

  if (workout.type === "cycling")
    html += `
      <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${workout.speed.toFixed()}</span>
      <span class="workout__unit">km/h</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⛰</span>
      <span class="workout__value">${workout.elevationGain}</span>
      <span class="workout__unit">m</span>
    </div>
  </li>`;

  containerWorkouts.insertAdjacentHTML("afterbegin", html);
}

function renderWorkouts() {
  workouts.forEach((work) => {
    renderWorkoutMarker(work);
    renderWorkout(work);
  });
}

function reset() {
  location.reload();
}

function deleteAllWorkouts() {
  containerWorkouts.innerHTML = "";
  deleteWorkoutMarkers(markers);
  workouts.splice(-workouts.length + 1);
  markers.splice(-markers.length + 1);
  setLocalStorage();
}

function deleteWorkout(workoutEl) {
  const workoutId = workoutEl.dataset.id;
  deleteSidebarWorkout(workoutEl);
  deleteWorkMarker(workoutEl);

  workouts = workouts.filter((work) => work.id !== +workoutId);
  setLocalStorage();
}

function deleteSidebarWorkout(workoutEl) {
  containerWorkouts.removeChild(workoutEl);
}
function deleteWorkMarker(workoutEl) {
  const workoutId = workoutEl.dataset.id;
  const workout = workouts.find((work) => work.id === +workoutId);
  const markerIndex = markers.findIndex((marker) => {
    const latlng = marker.getLatLng();
    return (
      latlng.lat === workout.coords.lat && latlng.lng === workout.coords.lng
    );
  });
  const marker = markers.splice(markerIndex, 1);
  deleteWorkoutMarkers(marker);
}
function sortWorkouts(e) {
  const sortBy = sortOption.value;
  if (sortBy === "type")
    workouts.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return 1;
      }
      if (a[sortBy] > b[sortBy]) {
        return -1;
      }
      return 0;
    });
  else {
    workouts.sort((a, b) => {
      return a[sortBy] - b[sortBy];
    });
  }
  containerWorkouts.innerHTML = "";
  deleteWorkoutMarkers(markers);
  markers.splice(-markers.length + 1);
  renderWorkouts();
}
function handleContainerClick(e) {
  const editEl = e.target.closest(".workout__btn--edit");
  const deleteEl = e.target.closest(".workout__btn--remove");
  const workoutEl = e.target.closest(".workout");

  if (!editEl && !deleteEl && !workoutEl) return;

  const workout = workouts.find((work) => work.id === +workoutEl.dataset.id);

  if (editEl) {
    if (workout.type !== inputType.value) toggleElevationField();

    inputType.value = workout.type;
    inputDistance.value = workout.distance;
    inputDuration.value = workout.duration;
    inputCadence.value = workout.cadence;
    inputElevation.value = workout.elevationGain;
    showForm(e);
  } else if (deleteEl) {
    deleteWorkout(workoutEl);
  } else if (workoutEl) {
    panTo(workout.coords);
  }
}

export {
  updateWorkout,
  newWorkout,
  sortWorkouts,
  sortOption,
  deleteAllWorkouts,
  renderWorkouts,
  getlocalStorage,
  containerWorkouts,
  handleContainerClick,
};
