import cookieParser from "cookie-parser";
import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import cookieParser  from "cookie-parser";

//Connect to database
mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
  })
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema); //creating model

//creating server
const app = express();
// const users = [];

//using Middlewares
app.set("view engine", "ejs"); // setting up view engine(ejs)
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies; //destructure the constant
  // console.log({ token });
  if (token) {
    const decoded = jwt.verify(token, "sdh");
    const rr = (req.user = await User.findById(decoded._id));
    // console.log(rr);
    next();
    // res.render("logout");
  } else {
    res.redirect("/login");
  }
};

app.get("/", isAuthenticated, (req, res) => {
  // res.render("index", { name: "Rojan" });
  // console.log(req.user);
  res.render("logout", { name: req.user.name });
});

app.get("/register", (req, res) => {
  // res.render("index", { name: "Rojan" });

  res.render("register");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.redirect("/login");
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  // console.log(user);

  const token = jwt.sign({ _id: user._id }, "sdh");
  //setting token
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000), // expires instead of expire
  });

  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) return res.redirect("/register");

  const isMatch = await bcrypt.compare(password, user.password);// compare password is match or not 
  const message = "Incorrect password";
  if (!isMatch) return res.render("login", { email, message});

  const token = jwt.sign({ _id: user._id }, "sdh");
  // //setting token
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000), // expires instead of expire
  });

  res.redirect("/");
});
app.post("/logout", (req, res) => {
  res.clearCookie("token", null, {
    expires: new Date(Date.now()), // expires instead of expire
  });
  res.redirect("/");

  // res.redirect("logout");
});

// app.get("/add", async (req, res) => {
//   await message.create({
//     name: "Shankar3",
//     email: "s1@gmail.com",
//   });
//   res.send("Nice");
// });
// app.get("/success", (req, res) => {
//   res.render("success");
// });

// app.post("/", async (req, res) => {
//   // users.push({ UserName: req.body.fname, Email: req.body.email });
//   const { name, email } = req.body;
//   const msg = await message.create({ name, email });
//   console.log(msg);

//   res.redirect("success");
// });
app.listen(3000, () => {
  console.log("Server started on port 3000 ");
});
