const fs = require('fs');
const path = require('path');

const COLLECTION = 'DC Comics — Egmont';
const SPECIAL_COLLECTION = 'DC Comics — wydania specjalne';

const rows = [
  ['1', 'Batman: Hush, część 1', 'Batman: Hush, Part 1', 'Zeszyty Batman (vol. 1) #608-613 (grudzień 2002-maj 2003) oraz pojedyncza historia z Detective Comics (vol. 1) #27 (maj 1939)', '24.08.2016', COLLECTION],
  ['2', 'Batman: Hush, część 2', 'Batman: Hush, Part 2', 'Zeszyty Batman (vol. 1) #614-619 (czerwiec-listopad 2003), Wizard: The Comics Magazine (vol. 1) #0 (wrzesień 2003) oraz pojedyncza historia z Detective Comics (vol. 1) #33 (listopad 1939)', '07.09.2016', COLLECTION],
  ['3', 'Green Arrow: Kołczan, część 1', 'Green Arrow: Quiver, Part 1', 'Zeszyty Green Arrow (vol. 3) #1-5 (kwiecień 2001-sierpień 2001) oraz The Brave and the Bold (vol. 1) #85 (wrzesień 1969)', '21.09.2016', COLLECTION],
  ['4', 'Green Arrow: Kołczan, część 2', 'Green Arrow: Quiver, Part 2', 'Zeszyty Green Arrow (vol. 3) #6-10 (wrzesień 2001-styczeń 2002) oraz pojedyncze historie z Flash Comics (vol. 1) #86, 92 (sierpień 1947, luty 1948)', '05.10.2016', COLLECTION],
  ['5', 'Batman: Batman i Syn', 'Batman: Batman & Son', 'Zeszyty Batman (vol. 1) #655-658, 664-665 (wrzesień-grudzień 2006, maj-czerwiec 2007) oraz pojedyncza historia z Detective Comics (vol. 1) # 411 (maj 1971)', '19.10.2016', COLLECTION],
  ['6', 'Wonder Woman: Krąg', 'Wonder Woman: The Circle', 'Zeszyty Wonder Woman (vol. 3) #14-17 (styczeń-kwiecień 2008) oraz Wonder Woman (vol. 1) #98, 105 (maj 1958, kwiecień 1959)', '02.11.2016', COLLECTION],
  ['7', 'Batman: Długie Halloween, część 1', 'Batman: Long Halloween, Part 1', 'Zeszyty Batman: The Long Halloween #1-6 (grudzień 1996-maj 1997) oraz pojedyncza historia z Detective Comics (vol. 1) #140 (październik 1948) i pojedyncza historia Batman (vol. 1) #181 (czerwień 1966)', '16.11.2016', COLLECTION],
  ['8', 'Batman: Długie Halloween, część 2', 'Batman: Long Halloween, Part 2', 'Zeszyty Batman: The Long Halloween #7-13 (czerwiec-grudzień 1997) oraz pojedyncza historia z Detective Comics (vol. 1) #66 (sierpień 1942)', '30.11.2016', COLLECTION],
  ['9', 'Batman: Śmierć w Rodzinie', 'Batman: A Death in the Family', 'Zeszyty Batman (vol.1) #426-429 (grudzień 1988-styczeń 1989) oraz Batman (vol.1) #366 (grudzień 1983)', '14.12.2016', COLLECTION],
  ['10', 'Amerykańska Liga Sprawiedliwości: Ziemia Dwa', 'JLA: Earth 2', 'Zeszyty JLA: Earth 2 (styczeń 2000) oraz Flash (vol.1) #123 (wrzesień 1961)', '28.12.2016', COLLECTION],
  ['11', 'Catwoman: Wielki Skok Seliny', "Catwoman: Selina's Big Score", "Zeszyty Catwoman: Selina's Big Score (wrzesień 2002), Detective Comics (vol.1) #759-762 (sierpień-listopad 2001) oraz pojedyncza historia z Batman (vol. 1) #1 (czerwień 1940)", '11.01.2017', COLLECTION],
  ['12', 'Superman: Ostatni syn Kryptona', 'Superman: Last Son of Krypton', 'Zeszyty Action Comics (vol. 1) #844-846, 851 (grudzień 2006-luty 2007, sierpień 2007), Superman Annual (vol.1) #13 (listopad 2007), Action Comics Annual (vol. 1) #11 (czerwień 2008) oraz Superman (vol.1) #1 (lipiec 1939)', '25.01.2017', COLLECTION],
  ['13', 'Amerykańska Liga Sprawiedliwości: Wieża Babel', 'JLA: Tower of Babel', 'Zeszyty JLA # 43-46 (lipiec-październik 2000), JLA: Secret Files and Origins #3 (grudzień 2000) oraz The Brave and the Bold (vol.1) #28 (marzec 1960)', '08.02.2017', COLLECTION],
  ['14', 'Batman: Zagłada Gotham', 'The Doom That Came to Gotham', 'Zeszyty Batman: The Doom That Came to Gotham #1-3 (listopad 2000-styczeń 2001), pojedyncza historia z Batman: Gotham Knights #36 (luty 2003) oraz The Demon (vol.1) #1 (wrzesień 1972)', '22.02.2017', COLLECTION],
  ['15', 'Amerykańska Liga Sprawiedliwości: Rok Pierwszy, część 1', 'JLA: Year One, Part 1', 'JLA: Year One #1-6 (styczeń-czerwień 1998) oraz Justice League of America (vol. 1) #9 (luty 1962)', '08.03.2017', COLLECTION],
  ['16', 'Amerykańska Liga Sprawiedliwości: Rok Pierwszy, część 2', 'JLA: Year One, Part 2', 'JLA: Year One #7-12 (lipiec-grudzień 1998) oraz pojedyncza historia z Detective Comics (vol. 1) #225 (listopad 1955)', '22.03.2017', COLLECTION],
  ['17', 'Harley Quinn: Preludia i fantazje', 'Harley Quinn: Preludes and Knock-knock Jokes', 'Zeszyty Harley Quinn (vol. 1) #1-7 (grudzień 2000-czerwień 2001) oraz Batman Adventures (vol. 1) #12 (wrzesień 1993)', '05.04.2017', COLLECTION],
  ['18', 'Superman: Człowiek ze Stali', 'Superman: Man of Steel', 'Zeszyty The Man of Steel (vol. 1) #1-6 (sierpień-październik 1986) oraz pojedyncza historia z Action Comics (vol. 1) #1 (czerwień 1938)', '19.04.2017', COLLECTION],
  ['19', 'Lex Luthor: Człowiek ze Stali', 'Lex Luthor: Man of Steel', 'Zeszyty Lex Luthor: Man of Steel #1-5 (maj-wrzesień 2005) oraz pojedyncza historia z Action Comics (vol. 1) #23 (kwiecień 1940)', '02.05.2017', COLLECTION],
  ['20', 'Amerykańska Liga Sprawiedliwości: Sprawiedliwość, część 1', 'Justice, Part 1', 'Zeszyty Justice #1-6 (październik 2005-sierpień 2006) oraz pojedyncza historia z More Fun Comics #73 (luty 1941)', '17.05.2017', COLLECTION],
  ['21', 'Amerykańska Liga Sprawiedliwości: Sprawiedliwość, część 2', 'Justice, Part 2', 'Zeszyty Justice #7-12 (wrzesień 2006-lipiec 2007) oraz pojedyncza historia z Whiz Comics #2 (luty 1940)', '31.05.2017', COLLECTION],
  ['22', 'Odważni i Niezłomni: Władcy Losu', 'The Brave and the Bold: The Lords of Luck', 'Zeszyty The Brave and the Bold (vol. 3) #1-6 (kwiecień-listopad 2007) oraz The Brave and the Bold (vol. 1) #50 (listopad 1963)', '14.06.2017', COLLECTION],
  ['23', 'Green Lantern: Tajna Geneza', 'Green Lantern: Secret Origin', 'Zeszyty Green Lantern (vol. 4) #29-35 (czerwień-grudzień 2008) oraz pojedyncza historia z Showcase #22 (październik 1959)', '28.06.2017', COLLECTION],
  ['24', 'Superman: Śmierć Supermana', 'Superman: The Death of Superman', 'Zeszyty Superman: The Man of Steel #18-19 (grudzień 1992-styczeń 1993), Justice League America vol. 1 #69 (grudzień 1992), Superman vol. 2 #73-75 (grudzień 1992-styczeń 1993), The Adventures of Superman (vol. 1) #497 (grudzień 1993), Action Comics (vol. 1) #684 (grudzień 1992), fragmenty z Superman: The Man of Steel #17 (listopad 1992), The Adventures of Superman (vol. 1) #496 (listopad 1992), Action Comics (vol. 1) #683 (listopad 1992) i Superman (vol. 2) #73 (listopad 1992) oraz pojedyncza historia z Superman (vol. 1) #21 (marzec 1943)', '12.07.2017', COLLECTION],
  ['25', 'Flash: Urodzony Sprinter', 'Flash: Born to Run', 'Zeszyty Flash (vol. 2) #62-65 (maj-czerwień 1992), pojedyncza historia z Flash Annual (vol. 2) #8 (1995), pojedyncza historia z Speed Force #1 (listopad 1997), pojedyncza historia z The Flash 80-Page Giant #1 (sierpień 1998) oraz The Flash (vol. 1) #135 (marzec 1963)', '26.07.2017', COLLECTION],
  ['26', 'Robin: Rok Pierwszy', 'Robin: Year One', 'Zeszyty Robin: Year One #1-4 (październik 2000-styczeń 2001) oraz pojedyncza historia z Detective Comics (vol. 1) #38 (sierpień 1940)', '09.08.2017', COLLECTION],
  ['27', 'Wonder Woman: Raj Utracony', 'Wonder Woman: Paradise Lost', 'Zeszyty Wonder Woman (vol. 2) #164-169 (styczeń-czerwień 2001) oraz The New Teen Titans (vol. 1) #38 (stycień 1984)', '23.08.2017', COLLECTION],
  ['28', 'Catwoman: Na tropie Catwoman', 'Catwoman: Trail of the Catwoman', 'Zeszyty Catwoman (vol. 2) #1-4, 6-9 (styczeń-kwiecień, czerwień-wrzesień 2002) oraz pojedyncza historia z Batman (vol. 1) #62 (grudzień 1950)', '06.09.2017', COLLECTION],
  ['29', 'Amerykańska Liga Sprawiedliwości: Gwoźdź', 'JLA: The Nail', 'Zeszyty JLA: The Nail #1-3 (sierpień-październik 1998) oraz pojedyncza historia z Superman (vol. 1) #13 (listopad 1941)', '20.09.2017', COLLECTION],
  ['30', 'Trójca', 'Batman/Superman/Wonder Woman: Trinity', 'Zeszyty Batman/Superman/Wonder Woman: Trinity #1-3 (sierpień-październik 2003) oraz pojedyncza historia z World\'s Finest Comics (vol. 1) #71 (lipiec 1954)', '04.10.2017', COLLECTION],
  ['31', 'Superman: Brainiac', 'Superman: Brainiac', 'Zeszyty Action Comics (vol. 1) #866-870 (sierpień-grudzień 2008), Superman: New Krypton Special (vol.1) #1 (grudzień 2008) oraz pojedyncza historia Action Comics (vol. 1) #242 (lipiec 1958)', '18.10.2017', COLLECTION],
  ['32', 'Batgirl: Rok Pierwszy', 'Batgirl: Year One', 'Zeszyty Batgirl: Year One #1-4 (luty 2003-październik 2003) oraz pojedyncza historia z Batman (vol. 1) #139 (sierpień 1961)', '31.10.2017', COLLECTION],
  ['33', 'Superman: Tajna Geneza', 'Superman: Secret Origin', 'Zeszyty Superman: Secret Origin (vol. 1) #1-6 (listopad 2009-październik 2010) oraz pojedyncza historia z Superman (vol. 1) #125 (listopad 1958)', '15.11.2017', COLLECTION],
  ['34', 'Batman: Narodziny Demona, część 1', 'Batman: Birth of the Demon, Part 1', 'Zeszyty Batman: Son of the Demon (wrzesień 1987), Batman: Bride of the Demon (grudzień 1990) oraz Batman (vol. 1) #232 (czerwień 1971)', '29.11.2017', COLLECTION],
  ['35', 'Batman: Narodziny Demona, część 2', 'Batman: Birth of the Demon, Part 2', 'Zeszyty Batman: Birth of the Demon (grudzień 1992) oraz pojedyncza historia z Batman (vol. 1) #235 (wrzesień 1971)', '13.12.2017', COLLECTION],
  ['36', 'Young Justice: Ich własna liga', 'Young Justice: A League of Their Own', 'Zeszyty Young Justice (vol. 1) #1-7 (wrzesień-październik 1998, grudzień 1998-kwiecień 1999) oraz Young Justice: Secret Files and Origins #1 (styczeń 1999) oraz The Flash (vol. 2) #92 (lipiec 1994)', '27.12.2017', COLLECTION],
  ['37', 'Flash: Wojna Łotrów', 'Flash: Rogue War', 'Zeszyty Flash (vol. 2) #220-225 (maj-październik 2005) oraz pojedyncza historia z Showcase #8 (maj 1957)', '10.01.2018', COLLECTION],
  ['38', 'Batman: Zjawy z przeszłości', 'Batman: Strange Apparitions', 'Zeszyty Detective Comics (vol. 1) #469-476, 478-479 (maj 1977-marzec 1978, lipiec-wrzesień 1978) oraz pojedyncza historia Detective Comics (vol. 1) #36 (luty 1940)', '24.01.2018', COLLECTION],
  ['39', 'Superman: Dziedzictwo, część 1', 'Superman: Birthright, Part 1', 'Zeszyty Superman: Birthright #1-6 (wrzesień 2003-marzec 2004) oraz pojedyncza historia z Action Comics (vol. 1) #245 (październik 1958)', '07.02.2018', COLLECTION],
  ['40', 'Superman: Dziedzictwo, część 2', 'Superman: Birthright, Part 2', 'Zeszyty Superman: Birthright #7-12 (kwiecień-wrzesień 2004) oraz pojedyncza historia z Adventure Comics #271 (kwiecień 1960)', '21.02.2018', COLLECTION],
  ['41', 'Wonder Woman: Oczy Gorgony', 'Wonder Woman: Eyes of the Gorgon', 'Zeszyty Wonder Woman (vol. 2) #92, 206-213 (grudzień 1994, wrzesień 2004-kwiecień 2005)', '07.03.2018', COLLECTION],
  ['42', 'Superman/Batman: Wrogowie Publiczni', 'Superman/Batman: Public Enemies', 'Zeszyty Superman/Batman #1-6 (październik 2003-marzec 2004) oraz pojedyncza historia z Superman (vol.1) #76 (maj 1952)', '21.03.2018', COLLECTION],
  ['43', 'Plastic Man: Ścigany', 'Plastic Man: On the Lam', 'Zeszyty Plastic Man #1-6 (luty 2004-lipiec 2004) oraz pojedyncza historia z Police Comics #1 (sierpień 1941)', '04.04.2018', COLLECTION],
  ['44', 'Green Arrow: Rok Pierwszy', 'Green Arrow: Year One', 'Zeszyty Green Arrow: Year One #1-6 (wrzesień-listopad 2007) oraz pojedyncza historia z More Fun Comics #73 (listopad 1941)', '18.04.2018', COLLECTION],
  ['45', 'Nowa Granica, część 1', 'The New Frontier, Part 1', 'Zeszyty DC: The New Frontier #1-3 (marzec-maj 2004) oraz pojedyncza historia z Adventure Comics #466 (grudzień 1979)', '02.05.2018', COLLECTION],
  ['46', 'Nowa Granica, część 2', 'The New Frontier, Part 2', 'Zeszyty DC: The New Frontier #4-6 (czerwień-listopad 2004) oraz pojedyncza historia z Showcase #17 (grudzień 1958)', '16.05.2018', COLLECTION],
  ['47', 'Flash: Powrót Barry\'ego Allena', 'Flash: The Return of Barry Allen', 'Zeszyty Flash (vol. 2) #74-79 (marzec-sierpień 1993), fragmenty z Flash (vol. 2) #72-73 (styczeń-luty 1993) oraz Superman (vol. 1) #199 (sierpień 1967)', '30.05.2018', COLLECTION],
  ['48', 'Amerykańska Liga Sprawiedliwości: Kolejny Gwóźdź', 'JLA: Another Nail', 'Zeszyty JLA: Another Nail #1-3 (maj-lipiec 2004) oraz Showcase #34 (październik 1961)', '13.06.2018', COLLECTION],
  ['49', 'Wonder Woman: Bogowie i śmiertelnicy', 'Wonder Woman: Gods and Mortals', 'Zeszyty Wonder Woman (vol. 2) #1-7 (luty-sierpień 1987) oraz Wonder Woman (vol. 1) #1 (czerwień 1942)', '27.06.2018', COLLECTION],
  ['50', 'Superman/Batman: Supergirl', 'Superman/Batman: Supergirl', 'Zeszyty Superman/Batman #8-13 (maj-październik 2004) oraz Action Comics (vol. 1) #252 (maj 1959)', '11.07.2018', COLLECTION],
  ['51', 'Batman: Człowiek, który się śmieje/Azyl Arkham', 'Batman: The Man Who Laughs/Arkham Asylum', 'Zeszyty Batman: The Man Who Laughs (kwiecień 2005), Arkham Asylum – A Serious House on Serious Earth (grudzień 1989) oraz Batman (vol. 1) #327 (wrzesień 1980)', '25.07.2018', COLLECTION],
  ['52', 'Amerykańska Liga Sprawiedliwości: Nowy Porządek Świata', 'JLA: The New World Order', 'Zeszyty JLA #1-4 (styczeń-kwiecień 1997), JLA Secret Files and Origins #1 (wrzesień 1997) oraz Justice League of America #42 (vol. 1) (luty 1966)', '08.08.2018', COLLECTION],
  ['53', 'Nowi Nastoletni Tytani: Kontrakt Judasza', 'New Teen Titans: The Judas Contract', 'Zeszyty The New Teen Titans (vol. 1) #39-40 (luty-marzec 1984), Tales of the Teen Titans #41-44 (kwiecień-lipiec 1984), Tales of the Teen Titans Annual #3 (czerwień 1984) oraz The Brave and the Bold (vol. 1) #54 (czerwień 1964)', '22.08.2018', COLLECTION],
  ['54', 'Superman: Dla Jutra, część 1', 'Superman: For Tomorrow, Part 1', 'Zeszyty Superman (vol. 2) #204-209 (czerwień-listopad 2004) oraz pojedyncza historia z Action Comics (vol. 1) #241 (czerwień 1958)', '05.09.2018', COLLECTION],
  ['55', 'Superman: Dla Jutra, część 2', 'Superman: For Tomorrow, Part 2', 'Zeszyty Superman (vol. 1) #210-215 (grudzień 2004-maj 2005) oraz pojedyncza historia z Action Comics (vol. 1) #283 (grudzień 1961)', '19.09.2018', COLLECTION],
  ['56', 'Amerykańska Liga Sprawiedliwości: Pragnienie Sprawiedliwości', 'JLA: Cry for Justice', 'Zeszyty Justice League: Cry for Justice #1-7 (wrzesień 2009-kwiecień 2010) oraz pojedyncza historia z Detective Comics (vol. 1) #248 (luty 1959)', '03.10.2018', COLLECTION],
  ['57', 'Batman: Pod kapturem', 'Batman: Under the Hood', 'Zeszyty Batman (vol. 1) #635-641 (luty-sierpień 2005) oraz pojedyncza historia z Detective Comics (vol. 1) #168 (luty 1951)', '17.10.2018', COLLECTION],
  ['58', 'Green Lantern/Green Arrow: Włóczęga Bohaterów', 'Green Lantern/Green Arrow: Hard-Travelling Heroes', 'Zeszyty Green Lantern/Green Arrow #76-81 (kwiecień-grudzień 1970) oraz pojedyncza historia z All-American Comics #16 (lipiec 1940)', '31.10.2018', COLLECTION],
  ['59', 'Superman/Batman: Udręka', 'Superman/Batman: Torment', 'Zeszyty Superman/Batman #37-42 (sierpień 2007-styczeń 2008) oraz Forever People #1 (marzec 1971)', '14.11.2018', COLLECTION],
  ['60', 'Punkt Krytyczny', 'Flashpoint', 'Zeszyty Flashpoint #1-5 (vol. 2) (lipiec 2011-październik 2011) oraz The Flash #139 (wrzesień 1963)', '28.11.2018', COLLECTION],
  ['61', 'Batman/Huntress: Zew Krwi', 'Batman/Huntress: Cry for Blood', 'Zeszyty Batman/Huntress: Cry for Blood (vol. 1) #1-6 (czerwień-listopad 2000) oraz DC Super Stars Vol. 1 #17 (grudzień 1977)', '12.12.2018', COLLECTION],
  ['62', 'JLA: Siła wyższa', 'JLA: Act of God', 'Zeszyty JLA: Act of God (vol. 1) #1-3 (listopad 2000 roku-styczeń 2001 roku) oraz Brave and the Bold (vol. 1) #30', '27.12.2018', COLLECTION],
  ['63', 'Superman: Co się stało z Człowiekiem Jutra?', 'Superman: Whatever happened to the Man of Tomorrow?', 'Zeszyty Superman (vol. 1) #423 (wrzesień 1986 roku), Action Comics (vol. 1) #583 (wrzesień 1986 roku), DC Comics Presents (vol. 1) #85 (wrzesień 1985 roku) i Superman Annual (vol. 1) #11 (sierpień 1985 roku) oraz Superman (Vol. 1) #30 (wrzesień 1944)', '09.01.2019', COLLECTION],
  ['64', 'JLA/JSA: Cnota i występek', 'JLA/JSA: Virtue and Vice', 'Zeszyty JLA/JSA Virtue and Vice (luty 2003 roku) oraz Justice League of America (vol. 1) #21 (sierpień 1963) i More Fun Comics (vol. 1) #55 (maj 1940)', '23.01.2019', COLLECTION],
  ['65', 'Batman: Czarna rękawica', 'Batman: The Black Glove', 'Zeszyty Batman (vol. 1) #667-669, #672-675 (sierpień-październik 2007 roku i luty-maj 2008 roku) oraz Detective Comics (vol.1) #110 (kwiecień 1946)', '06.02.2019', COLLECTION],
  ['66', 'Potwór z bagien, część 1', 'Swamp Thing, Part 1', 'Zeszyty Swamp Thing (vol. 1) #21-27 (luty-lipiec 1984 roku) oraz House of Secrets vol.1 #92 (lipiec 1971)', '20.02.2019', COLLECTION],
  ['67', 'Superman/Batman: Legendy najlepszych na świecie', "Superman/Batman: World's Finest", 'Zeszty Legends of the World’s Finest vol.1 #1–3 (luty-kwiecień 1994 roku) oraz World\'s Finest vol.1 #88 (czerwiec 1957)', '06.03.2019', COLLECTION],
  ['68', 'Green Lantern: Zemsta Green Lanternów', 'Green Lantern: Revenge of the Green Lanterns', 'Zeszyty Green Lantern vol. 4 #7–13 (luty – sierpień 2006 roku) oraz DC Comics Presents vol. 1 #27 (listopada 1980)', '20.03.2019', COLLECTION],
  ['69', 'Superman/Shazam: Pierwszy grom', 'Superman/Shazam: First Thunder', 'Zeszyty Superman/Shazam: First Thunder vol. 1 #1-4 (listopad 2005 roku – luty 2006 roku) oraz Superman vol.1 #276 (czerwień 1974)', '03.04.2019', COLLECTION],
  ['70', 'JSA: Złoty wiek', 'The Golden Age', 'Zeszyty The Golden Age Vol.1 #1-4 (1993-1994 rok) oraz Justice League of America vol. 1 #22 (wrzesień 1963)', '17.04.2019', COLLECTION],
  ['71', 'JLI: Międzynarodowa Liga Sprawiedliwości, część 1', 'Justice League International, Part 1', 'Zeszyty Justice League vol.1 #1-6 (maj-październik 1987) oraz Justice League International vol. 1 #7 (listopad 1987)', '02.05.2019', COLLECTION],
  ['72', 'Potwór z Bagien, część 2', 'Swamp Thing, Part 2', 'Zeszyty The Saga of the Swamp Thing vol. 2 #28-34 (wrzesień – marzec 1985) oraz Swamp Thing vol.1 #1 (listopad 1972)', '15.05.2019', COLLECTION],
  ['73', 'Green Lantern: Poszukiwany Hal Jordan', 'Green Lantern: Wanted Hal Jordan', 'Zeszyty Green Lantern vol. 4 #14-20 (wrzesień 2006 roku – lipiec 2007) oraz Green Lantern vol.1 #16 (październik 1962)', '29.05.2019', COLLECTION],
  ['74', 'Superman i Legion Superbohaterów', 'Superman and the Legion of Super-Heroes', 'Zeszyty Action Comics (1938) #858-863 (grudzień 2007 – maj 2008) oraz Adventure Comics (1938) #247 (kwiecień 1958)', '12.06.2019', COLLECTION],
  ['75', 'Nastoletni Tytani: Przyszłość jest teraz', 'Teen Titans: The Future is Now', 'Zeszyty Teen Titans/Legion Special (2004) #1 (listopad 2004), Teen Titans (2003) #16-23 (listopad 2004 – czerwień 2005) oraz The Brave and the Bold (1955) #60 (lipiec 1965)', '26.06.2019', COLLECTION],
  ['76', 'Batman: Dynastia Mrocznego Rycerza', 'Batman: Dark Knight Dynasty', 'Zeszyty Batman: Dark Knight Dynasty (listopad 1997) oraz The Flash vol.1 #137 (czerwień 1963)', '10.07.2019', COLLECTION],
  ['77', 'Flash: Błyskawica w butelce', 'The Flash: Lightning in the Bottle', 'Zeszyty The Flash: The Fastest Man Alive vol. 1 #1-6 (sierpień 2006 – styczeń 2007) oraz Impulse vol. 1 #1 (kwiecień 1995)', '24.07.2019', COLLECTION],
  ['78', 'JLI: Międzynarodowa Liga Sprawiedliwości, część 2', 'Justice League International, Part 2', 'Zeszyty Justice League vol.1 #8-12 (grudzień 1987 – kwiecień 1988) oraz Mister Miracle vol.1 #1 (kwiecień 1971)', '07.08.2019', COLLECTION],
  ['79', 'Superman: Kryzys Szkarłatnego Kryptonitu', 'Superman: Krisis of the Krimson Kryptonite', 'Zeszyty Superman vol.2 #49–50, Adventures of Superman vol.1 #472–473, Action Comics vol.1 #659–660 (listopad-grudzień 1990) oraz Starman vol.1 #28 (listopad 1990)', '21.08.2019', COLLECTION],
  ['80', 'Hawkman: Wieczny lot', 'Hawkman: Endless Flight', 'Zeszyty Hawkman (vol. 4) #1-6 (maj-październik 2002), Hawkman Secret Files and Origins (vol. 1) #1 (październik 2012) oraz Flash Comics (vol. 1) #1 (styczeń 1940)', '04.09.2019', COLLECTION],
  ['1', 'Kryzys Tożsamości', 'Identity Crisis', 'Zeszyty Identity Crisis #1-7 (sierpień 2004-luty 2005), Flash (vol. 2) #214-217 (listopad 2004-luty 2005)', '30.11.2016', SPECIAL_COLLECTION],
];

const comics = rows.map(([number, title, original, contents, date, collection]) => ({
  id: `${collection}|${number}|${title}`,
  number,
  title,
  original,
  contents,
  date,
  collection,
}));

const ids = comics.map((c) => c.id);
if (ids.length !== new Set(ids).size) {
  console.error('Duplicate IDs found');
  process.exit(1);
}

const out = path.join(__dirname, '..', 'data', 'dc-pl.js');
fs.writeFileSync(out, `window.DC_COMIC_CATALOG=${JSON.stringify(comics)};\n`, 'utf8');
console.log('Wrote', comics.length, 'entries to', out);
