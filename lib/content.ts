// Sav tekst stranice na jednom mestu. Obe varijante (A i B) koriste isti sadržaj,
// razlikuju se samo po tome gde stoji forma za prijavu.
//
// Sve što je u [uglastim zagradama] je placeholder iz dizajna i Olgica treba da ga popuni
// pre puštanja reklama.

export const site = {
  name: "Olgica Božinović",
  role: "HEALTH COACH",
  title: "Protokol ishrane napravljen za tebe | Olgica Božinović",
  description:
    "Na osnovu tvojih analiza, izveštaja lekara i terapije pravim plan ishrane po obrocima i suplementaciju za tvoj organizam. Dva meseca te pratim kroz WhatsApp poruke.",
  // Ako ostane prazno, video blok u hero delu se ne prikazuje.
  // Može direktan .mp4 link (npr. Cloudinary video URL).
  videoSrc: process.env.NEXT_PUBLIC_HERO_VIDEO_URL ?? "",
  videoPoster: process.env.NEXT_PUBLIC_HERO_VIDEO_POSTER ?? "",
  price: "350",
  links: {
    blog: "[link ka blogu na sajtu]",
    terms: "[link]",
    privacy: "[link]",
  },
};

export const nav = [
  { href: "#simptomi", label: "Simptomi" },
  { href: "#protokol", label: "Protokol" },
  { href: "#iskustva", label: "Rezultati" },
  { href: "#o-meni", label: "O meni" },
  { href: "#cena", label: "Cena" },
  { href: "#pitanja", label: "Pitanja" },
];

export const hero = {
  eyebrow: "Antiupalni i antivirusni protokol",
  lead: "Na osnovu tvojih analiza, izveštaja lekara i terapije pravim plan ishrane po obrocima i suplementaciju za tvoj organizam. Dva meseca te pratim kroz WhatsApp poruke.",
};

export const proof = {
  source: "Iz poruke na WhatsApp-u",
  quote:
    "„Ovih 20+ dana kako se pridržavam ishrane kod Olgice stvarno sam prezadovoljna. Krenula sam uz člana familije i tada sam shvatila da mogu da budem disciplinovana, da imam volju i da mi čak prija ovakav način ishrane.“",
  number: "100+",
  numberText: "klijenata sa kojima sam radila za 10 godina",
};

export const symptoms = [
  { title: "Nadutost", desc: "Stomak je težak i naduven.", d: "M128,208a24,24,0,1,0,24-24H32 M96,72a24,24,0,1,1,24,24H40 M176,104a24,24,0,1,1,24,24H32" },
  { title: "Manjak energije", desc: "Umor ne prolazi ni posle sna.", d: "M32,72H200a16,16,0,0,1,16,16v80a16,16,0,0,1-16,16H32a16,16,0,0,1-16-16V88A16,16,0,0,1,32,72Z M240,104v48 M56,104v48" },
  { title: "Koža se buni", desc: "Osip, akne ili svrab se vraćaju.", d: "M208,144c0-72-80-128-80-128S48,72,48,144a80,80,0,0,0,160,0Z M136,184a40,40,0,0,0,32-32" },
  { title: "Kosa opada", desc: "Tanja je i opada više nego ranije.", d: "M84,172L29,151a8,8,0,0,1,0-15l55-20,20-55a8,8,0,0,1,15,0l20,55,55,20a8,8,0,0,1,0,15l-55,20-20,55a8,8,0,0,1-15,0Z M184,16V64 M160,40h48" },
  { title: "Trnjenje i peckanje", desc: "Bolovi u telu bez jasnog razloga.", d: "M96,240l16-80L48,136,160,16,144,96l64,24Z" },
  { title: "Nemir i napetost", desc: "Teško se smiriš.", d: "M24,104c52-52,52,52,104,0s52-52,104,0 M24,160c52-52,52,52,104,0s52-52,104,0" },
];

