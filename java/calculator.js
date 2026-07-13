const carrot = document.querySelector("#carrot");
const checkboxes = document.querySelector("#jobs");
carrot.addEventListener("click", () => {
    checkboxes.classList.toggle("active");
    carrot.classList.toggle("active");
})

let pricesInput = {
    homeSqft: null,
    pressureDrivewaySqft: null,
    pressureStories: null,
    screen: null
}

let boxesChecked = {
    window: false,
    gutter: false,
    pressure: false, 
    screen: false
}

// --- Pricing rates ---
// TODO: these are placeholders/carried over from before. Confirm real values,
// especially the pressure washing story/driveway/roof rates which are brand new.
const rates = {
    window: 0.13,          // $ per sqft, used for Inside & Outside price
    gutter: 0.06,           // $ per sqft of home
    screen: 20,              // $ per screen
    pressure: {
        oneStory: 0.20,     // TODO: confirm - carried over from old flat pressure rate
        twoStory: 0.30,     // TODO: placeholder, set real rate
        threeStory: 0.40,   // TODO: placeholder, set real rate
        driveway: 0.30,     // TODO: placeholder, set real rate
        roofOneStory: 0.6, // TODO: placeholder, set real rate
        roofTwoStory: 1  // TODO: placeholder, set real rate (also used for 3-story homes, see note below)
    }
}

// Shared "Home Square Footage" field - used by window, gutter, and pressure washing
// so the user only has to enter it once.
function homeSqftSection() {
    return `
        <div class="form-section">
        <div class="form-group">
        <label for="home_sqft">Home Square Footage</label>
        <div class="input-wrapper">
        <span class="input-prefix"></span>
        <input type="number" id="home_sqft" inputmode="numeric" step="1" placeholder="e.g. 2000" value="${pricesInput.homeSqft || ""}">
        </div>
        </div>
        </div>`;
}

const jobInnerHtml = {
    pressureExtras: () => `
        <div class="form-section">
        <div class="form-group">
        <label for="pressure_driveway_sqft">Driveway Square Footage</label>
        <div class="input-wrapper">
        <span class="input-prefix"></span>
        <input type="number" id="pressure_driveway_sqft" inputmode="numeric" step="1" placeholder="e.g. 400 (enter 0 if none)" value="${pricesInput.pressureDrivewaySqft || ""}">
        </div>
        </div>
        <div class="form-group">
        <label for="pressure_stories">Number of Stories</label>
        <input type="number" id="pressure_stories" inputmode="numeric" step="1" min="1" max="3" placeholder="e.g. 2" value="${pricesInput.pressureStories || ""}">
        </div>
        </div>`, 
    screen: () => `
        <div class="form-section">
        <div class="form-group">
        <label for="total_screens">Total Number of Screens - $20 per screen</label>
        <div class="input-wrapper">
        <span class="input-prefix"></span>
        <input type="number" id="total_screens" inputmode="numeric" step="1" placeholder="e.g. 10" value="${pricesInput.screen || ""}">
        </div>
        </div>
        </div>`
}
        
const results = document.getElementById("results");
const calcForm = document.querySelector("#calculator-form");

function setCalculatorFormEmptyState(isEmpty) {
    calcForm.classList.toggle("is-empty", isEmpty);
}

setCalculatorFormEmptyState(true);
checkboxes.addEventListener("change", () => {
    scrapeNumbers();
    document.querySelectorAll('#jobs input[type="checkbox"]').forEach(box => {
        boxesChecked[box.id] = box.checked;
    });
    results.innerHTML = `<div class="results-placeholder">
        <p>Fill out the form and click "Calculate Quote" to see your estimated pricing breakdown.</p>
        </div>`
    if (boxesChecked.window === false && boxesChecked.gutter === false && boxesChecked.pressure === false && boxesChecked.screen === false) {
        setCalculatorFormEmptyState(true);
        calcForm.innerHTML = `<p>Select a job from the section above to start your estimate</p>`;
    } else {
        setCalculatorFormEmptyState(false);
        calcForm.innerHTML = `<h2 class="form-section-title">Job Details</h2>`;

        // Shared home sqft field - shown once if any job that needs it is checked
        if (boxesChecked.window === true || boxesChecked.gutter === true || boxesChecked.pressure === true) {
            calcForm.innerHTML += homeSqftSection();
        }
        // Pressure washing's extra fields (driveway + stories)
        if (boxesChecked.pressure === true) {
            calcForm.innerHTML += jobInnerHtml.pressureExtras();
        }
        // Screens
        if (boxesChecked.screen === true) {
            calcForm.innerHTML += jobInnerHtml.screen();
        }

        calcForm.innerHTML += `<button type="submit" class="calculate-btn">Calculate Quote</button>`;
    }
})

