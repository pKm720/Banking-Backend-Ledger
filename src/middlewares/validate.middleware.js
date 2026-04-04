const validate = (schema) => (req, res, next) => {
    try {
        const parsed = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        req.body = parse.body;
        req.query = parsed.query;
        req.params = parsed.params;

        return next();
    } catch (error) {
        return res.status(400).json({
            status: "Fail",
            message: "Validation Error",
            errors: error.errors.map(err => ({
                path: err.path.join("."),
                message: err.message
            }))
        })
    }
}
module.exports = validate