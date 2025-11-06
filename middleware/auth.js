/*
    DA AgriManage - Agricultural Management System
    Authentication Middleware
*/

export const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
};

export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.session.userId) {
            return res.redirect('/login');
        }
        
        if (!roles.includes(req.session.userRole)) {
            return res.status(403).render('error', { 
                title: 'Access Denied',
                message: 'You do not have permission to access this resource.'
            });
        }
        
        next();
    };
};

export const redirectIfAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect('/dashboard');
    }
    next();
};