export const comparison = [
  ["Polazna tačka", "Isti jelovnik za sve", "Tvoje analize, izveštaj lekara i terapija"],
  ["Ishrana", "Spisak zabranjenih namirnica", "Plan po obrocima: doručak, ručak, večera, užina"],
  ["Namirnice koje ne voliš", "Moraš da se prilagodiš", "Izbacujem iz jelovnika ono što ne voliš ili ne podnosiš"],
  ["Suplementi", "Biraju se po reklamama", "Suplementacija prilagođena stanju tvog organizma"],
  ["Šira slika", "Samo hrana", "Biljne tinkture i preporuke za kozmetiku, posuđe i limfu"],
  ["Podrška", "Kad zapneš, nemaš koga da pitaš", "Dva meseca praćenja kroz WhatsApp poruke"],
  ["Cilj", "Smirivanje simptoma", "Bavimo se uzrokom zdravstvenog problema"],
] as const;

export const flowInputs = [
  { title: "Analize krvi", desc: "Poslednje krvne analize koje imaš.", d: "M96,24H160 M152,24V184a32,32,0,0,1-64,0V24 M88,112h64" },
  { title: "Izveštaj lekara specijaliste", desc: "Da znam šta je lekar utvrdio.", d: "M200,224H56a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h96l56,56V216A8,8,0,0,1,200,224Z M152,32V88h56 M96,136h64 M96,168h64" },
  { title: "Terapija koju piješ", desc: "Da ishrana i suplementi idu uz nju.", d: "M216.4,39.6a54.6,54.6,0,0,0-77.2,0L39.6,139.2a54.6,54.6,0,0,0,77.2,77.2l99.6-99.6A54.6,54.6,0,0,0,216.4,39.6Z M89.4,89.4l77.2,77.2" },
  { title: "Tvoj ukus i alergije", desc: "Alergije na hranu i namirnice koje ne voliš.", d: "M72,24V96 M104,24l8,64a40,40,0,0,1-80,0l8-64 M72,128V232 M208,160H152s0-104,56-136V232" },
];

export const bento = [
  { n: "01", title: "Plan po obrocima", desc: "Za svaki obrok znaš šta jedeš." },
  { n: "02", title: "Suplementacija", desc: "Prilagođena stanju tvog organizma, da nadoknadi minerale i vitamine koji telu trebaju." },
  { n: "03", title: "Biljne tinkture", desc: "Uz ishranu, kao deo temeljnog pristupa." },
  { n: "04", title: "Online poziv", desc: "Pre izrade protokola razgovaramo o nalazima i navikama." },
  { n: "05", title: "Preporuke za zdravlje", desc: "Za kozmetiku, posuđe i pokretanje limfe." },
];
export const bentoHighlight = {
  n: "06",
  title: "Dva meseca praćenja na WhatsApp-u",
  desc: "Pišeš mi kad te nešto buni ili kad imaš pitanje.",
};

export const testimonials = {
  left: "„Nekako mi je sve laganije, osećam stalnu sitost. Kako legnem, tako zaspim. Kada ručam, ne osećam pospanost da mi se spava. Nisam naduvena niti otečena.“",
  right: "„Dobro sam Olgice, itekako se snalazim, to je moj način ishrane. Ne bih još da se hvalim, kosa zaista raste, koža miruje.“",
};

// Screenshotovi poruka u dva reda koja se pomeraju. w = širina pri visini 376px.
export const messageRows = [
  [
    { src: "/img/poruka-1.webp", w: 279 },
    { src: "/img/poruka-2.webp", w: 260 },
    { src: "/img/poruka-3.webp", w: 369 },
    { src: "/img/poruka-4.webp", w: 370 },
  ],
  [
    { src: "/img/poruka-5.webp", w: 458 },
    { src: "/img/poruka-6.webp", w: 272 },
    { src: "/img/poruka-7.webp", w: 450 },
    { src: "/img/poruka-8.webp", w: 298 },
  ],
];

