const { User, Thought } = require("../models");

//* `* `GET` to get all thoughts

const thoughtsAll = {
    getAllThought(req,res){
        Thought.find({})
            .populate({
                path: "reactions",
                select: "-__v",
            })
            .select("-__v")
            .sort({ _id: -1 })
            .then((dbThoughtData) => res.json(dbThoughtData))
            .catch((err) => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    //* `GET` to get a single thought by its `_id`
    getThoughtById({ params }, res ) {
        Thought.findOne({ _id: params.id })
            .populate({
                path: "reactions",
                select: "-__v",
            })
            .select("-__v")
            .then((dbThoughtData) =>{
                if (!dbThoughtData) {
                    return res
                     .status(404)
                     .json({ message: "thought for this id doesnot exist "});
                }
                res.json(dbThoughtData);
            })
            .catch((err) => {
                console.log(err);
                res.sendStatus(400);
            });
    },
    //* `POST` to create a new thought
    createThought({ params, body }, res) {
        Thought.create(body)
            .then(( {_id} ) => {
            return User.findByIdAndUpdate(
                { _id: body.userId },
                {$push: {thoughts: _id }},
                { new: true }
            );
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                return res
                 .status(404)
                 .json({ message: "thought for this id doesnot exist "});
            }
            res.json("thought created");
        })
        .catch((err) => {
            console.log(err);
            res.json(err);
        });
    },
    //*  `PUT` to update a thought by its `_id`
    updateThought({ params, body }, res){
        Thought.findOneAndUpdate({ _id: params.id}, body, {
            new:true,
            runValidators: true,
        })
         .then((dbThoughtData) => {
            if (!dbThoughtData) {
            res.status(404)
               .json({ message: "Thought for this id doesnot exist "});
                return
            }
            res.json(dbThoughtData);
        })
        .catch((err) =>  res.json(err))
         
    },

    //* `DELETE` to remove a thought by its `_id`
    deleteThought ({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    return res
                     .status(404)
                     .json({ message: "thought doesnot exist "});
                }

            return User.findOneAndUpdate(
                {thoughts: params.id },
                { $pull: {thoughts: params.id}},
                { new: true }
            );   
    })
     .then((dbUserData) => {
        if (!dbUserData) {
            return res
            .status(404)
            .json({ message: 'thought created'});
        }
        res.json({message: 'thought deleted'});
     })
     .catch((err) =>  res.json(err));
    },

    //* `POST` to create a reaction
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            {new: true}
        )
        .then ((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({ message: "thought for this user id doesnot exsists "})
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => res.json(err));
        },

        //* `DELETE` reaction
    deleteReaction({ params }, res) {
        console.log(params.thoughtId);
        console.log(params.reactionId);
            Thought.findOneAndUpdate(
                { _id: params.thoughtId },
                { $pull: { reactions: {_id: params.reactionId}} },
                {new: true},
            )
            .then (dbUserData => res.json(dbUserData))
               
            .catch((err) => res.json(err));
            },
    
    };

    module.exports = thoughtsAll;

