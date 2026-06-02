const mongoose = require('mongoose')

// Single-document config for hero slides, gallery strip, etc.
const SiteConfigSchema = new mongoose.Schema({
  key:   { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true })

module.exports = mongoose.model('SiteConfig', SiteConfigSchema)
