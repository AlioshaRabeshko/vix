export function getMean(arr: number[]): number {
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

function getStd(arr: number[], mean: number): number {
  const variance = arr.reduce((sum, val) => sum + (val - mean) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

function getZScore(current: number, history: number[]): number {
  const mean = getMean(history);
  const std = getStd(history, mean);
  if (std === 0) {
    return 0;
  }

  const zScore = (current - mean) / std;
  return normalizeZScore(zScore);
}

export function normalizeZScore(zScore: number): number {
  return zScore > 1 ? 1 : zScore < -1 ? -1 : zScore;
}

export default getZScore;

// // Використання
// const history = [30, 40, 50, 45, 60, 70, 55, 65];
// const current = 75;

// const z = getZScore(current, history);

// if (z > 1) {
//   console.log('Високий рівень страху');
// } else if (z < -1) {
//   console.log('Ейфорія');
// } else {
//   console.log('Нормальний стан');
// }