export const steps = [
  { time: "Odmah", title: "Prijaviš se", desc: "Popuniš kratku formu sa pitanjima o simptomima." },
  { time: "[Rok, npr. u roku od 2 dana]", title: "Online poziv", desc: "Razgovaramo o tvom zdravlju, navikama i onome što te muči." },
  { time: "Pre izrade", title: "Šalješ nalaze", desc: "Poslednje analize krvi, izveštaj lekara specijaliste i terapiju koju piješ." },
  { time: "[Rok izrade]", title: "Dobiješ protokol", desc: "Plan ishrane po obrocima, suplementaciju, tinkture i preporuke." },
  { time: "2 meseca", title: "Pratim te", desc: "Kroz WhatsApp poruke, za sve što te buni ili za pitanja." },
];

export const parents = {
  eyebrow: "Za roditelje",
  title: "Dete se često razboljeva?",
  text: "Roditelji mi se javljaju kad se dete stalno razboljeva ili ima problem sa krajnicima. Protokol ishrane pravim i za decu.",
  bullets: [
    "Plan po obrocima prilagođen uzrastu deteta",
    "Bez namirnica koje dete ne voli ili ne podnosi",
    "Uz terapiju i savete pedijatra",
    "Dva meseca praćenja na WhatsApp-u za sva pitanja roditelja",
  ],
};

export const about = {
  role: "Savetnica za ishranu i suplementaciju",
  story:
    "Godinama sam se borila sa vrtoglavicom i lošim varenjem. Niko mi nije rekao da u pozadini može da stoji troma jetra. Kada sam počela da čistim telo od teških metala i da jačam imunitet, telo je počelo da sarađuje. Tada sam odlučila da pomažem ljudima koji se bore sa sličnim simptomima.",
  degree: "Inženjer biotehnologije",
  school: "Tehnološki fakultet Beograd",
  education: [
    "Sertifikovani coach, Coaching akademija 2022",
    "Edukacija za ishranu sportista, DIF Novi Sad",
    "Srednja farmaceutska škola",
  ],
  stats: { years: 10, schools: 4, clients: 100 },
};

export const fit = {
  tags: [
    "Masna jetra",
    "Visok ili nizak pritisak",
    "Kožni problemi",
    "Bolesti štitne žlezde",
    "Anksioznost",
    "Panični napadi",
    "Trnjenje i peckanje",
    "Bolovi u telu",
    "Česta razboljevanja kod dece",
    "Problemi sa krajnicima",
  ],
  yes: [
    "želiš da se rešiš simptoma koji te muče",
    "popodne te muči nadutost, a ništa do sada nije pomoglo",
    "želiš jasan plan i da tačno znaš šta da jedeš za svaki obrok",
    "možeš da odvojiš dva meseca za sebe",
  ],
  no: [
    "si trudna ili dojiš",
    "tražiš brzo rešenje, a ne želiš da menjaš ishranu",
    "ti je lekar zabranio neki od prirodnih preparata koji se pominju u protokolu",
  ],
};

export const pricing = {
  rows: [
    ["Online poziv pre izrade protokola", "99 EUR"],
    ["Plan ishrane po obrocima", "149 EUR"],
    ["Suplementacija prilagođena tvom organizmu", "69 EUR"],
    ["Biljne tinkture", "49 EUR"],
    ["Preporuke za kozmetiku, posuđe i limfu", "39 EUR"],
    ["Dva meseca praćenja na WhatsApp-u, direktno sa mnom", "399 EUR"],
  ] as const,
  total: "804 EUR",
  price: "350",
  saving: "-454 EUR",
};

export const responseTime = "[rok]";

