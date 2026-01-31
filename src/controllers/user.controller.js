import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User }  from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


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


export {registerUser} 