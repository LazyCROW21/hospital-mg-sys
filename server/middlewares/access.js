module.exports = function checkAccess(roles, reqFieldLoc, reqField, matchField, adminAccess) {
    return (req, res, next) => {
        try {
            if(!roles.includes(req.role) ) {
                return res.sendStatus(401);
            }
            if(req.role === 'A' && adminAccess) {
                let fnd = false;
                for(let i=0; i<adminAccess.length; i++) {
                    if(req.roleDetails.access.includes(adminAccess[i])) {
                        fnd = true;
                        break;
                    }
                }
                if(!fnd) {
                    return res.sendStatus(401);
                } else {
                    return next();
                }
            }
            if(reqFieldLoc && reqField && matchField) {
                if(req[matchField] != req[reqFieldLoc][reqField]) {
                    return res.sendStatus(401);
                }
            }
            next();
        } catch (err) {
            console.log(err);
            return res.sendStatus(401);
        }
    }
}
