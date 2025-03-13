const express = require('express');
const router = express.Router();
const pressReleaseController = require('../controllers/pressRelease.controller.js');

const {uploadFilesOnS3} = require("../services/S3_Services.js")



// Routes with Image Upload
router.post('/', uploadFilesOnS3, pressReleaseController.createPressRelease);
router.put('/:id', uploadFilesOnS3, pressReleaseController.updatePressRelease);
router.get('/', pressReleaseController.getAllPressReleases); 
router.get('/:id', pressReleaseController.getPressReleaseById); 
router.delete('/:id', pressReleaseController.deletePressRelease);

module.exports = router;
