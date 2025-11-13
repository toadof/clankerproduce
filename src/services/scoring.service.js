export function scoreMetadata(meta) {
  let score = 0;
  let reasons = [];

  const exif = meta.exif || {};
  const sharp = meta.sharp || {};

  // -------------------------
  // AI INDICATORS
  // -------------------------

  // 1. No EXIF at all → strong AI signal
  if (!exif || Object.keys(exif).length === 0) {
      score += 30;
      reasons.push({ type: "AI", msg: "No EXIF metadata found." });
  }

  // 2. Missing camera make/model
  if (!exif.Make) {
      score += 20;
      reasons.push({ type: "AI", msg: "Camera manufacturer missing." });
  }
  if (!exif.Model) {
      score += 10;
      reasons.push({ type: "AI", msg: "Camera model missing." });
  }

  // 3. GPS missing (not strong AI, but supportive)
  if (!exif.GPSLatitude && !exif.GPSLongitude) {
      score += 5;
      reasons.push({ type: "AI", msg: "No GPS metadata (location) found." });
  }

  // 4. DPI suspicious or missing
  const dpi = sharp.density || 0;
  if (dpi === 72 || dpi === 0) {
      score += 5;
      reasons.push({ type: "AI", msg: "DPI is default (72) or missing — common in generated images." });
  }

  // -------------------------
  // REAL INDICATORS
  // -------------------------

  // Reduce score for real signals (subtract points)
  // 1. EXIF camera metadata
  if (exif.Make && exif.Model) {
      score -= 25;
      reasons.push({ type: "REAL", msg: "Camera Make & Model detected: " + exif.Make + " " + exif.Model });
  }

  // 2. Natural timestamps
  if (exif.DateTimeOriginal && exif.DateTimeDigitized) {
      score -= 10;
      reasons.push({ type: "REAL", msg: "Valid timestamp chain detected." });
  }

  // 3. Lens metadata present
  if (exif.FNumber || exif.ExposureTime || exif.FocalLength) {
      score -= 10;
      reasons.push({ type: "REAL", msg: "Lens metadata found (FNumber/Exposure/FocalLength)." });
  }

  // 4. Natural camera aspect ratio
  if (sharp.width && sharp.height) {
      const ratio = sharp.width / sharp.height;
      const naturalRatio = [1.33, 1.5, 1.77]; // 4:3, 3:2, 16:9
      const close = naturalRatio.some(r => Math.abs(ratio - r) < 0.1);
      if (close) {
          score -= 5;
          reasons.push({ type: "REAL", msg: `Natural aspect ratio detected (${sharp.width}×${sharp.height}).` });
      }
  }

  // -------------------------
  // FINAL LABEL
  // -------------------------

  let label = "Uncertain";
  if (score >= 40) label = "Likely AI";
  if (score <= 0) label = "Likely Human";

  return { score, label, reasons };
}
