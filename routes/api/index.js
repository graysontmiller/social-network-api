// This file will import all of the API routes to prefix their endpoint names and package them up
const router = require('express').Router();
const userRoutes = require('./user-routes');
const thoughtRoutes = require('./thought-routes');

// add prefix of `/users` and `/thoughts` to folder `routes`
router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;