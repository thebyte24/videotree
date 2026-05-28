/**
 * Seed script — populates MongoDB with default gallery categories and events.
 * Run once: node seed.js
 */
require('dotenv').config()
const mongoose       = require('mongoose')
const GalleryCategory = require('./models/GalleryCategory')
const Event          = require('./models/Event')
const SiteConfig     = require('./models/SiteConfig')

const defaultCategories = [
  { slug: 'weddings',    label: 'WEDDINGS',    description: 'Timeless moments from beautiful wedding celebrations.',        coverImage: '', photos: [], order: 0 },
  { slug: 'engagement',  label: 'ENGAGEMENT',  description: 'Beautiful engagement moments filled with love and joy.',        coverImage: '', photos: [], order: 1 },
  { slug: 'haldi',       label: 'HALDI',       description: 'Vibrant and colourful haldi ceremonies captured beautifully.',  coverImage: '', photos: [], order: 2 },
  { slug: 'pre-wedding', label: 'PRE-WEDDING', description: 'Romantic pre-wedding stories told through stunning frames.',    coverImage: '', photos: [], order: 3 },
  { slug: 'half-saree',  label: 'HALF SAREE',  description: 'Elegant half saree ceremonies marking a special milestone.',   coverImage: '', photos: [], order: 4 },
  { slug: 'baby-shoots', label: 'BABY SHOOTS', description: 'Adorable baby moments captured with warmth and care.',          coverImage: '', photos: [], order: 5 },
  { slug: 'ceremonies',  label: 'CEREMONIES',  description: 'Sacred rituals and cultural ceremonies captured with care.',    coverImage: '', photos: [], order: 6 },
  { slug: 'birthdays',   label: 'BIRTHDAYS',   description: 'Joyful birthday celebrations filled with colour and laughter.', coverImage: '', photos: [], order: 7 },
]

const defaultEvents = [
  {
    slug: 'phaniraj-akhila-wedding-visakhapatnam',
    couple: 'Phaniraj & Akhila',
    location: 'Visakhapatnam, Andhra',
    date: 'March, 2024',
    tagline: "Phaniraj and Akhila's wedding in Visakhapatnam brought together heartfelt traditions and radiant golden light on a serene beachside.",
    story: [
      "Set against the golden shores of Visakhapatnam, Phaniraj and Akhila's wedding was a breathtaking blend of tradition and heartfelt emotion.",
      "The Muhurtham was filled with tears of joy and radiant smiles.",
      "For our team, capturing this wedding was a privilege.",
    ],
    coverImage: '',
    sections: [
      { title: 'Haldi & Mehandi', photos: [] },
      { title: 'Sangeeth', photos: [] },
      { title: 'Wedding', photos: [] },
    ],
    order: 0,
  },
  {
    slug: 'venu-himaja-wedding-hyderabad',
    couple: 'Venu & Himaja',
    location: 'Hyderabad, Telangana',
    date: 'January, 2024',
    tagline: "Venu and Himaja's grand wedding in Hyderabad radiated joy with stunning outfits and heartfelt moments.",
    story: [
      "Venu and Himaja's wedding was a grand celebration that brought together the best of Telugu traditions with modern elegance.",
      "The Sangeeth night was electric — filled with dance, laughter, and performances.",
      "The wedding day itself was a masterpiece.",
    ],
    coverImage: '',
    sections: [
      { title: 'Pre-Wedding', photos: [] },
      { title: 'Sangeeth', photos: [] },
      { title: 'Wedding', photos: [] },
    ],
    order: 1,
  },
]

const defaultConfig = [
  { key: 'heroSlides',   value: [] },
  { key: 'galleryStrip', value: [] },
]

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  // Upsert categories
  for (const cat of defaultCategories) {
    await GalleryCategory.findOneAndUpdate(
      { slug: cat.slug },
      { $setOnInsert: cat },
      { upsert: true }
    )
  }
  console.log('✓ Gallery categories seeded')

  // Upsert events
  for (const ev of defaultEvents) {
    await Event.findOneAndUpdate(
      { slug: ev.slug },
      { $setOnInsert: ev },
      { upsert: true }
    )
  }
  console.log('✓ Events seeded')

  // Upsert config
  for (const cfg of defaultConfig) {
    await SiteConfig.findOneAndUpdate(
      { key: cfg.key },
      { $setOnInsert: cfg },
      { upsert: true }
    )
  }
  console.log('✓ Site config seeded')

  await mongoose.disconnect()
  console.log('Done.')
}

seed().catch((err) => { console.error(err); process.exit(1) })
