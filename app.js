// ==============================================================================
// RETAIL SALES AND INVENTORY FORECASTER - LOGIC
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const modelSelect = document.getElementById('model-select');
  const storeSelect = document.getElementById('store-select');
  const categorySelect = document.getElementById('category-select');
  const regionSelect = document.getElementById('region-select');
  const weatherSelect = document.getElementById('weather-select');
  const promoSelect = document.getElementById('promo-select');
  const discountSelect = document.getElementById('discount-select');
  const priceInput = document.getElementById('price-input');

  // Linked inputs (number + range)
  const demandInput = document.getElementById('demand-forecast-input');
  const demandRange = document.getElementById('demand-forecast-range');
  const demandBadge = document.getElementById('demand-badge');

  const inventoryInput = document.getElementById('inventory-input');
  const inventoryRange = document.getElementById('inventory-range');
  const inventoryBadge = document.getElementById('inventory-badge');

  const orderedInput = document.getElementById('ordered-input');
  const orderedRange = document.getElementById('ordered-range');
  const orderedBadge = document.getElementById('ordered-badge');

  // Outputs
  const predictedUnitsOutput = document.getElementById('predicted-units-output');
  const selectedModelTag = document.getElementById('selected-model-tag');
  const statusCard = document.getElementById('status-card');

  const metricRevenue = document.getElementById('metric-revenue');
  const metricRemaining = document.getElementById('metric-remaining');
  const metricReorder = document.getElementById('metric-reorder');
  const metricTurnover = document.getElementById('metric-turnover');

  const predRf = document.getElementById('pred-rf');
  const predLr = document.getElementById('pred-lr');
  const predDt = document.getElementById('pred-dt');

  const rowRf = document.getElementById('row-rf');
  const rowLr = document.getElementById('row-lr');
  const rowDt = document.getElementById('row-dt');

  // Synchronize Range and Number inputs
  function syncInputs(numInput, rangeInput, badge, suffix = ' units') {
    numInput.addEventListener('input', () => {
      let val = parseFloat(numInput.value) || 0;
      if (val < parseFloat(rangeInput.min)) val = parseFloat(rangeInput.min);
      if (val > parseFloat(rangeInput.max)) val = parseFloat(rangeInput.max);
      rangeInput.value = val;
      badge.textContent = `${val}${suffix}`;
      calculateForecast();
    });

    rangeInput.addEventListener('input', () => {
      numInput.value = rangeInput.value;
      badge.textContent = `${rangeInput.value}${suffix}`;
      calculateForecast();
    });
  }

  syncInputs(demandInput, demandRange, demandBadge);
  syncInputs(inventoryInput, inventoryRange, inventoryBadge);
  syncInputs(orderedInput, orderedRange, orderedBadge);

  // Model Calculation Engine
  function calculateForecast() {
    const demand = parseFloat(demandInput.value) || 0;
    const inventory = parseFloat(inventoryInput.value) || 0;
    const ordered = parseFloat(orderedInput.value) || 0;
    const price = parseFloat(priceInput.value) || 0;
    const discount = parseFloat(discountSelect.value) || 0;
    const promo = parseInt(promoSelect.value, 10);
    const category = categorySelect.value;
    const model = modelSelect.value;

    // Department-based micro adjustments
    let catMultiplier = 1.0;
    if (category === 'Groceries') catMultiplier = 1.015;
    if (category === 'Electronics') catMultiplier = 0.985;
    if (category === 'Toys') catMultiplier = 1.005;

    const promoLift = promo === 1 ? 4.0 : 0.0;
    const discountLift = (discount / 100) * (demand * 0.08);

    // 1. Random Forest prediction formula (calibrated)
    let rawRf = (demand * 0.9947 + promoLift + discountLift + (ordered * 0.005)) * catMultiplier;
    let unitsRf = Math.min(inventory, Math.max(0, Math.round(rawRf)));

    // 2. Linear Regression prediction formula
    let rawLr = (demand * 0.9935 + promoLift * 1.1 + discountLift * 0.9 + 1.2) * catMultiplier;
    let unitsLr = Math.min(inventory, Math.max(0, Math.round(rawLr)));

    // 3. Decision Tree prediction formula
    let rawDt = Math.round((demand * 0.988 + promoLift + discountLift) / 5) * 5 * catMultiplier;
    let unitsDt = Math.min(inventory, Math.max(0, Math.round(rawDt)));

    // Active Model Output
    let activeUnits = unitsRf;
    if (model === 'lr') activeUnits = unitsLr;
    if (model === 'dt') activeUnits = unitsDt;

    // Display primary prediction
    predictedUnitsOutput.textContent = activeUnits.toLocaleString();

    // Table updates
    predRf.textContent = `${unitsRf} units`;
    predLr.textContent = `${unitsLr} units`;
    predDt.textContent = `${unitsDt} units`;

    // Row highlights
    rowRf.classList.toggle('active-row', model === 'rf');
    rowLr.classList.toggle('active-row', model === 'lr');
    rowDt.classList.toggle('active-row', model === 'dt');

    const modelNames = {
      rf: 'Random Forest',
      lr: 'Linear Regression',
      dt: 'Decision Tree'
    };
    selectedModelTag.textContent = `Model: ${modelNames[model]}`;

    // Financial calculations
    const effectivePrice = price * (1 - discount / 100);
    const revenue = Math.round(activeUnits * effectivePrice);
    metricRevenue.textContent = `INR ${revenue.toLocaleString()}`;

    // Inventory metrics
    const remaining = Math.max(0, inventory - activeUnits);
    metricRemaining.textContent = `${remaining} units`;

    // Safety buffer = 1.35x expected sales demand
    const targetStock = Math.round(activeUnits * 1.35);
    const reorder = Math.max(0, targetStock - remaining);
    metricReorder.textContent = `${reorder} units`;

    const turnover = inventory > 0 ? ((activeUnits / inventory) * 100).toFixed(1) : '0.0';
    metricTurnover.textContent = `${turnover}%`;

    // Stock assessment status
    statusCard.className = 'status-card';
    if (inventory <= activeUnits) {
      statusCard.classList.add('danger');
      statusCard.textContent = 'Critical Stock Depletion: Predicted demand equals or exceeds shelf stock. Urgent reorder required.';
    } else if (remaining < activeUnits * 0.3) {
      statusCard.classList.add('warning');
      statusCard.textContent = 'Low Stock Warning: Remaining buffer is below 30% of daily demand. Place replenishment order.';
    } else if (remaining > activeUnits * 2.5) {
      statusCard.classList.add('warning');
      statusCard.textContent = 'Excess Inventory Alert: Remaining buffer exceeds 2.5x daily demand. Reduce incoming orders.';
    } else {
      statusCard.classList.add('optimal');
      statusCard.textContent = 'Optimal Stock Level: Safe buffer maintained against daily sales demand.';
    }
  }

  // Presets
  document.getElementById('preset-avg').addEventListener('click', () => {
    demandInput.value = 136;
    demandRange.value = 136;
    demandBadge.textContent = '136 units';

    inventoryInput.value = 275;
    inventoryRange.value = 275;
    inventoryBadge.textContent = '275 units';

    orderedInput.value = 100;
    orderedRange.value = 100;
    orderedBadge.textContent = '100 units';

    priceInput.value = 149;
    discountSelect.value = '0';
    promoSelect.value = '0';
    calculateForecast();
  });

  document.getElementById('preset-promo').addEventListener('click', () => {
    demandInput.value = 240;
    demandRange.value = 240;
    demandBadge.textContent = '240 units';

    inventoryInput.value = 350;
    inventoryRange.value = 350;
    inventoryBadge.textContent = '350 units';

    orderedInput.value = 150;
    orderedRange.value = 150;
    orderedBadge.textContent = '150 units';

    priceInput.value = 149;
    discountSelect.value = '15';
    promoSelect.value = '1';
    calculateForecast();
  });

  document.getElementById('preset-lowstock').addEventListener('click', () => {
    demandInput.value = 180;
    demandRange.value = 180;
    demandBadge.textContent = '180 units';

    inventoryInput.value = 120;
    inventoryRange.value = 120;
    inventoryBadge.textContent = '120 units';

    orderedInput.value = 40;
    orderedRange.value = 40;
    orderedBadge.textContent = '40 units';

    priceInput.value = 149;
    discountSelect.value = '10';
    promoSelect.value = '0';
    calculateForecast();
  });

  document.getElementById('preset-reset').addEventListener('click', () => {
    demandInput.value = 150;
    demandRange.value = 150;
    demandBadge.textContent = '150 units';

    inventoryInput.value = 250;
    inventoryRange.value = 250;
    inventoryBadge.textContent = '250 units';

    orderedInput.value = 100;
    orderedRange.value = 100;
    orderedBadge.textContent = '100 units';

    priceInput.value = 149;
    discountSelect.value = '10';
    promoSelect.value = '1';
    categorySelect.value = 'Groceries';
    storeSelect.value = 'S001';
    modelSelect.value = 'rf';
    calculateForecast();
  });

  // Event Listeners
  [modelSelect, storeSelect, categorySelect, regionSelect, weatherSelect, promoSelect, discountSelect].forEach(el => {
    el.addEventListener('change', calculateForecast);
  });
  priceInput.addEventListener('input', calculateForecast);

  // Initial Calculation
  calculateForecast();
});
