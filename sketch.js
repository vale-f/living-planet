let animals = {};
let floatingAnimals = [];

let lpiTable;
let yearsArr = [];
let currentSelection = "Global";
let currentMode = "Region";

let slider;
let yearLabelElem, indexLabelElem;
let displayIndex = 1.0;

const regionInfo = {
  "Global": { csv: "global.csv", animals: [ "african_elephant","giraffe","lion","giant_panda","komodo_dragon","tiger","eurasian_lynx","saiga_antelope","white_stork","andean_condor","jaguar","scarlet_macaw","american_bison","bald_eagle","grizzly_bear" ] },
  "Africa": { csv: "africa.csv", animals: ["african_elephant","giraffe","lion"] },
  "Asia and the Pacific": { csv: "asia-and-the-pacific.csv", animals: ["giant_panda","komodo_dragon","tiger"] },
  "Europe and Central Asia": { csv: "europe-and-central-asia.csv", animals: ["eurasian_lynx","saiga_antelope","white_stork"] },
  "Latin America and Caribbean": { csv: "latin-america-and-caribbean.csv", animals: ["andean_condor","jaguar","scarlet_macaw"] },
  "North America": { csv: "north-america.csv", animals: ["american_bison","bald_eagle","grizzly_bear"] }
};

const ecosystemInfo = {
  "Global": { csv: "global.csv", animals: ["american_alligator","hippopotamus","mekong_giant_catfish","great_white_shark","humpback_whale","monk_seal","african_elephant-terrestrial","andean_condor-terrestrial","tiger-terrestrial"] },
  "Freshwater": { csv: "freshwater.csv", animals: ["american_alligator","hippopotamus","mekong_giant_catfish"] },
  "Marine": { csv: "marine.csv", animals: ["great_white_shark","humpback_whale","monk_seal"] },
  "Terrestrial": { csv: "terrestrial.csv", animals: ["african_elephant-terrestrial","andean_condor-terrestrial","tiger-terrestrial"] }
};

function preload() {
  animals["african_elephant"] = loadImage("assets/africa/african_elephant.svg");
  animals["giraffe"] = loadImage("assets/africa/giraffe.svg");
  animals["lion"] = loadImage("assets/africa/lion.svg");

  animals["giant_panda"] = loadImage("assets/asia-and-the-pacific/giant_panda.svg");
  animals["komodo_dragon"] = loadImage("assets/asia-and-the-pacific/komodo_dragon.svg");
  animals["tiger"] = loadImage("assets/asia-and-the-pacific/tiger.svg");

  animals["eurasian_lynx"] = loadImage("assets/europe-and-central-asia/eurasian_lynx.svg");
  animals["saiga_antelope"] = loadImage("assets/europe-and-central-asia/saiga_antelope.svg");
  animals["white_stork"] = loadImage("assets/europe-and-central-asia/white_stork.svg");

  animals["andean_condor"] = loadImage("assets/latin-america-and-caribbean/andean_condor.svg");
  animals["jaguar"] = loadImage("assets/latin-america-and-caribbean/jaguar.svg");
  animals["scarlet_macaw"] = loadImage("assets/latin-america-and-caribbean/scarlet_macaw.svg");

  animals["american_bison"] = loadImage("assets/north-america/american_bison.svg");
  animals["bald_eagle"] = loadImage("assets/north-america/bald_eagle.svg");
  animals["grizzly_bear"] = loadImage("assets/north-america/grizzly_bear.svg");


  animals["american_alligator"] = loadImage("assets/freshwater/american_alligator.svg");
  animals["hippopotamus"] = loadImage("assets/freshwater/hippopotamus.svg");
  animals["mekong_giant_catfish"] = loadImage("assets/freshwater/mekong_giant_catfish.svg");

  animals["great_white_shark"] = loadImage("assets/marine/great_white_shark.svg");
  animals["humpback_whale"] = loadImage("assets/marine/humpback_whale.svg");
  animals["monk_seal"] = loadImage("assets/marine/monk_seal.svg");

  animals["african_elephant-terrestrial"] = loadImage("assets/terrestrial/african_elephant-terrestrial.svg");
  animals["andean_condor-terrestrial"] = loadImage("assets/terrestrial/andean_condor-terrestrial.svg");
  animals["tiger-terrestrial"] = loadImage("assets/terrestrial/tiger-terrestrial.svg");

  lpiTable = loadTable('assets/tables/global.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  yearLabelElem = select("#year-label");
  indexLabelElem = select("#index-label");

  populateSecondDropdown("Region");
  
  changeSelection("Global");

  const secondDropdown = document.getElementById('second-dropdown');
  secondDropdown.addEventListener('change', (e) => {
    const sel = e.target.value;
    changeSelection(sel);
  });

  const firstDropdown = document.getElementById('first-dropdown');
  firstDropdown.value = "Region";
  firstDropdown.addEventListener('change', (e) => {
    const mode = e.target.value;
    currentMode = mode;
    populateSecondDropdown(mode);
    
    const second = document.getElementById('second-dropdown');
    second.value = "Global";
    changeSelection("Global");
  });

  const infoBtn = document.getElementById('info-btn');
  const infoModal = document.getElementById('info-modal');
  const infoClose = document.getElementById('info-close');

  function openInfoModal() {
    if (!infoModal) return;
    infoModal.style.display = 'flex';
    infoModal.setAttribute('aria-hidden', 'false');
    if (infoClose) infoClose.focus();
  }
  function closeInfoModal() {
    if (!infoModal) return;
    infoModal.style.display = 'none';
    infoModal.setAttribute('aria-hidden', 'true');
    if (infoBtn) infoBtn.focus();
  }
  if (infoBtn) infoBtn.addEventListener('click', openInfoModal);
  if (infoClose) infoClose.addEventListener('click', closeInfoModal);
  if (infoModal) {
    infoModal.addEventListener('click', (e) => { if (e.target === infoModal) closeInfoModal(); });
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeInfoModal(); });
}

