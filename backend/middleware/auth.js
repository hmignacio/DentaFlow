function requireAuth(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({
            message: "Please log in to continue."
        });
    }

    next();
}
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({
                message: "Please log in to continue."
            });
        }

        if (!allowedRoles.includes(req.session.user.role)) {
            return res.status(403).json({
                message: "You do not have permission to access this dashboard."
            });
        }

        next();
    };
}

module.exports = { requireAuth, requireRole };
