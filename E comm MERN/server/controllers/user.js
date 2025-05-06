import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ message: "All required fields must be provided!" });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "This username is already in use. Try a different one!" });
    }

    const newUser = await User.create({ name, username, password });

    const token = jwt.sign(
      { userid: newUser._id, username: newUser.username },
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Account has been set up successfully, now you can login!",
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
      },
      token,
    });
  } catch (error) {
    console.error("error creating user:", error);
    res.status(500).json({ message: "An error occurred while creating the account" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(401)
        .json({ message: "The account you are looking for does not exist!" });
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid)
      return res
        .status(401)
        .json({ message: "Wrong email or password entered!!" });
    const token = jwt.sign(
      { userId: user._id, username: user.username,},
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      { expiresIn: "1d" }
    );
    res.status(200).json({ message: "successfully logged in!!", user, token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "An error occurred while logging in." });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id, username, name, currentPassword, newPassword } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "User id is required in the request body" });
    }

    // Find the user by id
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If a new password is provided, check that the current password is correct
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          message: "Current password is required to set a new password",
        });
      }
      // Compare the provided current password with the stored hashed password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      // Set the new password (pre-save hook will hash it)
      user.password = newPassword;
    }

    // Update other fields if provided
    if (username) user.username = username;
    if (name) user.name = name;

    // Save the updated user document
    const updatedUser = await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};