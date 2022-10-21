module.exports = function checkAccess(roles, reqFieldLoc, reqField, matchField, adminAccess) {
    return (req, res, next) => {
        try {
            if(!roles.includes(req.role)) {
                return res.sendStatus(403);
            } 
            else if(req.role === 'A' && adminAccess) {
                let fnd = false;
                for(const element of adminAccess) {
                    if(req.roleDetails.access.includes(element)) {
                        fnd = true;
                        break;
                    }
                }
                if(!fnd) {
                    return res.sendStatus(403);
                }
            } 
            else if(reqFieldLoc && reqField && matchField && req[matchField] != req[reqFieldLoc][reqField]) {
                return res.sendStatus(403);
            }
            next();
        } catch (err) {
            console.log(err);
            return res.sendStatus(403);
        }
    }
}
