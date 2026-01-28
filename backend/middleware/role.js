
module.exports = (role) => {
    return (req, res, next) => {
        // This is a placeholder. In a real app, you would get the user's role from the database.
        const userRole = 'ADMIN'; // Mock user role
        if (userRole !== role) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};
