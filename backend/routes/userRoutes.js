const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const userService = require('../services/userService');

// Get all users (Admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user role (Admin only)
router.put('/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const { roleName } = req.body;
    if (!['admin', 'user'].includes(roleName)) {
      return res.status(400).json({ message: 'Invalid role name' });
    }
    const updatedUser = await userService.updateUserRole(req.params.id, roleName);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
