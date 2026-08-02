import mongoose from 'mongoose';

const applicationSubmissionSchema = new mongoose.Schema({
  type: { type: String, enum: ['application'], default: 'application', required: true },
  name: String,
  email: String,
  phone: String,
  position: String,
  whyHire: String,
  resume: {
    fileName: String,
    mimeType: String,
    size: Number,
    data: { type: Buffer, select: false }
  },
  createdAt: { type: Date, default: Date.now }
});

const enquirySchema = new mongoose.Schema({
  type: { type: String, enum: ['enquiry'], default: 'enquiry', required: true },
  name: String,
  email: String,
  phone: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

export const ApplicationSubmission = mongoose.model('ApplicationSubmission', applicationSubmissionSchema, 'applications');
export const Enquiry = mongoose.model('Enquiry', enquirySchema, 'enquiries');
