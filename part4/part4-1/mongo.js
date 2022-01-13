const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
    required: true,
  },
});

const Blog = mongoose.model("Blog", blogSchema);

Blog.find({}).then((result) => {
  result.forEach((blog) => {
    console.log(blog);
  });
  mongoose.connection.close();
});

process.on("uncaughtException", () => {
  mongoose.connection.disconnect();
});
