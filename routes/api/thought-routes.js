const router = require('express').Router();

const {
    getAllThoughts,
    getOneThought,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thought-controller');

// set up GET all thoughts at /api/thoughts
router
    .route('/')
    .get(getAllThoughts)

// set up GET one thought at /api/thought/:thoughtId
router
    .route('/:id')
    .get(getOneThought)
    .put(updateThought)
    .delete(deleteThought)

// set up POST thought at api/thoughts/:userId
router
    .route('/:userId')
    .post(createThought)

// set up POST reaction to thought at api/thoughts/:thoughtId/reactions
router
    .route('/:thoughtId/reactions')
    .post(addReaction)

// set up DELETE reaction to thought at api/thoughts/:thoughtId/reactions/:reactionId
router
    .route('/:thoughtId/reactions/:reactionId')
    .delete(deleteReaction)

module.exports = router;