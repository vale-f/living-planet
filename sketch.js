let animals = {};
let floatingAnimals = [];

let lpiGlobalTable;
let yearsArr = [];

let slider; // p5 slider (range)
let yearLabelElem, indexLabelElem;
let displayIndex = 1.0;

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

    lpiGlobalTable = loadTable('assets/tables/Global.csv', 'csv', 'header');
}

function setup() {
    resizeCanvas(windowWidth, windowHeight);
    imageMode(CENTER)
    noStroke();

    let animalList = [
        ["african_elephant", 0.42, 0.45, 0.23],
        ["giraffe", 0.08, 0.25, 0.31],
        ["lion", 0.83, 0.13, 0.17],
        ["giant_panda", 0.06, 0.82, 0.2],
        ["komodo_dragon", 0.87, 0.85, 0.082],
        ["tiger", 0.25, 0.13, 0.17],
        ["eurasian_lynx", 0.25, 0.8,  0.12],
        ["saiga_antelope", 0.88, 0.56,  0.14],
        ["white_stork", 0.25, 0.54, 0.18],
        ["andean_condor", 0.8, 0.3,  0.14],
        ["jaguar", 0.65, 0.55, 0.15],
        ["scarlet_macaw", 0.07, 0.6, 0.21],
        ["american_bison", 0.55, 0.21, 0.18],
        ["bald_eagle", 0.65, 0.8,  0.14],
        ["grizzly_bear", 0.48, 0.84, 0.16]
    ];

    for (let i = 0; i < animalList.length; i++) {
        let key = animalList[i][0];
        let x = animalList[i][1] * width;
        let y = animalList[i][2] * height;
        let size = animalList[i][3] * width;
        floatingAnimals.push(new FloatingAnimal(animals[key], x, y, size));
    }

    yearsArr = lpiGlobalTable.getColumn('Year').map(Number);

    // UI references
    slider = createSlider(yearsArr[0], yearsArr[yearsArr.length-1], yearsArr[0], 1);
    slider.parent("ui");
    slider.style("width", "240px");

    yearLabelElem = select("#year-label");
    indexLabelElem = select("#index-label");
}

function draw() {
    background(245);

    for (let fa of floatingAnimals) {
        fa.update();
        fa.display();
    }

    const currentYear = slider.value();

    let row = lpiGlobalTable.findRow(String(currentYear), 'Year');
    displayIndex = row ? Number(row.get('LPI_final')) : null;

    yearLabelElem.html(`<strong>Year</strong>: ${currentYear}`);
    indexLabelElem.html(`Index: ${displayIndex !== null ? displayIndex.toFixed(2) : '—'}`);
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
        // Movement using Perlin noise
        this.x = this.baseX + map(noise(this.tx), 0, 1, -width * 0.1, width * 0.12);
        this.y = this.baseY + map(noise(this.ty), 0, 1, -height * 0.1, height * 0.12);

        this.tx += 0.0017;
        this.ty += 0.0017;
    }

    display() {
        let scaledHeight = this.targetHeight * displayIndex;
        drawImageKeepAspect(this.img, this.x, this.y, null, scaledHeight);
    }
}