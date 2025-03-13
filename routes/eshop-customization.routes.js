const {
    landingPageUpdate,
    addPromise,
    deletePromise,
    getLandingpage,
    toggleSection
} =require("../controllers/eshop/landingpage.controller.js");
const express = require("express");
const { uploads } = require("../services/S3_Services.js");
const { createTestimonial, getTestimonials, updateTestimonial, deleteTestimonial } = require("../controllers/eshop/testimonial.controller.js");
const { createBenefit, getBenefits, updateBenefit, deleteBenefit } = require("../controllers/eshop/eshopBenefits.controller.js");
const router = express.Router();


// add update both
router.get("/landing-page", getLandingpage);
router.put("/landing-page", uploads.fields([
    { name: "logo" },
    { name: "hero_desktop_img" },
    { name: "hero_mobile_img" },
    { name: "ad_video" },
    { name: "trending_img" },
    { name: "legacy_img" },
    { name: "curator_img" },
]), landingPageUpdate);

router.put("/toggle-section",toggleSection);
router.post('/landing-page/promises', uploads.single('image'), addPromise);
router.delete('/landing-page/promises/:id', deletePromise);


// Testimonial Routes
// Using local storage
router.post("/testimonial", uploads.single("profile_img"), createTestimonial);
router.put("/testimonial/:id", uploads.single("profile_img"), updateTestimonial);

// Using S3 storage (uncomment these lines to switch to S3):
// router.post("/", isAuth, isAdmin, uploadSingle("profile_img"), createTestimonial);
// router.put("/:id", isAuth, isAdmin, uploadSingle("profile_img"), updateTestimonial);

router.get("/testimonial", getTestimonials);
router.delete("/testimonial/:id", deleteTestimonial);

// Eshop Benefits Routes
// S3 Upload Setup
// const { uploadSingle } = require("../../services/S3_Services"); // adjust the path as needed

// Routes using local storage
router.post("/eshop-benefits", uploads.single("image"), createBenefit);
router.put("/eshop-benefits/:id", uploads.single("image"), updateBenefit);

// Routes using S3 storage (uncomment these lines to switch to S3)
// router.post("/", isAuth, isAdmin, uploadSingle("image"), createBenefit);
// router.put("/:id", isAuth, isAdmin, uploadSingle("image"), updateBenefit);

router.get("/eshop-benefits", getBenefits);
router.delete("/eshop-benefits/:id", deleteBenefit);

module.exports = router;