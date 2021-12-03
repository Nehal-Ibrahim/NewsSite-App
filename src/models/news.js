const mongoose = require("mongoose");
//const validator = require('validator')

const newsSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Reporter',
    },
    avatar: {
      type: Buffer
    }},
  {
    timestamps: true,
  }
);

newsSchema.methods.toJSON=function(){
  const news=this
  const newsObject=news.toObject()
  delete newsObject.password
  delete newsObject.tokens
  return newsObject
}





const News = mongoose.model("News", newsSchema);
module.exports = News;
