const fs = require('fs');
const path = require('path');

const COLLECTION = 'Marvel Komiks — Egmont';

const rows = [
  [
    '1',
    '1/2019',
    'Marvel Komiks #1 (Marvel Adventures anthology)',
    'Marvel Adventures: Super Heroes #1–2, Marvel Adventures: Spider-Man #1–2 oraz Marvel Adventures: The Avengers #1',
    '21.06.2019',
  ],
  [
    '2',
    '2/2019',
    'Marvel Komiks #2 (Marvel Adventures anthology)',
    'Marvel Adventures: Super Heroes #3, Marvel Adventures: Spider-Man #3–5 oraz Marvel Adventures: The Avengers #2',
    '19.07.2019',
  ],
  [
    '3',
    '3/2019',
    'Marvel Komiks #3 (Marvel Adventures anthology)',
    'Marvel Adventures: Super Heroes #4–5, Marvel Adventures: Spider-Man #6–7 oraz Marvel Adventures: The Avengers #3',
    '21.08.2019',
  ],
  [
    '4',
    '4/2019',
    'Marvel Komiks #4 (Marvel Adventures anthology)',
    'Marvel Adventures: Super Heroes #9, Marvel Adventures: Hulk #1, Marvel Adventures: Spider-Man #8–9 oraz Marvel Adventures: The Avengers #4',
    '23.10.2019',
  ],
  [
    '5',
    '5/2019',
    'Marvel Komiks #5 (Marvel Adventures anthology)',
    'Marvel Adventures: Super Heroes #11, Marvel Adventures: Hulk #2, Marvel Adventures: Spider-Man #10–11 oraz Marvel Adventures: The Avengers #5',
    '18.12.2019',
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
