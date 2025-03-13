const User = require("../models/user.model");

const isAdmin = (req, res, next) => {
    const userId = req.user.id; // Assuming user.id is set in req object after authentication

    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (user.roles.includes("Admin")) {
                next();
            } else {
                return res.status(403).json({ message: "Access denied. Admins only." });
            }
        })
        .catch(err => {
            return res.status(500).json({ message: "Server error", error: err });
        });
};

module.exports = isAdmin;