function scrapeNumbers() {
    pricesInput.homeSqft = parseInt(document.getElementById("home_sqft")?.value) || null;
    pricesInput.pressureDrivewaySqft = parseInt(document.getElementById("pressure_driveway_sqft")?.value) || null;
    pricesInput.pressureStories = parseInt(document.getElementById("pressure_stories")?.value) || null;
    pricesInput.screen = parseInt(document.getElementById("total_screens")?.value) || null;
}

// Returns the correct per-sqft pressure washing (house wash) rate for the given number of stories.
// Falls back to the 1-story rate if stories is missing, 0, or somehow negative.
function getPressureStoryRate(stories) {
    if (stories >= 3) return rates.pressure.threeStory;
    if (stories === 2) return rates.pressure.twoStory;
    return rates.pressure.oneStory;
}

// Returns the correct roof wash rate. Only two tiers exist (1-story vs 2-story+),
// so 3-story homes currently use the 2-story rate. Flag if 3-story needs its own rate.
function getRoofStoryRate(stories) {
    if (stories >= 2) return rates.pressure.roofTwoStory;
    return rates.pressure.roofOneStory;
}

// Calculate the bid
function calculateBid() {
    scrapeNumbers();

    // ----- Window cleaning -----
    // Inside & Outside = home sqft * rate
    // Outside Only = Inside & Outside / 0.8 / 2
    const windowInOutCharge = (pricesInput.homeSqft || 0) * rates.window;
    const windowOutsideOnlyCharge = windowInOutCharge / 0.8 / 2;

    // ----- Gutter cleaning -----
    const gutterCharge = (pricesInput.homeSqft || 0) * rates.gutter;

    // ----- Pressure washing -----
    // Guard against missing/0 stories so we never divide by zero.
    const stories = pricesInput.pressureStories && pricesInput.pressureStories > 0
        ? pricesInput.pressureStories
        : 1;
    const houseStoryRate = getPressureStoryRate(stories);
    const roofStoryRate = getRoofStoryRate(stories);

    const houseWashCharge = (pricesInput.homeSqft || 0) / stories * houseStoryRate;
    const drivewayWashCharge = (pricesInput.pressureDrivewaySqft || 0) * rates.pressure.driveway;
    const roofWashCharge = (pricesInput.homeSqft || 0) / stories * roofStoryRate;
    const pressureTotalCharge = houseWashCharge + drivewayWashCharge + roofWashCharge;

    // ----- Screens -----
    const screenCharge = (pricesInput.screen || 0) * rates.screen;

    // Round values to whole numbers for display
    const windowInOutRounded = Math.round(windowInOutCharge);
    const windowOutsideOnlyRounded = Math.round(windowOutsideOnlyCharge);
    const gutterRounded = Math.round(gutterCharge);
    const houseWashRounded = Math.round(houseWashCharge);
    const drivewayWashRounded = Math.round(drivewayWashCharge);
    const roofWashRounded = Math.round(roofWashCharge);
    const pressureTotalRounded = Math.round(pressureTotalCharge);
    const screenRounded = Math.round(screenCharge);

    results.innerHTML = "";
    results.innerHTML += `<h2>Price Breakdown</h2>`

    if (boxesChecked.window === true) {
        results.innerHTML += `<p><strong>Windows In/Out:</strong> <span>$${windowInOutRounded}</span></p>
        <p><strong>Windows Outside Only:</strong> <span>$${windowOutsideOnlyRounded}</span></p>`;
    }
    if (boxesChecked.gutter === true) {
        results.innerHTML += `<p><strong>Gutter Cleaning Charge:</strong> <span>$${gutterRounded}</span></p>`;
    }
    if (boxesChecked.pressure === true) {
        results.innerHTML += `<p><strong>House Wash:</strong> <span>$${houseWashRounded}</span></p>
        <p><strong>Driveway Wash:</strong> <span>$${drivewayWashRounded}</span></p>
        <p><strong>Roof Wash:</strong> <span>$${roofWashRounded}</span></p>
        <p><strong>Pressure Washing Total:</strong> <span>$${pressureTotalRounded}</span></p>`;
    }
    if (boxesChecked.screen === true) {
        results.innerHTML += `<p><strong>Screen Cleaning Charge:</strong> <span>$${screenRounded}</span></p>`;
    }

    // NOTE: Window's "Inside & Outside" price is what counts toward the grand
    // total below. "Outside Only" is shown as an alternative option and is
    // NOT added in.
    const grandTotal = windowInOutRounded + gutterRounded + pressureTotalRounded + screenRounded;
    results.innerHTML += `<p><strong>Total Charges:</strong> <span>$${grandTotal}</span></p>`;
}