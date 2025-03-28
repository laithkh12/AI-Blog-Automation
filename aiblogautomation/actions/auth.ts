"use server";
import validate from "deep-email-validator";
import db from "@/utils/db";
import User from "@/models/user";
import { hashPassword, comparePassword } from "@/utils/auth";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { AuthResponseType, UserType } from "@/utils/types";

// Define a response type for the logout action
interface LogoutResponse {
  message: string;
}

// Helper function to generate JWT token
const generateToken = (payload: UserType): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

// Helper function to set HTTP-only auth cookie
const setAuthCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set("auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
};

// Authentication check
export const authCheckAction = async (): Promise<{
  user?: UserType;
  loggedIn: boolean;
}> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;

  if (!token) {
    return { loggedIn: false }; // Don't throw an error; return a logged-out state.
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as UserType;

    // get user from db
    await db(); // Connect to database
    const user = await User.findById(decoded._id).select("-password -__v");
    // return { user: decoded, loggedIn: true };
    return { user: JSON.parse(JSON.stringify(user)), loggedIn: true };
  } catch {
    return { loggedIn: false }; // Invalid token, return logged-out state.
  }
};

// Login or Register
export const loginOrRegisterAction = async (
  email: string,
  password: string
): Promise<AuthResponseType> => {
  const { valid } = await validate(email);

  if (!valid) {
    return { error: "Invalid email" };
  }

  if (!password || password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  await db(); // Connect to database

  let user = await User.findOne({ email });

  if (user) {
    const match = await comparePassword(password, user.password);

    if (!match) {
      return { error: "Invalid password" };
    }
  } else {
    user = new User({
      email,
      password: await hashPassword(password),
      name: email.split("@")[0],
      username: nanoid(6),
    });
    await user.save();
  }

  // Destructure user data
  const { _id, name, username, role } = user;
  const token = generateToken({ _id, name, username, role, email });

  await setAuthCookie(token);

  return {
    user: { name, username, role, email },
    loggedIn: true,
  };
};

export async function logoutAction(): Promise<LogoutResponse> {
  // Access the cookie store
  const cookieStore = await cookies();

  // Check if the 'auth' cookie exists before attempting to delete it
  const hasCookie = cookieStore.has("auth");

  if (hasCookie) {
    // Delete the 'auth' cookie to log out the user
    cookieStore.delete("auth");

    return { message: "Successfully logged out" };
  } else {
    return { message: "No active session found" };
  }
}

export const updateProfileDb = async (data: UserType) => {
  try {
    await db(); // Ensure database connection

    const { user } = await authCheckAction(); // Ensure user is authenticated

    if (!user) {
      throw new Error("You need to be logged in to update your profile");
    }

    // Validate name field
    if (!data.name || data.name.trim() === "") {
      throw new Error("Name is required");
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          name: data.name,
          website: data.website,
          about: data.about,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("Failed to update profile");
    }

    const { password, __v, _id, ...rest } = updatedUser;
    return JSON.parse(JSON.stringify(rest));
  } catch (err: any) {
    console.error("Error updating profile:", err);
    throw new Error(
      err.message || "An error occurred while updating the profile"
    );
  }
};

export const updatePasswordDb = async (password: string) => {
  try {
    await db(); // Ensure database connection

    const { user } = await authCheckAction(); // Ensure user is authenticated

    if (!user) {
      throw new Error("You need to be logged in to update your password");
    }

    // Validate password
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Hash the password before saving (use bcrypt or similar library)
    const hashedPassword = await hashPassword(password);

    // Update user password
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("Failed to update password");
    }

    return { message: "Password updated successfully" };
  } catch (err: any) {
    console.error("Error updating password:", err);
    throw new Error(
      err.message || "An error occurred while updating the password"
    );
  }
};

export const updateUsernameDb = async (username: string) => {
  try {
    await db(); // Ensure database connection

    const { user } = await authCheckAction(); // Ensure user is authenticated

    if (!user) {
      throw new Error("You need to be logged in to update your username");
    }

    // Validate username
    if (!username || username.trim() === "") {
      throw new Error("Username is required");
    }

    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error("This username is already taken");
    }

    // Update user username
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          username,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("Failed to update username");
    }

    const { password, __v, _id, ...rest } = updatedUser;
    return JSON.parse(JSON.stringify(rest));
  } catch (err: any) {
    console.error("Error updating username:", err);
    throw new Error(
      err.message || "An error occurred while updating the username"
    );
  }
};

// get all blogs from database with pagination
export const adminGetAllUsersDb = async (page: number, limit: number) => {
  try {
    db();

    const [users, totalCount] = await Promise.all([
      User.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-password -__v"),
      User.countDocuments(),
    ]);

    console.log(users?.length);

    return {
      users: JSON.parse(JSON.stringify(users)),
      totalCount,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

// get user by username
export const getUserByUsernameDb = async (username: string) => {
  try {
    await db();

    const user = await User.findOne({ username }).select("-password -__v");

    if (!user) {
      throw new Error("User not found");
    }

    return JSON.parse(JSON.stringify(user));
  } catch (err: any) {
    throw new Error(err);
  }
};
