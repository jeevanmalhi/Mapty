import { map } from "./components/map/map.js";
import {
  containerWorkouts,
  deleteAllWorkouts,
  handleContainerClick,
  sortWorkouts,
  sortOption
} from "./components/workout/ui/workout.js";

const btnDeleteWorkouts = document.querySelector(".header__btn--delete");


btnDeleteWorkouts.addEventListener("click", deleteAllWorkouts);

containerWorkouts.addEventListener("click", handleContainerClick);

sortOption.addEventListener("change", sortWorkouts);

const myMap = map();
