// Aargau 2026 (Brugg) – alt vs. neu
// Tarif 2025 als Proxy für 2026

const BRACKETS = [
  [0.00,  4300],
  [0.01,  3800],
  [0.02,  3900],
  [0.03,  4200],
  [0.04,  4300],
  [0.05,  5200],
  [0.06,  7400],
  [0.07,  8600],
  [0.08,  9600],
  [0.085, 11800],
  [0.09,  11700],
  [0.095, 35300],
  [0.10,  66300],
  [0.105, 176300],
];
const TOP_RATE = 0.11;

const KANTON = 103.0;
const GEMEINDE = 97.0;
const KIRCHE = 0.0;

const fmt = (n) => {
  const parts = n.toFixed(2).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  return `CHF ${parts[0]}.${parts[1]}`;
};

const einfacheA = (income) => {
  let rest = Math.max(0, income);
  let tax = 0;
  for (const [rate, width] of BRACKETS) {
    if (rest <= 0) break;
    const step = Math.min(rest, width);
    tax += step * rate;
    rest -= step;
  }
  if (rest > 0) tax += rest * TOP_RATE;
  return tax;
};

const einfacheB = (income) => 2 * einfacheA(income / 2);

const total = (simple) => {
  const mult = (KANTON + GEMEINDE + KIRCHE) / 100.0;
  return simple * (1 + mult);
};

const calc = () => {
  const inc1 = Number(document.getElementById('inc1').value || 0);
  const inc2 = Number(document.getElementById('inc2').value || 0);
  const kids = Number(document.getElementById('kids').value || 0);
  const singleParent = document.getElementById('singleParent').checked;

  const totalIncome = inc1 + inc2;

  // Alt
  const useTarifB = (inc2 > 0) || (singleParent && kids > 0);
  const oldSimple = useTarifB ? einfacheB(totalIncome) : einfacheA(totalIncome);
  const oldTotal = total(oldSimple);

  // Neu
  const newSimple = einfacheA(inc1) + (inc2 > 0 ? einfacheA(inc2) : 0);
  const newTotal = total(newSimple);

  const diff = newTotal - oldTotal;

  document.getElementById('oldTotal').textContent = fmt(oldTotal);
  document.getElementById('newTotal').textContent = fmt(newTotal);
  document.getElementById('diff').textContent = fmt(diff);
};

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calc').addEventListener('click', calc);
  calc();
});
