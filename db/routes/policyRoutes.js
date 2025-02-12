const express = require('express');
const router = express.Router();
const Policy = require('../models/policySchema');
const User = require('../models/userSchema');
const mongoose = require('mongoose');

// Create a new policy
router.post('/', async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findOne({ userId: req.body.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const policy = new Policy({ ...req.body, userId: user.userId });
    const savedPolicy = await policy.save();
    
    // Update the user's policies array
    await User.findOneAndUpdate(
      { userId: req.body.userId },
      { $push: { policies: savedPolicy.policyId } },
      { new: true }
    );

    res.status(201).json(savedPolicy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all policies
router.get('/', async (req, res) => {
  try {
    const policies = await Policy.find();
    res.json(policies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get policy by policyId
router.get('/policy/:policyId', async (req, res) => {
  try {
    const policy = await Policy.findOne({ policyId: req.params.policyId });
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    res.json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single policy by ID
router.get('/:id', async (req, res) => {
  try {
    const policy = await Policy.findById(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    res.json(policy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update policy
router.put('/:id', async (req, res) => {
  try {
    const updatedPolicy = await Policy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPolicy) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    res.json(updatedPolicy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete policy
router.delete('/:id', async (req, res) => {
  try {
    const policy = await Policy.findByIdAndDelete(req.params.id);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    res.json({ message: 'Policy deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch('/policy/:policyId', async (req, res) => {
  try {
    const updatedPolicy = await Policy.findOneAndUpdate(
      { policyId: req.params.policyId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPolicy) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    res.json(updatedPolicy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete policy by policyId
router.delete('/policy/:policyId', async (req, res) => {
  try {
    const policy = await Policy.findOneAndDelete({ policyId: req.params.policyId });
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }

    // Remove the policy from the user's policies array
    await User.findOneAndUpdate(
      { userId: policy.userId },
      { $pull: { policies: policy.policyId } }
    );

    res.json({ message: 'Policy deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 