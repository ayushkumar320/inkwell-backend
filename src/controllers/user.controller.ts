import prisma from '../db/connectDB.js';
import type {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

export async function registerUser(req: Request, res: Response) {
  const {email, firstName, lastName, password} = req.body;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res.status(400).json({
        status: {
          code: 400,
          message: 'User already exists',
        },
        data: {
          error: 'Email is already registered please login',
        },
      });
    } else {
      const genSalt: string = await bcrypt.genSalt(10);
      const hashedPassword: string = await bcrypt.hash(password, genSalt);
      const newUser = await prisma.user.create({
        data: {
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: hashedPassword,
        },
      });
      return res.status(200).json({
        status: {
          code: 200,
          message: 'User registered successfully',
        },
        data: {
          user: newUser,
          message: 'You can now login with your credentials',
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: {
        code: 500,
        message: 'Internal Server Error',
      },
      data: {
        error: 'An error occurred while registering the user',
      },
    });
  }
}

export async function loginUser(req: Request, res: Response) {
  const {email, password} = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(400).json({
        status: {
          code: 400,
          message: 'Invalid email or password',
        },
        data: {
          error: 'User not found',
        },
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: {
          code: 400,
          message: 'Invalid email or password',
        },
        data: {
          error: 'Incorrect email or password',
        },
      });
    }
    const token = jwt.sign({email: user.email}, JWT_SECRET);
    return res.status(200).json({
      status: {
        code: 200,
        message: 'Login successful',
      },
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token: token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: {
        code: 500,
        message: 'Internal Server Error',
      },
      data: {
        error: 'An error occurred while logging in',
      },
    });
  }
}

interface UpdateProfileBody {
  email?: string;
  firstName?: string;
  lastName?: string;
  oldPassword?: string;
  newPassword?: string;
}

export async function updateUserProfile(
  req: Request & {body: UpdateProfileBody},
  res: Response
) {
  const {email, firstName, lastName, oldPassword, newPassword} = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {email: email},
    });

    if (!user) {
      return res.status(404).json({
        status: {code: 404, message: 'User not found'},
        data: {error: 'User not found'},
      });
    }

    const updatedData: {[k: string]: unknown} = {};
    if (firstName) updatedData.firstName = firstName;
    if (lastName) updatedData.lastName = lastName;

    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          status: {code: 400, message: 'Old password is incorrect'},
          data: {error: 'Incorrect old password'},
        });
      }

      const genSalt: string = await bcrypt.genSalt(10);
      const hashedPassword: string = await bcrypt.hash(newPassword, genSalt);
      updatedData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: {email: email},
      data: updatedData,
    });

    return res.status(200).json({
      status: {code: 200, message: 'Profile updated successfully'},
      data: {user: updatedUser},
    });
  } catch (error) {
    return res.status(500).json({
      status: {code: 500, message: 'Internal Server Error'},
      data: {error: 'An error occurred while updating the profile'},
    });
  }
}
