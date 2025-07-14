// models/place.model.js

import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fromLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Place", placeSchema);
