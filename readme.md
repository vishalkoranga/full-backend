# backend series folder d
--------------- in user.controller.js for coverImage
let coverImageLocalPath;
if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length>0){
    coverImageLocalPath = coverImage[o].path
}

The Array.isArray() method is a built-in JavaScript function used to determine whether the passed value is an Array
//Array.isArray(req.files.coverImage): Confirms that coverImage is actually an array (and not a single object or a string).
------------