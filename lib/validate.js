/**
 * Input validation & sanitization utilities for API routes.
 * Keeps user input safe and within expected bounds.
 */

const MAX_LENGTHS = {
    title: 200,
    content: 5000,
    description: 2000,
    name: 100,
    email: 254,
    password: 128,
    mood: 10,
    category: 20,
    milestoneName: 100,
};

/**
 * Sanitize a string: trim, remove null bytes, limit length
 */
export function sanitize(value, maxLength = 1000) {
    if (typeof value !== "string") return "";
    return value
        .trim()
        .replace(/\0/g, "") // remove null bytes
        .slice(0, maxLength);
}

/**
 * Validate and sanitize common fields from request body.
 * Returns an object with sanitized values.
 * Throws if required fields are missing.
 *
 * @param {Object} body - The raw request body
 * @param {Object} schema - { fieldName: { required?: boolean, maxLength?: number, type?: string, enum?: string[] } }
 * @returns {Object} Sanitized and validated fields
 */
export function validateBody(body, schema) {
    const result = {};

    for (const [field, rules] of Object.entries(schema)) {
        let value = body[field];

        // Type coercion/validation
        if (rules.type === "boolean") {
            value = Boolean(value);
        } else if (rules.type === "date") {
            if (value) {
                const parsed = new Date(value);
                if (isNaN(parsed.getTime())) {
                    throw createError(`Invalid date for field: ${field}`, 400);
                }
                value = parsed;
            } else if (rules.required) {
                throw createError(`${field} is required`, 400);
            } else {
                value = undefined;
            }
        } else if (typeof value === "string") {
            const maxLen = rules.maxLength || MAX_LENGTHS[field] || 1000;
            value = sanitize(value, maxLen);

            if (rules.required && !value) {
                throw createError(`${field} is required`, 400);
            }

            if (rules.enum && value && !rules.enum.includes(value)) {
                throw createError(
                    `Invalid value for ${field}. Must be one of: ${rules.enum.join(", ")}`,
                    400
                );
            }
        } else if (rules.required && (value === undefined || value === null)) {
            throw createError(`${field} is required`, 400);
        }

        if (value !== undefined) {
            result[field] = value;
        }
    }

    return result;
}

/**
 * Create a structured error with status code
 */
export function createError(message, status = 400) {
    const err = new Error(message);
    err.status = status;
    return err;
}
