const fs = require('fs');
const path = require('path');

const COLLECTION = 'Wolverine — Jason Aaron kolekcja';

const rows = [
  [
    '1',
    'Tom 1',
    'Wolverine By Jason Aaron: The Complete Collection: Vol 1',
    'Zeszyty Wolverine (2003) #56, #62–65, #73–74, Wolverine: Manifest Destiny #1–4, Wolverine: Weapon X #1–5 oraz Wolverine (1988) #175',
    '08.11.2017',
  ],
  [
    '2',
    'Tom 2',
    'Wolverine By Jason Aaron: The Complete Collection: Vol 2',
    'Dark Reign: The List – Wolverine, Wolverine: Weapon X #6–16 oraz Dark X-Men: The Beginning #3',
    '24.01.2018',
  ],
  [
    '3',
    'Tom 3',
    'Wolverine By Jason Aaron: The Complete Collection: Vol 3',
    'Astonishing Spider-Man & Wolverine #1–6, Wolverine (2010) #1–9 i #5.1 oraz Wolverine: Road to Hell #1',
    '18.06.2018',
  ],
  [
    '4',
    'Tom 4',
    'Wolverine By Jason Aaron: The Complete Collection: Vol 4',
    'Wolverine (2010) #10–20 oraz #300–304',
    '19.09.2018',
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
