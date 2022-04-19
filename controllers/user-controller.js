const { User, Thought } = require('../models');

const userController = {
    // GET all users
    getAllUser(req, res) {
        User.find({})
            .populate([
                {
                    path: 'thoughts',
                    select: '-__v'
                },
                {
                    path: 'friends',
                    select: '-__v'
                }
            ])
            .select('-__v')
            .sort({ _id: -1 })
            .then(user => res.json(user))
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            });
    },
    // GET one user
    getOneUser({ params }, res) {
        User.findOne({ _id: params.id })
        .populate([
            {
                path: 'thoughts',
                select: '-__v'
            },
            {
                path: 'friends',
                select: '-__v'
            }
        ])
            .select('-__v')
            .then(user => {
                if (!user) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(user);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    // POST users
    createUser({ body }, res) {
        User.create(body)
            .then(user => res.json(user))
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            });
    },
    // PUT (update) user
    updateUser({ params, body }, res) {
        User.findByIdAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(user => {
                if (!user) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(user);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            });
    },
    // DELETE user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(user => {
                if (!user) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                User.updateMany(
                    { _id: {$in: user.friends} },
                    { $pull: { friends: params.id}}
                )
                .then(() => {
                    Thought.deleteMany({ username: user.username })
                    .then(() => {
                        res.json(user);
                    })
                })
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            });
    },
    // (PUT) add another user as a friend
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            { $push: { friends: params.friendId } },
            { new: true }
        )
            .populate({
                path: 'friends',
                select: ('-__v')
            })
            .select('-__v')
            .then(user => {
                if (!user) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(user);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            });
    },
    // DELETE another user from friends list
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
            .populate({
                path: 'friends',
                select: ('-__v')
            })
            .select('-__v')
            .then(user => {
                if (!user) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(user);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            });
    }
};

module.exports = userController;