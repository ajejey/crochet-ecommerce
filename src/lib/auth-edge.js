import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

/**
 * Verify and decode a JWT token (Edge Runtime compatible - no bcrypt)
 * Returns null if token is invalid or expired
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

/**
 * Check if token should be refreshed (sliding session)
 * Returns true if token has less than 30 days remaining
 */
export function shouldRefreshToken(decoded) {
    if (!decoded || !decoded.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    const timeRemaining = decoded.exp - now;
    const daysRemaining = timeRemaining / (60 * 60 * 24);

    return daysRemaining < 30;
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(userId, email, role = 'user') {
    return jwt.sign(
        {
            userId,
            email,
            role
        },
        JWT_SECRET,
        { expiresIn: '90d' }
    );
}