export const faqs: [string, string][] = [
  ["Šta treba da ti pošaljem?", "Idealno je da pošalješ poslednje analize krvi i izveštaj lekara specijaliste, uz informaciju koju terapiju piješ. Na osnovu toga pravim plan ishrane po obrocima i suplementaciju za tvoj organizam."],
  ["Šta ako nemam skorije analize?", "[Odgovor Olgice]"],
  ["Da li protokol zamenjuje terapiju koju mi je dao lekar?", "Ne. Protokol ide uz terapiju koju piješ i ne zamenjuje lečenje ni savet lekara. Zato mi je važno da znam koju terapiju piješ."],
  ["Zašto u protokolu pričaš o teškim metalima, jetri i patogenima?", "U svom radu polazim od toga da iza mnogih zdravstvenih problema stoje teški metali u organizmu, troma jetra i patogeni: virusi, bakterije i gljivice. Menjajući ishranu čistimo organizam, a suplementacijom nadoknađujemo minerale i vitamine koji su telu potrebni za normalno funkcionisanje."],
  ["Šta ako ne volim neku namirnicu ili imam alergiju na hranu?", "Kad uzimam anamnezu, uvek pitam za alergije na hranu i za namirnice koje izrazito ne voliš. Te namirnice isključujem iz jelovnika."],
  ["Kako izgleda praćenje na WhatsApp-u?", "Dva meseca smo u kontaktu kroz WhatsApp poruke. Pišeš mi kad te nešto buni ili kad imaš pitanje u vezi sa protokolom."],
  ["Koliko čekam na protokol?", "Protokol dobijaš [rok] posle online poziva i poslatih nalaza."],
  ["Da li su suplementi i tinkture uključeni u cenu?", "[Odgovor Olgice]"],
  ["Da li protokol može i za dete?", "Može. Protokol pravim i za decu od [uzrast] godina. Plan prilagođavam uzrastu deteta, a sve ide uz terapiju i savete pedijatra."],
  ["Kada ću osetiti razliku?", "[Odgovor Olgice, bez obećanja rezultata] Iskustva su lična i razlikuju se od osobe do osobe."],
];

export const finalCta = {
  eyebrow: "Protokol ishrane",
  title: "Sledeća dva meseca ne moraš da razmišljaš šta ćeš da jedeš",
  text: "Protokol ishrane donosi osećaj lakoće u telu. Nadutost se smanjuje, kosa počinje da raste, imaš više energije i simptomi se povlače. Ti pratiš plan po obrocima, a ja sam tu na WhatsApp-u kad te nešto buni.",
  signature: "Olgica",
};

export const footer = {
  disclaimer:
    "Usluge su edukativnog karaktera i ne predstavljaju medicinski savet, dijagnozu ili lečenje. Za zdravstvene probleme obratite se lekaru.",
  note: "Napomena: sadržaj ove stranice i protokol ishrane služe u informativne svrhe i ne zamenjuju savet lekara, dijagnozu ni lečenje. Protokol ide uz terapiju koju ti je prepisao lekar. Ako si trudna ili dojiš, ili ako je protokol za dete, pre početka razgovaraj sa svojim lekarom ili pedijatrom. Iskustva klijenata su lična i razlikuju se od osobe do osobe.",
};

// Forma
export const form = {
  me: ["Nadutost", "Manjak energije", "Koža se buni", "Kosa opada", "Trnjenje i peckanje", "Nemir i napetost", "Nešto drugo"],
  kid: ["Često se razboljeva", "Problemi sa krajnicima", "Nadutost", "Koža se buni", "Manjak energije", "Nešto drugo"],
  hasIcons: [
    "M96,24H160 M152,24V184a32,32,0,0,1-64,0V24 M88,112h64",
    "M200,224H56a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h96l56,56V216A8,8,0,0,1,200,224Z M152,32V88h56 M96,136h64 M96,168h64",
    "M216.4,39.6a54.6,54.6,0,0,0-77.2,0L39.6,139.2a54.6,54.6,0,0,0,77.2,77.2l99.6-99.6A54.6,54.6,0,0,0,216.4,39.6Z M89.4,89.4l77.2,77.2",
    "M128,224a96,96,0,1,1,96-96A96,96,0,0,1,128,224Z M160,96L96,160 M96,96l64,64",
  ],
  who: [
    { key: "me" as const, label: "Za mene", d: "M128,160a64,64,0,1,0-64-64A64,64,0,0,0,128,160Z M32,216c19.37-33.47,54.55-56,96-56s76.63,22.53,96,56" },
    { key: "kid" as const, label: "Za moje dete", d: "M128,224a96,96,0,1,1,96-96A96,96,0,0,1,128,224Z M100,108v8 M156,108v8 M100,156c16,16,40,16,56,0 M128,32c-16,0-20,20-4,24" },
  ],
};
