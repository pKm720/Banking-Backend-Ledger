const validate = (schema) => (req, res, next) => {
    try {
        const parsed = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        req.body = parsed.body;
        req.query = parsed.query;
        req.params = parsed.params;

        return next();
    } catch (error) {
        const issues = error.errors || error.issues || [];
        
        if (issues.length > 0) {
            return res.status(400).json({
                status: "Fail",
                message: "Validation Error",
                errors: issues.map(err => ({
                    path: err.path.join("."),
                    message: err.message
                }))
            });
        }

        // Fallback for non-Zod errors or unexpected issues
        return res.status(400).json({
            status: "Fail",
            message: error.message || "An unexpected validation error occurred"
        });
    }
}
module.exports = validate