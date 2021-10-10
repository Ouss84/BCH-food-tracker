import { FetchWrapper } from "./fetchWrapper";
import Chart from "chart.js/auto";
import snackbar from "snackbar";
import "snackbar/dist/snackbar.min.css";
const form = document.getElementById("form");
const meal = document.getElementById("meal");
const protein = document.getElementById("protein");
const carbs = document.getElementById("carbs");
const fat = document.getElementById("fat");
const displayFacts = document.querySelector(".display-facts");
const displayCalories = document.querySelector(".total-calories");

const API = new FetchWrapper(
  "https://firestore.googleapis.com/v1/projects/programmingjs-90a13/databases/(default)/documents/"
);
const endpoint = "oussama-test7";
const ctx = document.getElementById("myChart").getContext("2d");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  await addFoodItem();
  await getData();
  meal.value = "";
  protein.value = "";
  carbs.value = "";
  fat.value = "";
});

// adding a new food item
async function addFoodItem() {
  if (meal.value !== "" && protein.value !== "" && carbs.value !== "") {
    snackbar.show("Item added");
  } else {
    snackbar.show("Please enter valid fields!");
  }

  return API.post(endpoint, {
    fields: {
      name: {
        stringValue: meal.value,
      },
      protein: {
        integerValue: protein.value,
      },
      fat: {
        integerValue: fat.value,
      },
      carbs: {
        integerValue: carbs.value,
      },
    },
  });
}

//   getting data from the server and dispalying it
async function getData() {
  // re-initializing the display area before a new fetch
  displayFacts.innerHTML = "";

  API.get(endpoint).then((data) => {
    // intializing the cards elements to display
    let foodItem, protein, carbs, fat;
    // intializing the total nutritionals facts to be displayed
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    //   looping throu the returned data and extracting the inner fields
    data.documents.forEach((row) => {
      for (let [key, value] of Object.entries(row.fields)) {
        for (let facts of Object.entries(value)) {
          // extracting the foodItem's name when the type of the value is stringValue
          if (facts[0] === "stringValue") {
            foodItem = facts[1];
            console.log(`food Item = ${foodItem}`);
          }
          // extracting the protein ammount
          if (key === "protein") {
            protein = Number(facts[1]);
            console.log(`protein :${protein}`);
            totalProtein += protein;
          }
          // extracting the carbs ammount
          if (key === "carbs") {
            carbs = Number(facts[1]);
            console.log(`carbs :${carbs}`);
            totalCarbs += carbs;
          }
          // extracting the fat ammount
          if (key === "fat") {
            fat = Number(facts[1]);
            console.log(`fat :${fat}`);
            totalFat += fat;
          }
        }
      }

      displayItems(foodItem, protein, carbs, fat);
    });
    let totalCal = totalProtein * 4 + totalCarbs * 4 + totalFat * 9;

    displayTotalCalories(totalCal);
    displayChart(totalProtein, totalCarbs, totalFat);
  });
}

function displayItems(foodItem, protein, carbs, fat) {
  let foodCard = document.createElement("div");
  foodCard.className = "food-card";
  const list = document.createElement("ul");
  let li = document.createElement("li");
  li.textContent = foodItem;
  list.appendChild(li);
  li = document.createElement("li");
  li.textContent = `Protein: ${protein}`;
  list.appendChild(li);
  li = document.createElement("li");
  li.textContent = `Carbs: ${carbs}`;
  list.appendChild(li);
  li = document.createElement("li");
  li.textContent = `Fat: ${fat}`;
  list.appendChild(li);
  foodCard.append(list);
  displayFacts.append(foodCard);
}

function displayTotalCalories(totalCal) {
  displayCalories.innerHTML = "";
  let totalCalories = document.createElement("h2");
  totalCalories.textContent = `Total calories :${totalCal}`;
  displayCalories.append(totalCalories);
}

function displayChart(totalProtein, totalCarbs, totalFat) {
  let myChart = new Chart(ctx, {
    type: "polarArea",
    data: {
      labels: ["Protein", "Carbs", "Fat"],
      datasets: [
        {
          label: "intake in grammes",
          data: [totalProtein, totalCarbs, totalFat],
          backgroundColor: [
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 99, 132, 0.2)",

            "rgba(255, 206, 86, 0.2)",
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(255, 99, 132, 1)",

            "rgba(255, 206, 86, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {},
  });
}
