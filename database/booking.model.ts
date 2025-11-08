import mongoose, { Document, Model, Schema } from 'mongoose'
import EventModel, { EventDocument } from './event.model'

// Booking document TypeScript interface
export interface BookingDocument extends Document {
    eventId: mongoose.Types.ObjectId
    email: string
    createdAt: Date
    updatedAt: Date
}

const BookingSchema = new Schema<BookingDocument, Model<BookingDocument>>(
    {
        eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
        email: { type: String, required: true, trim: true },
    },
    { timestamps: true, strict: true }
)

// Simple email validation regex (RFC-complete regex is large; this is pragmatic)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Pre-save hook:
// - Validate email format
// - Ensure the referenced event exists
BookingSchema.pre('save', async function (next) {
    try {
        const doc = this as BookingDocument

        if (typeof doc.email !== 'string' || !EMAIL_REGEX.test(doc.email)) {
            throw new Error('Invalid email format')
        }

        // Verify referenced Event exists; throw if not found.
        // Use `findById().select('_id')` to avoid pulling full document and to keep types aligned.
        const eventExists = await EventModel.findById(doc.eventId).select('_id').exec()
        if (!eventExists) {
            throw new Error('Referenced event not found')
        }

        next()
    } catch (err) {
        next(err as Error)
    }
})

const BookingModel = (mongoose.models.Booking as Model<BookingDocument>) ||
    mongoose.model<BookingDocument>('Booking', BookingSchema)

export default BookingModel
