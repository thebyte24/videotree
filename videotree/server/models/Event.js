const mongoose = require('mongoose')

const SectionSchema = new mongoose.Schema({
  title:  { type: String, required: true },
  photos: [{ type: String }],
})

const EventSchema = new mongoose.Schema({
  slug:       { type: String, required: true, unique: true },
  couple:     { type: String, required: true },
  location:   { type: String, default: '' },
  date:       { type: String, default: '' },
  tagline:    { type: String, default: '' },
  story:      [{ type: String }],
  coverImage: { type: String, default: '' },
  sections:   [SectionSchema],
  order:      { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Event', EventSchema)
