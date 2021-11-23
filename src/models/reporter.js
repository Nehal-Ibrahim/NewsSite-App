const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const reporterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },

  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,

    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },

  age: {
    type: Number,
    default: 20,
    validate(value) {
      if (value < 0) {
        throw new Error("age is invalid");
      }
    },
  },

  password: { type: String, required: true, trim: true, minLength: 6 },

  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  phone: {
    type: String,
    validate(value) {
      if (!validator.isMobilePhone(value, "ar-EG")) {
        throw new Error("invalid phone");
      }
    },
    required: true,
    unique: true,
  },

},

{
  timestamps:true
}

)

reporterSchema.virtual('news', {
  ref: 'News',
  localField: '_id',
  foreignField: 'owner',
})

reporterSchema.pre("save", async function (next) {
  const reporter = this;
  console.log(reporter);
  if (reporter.isModified("password")) {
    reporter.password = await bcrypt.hash(reporter.password, 8);
  }
  next();
});

reporterSchema.statics.findByCredentials = async (email, password) => {
  const reporter = await Reporter.findOne({ email: email });
  if (!reporter) {
    throw new Error("please sign up");
  }
  const isMatch = await bcrypt.compare(password, reporter.password);
  if (!isMatch) {
    throw new Error("unable to login");
  }
  return reporter;
};

reporterSchema.methods.generateToken = async function () {
  const reporter = this;
  const token = jwt.sign({ _id: reporter._id.toString() }, "nodejs");
  reporter.tokens = reporter.tokens.concat({ token });
  await reporter.save();
  return token;
};

const Reporter = mongoose.model("Reporter", reporterSchema);

module.exports = Reporter;
