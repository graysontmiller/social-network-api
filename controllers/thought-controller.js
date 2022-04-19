const { Thought, User } = require('../models');

const thoughtController = {
    // GEt all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .sort({ _id: -1 })
            .then(thought => res.json(thought))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    // GET one thought
    getOneThought({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v')
            .then(thought => {
                if (!thought) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(thought);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    // POST a thought to specified user
    createThought({ params, body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { username: body.username },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
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
    // PUT (update) a thought
    updateThought({ params, body }, res) {
        Thought.findByIdAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(thought => {
                if (!thought) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(thought);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    // DELETE a thought
    deleteThought({ params, body }, res) {
        Thought.findByIdAndDelete({ _id: params.id })
            .then(deleteThought => {
                if (!deleteThought) {
                    return res.status(404).json({ message: 'No thought found with this id!' });
                }
                res.json(deleteThought);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    // POST a reaction to a thought
    addReaction({ params, body}, res) {
        Thought.findByIdAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then(thought => {
            if (!thought) {
                res.status(404).json({ message: 'No thought found with this id!'});
                return;
            }
            res.json(thought);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    // DELETE a reaction of a thought
    deleteReaction({ params }, res) {
        Thought.findByIdAndUpdate(
            { _id: params.thoughtId},
            { $pull: { reactions: { reactionsId: params.reactionsId } } },
            { new:true }
        )
        .then(thought => res.json(thought))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    }
}

module.exports = thoughtController;