const childCount = document.getElementById("childCount");
const detailsDiv = document.getElementById("childDetails");

childCount.addEventListener("change", () => {
  detailsDiv.innerHTML = "";
  if (childCount.value === "none") return;

  let c = childCount.value === "more" ? 10 : parseInt(childCount.value);

  for (let i = 1; i <= c; i++) {
    detailsDiv.innerHTML += `
      <div class="childBox">
        <label>${i} Child Class</label>
        <select id="class_${i}">
          <option value="10th">10th</option>
          <option value="11th">11th</option>
          <option value="12th">12th</option>
        </select>

        <label>Gender</label>
        <select id="gender_${i}">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
    `;
  }
});

// Spinner
const spinner = document.createElement("div");
spinner.id = "spinner";
spinner.style.display = "none";
spinner.style.position = "fixed";
spinner.style.top = "0";
spinner.style.left = "0";
spinner.style.width = "100%";
spinner.style.height = "100%";
spinner.style.background = "rgba(0,0,0,0.6)";
spinner.style.color = "white";
spinner.style.fontSize = "22px";
spinner.style.alignItems = "center";
spinner.style.justifyContent = "center";
spinner.style.zIndex = "999";
spinner.style.display = "flex";
spinner.innerHTML = "Saving... Please wait";
document.body.appendChild(spinner);

function showSpinner() { spinner.style.display = "flex"; }
function hideSpinner() { spinner.style.display = "none"; }

// Submit
const form = document.getElementById("regForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  showSpinner();

  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;
  const interest = document.getElementById("interest").value;
  const surveyor = document.getElementById("surveyor").value;

  let children = [];
  if (childCount.value !== "none") {
    let c = childCount.value === "more" ? 10 : parseInt(childCount.value);
    for (let i = 1; i <= c; i++) {
      children.push({
        class: document.getElementById(`class_${i}`).value,
        gender: document.getElementById(`gender_${i}`).value
      });
    }
  }

  const data = { name, address, phone, interest, surveyor, children };

  try {
    const r1 = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const r2 = await fetch("/api/saveVcf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone })
    });

    hideSpinner();

    if (r1.ok && r2.ok) alert("Successfully added: Data + VCF");
    else alert("Error: Something went wrong. Check server logs.");

  } catch {
    hideSpinner();
    alert("Network Error: Could not save.");
  }

  form.reset();
  detailsDiv.innerHTML = "";
});
```javascript
const childCount = document.getElementById("childCount");
const detailsDiv = document.getElementById("childDetails");

childCount.addEventListener("change", () => {
  detailsDiv.innerHTML = "";
  if (childCount.value === "none") return;

  let c = childCount.value === "more" ? 10 : parseInt(childCount.value);

  for (let i = 1; i <= c; i++) {
    detailsDiv.innerHTML += `
      <div class="childBox">
        <label>${i} Child Class</label>
        <select id="class_${i}">
          <option value="10th">10th</option>
          <option value="11th">11th</option>
          <option value="12th">12th</option>
        </select>

        <label>Gender</label>
        <select id="gender_${i}">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
    `;
  }
});

// Submit
const form = document.getElementById("regForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;
  const interest = document.getElementById("interest").value;
  const surveyor = document.getElementById("surveyor").value;

  let children = [];
  if (childCount.value !== "none") {
    let c = childCount.value === "more" ? 10 : parseInt(childCount.value);
    for (let i = 1; i <= c; i++) {
      children.push({
        class: document.getElementById(`class_${i}`).value,
        gender: document.getElementById(`gender_${i}`).value
      });
    }
  }

  const data = {
    name,
    address,
    phone,
    interest,
    surveyor,
    children
  };

  await fetch("/api/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  await fetch("/api/saveVcf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone })
  });

  alert("Submitted Successfully!");
  form.reset();
  detailsDiv.innerHTML = "";
});