function populateSecondDropdown(mode) {
  const second = document.getElementById('second-dropdown');
  if (!second) return;
  second.innerHTML = "";

  if (mode === "Region") {
    const regions = ["Global","Africa","Asia and the Pacific","Europe and Central Asia","Latin America and Caribbean","North America"];
    regions.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r; opt.textContent = r;
      second.appendChild(opt);
    });
  } else {
    const ecosystems = ["Global","Freshwater","Marine","Terrestrial"];
    ecosystems.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r; opt.textContent = r;
      second.appendChild(opt);
    });
  }
}

function changeSelection(selectionName) {
  currentSelection = selectionName;

  const infoObj = (currentMode === "Region") ? regionInfo[selectionName] : ecosystemInfo[selectionName];
  if (!infoObj) {
    console.warn("No info object for", currentMode, selectionName);
    return;
  }

  const path = `assets/tables/${infoObj.csv}`;
  lpiTable = loadTable(path, 'csv', 'header', () => {
    setupAnimals(selectionName);
    yearsArr = lpiTable.getColumn('Year').map(Number);
    setupSlider();

    if (slider) {
      const selectedYear = slider.value ? slider.value() : yearsArr[0];
      const closest = yearsArr.reduce((prev, curr) =>
        Math.abs(curr - selectedYear) < Math.abs(prev - selectedYear) ? curr : prev
      , yearsArr[0]);
      slider.value(closest);
    }
  }, (err) => {
    console.error("Failed to load table:", path, err);
  });
}

function setupAnimals(selectionName) {
  floatingAnimals = [];

  const infoObj = (currentMode === "Region") ? regionInfo[selectionName] : ecosystemInfo[selectionName];
  if (!infoObj || !Array.isArray(infoObj.animals)) {
    console.warn("No animals defined for", currentMode, selectionName);
    return;
  }

  const animalPositions = {
    "african_elephant":[0.42,0.47,0.23],"giraffe":[0.09,0.18,0.31],"lion":[0.86,0.17,0.17],
    "giant_panda":[0.07,0.77,0.2],"komodo_dragon":[0.84,0.86,0.082],"tiger":[0.22,0.15,0.17],
    "eurasian_lynx":[0.21,0.81,0.12],"saiga_antelope":[0.87,0.51,0.14],"white_stork":[0.25,0.51,0.18],
    "andean_condor":[0.69,0.22,0.14],"jaguar":[0.66,0.55,0.15],"scarlet_macaw":[0.1,0.55,0.21],
    "american_bison":[0.52,0.15,0.18],"bald_eagle":[0.65,0.83,0.14],"grizzly_bear":[0.47,0.82,0.16],
    "american_alligator":[0.25,0.47,0.11],"hippopotamus":[0.85,0.73,0.135],"mekong_giant_catfish":[0.58,0.25,0.09],
    "great_white_shark":[0.23,0.18,0.17],"humpback_whale":[0.55,0.83,0.21],"monk_seal":[0.55,0.45,0.07],
    "african_elephant-terrestrial":[0.8,0.25,0.25],"andean_condor-terrestrial":[0.15,0.32,0.14],"tiger-terrestrial":[0.1,0.82,0.18]
  };

  for (let key of infoObj.animals) {
    const pos = animalPositions[key];
    if (!pos) {
      console.warn("No position for", key);
      continue;
    }
    const img = animals[key];
    if (!img) {
      console.warn("No loaded image for", key);
      continue;
    }
    const x = pos[0] * width;
    const y = pos[1] * height;
    const size = pos[2] * width;
    floatingAnimals.push(new FloatingAnimal(img, x, y, size));
  }
}

function setupSlider() {
  yearsArr = lpiTable.getColumn('Year').map(Number);
  if (slider) slider.remove();
  slider = createSlider(yearsArr[0], yearsArr[yearsArr.length - 1], yearsArr[0], 1);
  slider.parent("ui");
  slider.style("width", "240px");
}

function draw() {
  background(245);

  for (let fa of floatingAnimals) {
    fa.update();
    fa.display();
  }

  if (lpiTable && slider) {
    const currentYear = slider.value();
    let row = lpiTable.findRow(String(currentYear), 'Year');
    displayIndex = row ? Number(row.get('LPI_final')) : null;

    yearLabelElem.html(`<strong>Year</strong>: ${currentYear}`);
    indexLabelElem.html(`Index: ${displayIndex !== null ? displayIndex.toFixed(3) : '—'}`);
  }
}

class FloatingAnimal {
  constructor(img, x, y, targetHeight) {
    this.img = img;
    this.baseX = x;
    this.baseY = y;
    this.targetHeight = targetHeight;
    this.tx = random(1000);
    this.ty = random(2000, 3000);
    this.x = this.baseX;
    this.y = this.baseY;
  }

  update() {
    this.x = this.baseX + map(noise(this.tx), 0, 1, -width * 0.1, width * 0.14);
    this.y = this.baseY + map(noise(this.ty), 0, 1, -height * 0.1, height * 0.14);

    this.tx += 0.0018;
    this.ty += 0.0018;
  }

  display() {
    let scaledHeight = this.targetHeight * (displayIndex ?? 1.0);
    drawImageKeepAspect(this.img, this.x, this.y, null, scaledHeight);
  }
}
