export interface PronunciationEntry {
  word: string;
  ipa: string;
  guide: string;
  example: string;
}

export interface PronunciationCategory {
  key: string;
  labelEn: string;
  labelId: string;
  entries: PronunciationEntry[];
}

export const pronunciationData: PronunciationCategory[] = [
  {
    key: 'vowels',
    labelEn: 'Vowels',
    labelId: 'Vokal',
    entries: [
      { word: 'saya', ipa: '/sa.ja/', guide: 'SAH-yah', example: 'I / me' },
      { word: 'ini', ipa: '/i.ni/', guide: 'EE-nee', example: 'this' },
      { word: 'itu', ipa: '/i.tu/', guide: 'EE-too', example: 'that' },
      { word: 'atau', ipa: '/a.tau/', guide: 'AH-tow', example: 'or' },
      { word: 'orang', ipa: '/o.raŋ/', guide: 'OH-rahng', example: 'person' },
      { word: 'bukan', ipa: '/bu.kan/', guide: 'BOO-kahn', example: 'not (for nouns)' },
      { word: 'enak', ipa: '/e.naʔ/', guide: 'EH-nahk', example: 'delicious' },
      { word: 'luar', ipa: '/lu.ar/', guide: 'LOO-ahr', example: 'outside' },
      { word: 'situasi', ipa: '/si.tu.a.si/', guide: 'see-too-AH-see', example: 'situation' },
      { word: 'perempuan', ipa: '/pə.rəm.pu.an/', guide: 'puh-rum-POO-ahn', example: 'woman' },
    ],
  },
  {
    key: 'consonants',
    labelEn: 'Consonants',
    labelId: 'Konsonan',
    entries: [
      { word: 'ng (ngarai)', ipa: '/ŋa.rai/', guide: 'NGAH-rye', example: 'canyon (velar nasal)' },
      { word: 'ny (nyamuk)', ipa: '/ɲa.muʔ/', guide: 'NYAH-mook', example: 'mosquito (palatal nasal)' },
      { word: 'kh (khusus)', ipa: '/xu.sus/', guide: 'KHOO-soos', example: 'special (uvular fricative)' },
      { word: 'r (rasa)', ipa: '/ra.sa/', guide: 'RAH-sah', example: 'taste (trilled R)' },
      { word: 'c (cinta)', ipa: '/tʃin.ta/', guide: 'CHIN-tah', example: 'love (ch sound)' },
      { word: 'j (jalan)', ipa: '/dʒa.lan/', guide: 'JAH-lahn', example: 'road/walk' },
      { word: 'sy (syarat)', ipa: '/ʃa.rat/', guide: 'SHAH-raht', example: 'requirement (sh sound)' },
      { word: 'g (guna)', ipa: '/ɡu.na/', guide: 'GOO-nah', example: 'use (always hard G)' },
      { word: 'h (habis)', ipa: '/ha.bis/', guide: 'HAH-bees', example: 'finished (aspirated)' },
      { word: 'ngg (tangga)', ipa: '/taŋ.ɡa/', guide: 'TAHNG-gah', example: 'stairs (ng + g)' },
    ],
  },
  {
    key: 'common',
    labelEn: 'Common Words',
    labelId: 'Kata Umum',
    entries: [
      { word: 'terima kasih', ipa: '/tə.ˈri.ma ka.ˈsih/', guide: 'tuh-REE-mah kah-SEE', example: 'thank you' },
      { word: 'selamat pagi', ipa: '/sə.la.mat pa.ɡi/', guide: 'suh-LAH-maht PAH-gee', example: 'good morning' },
      { word: 'permisi', ipa: '/pər.mi.si/', guide: 'pur-MEE-see', example: 'excuse me' },
      { word: 'maaf', ipa: '/ma.af/', guide: 'MAH-ahf', example: 'sorry' },
      { word: 'tolong', ipa: '/to.loŋ/', guide: 'TOH-long', example: 'please / help' },
      { word: 'bagaimana', ipa: '/ba.ɡai.ma.na/', guide: 'bah-guy-MAH-nah', example: 'how' },
      { word: 'mengapa', ipa: '/mə.ŋa.pa/', guide: 'mung-AH-pah', example: 'why' },
      { word: 'sekolah', ipa: '/sə.ko.lah/', guide: 'suh-KOH-lah', example: 'school' },
      { word: 'pekerjaan', ipa: '/pə.kər.dʒa.an/', guide: 'puh-kur-JAH-ahn', example: 'job / work' },
      { word: 'perjalanan', ipa: '/pər.dʒa.la.nan/', guide: 'pur-jah-LAH-nahn', example: 'journey / trip' },
      { word: 'matahari', ipa: '/ma.ta.ha.ri/', guide: 'mah-tah-HAH-ree', example: 'sun' },
      { word: 'keluarga', ipa: '/kə.lu.ar.ɡa/', guide: 'kuh-loo-AHR-gah', example: 'family' },
      { word: 'mengunjungi', ipa: '/mə.ŋun.dʒu.ŋi/', guide: 'mung-oon-JOONG-ee', example: 'to visit' },
      { word: 'memperkenalkan', ipa: '/məm.pər.kə.nal.kan/', guide: 'mum-pur-kuh-NAHL-kahn', example: 'to introduce' },
      { word: 'sebenarnya', ipa: '/sə.bə.nar.ɲa/', guide: 'suh-buh-NAHR-nyah', example: 'actually' },
      { word: 'pemerintah', ipa: '/pə.mə.rin.tah/', guide: 'puh-muh-RIN-tah', example: 'government' },
      { word: 'perpustakaan', ipa: '/pər.pus.ta.ka.an/', guide: 'pur-poos-tah-KAH-ahn', example: 'library' },
      { word: 'kesempatan', ipa: '/kə.səm.pa.tan/', guide: 'kuh-sum-PAH-tahn', example: 'opportunity' },
      { word: 'bersyukur', ipa: '/bər.ʃu.kur/', guide: 'bur-SHOO-koor', example: 'to be grateful' },
      { word: 'pengalaman', ipa: '/pə.ŋa.la.man/', guide: 'pung-ah-LAH-mahn', example: 'experience' },
    ],
  },
];
