/*
 * The questions: each one in German and English, with its answer, a topic and how hard it is.
 * Text only (no pictures or sound): the quizmaster reads them out. Rows are compact tuples:
 * [topic, level, German question, German answer, English question, English answer].
 */

import { MORE_1 } from './more1';
import { MORE_2 } from './more2';
import { MORE_3 } from './more3';
import { MORE_4 } from './more4';
import { MORE_5 } from './more5';
import { MORE_6 } from './more6';
import { MORE_7 } from './more7';
import { MORE_8 } from './more8';
import { MORE_9 } from './more9';
import { MORE_10 } from './more10';

export type Topic =
  | 'general'
  | 'film'
  | 'sports'
  | 'entertainment'
  | 'history'
  | 'geography'
  | 'science'
  | 'food'
  | 'gaming'
  | 'art'
  | 'myth'
  | 'trash'
  | 'truefalse'
  | 'estimate'
  | 'first'
  | 'lie'
  | 'odd'
  | 'words'
  | 'plot'
  | 'beforeafter'
  | 'connect'
  | 'decades';
export type Level = 1 | 2 | 3 | 4;
export type Row = [Topic, Level, string, string, string, string];

export interface Question {
  topic: Topic;
  level: Level;
  q: { de: string; en: string };
  a: { de: string; en: string };
}

