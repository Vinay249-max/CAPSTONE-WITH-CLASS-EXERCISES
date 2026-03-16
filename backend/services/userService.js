const User = require('../models/User');
const Role = require('../models/Role');

const getAllUsers = async () => {
  return await User.find().select('-password').populate('roleId');
};

const updateUserRole = async (userId, targetRoleName) => {
  const role = await Role.findOne({ roleName: targetRoleName });
  if (!role) throw new Error('Role not found');

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.roleId = role._id;
  await user.save();
  return await User.findById(userId).select('-password').populate('roleId');
};

const deleteUser = async (userId) => {
  const user = await User.findById(userId).populate('roleId');
  if (!user) throw new Error('User not found');
  
  if (user.roleId.roleName === 'admin') {
    throw new Error('Cannot delete admin users');
  }
  
  // Here we could also delete their profile picture file if needed
  return await User.findByIdAndDelete(userId);
};

module.exports = { getAllUsers, updateUserRole, deleteUser };
