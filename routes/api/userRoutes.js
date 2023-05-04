const router = require('express').Router();
const {
  getAllUser,
  getUserById,
  createUser,
  updateUser,
  deletUser,
  addFriend,
  deleteFriend,
} = require('../../controllers/userController.js');

//uers routes
router.route('/').get(getAllUser).post(createUser);

//users at id routes
router.route('/:id').get(getUserById).put(updateUser).delete(deletUser);

// userid and friends route
router.route("/:userId/friends/:friendId").post(addFriend).delete(deleteFriend);


module.exports = router;
