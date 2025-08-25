const bcrypt = require("bcrypt");
const Admin = require("../models/admin");

exports.signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if user already exists
    const existingUser = await Admin.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = await Admin.create({
      username,
      email,
      password_hash: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const user = await Admin.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // compare password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    // create JWT
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
