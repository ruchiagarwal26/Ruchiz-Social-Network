const { User, Thought } = require("../models");

//* `GET` all users

const usersAll = {
    getAllUser(req,res){
        User.find({})
            .populate({
                path: "friends",
                select: "-__v",
            })
            .select("-__v")
            .sort({ _id: -1 })
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    //* `GET` a single user by its `_id` and populated thought and friend data
    getUserById({ params }, res ) {
        User.findOne({ _id: params.id })
            .populate({
                path: "thoughts",
                select: "-__v",
            })
            .populate({
                path: "friends",
                select: "-__v",
            })
            .select("-__v")
            .then((dbUserData) =>{
                if (!dbUserData) {
                    return res
                     .status(404)
                     .json({ message: "id doesnot exist "});
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.sendStatus(400);
            });
    },
    //* `POST` a new user:
    createUser({ body }, res) {
        User.create(body)
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.json(err));
    },
    //* `PUT` to update a user by its `_id`
    updateUser({ params, body }, res){
        User.findOneAndUpdate({ _id: params.id}, body, {
            new:true,
            runValidators: true,
        })
         .then((dbUserData) => {
            if (!dbUserData) {
                return res
                 .status(404)
                 .json({ message: "id doesnot exist "});
            }
            res.json(dbUserData);
        })
        .catch((err) =>  res.json(err))
         
    },

    //* `DELETE` to remove user by its `_id`
    deletUser ( {params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then((dbUserData) => {
                if (!dbUserData) {
                    return res
                     .status(404)
                     .json({ message: "id doesnot exist "});
                }
                //**BONUS**: Remove a user's associated thoughts when deleted.

                return Thought.deleteMany({ _id: { $in: dbUserData.thoughts }});
            })
            .then(() => {
                res.json({ message: " User and thoughts are deleted "});
            })
            .catch((err) => res.json(err));
    },

    //* `POST` to add a new friend to a user's friend list
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            {new: true, runValidators: true}
        )
        .then ((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: " user id doesnot exsists "})
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => res.json(err));
        },

        //* `DELETE` to remove a friend from a user's friend list
    deleteFriend({ params }, res) {
            User.findOneAndUpdate(
                { _id: params.userId },
                { $pull: { friends: params.friendId } },
                {new: true}
            )
            .then ((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: " user id doesnot exsists "})
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
            },
    
    };

    module.exports = usersAll;

