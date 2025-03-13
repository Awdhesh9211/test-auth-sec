const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/S3");

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

const allowedImageTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp","image/avif"];

const uploads = multer({
  storage: multerS3({
    s3: s3,
    bucket: AWS_S3_BUCKET_NAME,
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}_${Math.floor(Math.random() * 1000000)}_${file.originalname}`);

    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: (req, file, cb) => {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, PNG, and WEBP images are allowed"), false);
    }
  },
});

// This helper can be used for single file upload for a given field name
const uploadSingle = (fieldName) => {
  return uploads.single(fieldName);
};

// This helper can be used for multiple file upload for a given field name
const uploadFilesOnS3 = async (req, res, next) => {
  uploads.fields([
    { name: "images1"}, 
    { name: "images2"}, 
    { name: "images3"}, 
    { name: "images"}, 
    { name: "image"}, 
    { name: "nav_image"}, 
  ])(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ error: "File size exceeds the 5MB limit" });
        }
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
    }

    // Separate images for images1, images2, and images3
    const imageUrls1 = req.files?.images1 ? req.files.images1.map((file) => ({ url: file.location, key: file.key })) : [];
    const imageUrls2 = req.files?.images2 ? req.files.images2.map((file) => ({ url: file.location, key: file.key })) : [];
    const imageUrls3 = req.files?.images3 ? req.files.images3.map((file) => ({ url: file.location, key: file.key })) : [];
    const imageUrls = req.files?.images ? req.files.images.map((file) => ({ url: file.location, key: file.key })) : [];
    const imageUrl = req.files?.image ? req.files.image.map((file) => ({ url: file.location, key: file.key })) : null;
    const navImageUrl = req.files?.nav_image ? req.files.nav_image.map((file) => ({ url: file.location, key: file.key })) : null;
    
    // Store image URLs in the request object
    req.imageUrls1 = imageUrls1;
    req.imageUrls2 = imageUrls2;
    req.imageUrls3 = imageUrls3;
    req.imageUrls = imageUrls;
    req.imageUrl = imageUrl ? imageUrl[0] : null;
    req.navImageUrl = navImageUrl ? navImageUrl[0] : null;

    next();
  });
};

// add this in services 
const deleteFileByLocationFromS3 = async (fileUrl) => {
    try {
      if (!fileUrl.startsWith("https://")) {
        throw new Error("Invalid S3 file URL");
      }
  
      // Extract file key from URL
      const fileKey = new URL(fileUrl).pathname.substring(1); // Remove leading "/"
  
      if (!fileKey) {
        throw new Error("Invalid S3 file key extracted");
      }
  
      const params = {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: fileKey,
      };
  
      await s3.send(new DeleteObjectCommand(params));
      console.log(`File deleted: ${fileKey}`);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };



const deleteFileFromS3 = async (fileKey) => {
  const params = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: fileKey,
  };
  await s3.send(new DeleteObjectCommand(params));
};

module.exports = { uploadSingle, uploadFilesOnS3, deleteFileFromS3 };
module.exports = { uploadFilesOnS3, deleteFileFromS3 ,deleteFileByLocationFromS3,uploads};