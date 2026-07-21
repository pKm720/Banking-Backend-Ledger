const z = require("zod");

const createTransactionSchema = z.object({
    body: z.object({
        amount: z.coerce
            .number()
            .positive("Amount must be a positive number")
            .safe(),

        fromAccount: z
            .string()
            .uuid("Invalid sender account ID — must be a valid UUID"),

        toAccount: z
            .string()
            .uuid("Invalid receiver account ID — must be a valid UUID"),

        idempotencyKey: z
            .string()
            .trim()
            .min(5, "Key is too short"),
    }).refine((data) => data.fromAccount !== data.toAccount, {
        message: "Sender and receiver accounts cannot be the same",
        path: ["toAccount"],
    }),
});

const createSystemTransactionSchema = z.object({
    body: z.object({
        amount: z.coerce
            .number()
            .positive("Amount must be a positive number")
            .safe(),

        toAccount: z
            .string()
            .uuid("Invalid receiver account ID — must be a valid UUID"),

        idempotencyKey: z
            .string()
            .trim()
            .min(5, "Key is too short"),
    }),
});

module.exports = {
    createTransactionSchema,
    createSystemTransactionSchema,
};