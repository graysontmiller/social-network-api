const router = require('express').Router();

const {
    getAllUser,
    getOneUser,
    createUser,
    updateUser,
    deleteUser, 
    addFriend,
    deleteFriend
} = require('../../controllers/user-controller');

// set up GET all and POST at /api/users
router
    .route('/')
    .get(getAllUser)
    .post(createUser);

// set up GET one, PUT and DELETE at api/users/:id
router
    .route('/:id')
    .get(getOneUser)
    .put(updateUser)
    .put(addFriend)
    .delete(deleteUser);

// set up POST and DELETE at api/users/:id/friends/:friendId
router
    .route('/:id/friends/:friendId')
    .post(addFriend)
    .delete(deleteFriend);

module.exports = router;