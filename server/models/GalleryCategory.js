const mongoose = require('mongoose')

const GalleryCategorySchema = new mongoose.Schema({
  slug:        { type: String, required: true, unique: true },
  label:       { type: String, required: true },
  description: { type: String, default: '' },
  coverImage:  { type: String, default: '' },
  photos:      [{ type: String }],
  order:       { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('GalleryCategory', GalleryCategorySchema)
