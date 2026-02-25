const carrot = document.querySelector("#carrot");
const checkboxes = document.querySelector("#jobs");
carrot.addEventListener("click", () => {
    checkboxes.classList.toggle("active");
    carrot.classList.toggle("active");
})

let pricesInput = {
    window: null,
    hazardWindows: null,
    gutter: null,
    pressure: null, 
    screen: null
}

let boxesChecked = {
    window: false,
    gutter: false,
    pressure: false, 
    screen: false
}

const jobInnerHtml = {
    window: () => `
        <div class="form-section">
            <div class="form-group">
            <label for="total_windows">Total Windows (~$5 per window)</label>
            <input type="number" id="total_windows" inputmode="numeric" step="1" placeholder="e.g. 10" value="${pricesInput.window || ""}">
            </div>

            <div class="form-group">
            <label for="total_hazard_windows">Total Hazard Windows (paint, cement, roof access, etc.) (~$7 per window)</label>
            <input type="number" id="total_hazard_windows" inputmode="numeric" step="1" placeholder="e.g. 5" value="${pricesInput.hazardWindows || ""}">
            </div>
        </div>`,
    gutter: () => `
        <div class="form-section">
            <div class="form-group">
            <label for="total_gutters">Total sqrft of Gutters (~$1 per sqrft of gutter)</label>
            <div class="input-wrapper">
                <span class="input-prefix"></span>
                <input type="number" id="total_gutters" inputmode="numeric" step="1" placeholder="e.g. 30" value="${pricesInput.gutter || ""}">
            </div>
            </div>
        </div>`,
    pressure: () => `
        <div class="form-section">
            <div class="form-group">
            <label for="total_pressure">Total sqrft to be Pressure Washed (~$0.50 per sqrft)</label>
            <div class="input-wrapper">
                <span class="input-prefix"></span>
                <input type="number" id="total_pressure" inputmode="numeric" step="1" placeholder="e.g. 20" value="${pricesInput.pressure || ""}">
            </div>
            </div>
        </div>`, 
    screen: () => `
        <div class="form-section">
            <div class="form-group">
            <label for="total_screens">Total Number of Screens (~$3 per screen)</label>
            <div class="input-wrapper">
            <span class="input-prefix"></span>
            <input type="number" id="total_screens" inputmode="numeric" step="1" placeholder="e.g. 10" value="${pricesInput.screen || ""}">
            </div>
            </div>
            </div>`
        }
        
const results = document.getElementById("results");
const calcForm = document.querySelector("#calculator-form");
checkboxes.addEventListener("change", () => {
    scrapeNumbers();
    document.querySelectorAll('#jobs input[type="checkbox"]').forEach(box => {
        boxesChecked[box.id] = box.checked;
    });
    results.innerHTML = `<div class="results-placeholder">
        <p>Fill out the form and click "Calculate Quote" to see your estimated pricing breakdown.</p>
        </div>`
    if (boxesChecked.window === false && boxesChecked.gutter === false && boxesChecked.pressure === false && boxesChecked.screen === false) {
        calcForm.innerHTML = `<p>Select a job from the section above to start your estimate</p>`;
    } else {
        calcForm.innerHTML = `<h2 class="form-section-title">Job Details</h2>`;
        if (boxesChecked.window === true) {
            calcForm.innerHTML += jobInnerHtml.window();
        }
        if (boxesChecked.gutter === true) {
            calcForm.innerHTML += jobInnerHtml.gutter();
        }
        if (boxesChecked.pressure === true) {
            calcForm.innerHTML += jobInnerHtml.pressure();
        }
        if (boxesChecked.screen === true) {
            calcForm.innerHTML += jobInnerHtml.screen();
        }
        calcForm.innerHTML += `<button type="submit" class="calculate-btn">Calculate Quote</button>`;
    }
})

function scrapeNumbers() {
    pricesInput.window = parseInt(document.getElementById("total_windows")?.value) || null;
    pricesInput.hazardWindows = parseInt(document.getElementById("total_hazard_windows")?.value) || null;
    pricesInput.screen = parseInt(document.getElementById("total_screens")?.value) || null;
    pricesInput.pressure = parseInt(document.getElementById("total_pressure")?.value) || null;
    pricesInput.gutter = parseInt(document.getElementById("total_gutters")?.value) || null;
}

// Calculate the bid
function calculateBid() {
    // Get pricing inputs
    const standardPrice = 5;
    const hazardPrice = 7;
    const screenPrice = 3;
    const pressurePrice = .50;
    const gutterPrice = 1;

    // Get job inputs
    scrapeNumbers();

    // Calculations
    const oneSidePrice = pricesInput.window * standardPrice;
    const totalInOut = oneSidePrice * 2;
    const hazardSurcharge = pricesInput.hazardWindows * hazardPrice;
    const screenCharge = pricesInput.screen * screenPrice;

    const gutterCharge = pricesInput.gutter * gutterPrice;
    const pressureCharge = pricesInput.pressure * pressurePrice;

    // New totals
    const totalWindowPrice = totalInOut + hazardSurcharge; // Total In/Out + Hazard

    // Round values to whole numbers
    const totalInOutRounded = Math.round(totalInOut);
    const oneSideRounded = Math.round(oneSidePrice);
    const hazardRounded = Math.round(hazardSurcharge);
    const screenRounded = Math.round(screenCharge);
    const totalWindowRounded = Math.round(totalWindowPrice);
    results.innerHTML = "";

    results.innerHTML += `<h2>Price Breakdown</h2>`
    if (boxesChecked.window === true) {
        results.innerHTML += `<p><strong>Total In/Out Price:</strong> <span>$${totalInOutRounded}</span></p>
        <p><strong>One-Side Price:</strong> <span>$${oneSideRounded}</span></p>
        <p><strong>Hazard Surcharge:</strong> <span>$${hazardRounded}</span></p>
        <p><strong>Total Window Price:</strong> <span>$${totalWindowRounded}</span></p>`;
    }
    if (boxesChecked.gutter === true) {
        results.innerHTML += `<p><strong>Gutter Cleaning Charge:</strong> <span>$${gutterCharge}</span></p>`;
    }
    if (boxesChecked.pressure === true) {
        results.innerHTML += `<p><strong>Pressure Washing Charge:</strong> <span>$${pressureCharge}</span></p>`;
    }
    if (boxesChecked.screen === true) {
        results.innerHTML += `<p><strong>Screen Cleaning Charge:</strong> <span>$${screenRounded}</span></p>`;
    }
    results.innerHTML += `<p><strong>Total Charges:</strong> <span>$${totalWindowRounded+gutterCharge+pressureCharge+screenRounded}</span></p>`;
}