const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PolicySchema = new Schema({
  userId: { type: String, required: true },
  policyId: { type: String, required: true, unique: true },
  policyName: { type: String, required: true },
  policyCategory: { type: String, required: false },
  policyEffectiveDate: { type: Date, default: Date.now },
  policyOwners: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  requiresReview: { type: Boolean, default: false },
  approvalWorkflowId: { type: Schema.Types.ObjectId, ref: 'ApprovalWorkflow', default: null },
  attestationResponsiblePersons: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  attestationRequiresESignature: { type: Boolean, default: false },
  attestationFrequencyType: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'], default: 'monthly' },
  attestationFrequencyInterval: { type: Number, default: 1 },
  editLink: { type: String, default: "" },
  readLink: { type: String, default: "" }
}, {
  timestamps: true
});


const PolicyModel = mongoose.model('Policy', PolicySchema, 'policy_collection');
module.exports = PolicyModel;