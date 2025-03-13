const router = require("express").Router()
const {isAuth} = require("../middlewares/authMiddleware")
const {phoneOtp, phoneOtpVerifyAndChangePassword, changePasswordViaPasskey,
     addAddress, updateAddress, deleteAddress, getAddresses,
     emailOtp,
     emailOtpVerify,
     updateName} = require("../controllers/user.profile.controller")

router.post('/forgot-pass/phone-otp',isAuth,phoneOtp)
router.post('/forgot-pass/phone-otp-verify',isAuth, phoneOtpVerifyAndChangePassword)
router.post('/forgot-pass/passkey',isAuth,changePasswordViaPasskey);

router.post("/add-address", isAuth, addAddress);
router.put("/update-address/:addressId", isAuth, updateAddress);
router.delete("/delete-address/:addressId", isAuth, deleteAddress);
router.get("/get-address", isAuth, getAddresses);

router.post("/email-otp",isAuth,emailOtp)
router.post("/email-otp-verify",isAuth,emailOtpVerify)

router.post("/update-name",isAuth,updateName)
module.exports =  router;