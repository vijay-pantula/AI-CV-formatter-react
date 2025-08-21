// models/Cv.js
// Defines the schema for how CV data will be stored in MongoDB.

const mongoose = require('mongoose');

const CvSchema = new mongoose.Schema({
  header: {
    name: { type: String, required: true },
    jobTitle: { type: String },
  },
  personalDetails: {
    nationality: { type: String },
    languages: { type: String },
    dob: { type: String },
    maritalStatus: { type: String },
  },
  profile: { type: String },
  experience: [
    {
      title: { type: String },
      company: { type: String },
      dates: { type: String },
      duties: { type: String },
    },
  ],
  education: [
    {
      degree: { type: String },
      institution: { type: String },
      dates: { type: String },
    },
  ],
  keySkills: { type: String },
  interests: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Cv', CvSchema);