export const QUESTIONS: Question[] = ([] as Row[])
  .concat(
    // General knowledge
    [
      ['general', 1, 'Wie viele Tage hat ein Schaltjahr?', '366', 'How many days are there in a leap year?', '366'],
      ['general', 1, 'Welche Farbe entsteht, wenn man Blau und Gelb mischt?', 'Grün', 'What colour do you get by mixing blue and yellow?', 'Green'],
      ['general', 1, 'Wie viele Kontinente gibt es?', 'Sieben', 'How many continents are there?', 'Seven'],
      ['general', 1, 'Wie viele Minuten hat eine Stunde?', '60', 'How many minutes are in an hour?', '60'],
      ['general', 1, 'Welches Tier ist das größte Landtier der Erde?', 'Der Afrikanische Elefant', 'What is the largest land animal?', 'The African elephant'],
      ['general', 1, 'Wie viele Beine hat eine Spinne?', 'Acht', 'How many legs does a spider have?', 'Eight'],
      ['general', 1, 'Wie heißt der höchste Berg der Welt?', 'Mount Everest', 'What is the highest mountain in the world?', 'Mount Everest'],
      ['general', 2, 'Wie viele Felder hat ein Schachbrett?', '64', 'How many squares are on a chessboard?', '64'],
      ['general', 2, 'Welches Organ verbraucht im Ruhezustand am meisten Energie im menschlichen Körper?', 'Das Gehirn', 'Which organ uses the most energy in a resting human body?', 'The brain'],
      ['general', 2, 'Wie viele Zähne hat ein erwachsener Mensch normalerweise?', '32', 'How many teeth does an adult human usually have?', '32'],
      ['general', 2, 'Wofür steht die Abkürzung „WWW“?', 'World Wide Web', 'What does “WWW” stand for?', 'World Wide Web'],
      ['general', 2, 'Welches Instrument hat 88 Tasten?', 'Das Klavier', 'Which instrument has 88 keys?', 'The piano'],
      ['general', 2, 'Wie viele Spieler stehen bei einer Fußballmannschaft auf dem Platz?', 'Elf', 'How many players does a football team have on the pitch?', 'Eleven'],
      ['general', 3, 'Wie viele Herzen hat ein Oktopus?', 'Drei', 'How many hearts does an octopus have?', 'Three'],
      ['general', 3, 'Welcher Buchstabe kommt in keinem US-Bundesstaatsnamen vor?', 'Q', 'Which letter appears in no US state name?', 'Q'],
      ['general', 3, 'Wie heißt die Angst vor langen Wörtern?', 'Hippopotomonstrosesquippedaliophobie', 'What is the fear of long words called?', 'Hippopotomonstrosesquippedaliophobia'],
      ['general', 3, 'Welche Blutgruppe gilt als Universalspender?', '0 negativ', 'Which blood type is the universal donor?', 'O negative'],
      ['general', 3, 'Wie viele Knochen hat ein erwachsener Mensch?', '206', 'How many bones does an adult human have?', '206'],
      ['general', 4, 'Wie heißt der Punkt über einem kleinen „i“?', 'Tittle (Diakritischer i-Punkt)', 'What is the dot over a lowercase “i” called?', 'A tittle'],
      ['general', 4, 'Wie heißt das Plastikende eines Schnürsenkels?', 'Senkelstift (engl. Aglet)', 'What is the plastic tip of a shoelace called?', 'An aglet'],
      ['general', 4, 'Welches Tier kann nicht rückwärts laufen und ist auf dem australischen Wappen?', 'Das Känguru (und der Emu)', 'Which animal on Australia’s coat of arms can’t walk backwards?', 'The kangaroo (and the emu)'],
    ],
    // Film & TV
    [
      ['film', 1, 'Wie heißt der Schneemann in „Die Eiskönigin“?', 'Olaf', 'What is the snowman called in “Frozen”?', 'Olaf'],
      ['film', 1, 'Wer ist der Vater von Luke Skywalker?', 'Darth Vader (Anakin Skywalker)', 'Who is Luke Skywalker’s father?', 'Darth Vader (Anakin Skywalker)'],
      ['film', 1, 'In welcher Stadt spielt die Serie „Friends“?', 'New York', 'In which city is “Friends” set?', 'New York'],
      ['film', 1, 'Wie heißt der Zauberschüler mit der Narbe auf der Stirn?', 'Harry Potter', 'What is the name of the young wizard with a scar on his forehead?', 'Harry Potter'],
      ['film', 1, 'Welcher Fisch wird in einem Pixar-Film gesucht?', 'Nemo', 'Which fish has to be found in a Pixar film?', 'Nemo'],
      ['film', 2, 'Welches Schiff sinkt im Film von James Cameron aus dem Jahr 1997?', 'Die Titanic', 'Which ship sinks in James Cameron’s 1997 film?', 'The Titanic'],
      ['film', 2, 'Wie heißt das Café in „Friends“?', 'Central Perk', 'What is the café in “Friends” called?', 'Central Perk'],
      ['film', 2, 'Welcher Schauspieler spielt Jack Sparrow?', 'Johnny Depp', 'Which actor plays Jack Sparrow?', 'Johnny Depp'],
      ['film', 2, 'In welcher Serie kocht ein Chemielehrer Crystal Meth?', 'Breaking Bad', 'In which series does a chemistry teacher cook meth?', 'Breaking Bad'],
      ['film', 2, 'Wie heißt der Kontinent in „Game of Thrones“, auf dem die Sieben Königslande liegen?', 'Westeros', 'On which continent do the Seven Kingdoms lie in “Game of Thrones”?', 'Westeros'],
      ['film', 2, 'Wie heißt die Kleinstadt in „Stranger Things“?', 'Hawkins', 'What is the small town in “Stranger Things” called?', 'Hawkins'],
      ['film', 3, 'Welcher Film gewann 2020 als erster nicht-englischsprachiger Film den Oscar als bester Film?', 'Parasite', 'Which film was the first in a language other than English to win Best Picture (2020)?', 'Parasite'],
      ['film', 3, 'Wie heißt der Hund in „Die Simpsons“?', 'Knecht Ruprecht (Santa’s Little Helper)', 'What is the dog called in “The Simpsons”?', 'Santa’s Little Helper'],
      ['film', 3, 'Wie oft wurde Leonardo DiCaprio für einen Schauspiel-Oscar nominiert, bevor er gewann?', 'Viermal (gewonnen beim fünften Mal)', 'How many times was Leonardo DiCaprio nominated for an acting Oscar before he won?', 'Four times (won on the fifth)'],
      ['film', 3, 'Welche Farbe hat die Pille, die Neo in „Matrix“ schluckt?', 'Rot', 'Which colour is the pill Neo takes in “The Matrix”?', 'Red'],
      ['film', 4, 'Wie heißt der Roboter in „Interstellar“, der witzig sein darf?', 'TARS', 'What is the robot called in “Interstellar” with an adjustable humour setting?', 'TARS'],
      ['film', 4, 'Wie hieß der erste abendfüllende Animationsfilm von Disney?', 'Schneewittchen und die sieben Zwerge (1937)', 'What was Disney’s first full-length animated film?', 'Snow White and the Seven Dwarfs (1937)'],
      ['film', 4, 'Wie lautet der Name des Pferdes von Pippi Langstrumpf?', 'Kleiner Onkel', 'What is the name of Pippi Longstocking’s horse?', 'Lilla Gubben (Old Man)'],
    ],
    // Sports
    [
      ['sports', 1, 'Wie viele Ringe hat das olympische Symbol?', 'Fünf', 'How many rings does the Olympic symbol have?', 'Five'],
      ['sports', 1, 'In welcher Sportart gibt es einen „Touchdown“?', 'American Football', 'In which sport do you score a “touchdown”?', 'American football'],
      ['sports', 1, 'Wie viele Punkte ist ein Korb von hinter der Dreierlinie im Basketball wert?', 'Drei', 'How many points is a basket from behind the three-point line worth?', 'Three'],
      ['sports', 1, 'Welches Land gewann die Fußball-WM 2014?', 'Deutschland', 'Which country won the 2014 football World Cup?', 'Germany'],
      ['sports', 2, 'Wie lang ist ein Marathon (in Kilometern, gerundet)?', '42,195 km', 'How long is a marathon in kilometres?', '42.195 km'],
      ['sports', 2, 'In welcher Stadt fanden 2012 die Olympischen Sommerspiele statt?', 'London', 'Which city hosted the 2012 Summer Olympics?', 'London'],
      ['sports', 2, 'Wie viele Grand-Slam-Turniere gibt es im Tennis pro Jahr?', 'Vier', 'How many Grand Slam tennis tournaments are there each year?', 'Four'],
      ['sports', 2, 'Welcher Rennfahrer wurde siebenmal Formel-1-Weltmeister und ist Deutscher?', 'Michael Schumacher', 'Which German driver won seven Formula One world titles?', 'Michael Schumacher'],
      ['sports', 2, 'Was ist beim Bowling ein „Strike“?', 'Alle zehn Pins mit dem ersten Wurf', 'What is a “strike” in bowling?', 'All ten pins with the first ball'],
      ['sports', 3, 'Welcher Verein gewann die erste Champions-League-Saison 1992/93?', 'Olympique Marseille', 'Which club won the first Champions League season in 1992/93?', 'Olympique Marseille'],
      ['sports', 3, 'Wie viele Spieler hat ein Volleyballteam auf dem Feld?', 'Sechs', 'How many players does a volleyball team have on court?', 'Six'],
      ['sports', 3, 'In welchem Sport gibt es den „Albatros“?', 'Golf (drei unter Par)', 'In which sport is there an “albatross”?', 'Golf (three under par)'],
      ['sports', 3, 'Wie oft wurde Deutschland (inkl. BRD) Fußball-Weltmeister?', 'Viermal (1954, 1974, 1990, 2014)', 'How many times have Germany won the football World Cup?', 'Four (1954, 1974, 1990, 2014)'],
      ['sports', 4, 'Wie heißt die Trophäe der Fußball-Europameisterschaft der Männer?', 'Henri-Delaunay-Pokal', 'What is the men’s European Championship football trophy called?', 'The Henri Delaunay Trophy'],
      ['sports', 4, 'In welchem Jahr fanden die ersten Olympischen Spiele der Neuzeit statt?', '1896 (Athen)', 'In which year were the first modern Olympic Games held?', '1896 (Athens)'],
      ['sports', 4, 'Wie viele Dimples hat ein typischer Golfball ungefähr?', 'Etwa 300 bis 500 (meist um 336)', 'Roughly how many dimples does a typical golf ball have?', 'About 300 to 500 (often 336)'],
    ],
    // Entertainment & music
    [
      ['entertainment', 1, 'Wie heißt die Band von Freddie Mercury?', 'Queen', 'What was Freddie Mercury’s band called?', 'Queen'],
      ['entertainment', 1, 'Welche Sängerin ist für „Shake It Off“ bekannt?', 'Taylor Swift', 'Which singer is known for “Shake It Off”?', 'Taylor Swift'],
      ['entertainment', 1, 'Aus welchem Land kommt die Band ABBA?', 'Schweden', 'Which country is ABBA from?', 'Sweden'],
      ['entertainment', 1, 'Wie heißt der „King of Pop“?', 'Michael Jackson', 'Who is known as the “King of Pop”?', 'Michael Jackson'],
      ['entertainment', 2, 'Mit welchem Lied gewann Lena 2010 den Eurovision Song Contest?', 'Satellite', 'With which song did Lena win Eurovision in 2010?', 'Satellite'],
      ['entertainment', 2, 'Wie viele Mitglieder hatten die Beatles?', 'Vier', 'How many members did the Beatles have?', 'Four'],
      ['entertainment', 2, 'Welcher Rapper heißt mit bürgerlichem Namen Marshall Mathers?', 'Eminem', 'Which rapper’s real name is Marshall Mathers?', 'Eminem'],
      ['entertainment', 2, 'Welche deutsche Band sang „Atemlos durch die Nacht“? Achtung, Fangfrage!', 'Keine Band: Helene Fischer', 'Which German band sang “Atemlos durch die Nacht”? Careful!', 'No band: Helene Fischer'],
      ['entertainment', 3, 'Welches Album ist das meistverkaufte aller Zeiten?', 'Thriller (Michael Jackson)', 'Which album is the best-selling of all time?', 'Thriller (Michael Jackson)'],
      ['entertainment', 3, 'Wie heißt die Band von Campino?', 'Die Toten Hosen', 'What is Campino’s band called?', 'Die Toten Hosen'],
      ['entertainment', 3, 'Welche Sängerin hieß eigentlich Stefani Germanotta?', 'Lady Gaga', 'Which singer was born Stefani Germanotta?', 'Lady Gaga'],
      ['entertainment', 4, 'Wie hieß die erste Single der Beatles?', 'Love Me Do (1962)', 'What was the Beatles’ first single?', 'Love Me Do (1962)'],
      ['entertainment', 4, 'Welches Land hat den Eurovision Song Contest am häufigsten gewonnen?', 'Irland und Schweden (je sieben)', 'Which country has won Eurovision the most times?', 'Ireland and Sweden (seven each)'],
    ],
    // History
    [
      ['history', 1, 'In welchem Jahr fiel die Berliner Mauer?', '1989', 'In which year did the Berlin Wall fall?', '1989'],
      ['history', 1, 'Wer war der erste Mensch auf dem Mond?', 'Neil Armstrong', 'Who was the first person on the Moon?', 'Neil Armstrong'],
      ['history', 1, 'Welches Volk baute die Pyramiden von Gizeh?', 'Die alten Ägypter', 'Who built the pyramids of Giza?', 'The ancient Egyptians'],
      ['history', 2, 'In welchem Jahr begann der Zweite Weltkrieg?', '1939', 'In which year did the Second World War begin?', '1939'],
      ['history', 2, 'Wer war der erste Bundeskanzler der Bundesrepublik Deutschland?', 'Konrad Adenauer', 'Who was West Germany’s first chancellor?', 'Konrad Adenauer'],
      ['history', 2, 'In welchem Jahr entdeckte Kolumbus Amerika?', '1492', 'In which year did Columbus reach the Americas?', '1492'],
      ['history', 2, 'Welche Stadt wurde 79 n. Chr. vom Vesuv verschüttet?', 'Pompeji', 'Which city was buried by Vesuvius in 79 AD?', 'Pompeii'],
      ['history', 3, 'Wer war die letzte Zarenfamilie Russlands?', 'Die Romanows', 'Which family were Russia’s last tsars?', 'The Romanovs'],
      ['history', 3, 'Wann wurde Deutschland wiedervereinigt (Datum)?', '3. Oktober 1990', 'On what date was Germany reunified?', '3 October 1990'],
      ['history', 3, 'Wer schlug 1517 seine Thesen an eine Kirchentür?', 'Martin Luther', 'Who nailed his theses to a church door in 1517?', 'Martin Luther'],
      ['history', 3, 'Welcher Pharao wurde 1922 in einem fast unberührten Grab gefunden?', 'Tutanchamun', 'Which pharaoh’s almost untouched tomb was found in 1922?', 'Tutankhamun'],
      ['history', 4, 'Wie lange dauerte der Hundertjährige Krieg ungefähr?', '116 Jahre (1337–1453)', 'How long did the Hundred Years’ War last?', '116 years (1337–1453)'],
      ['history', 4, 'Wie hieß der kürzeste Krieg der Geschichte?', 'Der Anglo-Sansibarische Krieg (1896, rund 38 Minuten)', 'What was the shortest war in history?', 'The Anglo-Zanzibar War (1896, about 38 minutes)'],
      ['history', 4, 'Welcher römische Kaiser soll sein Pferd zum Konsul machen wollen?', 'Caligula', 'Which Roman emperor is said to have wanted to make his horse a consul?', 'Caligula'],
    ],
    // Geography
    [
      ['geography', 1, 'Was ist die Hauptstadt von Frankreich?', 'Paris', 'What is the capital of France?', 'Paris'],
      ['geography', 1, 'Welcher ist der größte Ozean der Erde?', 'Der Pazifik', 'What is the largest ocean?', 'The Pacific'],
      ['geography', 1, 'Auf welchem Kontinent liegt Ägypten?', 'Afrika', 'On which continent is Egypt?', 'Africa'],
      ['geography', 1, 'Welcher Fluss fließt durch Wien, Budapest und Belgrad?', 'Die Donau', 'Which river flows through Vienna, Budapest and Belgrade?', 'The Danube'],
      ['geography', 2, 'Was ist die Hauptstadt von Australien?', 'Canberra', 'What is the capital of Australia?', 'Canberra'],
      ['geography', 2, 'Welches ist das flächengrößte Land der Erde?', 'Russland', 'Which is the largest country by area?', 'Russia'],
      ['geography', 2, 'Wie viele Bundesländer hat Deutschland?', '16', 'How many federal states does Germany have?', '16'],
      ['geography', 2, 'Welche Wüste ist die größte heiße Wüste der Welt?', 'Die Sahara', 'Which is the largest hot desert in the world?', 'The Sahara'],
      ['geography', 2, 'In welchem Land liegt Machu Picchu?', 'Peru', 'In which country is Machu Picchu?', 'Peru'],
      ['geography', 3, 'Was ist die Hauptstadt von Kanada?', 'Ottawa', 'What is the capital of Canada?', 'Ottawa'],
      ['geography', 3, 'Welches Land hat die meisten Zeitzonen (inklusive Überseegebiete)?', 'Frankreich', 'Which country has the most time zones (overseas territories included)?', 'France'],
      ['geography', 3, 'Welcher ist der längste Fluss Deutschlands (innerhalb Deutschlands)?', 'Der Rhein', 'Which is the longest river within Germany?', 'The Rhine'],
      ['geography', 3, 'Welches Land ist ganz von Südafrika umschlossen?', 'Lesotho', 'Which country is completely surrounded by South Africa?', 'Lesotho'],
      ['geography', 4, 'Was ist die Hauptstadt von Kasachstan?', 'Astana', 'What is the capital of Kazakhstan?', 'Astana'],
      ['geography', 4, 'Welcher See ist der tiefste der Welt?', 'Der Baikalsee', 'Which is the deepest lake in the world?', 'Lake Baikal'],
      ['geography', 4, 'Wie viele Länder grenzen an Deutschland?', 'Neun', 'How many countries border Germany?', 'Nine'],
    ],
    // Science
    [
      ['science', 1, 'Welcher Planet ist der Sonne am nächsten?', 'Merkur', 'Which planet is closest to the Sun?', 'Mercury'],
      ['science', 1, 'Was ist H₂O?', 'Wasser', 'What is H₂O?', 'Water'],
      ['science', 1, 'Welches Gas atmen wir ein, um zu leben?', 'Sauerstoff', 'Which gas do we breathe in to live?', 'Oxygen'],
      ['science', 1, 'Welcher Planet heißt der „Rote Planet“?', 'Der Mars', 'Which planet is called the Red Planet?', 'Mars'],
      ['science', 2, 'Bei wie viel Grad Celsius siedet Wasser auf Meereshöhe?', '100 °C', 'At what temperature does water boil at sea level?', '100 °C'],
      ['science', 2, 'Welches chemische Element hat das Symbol „Au“?', 'Gold', 'Which element has the symbol “Au”?', 'Gold'],
      ['science', 2, 'Wie viele Planeten hat unser Sonnensystem?', 'Acht', 'How many planets are in our solar system?', 'Eight'],
      ['science', 2, 'Was ist das härteste natürliche Material?', 'Diamant', 'What is the hardest natural material?', 'Diamond'],
      ['science', 3, 'Wie schnell ist das Licht ungefähr (km pro Sekunde)?', 'Rund 300.000 km/s', 'Roughly how fast is light (km per second)?', 'About 300,000 km/s'],
      ['science', 3, 'Welches Element hat die Ordnungszahl 1?', 'Wasserstoff', 'Which element has atomic number 1?', 'Hydrogen'],
      ['science', 3, 'Wer formulierte die Relativitätstheorie?', 'Albert Einstein', 'Who came up with the theory of relativity?', 'Albert Einstein'],
      ['science', 3, 'Welcher Planet hat die meisten bekannten Monde?', 'Saturn', 'Which planet has the most known moons?', 'Saturn'],
      ['science', 4, 'Was misst die Einheit „Becquerel“?', 'Radioaktivität', 'What does the unit “becquerel” measure?', 'Radioactivity'],
      ['science', 4, 'Welches ist das einzige Metall, das bei Raumtemperatur flüssig ist?', 'Quecksilber', 'Which is the only metal liquid at room temperature?', 'Mercury'],
      ['science', 4, 'Wie viele Chromosomen hat ein Mensch normalerweise?', '46', 'How many chromosomes does a human usually have?', '46'],
    ],
    // Food & drink
    [
      ['food', 1, 'Aus welchem Land kommt die Pizza?', 'Italien', 'Which country does pizza come from?', 'Italy'],
      ['food', 1, 'Aus welcher Pflanze wird Tequila hergestellt?', 'Agave', 'Which plant is tequila made from?', 'Agave'],
      ['food', 1, 'Was ist die Hauptzutat von Guacamole?', 'Avocado', 'What is the main ingredient of guacamole?', 'Avocado'],
      ['food', 2, 'Aus welchem Getreide wird Whisky meistens gemacht?', 'Gerste (Malz), auch Mais, Roggen, Weizen', 'Which grain is whisky mostly made from?', 'Barley (malt), also corn, rye, wheat'],
      ['food', 2, 'Welches Gewürz ist das teuerste der Welt?', 'Safran', 'Which is the most expensive spice in the world?', 'Saffron'],
      ['food', 2, 'Wie heißt das japanische Gericht aus rohem Fisch ohne Reis?', 'Sashimi', 'What is the Japanese dish of raw fish without rice called?', 'Sashimi'],
      ['food', 2, 'Aus welchem Land kommt der Gouda?', 'Aus den Niederlanden', 'Which country does Gouda cheese come from?', 'The Netherlands'],
      ['food', 3, 'Welche Biersorte wird oben auf dem Gärbottich vergoren?', 'Obergäriges Bier (z. B. Weizen, Ale, Kölsch)', 'What kind of beer ferments at the top of the vat?', 'Top-fermented beer (ale, wheat beer, Kölsch)'],
      ['food', 3, 'Woraus wird Hummus gemacht?', 'Kichererbsen (mit Tahin)', 'What is hummus made from?', 'Chickpeas (with tahini)'],
      ['food', 3, 'Welches Land trinkt pro Kopf den meisten Kaffee?', 'Finnland', 'Which country drinks the most coffee per person?', 'Finland'],
      ['food', 4, 'In welchem Jahr wurde das bayerische Reinheitsgebot erlassen?', '1516', 'In which year was the German beer purity law issued?', '1516'],
      ['food', 4, 'Was ist „Umami“?', 'Die fünfte Geschmacksrichtung (herzhaft)', 'What is “umami”?', 'The fifth basic taste (savoury)'],
    ],
    // Gaming
    [
      ['gaming', 1, 'Wie heißt der Klempner mit roter Mütze von Nintendo?', 'Mario', 'What is Nintendo’s plumber in the red cap called?', 'Mario'],
      ['gaming', 1, 'In welchem Spiel baut man mit Blöcken in einer Pixelwelt?', 'Minecraft', 'In which game do you build with blocks in a pixel world?', 'Minecraft'],
      ['gaming', 1, 'Wie heißt das gelbe elektrische Pokémon von Ash?', 'Pikachu', 'What is Ash’s yellow electric Pokémon called?', 'Pikachu'],
      ['gaming', 2, 'Welche Firma stellt die PlayStation her?', 'Sony', 'Which company makes the PlayStation?', 'Sony'],
      ['gaming', 2, 'Wie heißt die Prinzessin in „The Legend of Zelda“?', 'Zelda', 'What is the princess in “The Legend of Zelda” called?', 'Zelda'],
      ['gaming', 2, 'Wie heißt der blaue Igel von Sega?', 'Sonic', 'What is Sega’s blue hedgehog called?', 'Sonic'],
      ['gaming', 2, 'In welchem Battle-Royale-Spiel tanzt man nach einem Sieg mit „Emotes“ und baut Rampen?', 'Fortnite', 'In which battle royale do you build ramps and dance with emotes?', 'Fortnite'],
      ['gaming', 3, 'Wie hießen die vier Geister in Pac-Man?', 'Blinky, Pinky, Inky und Clyde', 'What are the four ghosts in Pac-Man called?', 'Blinky, Pinky, Inky and Clyde'],
      ['gaming', 3, 'In welcher Stadt spielt „GTA V“?', 'Los Santos', 'In which city is “GTA V” set?', 'Los Santos'],
      ['gaming', 3, 'Wie heißt der Held in „The Legend of Zelda“?', 'Link', 'What is the hero of “The Legend of Zelda” called?', 'Link'],
      ['gaming', 4, 'Wie hieß die erste Spielkonsole für zu Hause (1972)?', 'Magnavox Odyssey', 'What was the first home video game console (1972)?', 'The Magnavox Odyssey'],
      ['gaming', 1, 'Wie heißt Marios Bruder?', 'Luigi', 'What is Mario’s brother called?', 'Luigi'],
    ],
    // Art & fashion
    [
      ['art', 1, 'Wer malte die „Mona Lisa“?', 'Leonardo da Vinci', 'Who painted the “Mona Lisa”?', 'Leonardo da Vinci'],
      ['art', 1, 'In welcher Stadt steht der Louvre?', 'Paris', 'In which city is the Louvre?', 'Paris'],
      ['art', 2, 'Welcher Maler schnitt sich ein Stück seines Ohrs ab?', 'Vincent van Gogh', 'Which painter cut off part of his own ear?', 'Vincent van Gogh'],
      ['art', 2, 'Welches Modehaus hat zwei verschränkte „C“ als Logo?', 'Chanel', 'Which fashion house has two interlocking “C”s as its logo?', 'Chanel'],
      ['art', 2, 'Wer malte „Der Schrei“?', 'Edvard Munch', 'Who painted “The Scream”?', 'Edvard Munch'],
      ['art', 2, 'Aus welchem Land kommt das Modelabel Adidas?', 'Deutschland', 'Which country is the Adidas brand from?', 'Germany'],
      ['art', 3, 'Wer malte die Decke der Sixtinischen Kapelle?', 'Michelangelo', 'Who painted the ceiling of the Sistine Chapel?', 'Michelangelo'],
      ['art', 3, 'Welcher Künstler ist für Suppendosen und Marilyn-Monroe-Drucke bekannt?', 'Andy Warhol', 'Which artist is known for soup cans and Marilyn Monroe prints?', 'Andy Warhol'],
      ['art', 3, 'Welcher deutsche Designer trug immer Sonnenbrille und weißen Zopf?', 'Karl Lagerfeld', 'Which German designer always wore sunglasses and a white ponytail?', 'Karl Lagerfeld'],
      ['art', 4, 'In welchem Museum hängt „Die Nachtwache“ von Rembrandt?', 'Rijksmuseum, Amsterdam', 'In which museum hangs Rembrandt’s “The Night Watch”?', 'The Rijksmuseum, Amsterdam'],
      ['art', 4, 'Welche Kunstrichtung begründeten Picasso und Braque?', 'Den Kubismus', 'Which art movement did Picasso and Braque found?', 'Cubism'],
    ],
    // Mythology
    [
      ['myth', 1, 'Wer ist in der griechischen Mythologie der Göttervater?', 'Zeus', 'Who is the king of the gods in Greek mythology?', 'Zeus'],
      ['myth', 1, 'Welcher nordische Gott schwingt den Hammer Mjölnir?', 'Thor', 'Which Norse god wields the hammer Mjölnir?', 'Thor'],
      ['myth', 2, 'Welches Wesen ist halb Mensch, halb Pferd?', 'Der Zentaur', 'Which creature is half human, half horse?', 'A centaur'],
      ['myth', 2, 'Wer flog mit Flügeln aus Wachs zu nah an die Sonne?', 'Ikarus', 'Who flew too close to the Sun on wings of wax?', 'Icarus'],
      ['myth', 2, 'Wessen Blick verwandelte Menschen in Stein?', 'Medusa', 'Whose gaze turned people to stone?', 'Medusa'],
      ['myth', 3, 'Wie heißt der griechische Gott der Unterwelt?', 'Hades', 'What is the Greek god of the underworld called?', 'Hades'],
      ['myth', 3, 'Was öffnete Pandora?', 'Eine Büchse (eigentlich ein Krug)', 'What did Pandora open?', 'A box (really a jar)'],
      ['myth', 3, 'Wie heißt der Weltenbaum der nordischen Mythologie?', 'Yggdrasil', 'What is the world tree of Norse mythology called?', 'Yggdrasil'],
      ['myth', 4, 'Wie hieß der dreiköpfige Hund vor der Unterwelt?', 'Kerberos (Zerberus)', 'What was the three-headed dog guarding the underworld called?', 'Cerberus'],
      ['myth', 4, 'Welcher ägyptische Gott hat einen Schakalkopf?', 'Anubis', 'Which Egyptian god has a jackal’s head?', 'Anubis'],
    ],
    // German reality TV
    [
      ['trash', 1, 'In welcher Show ziehen Promis in den australischen Dschungel?', 'Ich bin ein Star – Holt mich hier raus!', 'In which show do celebrities move into the Australian jungle?', 'I’m a Celebrity… Get Me Out of Here!'],
      ['trash', 1, 'Wie heißt die Show, in der Menschen in einem Container leben und rausgewählt werden?', 'Big Brother', 'What is the show where people live in a house and get voted out?', 'Big Brother'],
      ['trash', 1, 'Wie heißt die Kuppelshow mit Rosen am Ende jeder Nacht?', 'Der Bachelor (bzw. Die Bachelorette)', 'Which dating show hands out roses at the end of each night?', 'The Bachelor (or The Bachelorette)'],
      ['trash', 2, 'Wie heißt der Gewinner-Titel im Dschungelcamp?', 'Dschungelkönig bzw. Dschungelkönigin', 'What is the winner of the German jungle camp called?', 'Jungle King or Jungle Queen'],
      ['trash', 2, 'In welcher Show suchen Paare die perfekte Übereinstimmung, ohne zu wissen, wer passt?', 'Are You the One?', 'In which show do singles look for their perfect match without knowing who it is?', 'Are You the One?'],
      ['trash', 2, 'Welches Model leitet „Germany’s Next Topmodel“?', 'Heidi Klum', 'Which model hosts “Germany’s Next Topmodel”?', 'Heidi Klum'],
      ['trash', 2, 'In welcher Castingshow saß Dieter Bohlen jahrelang in der Jury?', 'Deutschland sucht den Superstar (DSDS)', 'In which casting show did Dieter Bohlen judge for years?', 'Deutschland sucht den Superstar (DSDS)'],
      ['trash', 3, 'Wie heißt die Show, in der Singles auf einer Insel nicht miteinander schlafen dürfen?', 'Too Hot to Handle', 'Which show forbids singles on an island from getting intimate?', 'Too Hot to Handle'],
      ['trash', 3, 'Was sagt Heidi Klum, wenn ein Model ausscheidet?', '„Ich habe heute leider kein Foto für dich.“', 'What does Heidi Klum say when a model is out?', '“I’m sorry, I don’t have a photo for you today.”'],
      ['trash', 3, 'Wie heißt das Reality-Format, in dem Paare auf einer Insel von Verführern getestet werden?', 'Temptation Island', 'In which reality show are couples tested by seducers on an island?', 'Temptation Island'],
      ['trash', 4, 'In welchem Jahr lief die erste Staffel von „Big Brother“ in Deutschland?', '2000', 'In which year did the first German series of “Big Brother” air?', '2000'],
      ['trash', 4, 'Wer gewann die allererste Staffel des deutschen Dschungelcamps (2004)?', 'Costa Cordalis', 'Who won the very first German jungle camp (2004)?', 'Costa Cordalis'],
    ],
    // True or false (rapid fire)
    [
      ['truefalse', 1, 'Wahr oder falsch: Tomaten sind botanisch gesehen Früchte.', 'Wahr', 'True or false: botanically, tomatoes are fruits.', 'True'],
      ['truefalse', 1, 'Wahr oder falsch: Die Chinesische Mauer ist mit bloßem Auge vom Mond aus zu sehen.', 'Falsch', 'True or false: the Great Wall of China can be seen from the Moon with the naked eye.', 'False'],
      ['truefalse', 2, 'Wahr oder falsch: Ein Strauß kann schneller laufen als ein Pferd.', 'Wahr (bis etwa 70 km/h)', 'True or false: an ostrich can run faster than a horse.', 'True (up to about 70 km/h)'],
      ['truefalse', 2, 'Wahr oder falsch: Bananen wachsen an Bäumen.', 'Falsch: an riesigen Stauden', 'True or false: bananas grow on trees.', 'False: on giant herbs'],
      ['truefalse', 2, 'Wahr oder falsch: Honig verdirbt nie.', 'Wahr (richtig gelagert)', 'True or false: honey never goes off.', 'True (stored properly)'],
      ['truefalse', 3, 'Wahr oder falsch: Kühe haben vier Mägen.', 'Falsch: einen Magen mit vier Kammern', 'True or false: cows have four stomachs.', 'False: one stomach with four chambers'],
      ['truefalse', 3, 'Wahr oder falsch: Napoleon war ungewöhnlich klein.', 'Falsch: etwa durchschnittlich groß für seine Zeit', 'True or false: Napoleon was unusually short.', 'False: about average for his time'],
      ['truefalse', 3, 'Wahr oder falsch: Ein Tag auf der Venus dauert länger als ein Venusjahr.', 'Wahr', 'True or false: a day on Venus lasts longer than a Venus year.', 'True'],
      ['truefalse', 4, 'Wahr oder falsch: Oxford ist älter als das Aztekenreich.', 'Wahr', 'True or false: Oxford University is older than the Aztec Empire.', 'True'],
      ['truefalse', 4, 'Wahr oder falsch: Haie gibt es länger als Bäume.', 'Wahr', 'True or false: sharks have existed longer than trees.', 'True'],
    ],
    // Estimation: closest wins
    [
      ['estimate', 1, 'Schätzfrage: Wie viele Länder gibt es in der EU?', '27', 'Estimate: how many countries are in the EU?', '27'],
      ['estimate', 2, 'Schätzfrage: Wie hoch ist der Eiffelturm (in Metern)?', 'Rund 330 m', 'Estimate: how tall is the Eiffel Tower in metres?', 'About 330 m'],
      ['estimate', 2, 'Schätzfrage: Wie viele Einwohner hat Deutschland (in Millionen)?', 'Rund 84 Millionen', 'Estimate: how many people live in Germany (in millions)?', 'About 84 million'],
      ['estimate', 3, 'Schätzfrage: Wie viele Kilometer ist der Mond von der Erde entfernt?', 'Rund 384.000 km', 'Estimate: how far is the Moon from Earth in kilometres?', 'About 384,000 km'],
      ['estimate', 3, 'Schätzfrage: Wie viele Liter Blut hat ein Erwachsener?', 'Rund 5 Liter', 'Estimate: how many litres of blood does an adult have?', 'About 5 litres'],
      ['estimate', 4, 'Schätzfrage: Wie viele Stufen hat der Eiffelturm bis zur Spitze?', '1.665', 'Estimate: how many steps lead to the top of the Eiffel Tower?', '1,665'],
      ['estimate', 4, 'Schätzfrage: Wie lang ist die Chinesische Mauer insgesamt (in km)?', 'Rund 21.000 km', 'Estimate: how long is the Great Wall of China in total (km)?', 'About 21,000 km'],
    ],
    // What came first? Put them in order
    [
      ['first', 1, 'Was kam zuerst: das iPhone, Facebook oder YouTube?', 'Facebook (2004), YouTube (2005), iPhone (2007)', 'What came first: the iPhone, Facebook or YouTube?', 'Facebook (2004), YouTube (2005), iPhone (2007)'],
      ['first', 2, 'Ordne: Mondlandung, Mauerfall, Titanic-Untergang.', 'Titanic (1912), Mondlandung (1969), Mauerfall (1989)', 'Put in order: Moon landing, fall of the Berlin Wall, sinking of the Titanic.', 'Titanic (1912), Moon landing (1969), Wall (1989)'],
      ['first', 2, 'Was kam zuerst: Glühbirne, Telefon oder Auto?', 'Telefon (1876), Glühbirne (1879), Auto (1886)', 'What came first: the light bulb, the telephone or the car?', 'Telephone (1876), light bulb (1879), car (1886)'],
      ['first', 3, 'Ordne die Filme: Titanic, Jurassic Park, Avatar.', 'Jurassic Park (1993), Titanic (1997), Avatar (2009)', 'Put the films in order: Titanic, Jurassic Park, Avatar.', 'Jurassic Park (1993), Titanic (1997), Avatar (2009)'],
      ['first', 3, 'Was kam zuerst: Gameboy, PlayStation oder Nintendo 64?', 'Game Boy (1989), PlayStation (1994), N64 (1996)', 'What came first: the Game Boy, the PlayStation or the Nintendo 64?', 'Game Boy (1989), PlayStation (1994), N64 (1996)'],
      ['first', 4, 'Ordne: Gründung der Universität Oxford, Ende des Römischen Reichs im Westen, Erfindung des Buchdrucks durch Gutenberg.', 'Weströmisches Reich endet (476), Oxford (um 1096), Gutenberg (um 1450)', 'Put in order: founding of Oxford, end of the Western Roman Empire, Gutenberg’s printing press.', 'Rome ends (476), Oxford (c. 1096), Gutenberg (c. 1450)'],
    ],
    // Two truths and a lie
    [
      ['lie', 2, 'Zwei Wahrheiten, eine Lüge – Pinguine: A) Sie leben nur auf der Südhalbkugel. B) Sie können fliegen, nur nicht hoch. C) Kaiserpinguin-Männchen brüten die Eier aus.', 'B ist gelogen', 'Two truths and a lie – penguins: A) They only live in the southern hemisphere. B) They can fly, just not high. C) Male emperor penguins incubate the eggs.', 'B is the lie'],
      ['lie', 2, 'Zwei Wahrheiten, eine Lüge – Deutschland: A) Es gibt über 1.000 Brauereien. B) Berlin hat mehr Brücken als Venedig. C) Die Autobahn hat überall ein Tempolimit.', 'C ist gelogen', 'Two truths and a lie – Germany: A) It has over 1,000 breweries. B) Berlin has more bridges than Venice. C) The Autobahn has a speed limit everywhere.', 'C is the lie'],
      ['lie', 3, 'Zwei Wahrheiten, eine Lüge – Weltall: A) Auf dem Mond gibt es keinen Wind. B) Die Sonne ist ein Stern. C) Jupiter ist ein Gesteinsplanet.', 'C ist gelogen (Gasriese)', 'Two truths and a lie – space: A) There is no wind on the Moon. B) The Sun is a star. C) Jupiter is a rocky planet.', 'C is the lie (a gas giant)'],
      ['lie', 3, 'Zwei Wahrheiten, eine Lüge – Tiere: A) Ein Koala schläft bis zu 20 Stunden am Tag. B) Flamingos sind von Geburt an rosa. C) Seeotter halten sich beim Schlafen an den Pfoten.', 'B ist gelogen (rosa durch die Nahrung)', 'Two truths and a lie – animals: A) Koalas sleep up to 20 hours a day. B) Flamingos are born pink. C) Sea otters hold paws while sleeping.', 'B is the lie (pink from their food)'],
      ['lie', 4, 'Zwei Wahrheiten, eine Lüge – Musik: A) Beethoven war am Ende seines Lebens taub. B) Mozart starb mit 35. C) Bach hatte keine Kinder.', 'C ist gelogen (rund 20 Kinder)', 'Two truths and a lie – music: A) Beethoven was deaf late in life. B) Mozart died aged 35. C) Bach had no children.', 'C is the lie (about 20 children)'],
    ],
    // Odd one out
    [
      ['odd', 1, 'Was passt nicht: Apfel, Banane, Karotte, Kirsche?', 'Karotte (Gemüse)', 'Odd one out: apple, banana, carrot, cherry?', 'Carrot (a vegetable)'],
      ['odd', 2, 'Was passt nicht: Merkur, Venus, Pluto, Mars?', 'Pluto (kein Planet mehr)', 'Odd one out: Mercury, Venus, Pluto, Mars?', 'Pluto (no longer a planet)'],
      ['odd', 2, 'Was passt nicht: Wal, Hai, Delfin, Robbe?', 'Hai (kein Säugetier)', 'Odd one out: whale, shark, dolphin, seal?', 'Shark (not a mammal)'],
      ['odd', 3, 'Was passt nicht: Rom, Madrid, Sydney, Berlin?', 'Sydney (keine Hauptstadt)', 'Odd one out: Rome, Madrid, Sydney, Berlin?', 'Sydney (not a capital)'],
      ['odd', 3, 'Was passt nicht: Violine, Cello, Harfe, Trompete?', 'Trompete (kein Saiteninstrument)', 'Odd one out: violin, cello, harp, trumpet?', 'Trumpet (not a string instrument)'],
      ['odd', 4, 'Was passt nicht: Neon, Argon, Stickstoff, Helium?', 'Stickstoff (kein Edelgas)', 'Odd one out: neon, argon, nitrogen, helium?', 'Nitrogen (not a noble gas)'],
    ],
    // Wordplay & logic: anagrams, riddles, sequences
    [
      ['words', 1, 'Rätsel: Was wird nasser, je mehr es trocknet?', 'Ein Handtuch', 'Riddle: what gets wetter the more it dries?', 'A towel'],
      ['words', 1, 'Rätsel: Was hat Zeiger, aber keine Hände zum Klatschen?', 'Eine Uhr', 'Riddle: what has hands but can’t clap?', 'A clock'],
      ['words', 1, 'Anagramm: Welches Tier steckt in „LEGI“?', 'Igel', 'Anagram: which planet hides in “SMAR”?', 'Mars'],
      ['words', 2, 'Rätsel: Je mehr du davon wegnimmst, desto größer wird es. Was ist es?', 'Ein Loch', 'Riddle: the more you take away, the bigger it gets. What is it?', 'A hole'],
      ['words', 2, 'Anagramm: Welcher Baum steckt in „AMPEL“?', 'Palme', 'Anagram: which word meaning “quiet” hides in “LISTEN”?', 'Silent'],
      ['words', 2, 'Was kommt als Nächstes: J, F, M, A, M, J, …?', 'J (Juli: die Anfangsbuchstaben der Monate)', 'What comes next: J, F, M, A, M, J, …?', 'J (July: the months’ first letters)'],
      ['words', 3, 'Rätsel: Ich habe Städte, aber keine Häuser, Wälder, aber keine Bäume, Wasser, aber keine Fische. Was bin ich?', 'Eine Landkarte', 'Riddle: I have cities but no houses, forests but no trees, water but no fish. What am I?', 'A map'],
      ['words', 3, 'Was kommt als Nächstes: 1, 1, 2, 3, 5, 8, …?', '13 (Fibonacci)', 'What comes next: 1, 1, 2, 3, 5, 8, …?', '13 (Fibonacci)'],
      ['words', 4, 'Rätsel: Was kommt einmal in jeder Minute vor, zweimal in jedem Moment, aber nie in tausend Jahren?', 'Der Buchstabe „M“', 'Riddle: what comes once in a minute, twice in a moment, but never in a thousand years?', 'The letter “M”'],
      ['words', 4, 'Was kommt als Nächstes: O, T, T, F, F, S, S, E, …?', 'N (One, Two, Three … Nine)', 'What comes next: O, T, T, F, F, S, S, E, …?', 'N (One, Two, Three … Nine)'],
    ],
    // Badly explained plots
    [
      ['plot', 1, 'Schlecht erklärt: Ein Mädchen tötet die erste Person, die es trifft, und tut sich dann mit drei Fremden zusammen, um wieder zu töten.', 'Der Zauberer von Oz', 'Badly explained: a girl kills the first person she meets, then teams up with three strangers to kill again.', 'The Wizard of Oz'],
      ['plot', 1, 'Schlecht erklärt: Ein Einzelgänger lebt im Sumpf und muss eine Prinzessin befreien.', 'Shrek', 'Badly explained: a loner who lives in a swamp has to rescue a princess.', 'Shrek'],
      ['plot', 2, 'Schlecht erklärt: Ein Fisch mit Gedächtnisproblemen hilft einem Vater, sein Kind zu finden.', 'Findet Nemo', 'Badly explained: a fish with memory problems helps a father find his son.', 'Finding Nemo'],
      ['plot', 2, 'Schlecht erklärt: Ein Junge erfährt mit elf, dass man ihn über seine Eltern belogen hat, und kommt auf ein Internat.', 'Harry Potter', 'Badly explained: at eleven, a boy finds out he was lied to about his parents and goes to boarding school.', 'Harry Potter'],
      ['plot', 2, 'Schlecht erklärt: Ein teures Boot geht kaputt, und eine Frau teilt ihre Tür nicht.', 'Titanic', 'Badly explained: an expensive boat breaks and a woman won’t share her door.', 'Titanic'],
      ['plot', 3, 'Schlecht erklärt: Ein alter Mann bindet Luftballons an sein Haus, um nicht ins Altenheim zu müssen.', 'Oben', 'Badly explained: an old man ties balloons to his house to avoid a care home.', 'Up'],
      ['plot', 3, 'Schlecht erklärt: Eine Gruppe wandert quer durchs Land, um ein Schmuckstück zurückzugeben.', 'Der Herr der Ringe', 'Badly explained: a group walks across the land to return a piece of jewellery.', 'The Lord of the Rings'],
      ['plot', 4, 'Schlecht erklärt: Ein Mann verliert seinen Hund und legt sich dafür mit einer ganzen Verbrecherbande an.', 'John Wick', 'Badly explained: a man loses his dog and takes on an entire crime gang for it.', 'John Wick'],
    ],
    // Before & after: two answers that share a word
    [
      ['beforeafter', 2, 'Vorher-Nachher: eine gelbe Blume, die der Sonne folgt + ein weißes Gemüse.', 'Sonnenblumenkohl (Sonnenblume + Blumenkohl)', 'Before & after: the boy who never grew up + a flat breakfast food.', 'Peter Pancake (Peter Pan + pancake)'],
      ['beforeafter', 2, 'Vorher-Nachher: der Eingang zu deinem Haus + womit man ihn absperrt.', 'Haustürschloss (Haustür + Türschloss)', 'Before & after: a famous Disney mouse + a device to catch one.', 'Mickey Mousetrap (Mickey Mouse + mousetrap)'],
      ['beforeafter', 3, 'Vorher-Nachher: ein Sport mit rundem Leder + ein Kleid für den großen Abend.', 'Fußballkleid (Fußball + Ballkleid)', 'Before & after: the boy wizard + what a potter spins clay on.', 'Harry Potter’s Wheel (Harry Potter + potter’s wheel)'],
    ],
    // Connections & missing links
    [
      ['connect', 1, 'Was fehlt: Erde, Wasser, Luft, …?', 'Feuer (die vier Elemente)', 'What’s missing: earth, water, air, …?', 'Fire (the four elements)'],
      ['connect', 2, 'Was verbindet Golf, Polo und Passat?', 'Alles VW-Modelle', 'What links Golf, Polo and Passat?', 'They’re all VW models'],
      ['connect', 2, 'Was verbindet Pinguin, Strauß und Kiwi?', 'Vögel, die nicht fliegen können', 'What links the penguin, the ostrich and the kiwi?', 'Birds that can’t fly'],
      ['connect', 3, 'Was verbindet Merkur, Jupiter und Saturn außer dem Weltall?', 'Römische Götter', 'Besides space, what links Mercury, Jupiter and Saturn?', 'Roman gods'],
      ['connect', 3, 'Was verbindet Tokio, Rio und Berlin in einer Netflix-Serie?', 'Decknamen in „Haus des Geldes“', 'What links Tokyo, Rio and Berlin in a Netflix series?', 'Code names in “Money Heist”'],
      ['connect', 4, 'Was verbindet Donnerstag, Thor und Jupiter?', 'Der Donnerstag ist nach dem Donnergott benannt (Donar/Thor; frz. jeudi nach Jupiter)', 'What links Thursday, Thor and Jupiter?', 'Thursday is named after the thunder god (Thor; French jeudi after Jupiter)'],
    ],
    // Decades
    [
      ['decades', 1, 'Aus welchem Jahrzehnt: Tamagotchi, „Titanic“ im Kino, Spice Girls?', 'Die 1990er', 'Which decade: Tamagotchi, “Titanic” in cinemas, the Spice Girls?', 'The 1990s'],
      ['decades', 2, 'Aus welchem Jahrzehnt: Walkman, der erste „Star Wars“, Disco-Fieber?', 'Die 1970er', 'Which decade: the Walkman, the first “Star Wars”, disco fever?', 'The 1970s'],
      ['decades', 2, 'Aus welchem Jahrzehnt: erstes iPhone, Finanzkrise, Obama gewählt?', 'Die 2000er', 'Which decade: the first iPhone, the financial crisis, Obama elected?', 'The 2000s'],
      ['decades', 3, 'Aus welchem Jahrzehnt: Mondlandung, Woodstock, Minirock?', 'Die 1960er', 'Which decade: the Moon landing, Woodstock, the miniskirt?', 'The 1960s'],
      ['decades', 3, 'Aus welchem Jahrzehnt: Mauerfall, Game Boy, Tetris?', 'Die 1980er', 'Which decade: the fall of the Berlin Wall, the Game Boy, Tetris?', 'The 1980s'],
      ['decades', 4, 'In welchem Jahr erschien „Bohemian Rhapsody“?', '1975', 'In which year was “Bohemian Rhapsody” released?', '1975'],
    ],
    MORE_1,
    MORE_2,
    MORE_3,
    MORE_4,
    MORE_5,
    MORE_6,
    MORE_7,
    MORE_8,
    MORE_9,
    MORE_10,
  )
  .map(([topic, level, deQ, deA, enQ, enA]) => ({ topic, level, q: { de: deQ, en: enQ }, a: { de: deA, en: enA } }));
