import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { z } from "zod";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//method

const generateAcessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAcessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    // user.save();  we dont use this as we are not passing password which is required field in model
    await user.save({ validateBeforeSave: false });
    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(500, "error in genrerating access and refresh token ");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend by req.body
  // req.body -> username ,email, password;
  //validation ->not empty
  //check if user already exists
  //create user object ;->creaate entry in db
  //remove password and refresh token from response
  //check for user creation
  //return res

  // console.log(userName,email);
  // res.json({
  //     "gotEmail": email,
  // }

  //validation using some  ->but it is only for empty or not

  // if(
  //     [userName,email,password].some((field)=>{
  //         return  field?.trim()==="";
  //     })
  // ){
  //     throw new ApiError(400,"Some of the field is empty");
  // }

  //zod validation

  const requireBody = z.object({
    email: z.email().min(3).max(100),
    userName: z.string().min(1).max(50),
    password: z.string().min(1).max(50),
  });

  const parsedDataWithSucces = requireBody.safeParse(req.body);

  if (!parsedDataWithSucces.success) {
    throw new ApiError(400, "Invalid input fields - error in registerUser", parsedDataWithSucces.error);
  }
  const { userName, email, password } = req.body;
  console.log(userName, email);
  res.json({
    gotEmail: email,
  });

  const existedUser = User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "USER or EMAIL already exists /registeruser");
  }

  const user = await User.create({
    userName: userName.toLowercase(),
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password refreshToken"
  ); // kya kya nhi chaiye

  if (!createdUser) {
    throw new ApiError(500, "server error: while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered succesfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //req->body
  //username or email
  //check for password
  //if password not correct - > error
  // if password correct -> create acces and refresh token
  //send cookies
  //send res -> succesfully login

  const {email, userName, password } = req.body;

  if (!userName && !email) {
    throw new ApiError(400, "EMAIL OR USSERNAME is required");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "user is not registered");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "PASSWORD IS INCORRECT");
  }

  const { refreshToken, accessToken } = await generateAcessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //for cookies - to not make it modifly by frontend
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accesToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user logged in succesfulyy"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).
  json(new ApiResponse(200,{},"User logged out"))
});

export { registerUser, loginUser, logoutUser };
