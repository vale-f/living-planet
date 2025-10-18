// Helper function to keep aspect ratio when drawing images
function drawImageKeepAspect(img, x, y, targetWidth=null, targetHeight=null) {
  if (!img) return;
  
  let w, h;

  if (targetWidth && !targetHeight) {
    // Scale based on width
    let ratio = img.height / img.width;
    w = targetWidth;
    h = targetWidth * ratio;
  } else if (targetHeight && !targetWidth) {
    // Scale based on height
    let ratio = img.width / img.height;
    h = targetHeight;
    w = targetHeight * ratio;
  } else if (targetWidth && targetHeight) {
    // If both are provided, scaling is forced (can cause distortion)
    w = targetWidth;
    h = targetHeight;
  } else {
    w = img.width;
    h = img.height;
  }

  image(img, x, y, w, h);
}

// Helper function to find the closest year from a list
function findClosestYear(years, target) {
  if (!years || years.length === 0) return null;
  let closest = years[0];
  let minDiff = Math.abs(target - closest);
  for (let y of years) {
    const d = Math.abs(target - y);
    if (d < minDiff) { minDiff = d; closest = y; }
  }
  return closest;
}
