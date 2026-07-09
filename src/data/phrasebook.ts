export interface Phrase {
  en: string;
  id: string;
}

export interface PhraseCategory {
  key: string;
  labelEn: string;
  labelId: string;
  phrases: Phrase[];
}

export const phrasebook: PhraseCategory[] = [
  {
    key: 'greetings',
    labelEn: 'Greetings',
    labelId: 'Sapaan',
    phrases: [
      { en: 'Hello', id: 'Halo' },
      { en: 'Good morning', id: 'Selamat pagi' },
      { en: 'Good afternoon', id: 'Selamat siang' },
      { en: 'Good evening', id: 'Selamat malam' },
      { en: 'How are you?', id: 'Apa kabar?' },
      { en: 'I am fine, thank you', id: 'Saya baik, terima kasih' },
      { en: 'Nice to meet you', id: 'Senang bertemu Anda' },
      { en: 'What is your name?', id: 'Siapa nama Anda?' },
      { en: 'My name is...', id: 'Nama saya...' },
      { en: 'Goodbye', id: 'Selamat tinggal' },
    ],
  },
  {
    key: 'travel',
    labelEn: 'Travel',
    labelId: 'Perjalanan',
    phrases: [
      { en: 'Where is the airport?', id: 'Di mana bandara?' },
      { en: 'I need a taxi', id: 'Saya butuh taksi' },
      { en: 'How much is the ticket?', id: 'Berapa harga tiketnya?' },
      { en: 'Where is the hotel?', id: 'Di mana hotelnya?' },
      { en: 'I am lost', id: 'Saya tersesat' },
      { en: 'Can you help me?', id: 'Bisa bantu saya?' },
      { en: 'Turn left', id: 'Belok kiri' },
      { en: 'Turn right', id: 'Belok kanan' },
      { en: 'Go straight', id: 'Jalan lurus' },
      { en: 'How far is it?', id: 'Berapa jauh?' },
    ],
  },
  {
    key: 'food',
    labelEn: 'Food & Dining',
    labelId: 'Makanan',
    phrases: [
      { en: 'I am hungry', id: 'Saya lapar' },
      { en: 'The menu, please', id: 'Minta menunya' },
      { en: 'I would like to order', id: 'Saya ingin pesan' },
      { en: 'How much is this?', id: 'Berapa harganya?' },
      { en: 'The bill, please', id: 'Minta bonnya' },
      { en: 'It is delicious', id: 'Ini enak' },
      { en: 'I am vegetarian', id: 'Saya vegetarian' },
      { en: 'No spicy, please', id: 'Tidak pedas, ya' },
      { en: 'Water, please', id: 'Minta air putih' },
      { en: 'Thank you for the meal', id: 'Terima kasih atas makanannya' },
    ],
  },
  {
    key: 'shopping',
    labelEn: 'Shopping',
    labelId: 'Belanja',
    phrases: [
      { en: 'How much does this cost?', id: 'Berapa harga ini?' },
      { en: 'Can I get a discount?', id: 'Bisa dapat diskon?' },
      { en: 'Too expensive', id: 'Terlalu mahal' },
      { en: 'I will take it', id: 'Saya ambil ini' },
      { en: 'Do you have a bigger size?', id: 'Ada ukuran lebih besar?' },
      { en: 'Do you have a smaller size?', id: 'Ada ukuran lebih kecil?' },
      { en: 'Can I try this on?', id: 'Boleh coba ini?' },
      { en: 'Where is the cashier?', id: 'Di mana kasirnya?' },
      { en: 'Do you accept credit card?', id: 'Terima kartu kredit?' },
      { en: 'I am just looking', id: 'Saya lihat-lihat saja' },
    ],
  },
  {
    key: 'emergency',
    labelEn: 'Emergency',
    labelId: 'Darurat',
    phrases: [
      { en: 'Help!', id: 'Tolong!' },
      { en: 'Call the police', id: 'Panggil polisi' },
      { en: 'I need a doctor', id: 'Saya butuh dokter' },
      { en: 'Where is the hospital?', id: 'Di mana rumah sakit?' },
      { en: 'I am sick', id: 'Saya sakit' },
      { en: 'It hurts here', id: 'Sakit di sini' },
      { en: 'I lost my passport', id: 'Paspor saya hilang' },
      { en: 'Call an ambulance', id: 'Panggil ambulans' },
      { en: 'There is a fire', id: 'Ada kebakaran' },
      { en: 'I have an allergy', id: 'Saya punya alergi' },
    ],
  },
  {
    key: 'business',
    labelEn: 'Business',
    labelId: 'Bisnis',
    phrases: [
      { en: 'Nice to meet you', id: 'Senang bertemu Anda' },
      { en: 'Here is my business card', id: 'Ini kartu nama saya' },
      { en: 'What time is the meeting?', id: 'Jam berapa rapatnya?' },
      { en: 'I have an appointment', id: 'Saya ada janji temu' },
      { en: 'Can we schedule a meeting?', id: 'Bisa jadwalkan rapat?' },
      { en: 'I agree with you', id: 'Saya setuju dengan Anda' },
      { en: 'Let me think about it', id: 'Biarkan saya pikirkan' },
      { en: 'Please send me an email', id: 'Tolong kirim email ke saya' },
      { en: 'What is the deadline?', id: 'Kapan batas waktunya?' },
      { en: 'Thank you for your time', id: 'Terima kasih atas waktunya' },
    ],
  },
];
