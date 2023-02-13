const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,

} = require('../controllers/users');

const { userIdValidation, updateUserValidation, updateAvatarValidation } = require('../middlewares/validation');

router.get('/users', getUsers);

router.get('/users/me', getCurrentUser);

router.get('/users/:userId', userIdValidation, getUserById);

router.patch('/users/me', updateUserValidation, updateUser);

router.patch('/users/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = router;
