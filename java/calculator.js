// Load saved pricing from localStorage
document.addEventListener("DOMContentLoaded", () => {
    const fields = [
        "standard_price",
        "hazard_price",
        "screen_price"
    ];

    fields.forEach(id => {
        const saved = localStorage.getItem(id);
        if (saved !== null) {
            document.getElementById(id).value = saved;
        }

        document.getElementById(id).addEventListener("input", e => {
            localStorage.setItem(id, e.target.value);
        });
    });
});

// Calculate the bid
function calculateBid() {
    // Get pricing inputs
    const standardPrice = parseInt(document.getElementById("standard_price").value) || 0;
    const hazardPrice = parseInt(document.getElementById("hazard_price").value) || 0;
    const screenPrice = parseInt(document.getElementById("screen_price").value) || 0;

    // Get job inputs
    const totalWindows = parseInt(document.getElementById("total_windows").value) || 0;
    const hazardWindows = parseInt(document.getElementById("total_hazard_windows").value) || 0;

    // Calculations
    const oneSidePrice = totalWindows * standardPrice;
    const totalInOut = oneSidePrice * 2;
    const hazardSurcharge = hazardWindows * hazardPrice;
    const screenCharge = totalWindows * screenPrice;

    // New totals
    const totalWindowPrice = totalInOut + hazardSurcharge; // Total In/Out + Hazard
    const totalPlusScreens = totalWindowPrice + screenCharge; // Add screen cleaning

    // Round values to whole numbers
    const totalInOutRounded = Math.round(totalInOut);
    const oneSideRounded = Math.round(oneSidePrice);
    const hazardRounded = Math.round(hazardSurcharge);
    const screenRounded = Math.round(screenCharge);
    const totalWindowRounded = Math.round(totalWindowPrice);
    const totalPlusScreensRounded = Math.round(totalPlusScreens);

    // Display results with improved styling
    document.getElementById("results").innerHTML = `
        <h2>Price Breakdown</h2>
        <p><strong>Total In/Out Price:</strong> <span>$${totalInOutRounded}</span></p>
        <p><strong>One-Side Price:</strong> <span>$${oneSideRounded}</span></p>
        <p><strong>Hazard Surcharge:</strong> <span>$${hazardRounded}</span></p>
        <p><strong>Screen Cleaning Charge:</strong> <span>$${screenRounded}</span></p>
        <p><strong>Total Window Price:</strong> <span>$${totalWindowRounded}</span></p>
        <p><strong>Total Plus Screens:</strong> <span>$${totalPlusScreensRounded}</span></p>
    `;
}

const jobDropdown = document.querySelector("#jobs")

jobDropdown.addEventListener("change", (e) => {
    const selectedJob = e.target.value;
    const form = document.querySelector("#calculator-form");

    if (selectedJob === "window") {
        form.innerHTML = `
        <div class="form-section">
            <h2 class="form-section-title">Pricing</h2>
            
            <div class="form-group">
            <label for="standard_price">Standard Price Per Side (~$7)</label>
            <div class="input-wrapper">
                <span class="input-prefix"></span>
                <input type="number" id="standard_price" inputmode="numeric" step="1" placeholder="e.g. 7">
            </div>
            </div>

            <div class="form-group"> 
            <label for="hazard_price">Price Per Hazard Window (~$5)</label>
            <div class="input-wrapper">
                <span class="input-prefix"></span>
                <input type="number" id="hazard_price" inputmode="numeric" step="1" placeholder="e.g. 5">
            </div>
            </div>

            <div class="form-group">
            <label for="screen_price">Price Per Screen (~$1)</label>
            <div class="input-wrapper">
                <span class="input-prefix"></span>
                <input type="number" id="screen_price" inputmode="numeric" step="1" placeholder="e.g. 1">
            </div>
            </div>
        </div>

        <div class="form-section">
            <h2 class="form-section-title">Job Details</h2>
            
            <div class="form-group">
            <label for="total_windows">Total Windows</label>
            <input type="number" id="total_windows" inputmode="numeric" step="1" placeholder="e.g. 0">
            </div>

            <div class="form-group">
            <label for="total_hazard_windows">Total Hazard Windows (paint, cement, roof access, etc.)</label>
            <input type="number" id="total_hazard_windows" inputmode="numeric" step="1" placeholder="e.g. 0">
            </div>
        </div>

        <button type="submit" class="calculate-btn">Calculate Quote</button>`
    }
    else if (selectedJob === "gutter") {
        form.innerHTML = `
        <div class="form-section">
            <h2 class="form-section-title">Pricing</h2>
            
            <div class="form-group">
            <label for="standard_price">Standard Price Per Foot (~$7)</label>
            <div class="input-wrapper">
                <span class="input-prefix"></span>
                <input type="number" id="standard_price" inputmode="numeric" step="1" placeholder="e.g. 7">
            </div>
            </div>
        </div>
        <button type="submit" class="calculate-btn">Calculate Quote</button>`;
    }
    else if (selectedJob === "pressure") {
        form.innerHTML = `
        <div class="form-section">
            <h2 class="form-section-title">Pricing</h2>
            
            <div class="form-group">
            <label for="standard_price">Standard Price Per sqft (~$7)</label>
            <div class="input-wrapper">
                <span class="input-prefix"></span>
                <input type="number" id="standard_price" inputmode="numeric" step="1" placeholder="e.g. 7">
            </div>
            </div>
        </div>
        <button type="submit" class="calculate-btn">Calculate Quote</button>`;
    }
    else if (selectedJob === "screen") {
        form.innerHTML = `
        <div class="form-section">
            <h2 class="form-section-title">Pricing</h2>
            
            <div class="form-group">
            <label for="standard_price">Standard Price Per Screen (~$7)</label>
            <div class="input-wrapper">
                <span class="input-prefix"></span>
                <input type="number" id="standard_price" inputmode="numeric" step="1" placeholder="e.g. 7">
            </div>
            </div>
        </div>
        <button type="submit" class="calculate-btn">Calculate Quote</button>`;
    }
})