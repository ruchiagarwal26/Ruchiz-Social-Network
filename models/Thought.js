const { Schema , model , Type } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

//**Reaction** (SCHEMA ONLY)
const ReactionSchema = new Schema(
    {
        reactionId: {
        //* Use Mongoose's ObjectId data type
        type: Schema.Types.ObjectId,
        //Default value is set to a new ObjectId
        default: () => new Type.ObjectId(),
        },
      
      reactionBody: {
        type: String,
        required: true,
        maxlength: 280,
      },
      
      username: {
        type: String,
        required: true,
      },
      
      createdAt: {
        type: Date,
        //* Set default value to the current timestamp
        default: Date.now,
        //* Use a getter method to format the timestamp on query
        get: (timestamp) => dateFormat(timestamp),
      },
    },
    {
        toJSON: {
            getters: true,
        }
        //id:false,
    }
)
///////****************Thought Schema *******************************
const ThoughtSchema = new Schema (
{
thoughtText: {
   type:  String,
   required: true,
   minlength: 1,
   maxlength: 280,
},

createdAt: {
  type: Date,
  default: Date.now,
  //Use a getter method to format the timestamp on query
  get: (timestamp) => dateFormat(timestamp),
},

username: {
// (The user that created this thought)
   type: String,
   required: true,
},

// `reactions` (These are like replies)
// Array of nested documents created with the `reactionSchema`
reactions: [ReactionSchema]
},
{
    toJSON: {
        virtuals: true,
        getters: true,
    },
    id: false,
}
);

//**Schema Settings**:
ThoughtSchema.virtual("reactionCount").get(function () {
    return this.reactions.length;
});

const Thought = model("Thought", ThoughtSchema);

module.exports = Thought;

