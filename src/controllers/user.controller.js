import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User }  from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefereshTokens = async (userId)=>{
  try{
    const user = await User.findById(userId)
    const accessToken = user.generateAccesstoken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave : false})// validateBeforeSave false will prevent entire 
    // user model to be saved again as it contain other feilds like password so save only refresh token 

    return {accessToken, refreshToken}

  }catch(error){
    throw new ApiError(500, "something went wrong while craeting referesh and access tokens ")
  }
}

const registerUser = asyncHandler(async (req,res)=>{
 const{fullName, email, userName, password}= req.body
 //console.log("email :", email);

 /*instead of this you can write the longer code of if else where you check every feild sepretly
 if (
    fullName.trim() === "" || 
    email.trim() === "" || 
    userName.trim() === "" || 
    password.trim() === ""
) {
    throw new ApiError(400, "All fields are required")
}
 */
 if([fullName, email, userName, password].some((field)=>
    field?.trim()=== "")
){
    throw new ApiError(400, "All fields are required")
}
const existedUser = await User.findOne({
    $or : [{email},{userName}]
})
if(existedUser){
    throw new ApiError(409, "A user already exists")
}
const avatarLocalPath = req.files?.avatar?.[0].path;
const coverImageLocalPath = req.files?.coverImage?.[0].path;

if(!avatarLocalPath){
    throw new ApiError(400, "avtar is needed")
}
const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)

if(!avatar){
  throw new ApiError(400, "avatar is needed")
}
const user = await User.create({
    fullName,
    avatar : avatar.url,
    coverImage : coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase()
})

const createdUser = await User.findById(user?._id).select(
    "-password -refreshToken"
)
if(!createdUser){
    throw new ApiError(500, "something went wrong while registering the user in db")
}
return res.status(201).json(
    new ApiResponse(200, createdUser, "sucess user has been registered")
)

})

const loginUser = asyncHandler(async (req,res)=>{
    //req body data
    //check user exist
    //check the password
    //refresh token and acces token 
    //send cookeis
    const {email, userName, password} = req.body

    if(!userName || !email){
        throw new ApiError(400, "user and email are required")
    }

    const user = await User.findOne({
        $or : [{userName},{email}]
    })
    if(!user){
        throw new ApiError(404, "user does not exists")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "password is wrong")
    }
    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)
    
    const loggedInUser = await User.findById(user._id).select("-refreshToken -password")
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,
            {
                user: loggedInUser, accessToken , refreshToken
            },
            "you have logged in sucessfully"
        )
    )
})

const logoutUser = asyncHandler(async (req,res)=>{
   await User.findByIdAndUpdate(
    req.user._id,
    {
        $set: {
            refreshToken : undefined
        }
    },
    {
        new : true
    }
   )
   const options = {
    httpOnly: true,
    secure: true
}
return res
.status(200)
.clearCookie(accessToken, options)
.clearCookie(refreshToken, options)
.json(
    new ApiResponse(200,
        {},
        "user logged out"
    )
)
})

export {
    registerUser,
    loginUser,
    logoutUser
} 