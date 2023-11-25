const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Event",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  remark: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },


});

module.exports = mongoose.model("Comment", commentSchema);
