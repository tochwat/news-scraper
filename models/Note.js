var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var NoteSchema = new Schema({
  // The headline is the article associate with the note
  _articleId: {
    type: Schema.Types.ObjectId,
    ref: "Article"
  },
  _articleTitle: {
  	type: String
  }, 
  title: {
  	type: String
  }, 
  body: {
    type: String
  }
  // },
  // `articleId` is an object that stores an article id
  // The ref property links the ObjectId to the Article model
  // This allows us to populate the Note with an associated Article
  // articleId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Article"
  // }
});

// This creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
