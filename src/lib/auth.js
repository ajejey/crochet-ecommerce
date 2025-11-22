import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '90d'; // 90 days (3 months) - sliding session
const SLIDING_WINDOW = 30; // Refresh token if less than 30 days remaining

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a password with a hashed password
 */
export async function comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
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
        { expiresIn: TOKEN_EXPIRY }
    );
}

/**
 * Verify and decode a JWT token
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
 * Returns true if token has less than SLIDING_WINDOW days remaining
 */
export function shouldRefreshToken(decoded) {
    if (!decoded || !decoded.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    const timeRemaining = decoded.exp - now;
    const daysRemaining = timeRemaining / (60 * 60 * 24);

    return daysRemaining < SLIDING_WINDOW;
}

/**
 * Set authentication cookie with JWT token
 */
export function setAuthCookie(token) {
    const cookieStore = cookies();
    cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 90, // 90 days (3 months)
        path: '/',
    });
}

/**
 * Get authentication cookie
 */
export function getAuthCookie() {
    const cookieStore = cookies();
    return cookieStore.get('session')?.value;
}

/**
 * Clear authentication cookie
 */
export function clearAuthCookie() {
    const cookieStore = cookies();
    cookieStore.delete('session');
}

/**
 * Get current user from session token
 */
export function getCurrentUserFromToken() {
    const token = getAuthCookie();
    if (!token) return null;

    return verifyToken(token);
}

/**
 * Generate a random reset token
 */
export function generateResetToken() {
    return jwt.sign(
        { type: 'password-reset', timestamp: Date.now() },
        JWT_SECRET,
        { expiresIn: '1h' } // Reset tokens expire in 1 hour
    );
}

/**
 * Verify a reset token
 */
export function verifyResetToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.type !== 'password-reset') {
            return null;
        }
        return decoded;
    } catch (error) {
        return null;
    }
}
