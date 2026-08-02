import test from 'node:test';
import assert from 'node:assert/strict';
import { ApplicationSubmission, Enquiry } from '../models/forms.js';

test('application and enquiry submissions use separate Mongoose models', () => {
  assert.equal(ApplicationSubmission.modelName, 'ApplicationSubmission');
  assert.equal(Enquiry.modelName, 'Enquiry');
  assert.equal(ApplicationSubmission.collection.name, 'applications');
  assert.equal(Enquiry.collection.name, 'messages');

  const applicationDoc = new ApplicationSubmission({
    type: 'application',
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '1234567890',
    position: 'Frontend Developer',
    whyHire: 'Great fit'
  });

  const enquiryDoc = new Enquiry({
    type: 'enquiry',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '0987654321',
    message: 'Hello there'
  });

  assert.equal(applicationDoc.type, 'application');
  assert.equal(enquiryDoc.type, 'enquiry');
  assert.equal(applicationDoc.position, 'Frontend Developer');
  assert.equal(enquiryDoc.message, 'Hello there');
});
