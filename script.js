document.addEventListener('DOMContentLoaded', function() {
  const calculateBtn = document.getElementById('calculate');
  calculateBtn.addEventListener('click', calculateTVM);
  
  // Auto-disable the input field for what we're solving for
  document.getElementById('solve').addEventListener('change', function() {
    const solveFor = this.value;
    // Enable all inputs first
    document.getElementById('pv').disabled = false;
    document.getElementById('fv').disabled = false;
    document.getElementById('pmt').disabled = false;
    document.getElementById('rate').disabled = false;
    document.getElementById('nper').disabled = false;
    
    // Disable the one we're solving for
    document.getElementById(solveFor).disabled = true;
  });
  
  // Initialize by disabling the first option
  document.getElementById('pv').disabled = true;
});

function calculateTVM() {
  // Get values from form
  const solveFor = document.getElementById('solve').value;
  const pv = parseFloat(document.getElementById('pv').value) || 0;
  const fv = parseFloat(document.getElementById('fv').value) || 0;
  const pmt = parseFloat(document.getElementById('pmt').value) || 0;
  const rate = parseFloat(document.getElementById('rate').value) || 0;
  const nper = parseFloat(document.getElementById('nper').value) || 0;
  const isBeginning = document.getElementById('beginning').checked;
  const type = isBeginning ? 1 : 0;
  
  let result;
  let rateDecimal = rate / 100; // Convert percentage to decimal
  
  try {
    switch(solveFor) {
      case 'pv':
        result = calculatePV(pmt, rateDecimal, nper, fv, type);
        break;
      case 'fv':
        result = calculateFV(pv, pmt, rateDecimal, nper, type);
        break;
      case 'pmt':
        result = calculatePMT(pv, fv, rateDecimal, nper, type);
        break;
      case 'rate':
        result = calculateRate(pv, fv, pmt, nper, type);
        break;
      case 'nper':
        result = calculateNPER(pv, fv, pmt, rateDecimal, type);
        break;
    }
    
    document.getElementById('result-value').textContent = result !== null ? 
      result.toFixed(2) : 'Could not calculate';
  } catch (error) {
    document.getElementById('result-value').textContent = 'Error: ' + error.message;
  }
}

function calculatePV(pmt, rate, nper, fv, type) {
  if (rate === 0) {
    return -fv - pmt * nper;
  }
  
  const pvif = Math.pow(1 + rate, nper);
  let pvalue = -(fv + pmt * (pvif - 1) / rate * (1 + rate * type)) / pvif;
  
  return pvalue;
}

function calculateFV(pv, pmt, rate, nper, type) {
  if (rate === 0) {
    return -pv - pmt * nper;
  }
  
  const pvif = Math.pow(1 + rate, nper);
  const fvifa = (pvif - 1) / rate;
  
  let fvalue = -pv * pvif - pmt * (1 + rate * type) * fvifa;
  
  return fvalue;
}

function calculatePMT(pv, fv, rate, nper, type) {
  if (rate === 0) {
    return -(pv + fv) / nper;
  }
  
  const pvif = Math.pow(1 + rate, nper);
  const pmt = -rate * (pv * pvif + fv) / ((1 + rate * type) * (pvif - 1));
  
  return pmt;
}

function calculateRate(pv, fv, pmt, nper, type) {
  // This is a complex calculation that requires an iterative approach
  // For simplicity, we'll use a binary search method
  
  let low = 0;
  let high = 1;
  let tolerance = 0.0000001;
  let guess = (low + high) / 2;
  
  // First check if a solution exists in reasonable range
  if (pmt === 0 && Math.sign(pv) === Math.sign(fv)) {
    throw new Error("Cannot solve for rate without payment when PV and FV have same sign");
  }
  
  // Increase bounds if necessary
  const checkVal = calculateFV(pv, pmt, high, nper, type);
  if (Math.sign(checkVal) === Math.sign(fv)) {
    high = 1;
    while (Math.sign(calculateFV(pv, pmt, high, nper, type)) === Math.sign(fv)) {
      high *= 2;
      if (high > 1000) {
        throw new Error("Cannot find a valid interest rate");
      }
    }
  }
  
  // Binary search implementation
  for (let i = 0; i < 100; i++) {
    guess = (low + high) / 2;
    const guessVal = calculateFV(pv, pmt, guess, nper, type);
    
    if (Math.abs(guessVal - fv) < tolerance) {
      return guess * 100; // Return as percentage
    }
    
    if (Math.sign(guessVal - fv) === Math.sign(calculateFV(pv, pmt, low, nper, type) - fv)) {
      low = guess;
    } else {
      high = guess;
    }
  }
  
  return guess * 100; // Return as percentage
}

function calculateNPER(pv, fv, pmt, rate, type) {
  if (rate === 0) {
    if (pmt === 0) {
      throw new Error("Cannot calculate periods with zero rate and payment");
    }
    return -(pv + fv) / pmt;
  }
  
  // Handle case where PMT is sufficient to reach FV
  if (pmt === 0) {
    return Math.log(-fv / pv) / Math.log(1 + rate);
  }
  
  const z = pmt * (1 + rate * type) / rate;
  const a = -fv + z;
  const b = pv + z;
  
  if (a === 0 || b === 0 || Math.sign(a) !== Math.sign(b)) {
    throw new Error("Cannot calculate number of periods with these values");
  }
  
  return Math.log(a / b) / Math.log(1 + rate);
}
