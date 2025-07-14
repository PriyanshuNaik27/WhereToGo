import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { z } from "zod";
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
    throw new ApiError(400, "Invalid input fields", parsedDataWithSucces.error);
  }
  const { userName, email, password } = req.body;
  console.log(userName, email);
  res.json({
    gotEmail: email,
  });
});

export { registerUser };
