const fs = require('fs');
const path = require('path');

const COLLECTION = 'Amazing Spider-Man. Epic Collection — Egmont';

const rows = [
  [
    '1',
    'Ostatnie łowy Kravena',
    'The Amazing Spider-Man Epic Collection: Kraven\'s Last Hunt',
    'Zeszyty The Amazing Spider-Man #289–294 i Annual #20–21, powieść graficzna Spider-Man Versus Wolverine, zeszyty Web of Spider-Man #29–32 oraz Peter Parker, The Spectacular Spider-Man #131–132',
    '24.03.2021',
  ],
  [
    '2',
    'Venom',
    'The Amazing Spider-Man Epic Collection: Venom',
    'Zeszyty The Amazing Spider-Man #295–310 i Annual #22, Web of Spider-Man #33 oraz Peter Parker, The Spectacular Spider-Man #133',
    '16.06.2021',
  ],
  [
    '3',
    'Inferno',
    'The Amazing Spider-Man Epic Collection: Assassin Nation',
    'Zeszyty The Amazing Spider-Man #311–325 i Annual #23 oraz powieść graficzna Amazing Spider-Man: Parallel Lives',
    '24.11.2021',
  ],
  [
    '4',
    'Kosmiczne przygody',
    'The Amazing Spider-Man Epic Collection: Cosmic Adventures',
    'Zeszyty The Amazing Spider-Man #326–333 i Annual #24, Spectacular Spider-Man #158–160 i Annual #10 oraz Web of Spider-Man #59–61 i Annual #6',
    '23.03.2022',
  ],
  [
    '5',
    'Powrót Złowieszczej Szóstki',
    'The Amazing Spider-Man Epic Collection: Return of the Sinister Six',
    'Zeszyty The Amazing Spider-Man #334–350 oraz powieść graficzna Spider-Man: Spirits of the Earth',
    '27.07.2022',
  ],
  [
    '6',
    'Każdy z każdym',
    'The Amazing Spider-Man Epic Collection: Round Robin',
    'Zeszyty The Amazing Spider-Man #351–360 i Annual #25, Spectacular Spider-Man Annual #11, Web of Spider-Man Annual #7 oraz powieść graficzna Spider-Man: Fear Itself',
    '08.02.2023',
  ],
  [
    '7',
    'Plaga pająkobójców',
    'The Amazing Spider-Man Epic Collection: Invasion of the Spider-Slayers',
    'Zeszyty The Amazing Spider-Man #368–377 i Annual #27, Spider-Man Special Edition: The Trial of Venom oraz powieść graficzna Spider-Man/Dr. Strange: The Way to Dusty Death',
    '26.07.2023',
  ],
  [
    '8',
    'Rzeź maksymalna',
    'The Amazing Spider-Man Epic Collection: Maximum Carnage',
    'Zeszyty Amazing Spider-Man #378–380, Web of Spider-Man #101–103, Spider-Man #35–37, Spectacular Spider-Man #201–203, powieść graficzna Spider-Man/Punisher/Sabretooth: Designer Genes oraz materiały z Spider-Man Unlimited #1–2',
    '27.09.2023',
  ],
  [
    '9',
    'Łowcy bohaterów',
    'The Amazing Spider-Man Epic Collection: The Hero Killers',
    'Zeszyty Amazing Spider-Man #361–367 i Annual #26, Amazing Spider-Man: Soul of the Hunter, Spectacular Spider-Man Annual #12, Web of Spider-Man Annual #8 oraz New Warriors Annual #2',
    '24.04.2024',
  ],
  [
    '10',
    'Skradzione życie',
    'The Amazing Spider-Man Epic Collection: Lifetheft',
    'Zeszyty Amazing Spider-Man #381–393 i Annual #28, Spider-Man #45, Spectacular Spider-Man #211, Web of Spider-Man #112 oraz Amazing Spider-Man Ashcan Edition',
    '27.11.2024',
  ],
  [
    '11',
    'Saga klonów',
    'The Amazing Spider-Man Epic Collection: The Clone Saga',
    'Zeszyty Web of Spider-Man #117–119, Amazing Spider-Man #394–396, Spider-Man #51–53, Spectacular Spider-Man #217–219 oraz Spider-Man Unlimited #7',
    '26.03.2025',
  ],
  [
    '12',
    'Sieć życia, sieć śmierci',
    'The Amazing Spider-Man Epic Collection: Web of Life, Web of Death',
    'Zeszyty Web of Spider-Man #120–123, Amazing Spider-Man #397–399, Spider-Man #54–56, Spectacular Spider-Man #220–222, Spider-Man Unlimited #8, Spider-Man: Funeral for an Octopus #1–3 oraz Spider-Man: The Clone Journal',
    '18.06.2025',
  ],
  [
    '13',
    'Sekret kamiennej tablicy',
    'The Amazing Spider-Man Epic Collection: Secret of the Petrified Tablet',
    'Zeszyty Amazing Spider-Man #68–85 i Amazing Spider-Man Annual #5',
    '17.06.2026',
  ],
  [
    '14',
    'The Death of Captain Stacy',
    'The Amazing Spider-Man Epic Collection: The Death of Captain Stacy',
    'Zeszyty Amazing Spider-Man #86–104',
    '',
  ],
];

const newComics = rows.map(([number, title, original, contents, date]) => ({
  id: `${COLLECTION}|${number}|${title}`,
  number,
  title,
  original,
  contents,
  date,
  collection: COLLECTION,
}));

const catalogPath = path.join(__dirname, '..', 'data', 'marvel-pl.js');
const src = fs.readFileSync(catalogPath, 'utf8');
const catalog = eval(src.replace('window.MARVEL_COMIC_CATALOG=', ''));

const existingIds = new Set(catalog.map((x) => x.id));
for (const comic of newComics) {
  if (existingIds.has(comic.id)) {
    console.error('Duplicate ID:', comic.id);
    process.exit(1);
  }
}

const merged = [...catalog, ...newComics];
fs.writeFileSync(catalogPath, `window.MARVEL_COMIC_CATALOG=${JSON.stringify(merged)};\n`, 'utf8');
console.log(`Added ${newComics.length} comics. Total: ${merged.length}`);
