import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import asyncHandler from './asyncHandler.js';
import { ApiErrorResponse } from './ApiErrorResponse.js';
import User from '../modal/user.js';

const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(plainPassword, saltRounds);
  return hashed;
};

const verifyPassword = async (storedHash, enteredPassword) => {
  return await bcrypt.compare(enteredPassword, storedHash)
}

const generateRefreshToken = (user) => {
  const { id, name, email } = user

  const refreshToken = jwt.sign({
    id: id,
    name: name,
    email: email
  },
    process.env.REFRESH_TOEKN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
  return refreshToken;
}

const generateAccessToken = (user) => {
  const { id, name, email } = user
  const accessToken = jwt.sign({
    id: id,
    name: name,
    email: email
  },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )

  return accessToken;
}

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req?.cookies?.accessToken || req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new ApiErrorResponse(401, "Unauthorized request ! Please log in to access this resource")
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const authenticatedUser = await User.findOne({ id: decodeToken?.id, raw: true, attributes: { exclude: ['passwordHash', 'refreshToken', 'createdAt', 'updatedAt'] } });


    req.user = authenticatedUser;
  } catch (error) {
    throw new ApiErrorResponse(401, error?.message || "Invalid access token")

  }
})


export { hashPassword, generateRefreshToken, verifyPassword, generateAccessToken, verifyJWT };
