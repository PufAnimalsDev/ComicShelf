const fs = require('fs');
const path = require('path');

const COLLECTION = 'Marvel Action — Panini/Carrefour';

const rows = [
  ['1', 'Avengers - Nowe zagrożenie', 'Avengers: New Threat', ''],
  ['2', 'Avengers - Rubin przejścia', 'Avengers: Bridged', ''],
  ['3', 'Avengers - Strachojady', 'Avengers: Spiders From Mars', ''],
  ['4', 'Avengers - Koszmar na jawie', 'Avengers: Nightmare on Dream Street', ''],
  ['5', 'Spider-Man - Nowy początek', 'Spider-Man: Fresh Start', ''],
  ['6', 'Spider-Man - W pogoni za pająkiem', 'Spider-Man: Chase of the Spider', ''],
  ['7', 'Spider-Man - Pech', 'Spider-Man: Bad Luck', ''],
  ['8', 'Spider-Man - Venom', 'Spider-Man: Venom', ''],
  ['9', 'Kapitan Marvel - Kosmiczna katastrofa', 'Captain Marvel: Cosmic Catastrophe', ''],
  ['10', 'Kapitan Marvel - Skala bohaterstwa', 'Captain Marvel: Scale of Heroism', ''],
];

const newComics = rows.map(([number, title, original, contents]) => ({
  id: `${COLLECTION}|${number}|${title}`,
  number,
  title,
  original,
  contents,
  date: '',
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
