const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const Policy = require("../models/policySchema");

// Create a new user
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by userId
router.get("/user/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId }).populate(
      "policies"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user by userId
router.put("/user/:userId", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user by userId
router.delete("/user/:userId", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove user references from policies
    await Policy.updateMany(
      {
        $or: [
          { policyOwners: user._id },
          { attestationResponsiblePersons: user._id },
        ],
      },
      {
        $pull: {
          policyOwners: user._id,
          attestationResponsiblePersons: user._id,
        },
      }
    );

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get policies by user email
router.get("/user/email/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const allPolicyDetails = [];
    let userPolicies = user.policies;

    for (const policy_id of userPolicies) {
      let policyDetails = await Policy.findOne({ policyId: policy_id });
      if (policyDetails) {
        const policyName = policyDetails.policyName;
        const policyEditLink = policyDetails.editLink;
        const policyReadLink = policyDetails.readLink;
        allPolicyDetails.push({
          policyId: policy_id,
          policyName: policyName,
          policyEditLink: policyEditLink,
          policyReadLink: policyReadLink,
        });
      }
    }

    res.json(allPolicyDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
