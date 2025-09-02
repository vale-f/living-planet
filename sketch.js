let animals = {};
let floatingAnimals = [];

let lpiTable;
let yearsArr = [];
let currentRegion = "Global";

let slider;
let yearLabelElem, indexLabelElem;
let displayIndex = 1.0;

const regionInfo = {
    "Global": {
        csv: "Global.csv",
        animals: [
            "african_elephant", "giraffe", "lion",
            "giant_panda", "komodo_dragon", "tiger",
            "eurasian_lynx", "saiga_antelope", "white_stork",
            "andean_condor", "jaguar", "scarlet_macaw",
            "american_bison", "bald_eagle", "grizzly_bear"
        ]
    },
    "Africa": {
        csv: "africa.csv",
        animals: ["african_elephant", "giraffe", "lion"]
    },
    "Asia and the Pacific": {
        csv: "asia-and-the-pacific.csv",
        animals: ["giant_panda", "komodo_dragon", "tiger"]
    },
    "Europe and Central Asia": {
        csv: "europe-and-central-asia.csv",
        animals: ["eurasian_lynx", "saiga_antelope", "white_stork"]
    },
    "Latin America and Caribbean": {
        csv: "latin-america-and-caribbean.csv",
        animals: ["andean_condor", "jaguar", "scarlet_macaw"]
    },
    "North America": {
        csv: "north-america.csv",
        animals: ["american_bison", "bald_eagle", "grizzly_bear"]
    }
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

    lpiTable = loadTable('assets/tables/Global.csv', 'csv', 'header');
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    imageMode(CENTER);

    yearLabelElem = select("#year-label");
    indexLabelElem = select("#index-label");

    setupAnimals("Global");
    setupSlider();

    // Handles the region change
    const dropdown = document.getElementById('corner-dropdown');
    dropdown.addEventListener('change', (e) => {
        const selectedRegion = e.target.value;
        changeRegion(selectedRegion);
    });
}

function setupAnimals(region) {
    floatingAnimals = [];
    const animalPositions = {
        "african_elephant": [0.42, 0.47, 0.23],
        "giraffe": [0.09, 0.18, 0.31],
        "lion": [0.86, 0.17, 0.17],
        "giant_panda": [0.07, 0.77, 0.2],
        "komodo_dragon": [0.84, 0.86, 0.082],
        "tiger": [0.22, 0.15, 0.17],
        "eurasian_lynx": [0.21, 0.81, 0.12],
        "saiga_antelope": [0.87, 0.51, 0.14],
        "white_stork": [0.25, 0.51, 0.18],
        "andean_condor": [0.69, 0.22, 0.14],
        "jaguar": [0.66, 0.55, 0.15],
        "scarlet_macaw": [0.1, 0.55, 0.21],
        "american_bison": [0.52, 0.15, 0.18],
        "bald_eagle": [0.65, 0.83, 0.14],
        "grizzly_bear": [0.47, 0.82, 0.16]
    };

    for (let key of regionInfo[region].animals) {
        let pos = animalPositions[key];
        let x = pos[0] * width;
        let y = pos[1] * height;
        let size = pos[2] * width;
        floatingAnimals.push(new FloatingAnimal(animals[key], x, y, size));
    }
}

function setupSlider() {
    yearsArr = lpiTable.getColumn('Year').map(Number);
    // If the slider already exists, delete the previous one
    if (slider) slider.remove();
    slider = createSlider(yearsArr[0], yearsArr[yearsArr.length-1], yearsArr[0], 1);
    slider.parent("ui");
    slider.style("width", "240px");
}

function changeRegion(region) {
    currentRegion = region;
    lpiTable = loadTable(`assets/tables/${regionInfo[region].csv}`, 'csv', 'header', () => {
        setupAnimals(region);
        yearsArr = lpiTable.getColumn('Year').map(Number);

        let selectedYear = slider.value();
        let closestYear = yearsArr.reduce((prev, curr) =>
            Math.abs(curr - selectedYear) < Math.abs(prev - selectedYear) ? curr : prev
        );
        setupSlider();
        slider.value(closestYear);
    });
}

function draw() {
    background(245);

    for (let fa of floatingAnimals) {
        fa.update();
        fa.display();
    }

    const currentYear = slider.value();
    let row = lpiTable.findRow(String(currentYear), 'Year');
    displayIndex = row ? Number(row.get('LPI_final')) : null;

    yearLabelElem.html(`<strong>Year</strong>: ${currentYear}`);
    indexLabelElem.html(`Index: ${displayIndex !== null ? displayIndex.toFixed(3) : '—'}`);
}

class FloatingAnimal {
    constructor(img, x, y, targetHeight) {
        this.img = img;
        this.baseX = x;
        this.baseY = y;
        this.targetHeight = targetHeight;
        this.tx = random(1000);
        this.ty = random(2000, 3000);
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