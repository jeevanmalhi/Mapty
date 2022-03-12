import { mapZoomLevel } from "../../util/config.js";
import {
  form,
  showForm,
  hideForm,
  inputType,
  toggleElevationField,
  overlay,
  btnHideForm,
  isEdit,
} from "../workout/ui/workoutForm.js";

import {
  getlocalStorage,
  newWorkout,
  updateWorkout,
  renderWorkouts,
} from "../workout/ui/workout.js";

let map;
let markers = [];

const loadMap = (position) => {
  const { latitude, longitude } = position.coords;
  const coords = [latitude, longitude];

  map = L.map("map").setView(coords, mapZoomLevel);

  L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  getlocalStorage();
  renderWorkouts();

  map.on("click", showForm);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    isEdit ? updateWorkout(e) : newWorkout(e);
  });
  overlay.addEventListener("click", hideForm);
  btnHideForm.addEventListener("click", hideForm);
  inputType.addEventListener("change", toggleElevationField);
};

const getPosition = () => {
  if (navigator.geolocation) {
    return navigator.geolocation.getCurrentPosition(loadMap);
  } else {
    alert(`Geolocation is not supported by this browser.`);
  }
};

const renderWorkoutMarker = (workout) => {
  const marker = L.marker(workout.coords);
  markers.push(marker);
  marker
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: `${workout.type}-popup`,
      }).setContent(`${workout.description}`)
    )
    .openPopup();
};

const deleteWorkoutMarkers = (markerList) => {
  markerList.forEach((marker) => {
    marker.removeFrom(map);
  });
};

const panTo = (coords) => {
  map.setView(coords, mapZoomLevel, {
    animate: true,
    pan: {
      duration: 1,
    },
  });
};

export {
  getPosition as map,
  renderWorkoutMarker,
  deleteWorkoutMarkers,
  markers,
  panTo,
};
