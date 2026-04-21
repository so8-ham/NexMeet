import { Schema } from "mongoose";

const meetingSchema = new Schema({
    user_id: { type: String, require: true },
    meetingCode: { type: String, require: true },
    date: { type: Date, default: Date.now, require: true },
})

const Meeting = mongoose.model("Meeting", meetingSchema);

export default Meeting