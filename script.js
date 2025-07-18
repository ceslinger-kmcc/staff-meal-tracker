const prices = {
  "Breakfast": 3,
  "Lunch": 5,
  "Dinner": 5,
  "Snacks": 1
};

const todayKey = `meals_${new Date().toLocaleDateString()}`;

document.getElementById("mealForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("staffName").value.trim();
  const meal = document.getElementById("mealType").value;
  const cost = prices[meal];
  const date = new Date().toLocaleDateString();

  const entry = { name, meal, cost, date };
  saveMeal(entry);
  renderTable();
  this.reset();
});

function saveMeal(entry) {
  const meals = JSON.parse(localStorage.getItem(todayKey) || "[]");
  meals.push(entry);
  localStorage.setItem(todayKey, JSON.stringify(meals));
}

function renderTable() {
  const meals = JSON.parse(localStorage.getItem(todayKey) || "[]");
  const tbody = document.querySelector("#mealTable tbody");
  tbody.innerHTML = "";
  meals.forEach(entry => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.name}</td>
      <td>${entry.meal}</td>
      <td>$${entry.cost.toFixed(2)}</td>
      <td>${entry.date}</td>
    `;
    tbody.appendChild(row);
  });
  renderTotals(meals);
}

function renderTotals(meals) {
  const totals = {};
  meals.forEach(entry => {
    if (!totals[entry.name]) {
      totals[entry.name] = 0;
    }
    totals[entry.name] += entry.cost;
  });

  const summaryDiv = document.getElementById("totals");
  summaryDiv.innerHTML = `<h3>Total Cost for ${new Date().toLocaleDateString()}</h3>`;
  for (const name in totals) {
    const p = document.createElement("p");
    p.textContent = `${name}: $${totals[name].toFixed(2)}`;
    summaryDiv.appendChild(p);
  }
}

function exportCSV() {
  const meals = JSON.parse(localStorage.getItem(todayKey) || "[]");
  if (meals.length === 0) {
    alert("No meal data to export.");
    return;
  }

  let csv = "Name,Meal,Cost,Date\n";
  meals.forEach(entry => {
    csv += `${entry.name},${entry.meal},${entry.cost},${entry.date}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `meal_log_${entry.date}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Initial render
renderTable();
