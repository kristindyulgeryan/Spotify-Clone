import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
  const auth = req.auth();
  if (!auth || !auth.userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized - you must be logged in" });
    return;
  }

  next();
};

// check if user is admin or not
export const requireAdmin = async (req, res, next) => {
  try {
    const auth = req.auth();
    if (!auth || !auth.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - you must be logged in" });
    }
    const currentUser = await clerkClient.users.getUser(auth.userId);
    const isAdmin =
      process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

    if (!isAdmin) {
      res.status(403).json({ message: "Unauthorized - you must be and admin" });
    }

    next();
  } catch (error) {
    next(error);
  }
};
