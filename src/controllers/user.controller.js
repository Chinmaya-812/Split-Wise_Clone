import asyncHandler from '../utils/asyncHandler.js';
import { ApiErrorResponse } from '../utils/ApiErrorResponse.js';
import User from '../modal/user.js';
import { Op } from 'sequelize';
import { hashPassword, generateRefreshToken, verifyPassword, generateAccessToken } from '../utils/AuthUtils.js';
import { ApiSuccessResponse } from '../utils/ApiSuccessResponse.js';


const generateAndSaveTokens = async (user) => {
  try {
    const currentUser = await User.findByPk(user?.id);
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    currentUser.refreshToken = refreshToken;
    currentUser.save()

    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiErrorResponse(500, 'Something went wrong ! While generating refresh & access tokens')
  }

}
const signUp = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);
  const PasswordHash = await hashPassword(password);

  if (!username || !email || !password) {
    throw new ApiErrorResponse(400, 'All Field Are Required');
  }

  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ username }, { email }],
    },
  });


  if (existingUser) {
    throw new ApiErrorResponse(
      401,
      'User with email or email that you entered is already exist'
    );
  }

  const user = await User.create({
    username,
    email,
    passwordHash: PasswordHash,
  });

  const createdUser = await User.findAll({
    raw: true,
    where: { id: user.id },
    attributes: { exclude: ['passwordHash'] },
  });

  if (!createdUser) {
    throw new ApiErrorResponse(
      400,
      'Something went Wrong while registering User'
    );
  }

  return res
    .status(200)
    .json(
      new ApiSuccessResponse(200, createdUser, 'User registered SuuceeFully')
    );
});


const login = asyncHandler(async (req, res) => {

  const { username, email, password } = req.body
  console.log(req.body);


  if (!username && !email) {
    throw new ApiError(400, 'All Field are Mandatory to filled Up');
  }

  const foundUser = await User.findOne({
    where: {
      [Op.or]: [{ username }, { email }]
    },
    raw: true
  })

  if (!foundUser) {
    throw new ApiErrorResponse(404, "User doesn't Exist");
  }

  const compareHashedPassword = await verifyPassword(foundUser.passwordHash, password);

  if (!compareHashedPassword) {
    throw new ApiErrorResponse('401', "Invalid user credentials");
  }


  console.log(foundUser);

  const { accessToken, refreshToken } = await generateAndSaveTokens(foundUser)
  const loggedInUser = await User.findByPk(foundUser.id, {
    attributes: ['username', 'email'],
    raw: true
  });

  const options = {
    httponly: true,
    secure: true
  }

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiSuccessResponse(200,
        {
          User: loggedInUser, accessToken
        },
        "User Logged In Successfully"
      )
    )
})




export { signUp, login };
