/**
 * Mongoose connection helper for Next.js (TypeScript)
 *
 * - Uses a global cache to avoid creating multiple connections during
 *   development / hot-reloads. This is important because Next's dev server
 *   may re-evaluate modules frequently which can otherwise create many
 *   connections and exhaust MongoDB connection limits.
 * - Provides a single async `connectToDatabase` function that returns the
 *   active Mongoose `Connection` object.
 * - Uses strong typing (no `any`).
 */
import mongoose from 'mongoose'

// The environment variable that contains your MongoDB connection string.
// Set this in your environment (e.g. `.env.local`) as `MONGODB_URI`.
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    // Fail fast with a clear message if the connection string is missing.
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    )
}

// Improve Mongoose behavior for strict queries (optional but recommended).
mongoose.set('strictQuery', true)

/**
 * A typed cache object stored on the global object. We attach the cache to
 * the global scope so it survives Hot Module Replacement (HMR) in development.
 */
declare global {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    var _mongoose: {
        conn: mongoose.Connection | null
        promise: Promise<mongoose.Connection> | null
    } | undefined
}

// Initialize the global cache object if it doesn't exist.
if (!global._mongoose) {
    global._mongoose = { conn: null, promise: null }
}

/**
 * Establishes (or returns) a Mongoose connection to MongoDB.
 *
 * - Returns the active `mongoose.Connection`.
 * - Caches the connection to avoid multiple connections during development.
 */
export async function connectToDatabase(): Promise<mongoose.Connection> {
    // Use a local reference to the cached object for safer typing and to
    // avoid repeated optional chaining checks.
    const cache = global._mongoose!

    // If a connection is already established, reuse it.
    if (cache.conn) {
        return cache.conn
    }

    // If a connection is in progress, await the existing promise.
    if (cache.promise) {
        return cache.promise
    }

    // Create a new connection promise and store it on the global cache so
    // concurrent callers will wait for the same promise instead of creating
    // additional connections.
    const promise: Promise<mongoose.Connection> = mongoose
        .connect(MONGODB_URI as string)
        .then((mongooseInstance: mongoose.Mongoose) => {
            // Save the established connection on the cache and return it.
            cache.conn = mongooseInstance.connection
            return mongooseInstance.connection
        })

    cache.promise = promise

    return promise
}

export default connectToDatabase
