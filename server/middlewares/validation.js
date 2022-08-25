module.exports = function validate(JOIValidator) {
    return (req, res, next) => {
        try {
            const data = JOIValidator.validate(req.body);
            if(data.error) {
                console.log(data.error.details);
                return res.status(400).send(data.error.details);
            } else {
                return next();
            }
        } catch (err) {
            console.log(err);
            return res.status(400).send(err);
        }
    }
}