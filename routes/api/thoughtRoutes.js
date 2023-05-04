const router = require('express').Router();
const {
  getAllThought,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
} = require('../../controllers/thoughtController.js');

//thought routes
router.route('/').get(getAllThought).post(createThought);

//thoughts at id routes
router.route('/:id').get(getThoughtById).put(updateThought).delete(deleteThought);

// thoughts and reactions route
router.route("/:thoughtId/reactions").post(addReaction);

router.route("/:thoughtId/reactions/:reactionId").delete(deleteReaction);


module.exports = router;
