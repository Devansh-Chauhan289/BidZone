import { Schema, model } from "mongoose"
import dotenv from "dotenv"
import { userData } from "./user.model.js"



const locationSchema = new Schema({
    name: { type: String },
    address: { type: String },
    lat: { type: Number },
    lng: { type: Number },
})


locationSchema.methods.setCoordinates = async function () {
    if (this.address) {
        try {
            const coordinates = await getCoordinates(this.address)
            this.lat = coordinates.lat
            this.lng = coordinates.lng
        } catch (err) {
            console.error("Error setting coordinates:", err)
            throw new Error("Failed to set coordinates for the location.")
        }
    }
}

const getCoordinates = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    try {
        const response = await axios.get(url)
        if (response.data && response.data.length > 0) {
            const location = response.data[0]
            // console.log(location)
            return {
                lat: parseFloat(location.lat),
                lng: parseFloat(location.lon),
            }
        } else {
            throw new Error("No results found for the address.")
        }
    } catch (err) {
        console.error(err)
        throw new Error("Unable to fetch coordinates.")
    }
}

const mediaSchema = new Schema({
    filename: String
})


const ProductSchema = new Schema({
    title: { type: String, required: true },
    desc: { type: String },
    dateTime: {
        uploadedDate: {
            dateTime: { type: Date, required: true },
            timeZone: { type: String, required: true },
        }
    },
    estimatedPrice : {type : Number},
    category : {type : String},
    location: locationSchema,
    media: [String],
    responsed: [
        {
            user: { type: Schema.Types.ObjectId, ref: "User" },
            status: { type: String, enum: ["intrested", "not intrested"], default: "maybe" },
        },
    ],
})

ProductSchema.pre("save", async function (next) {
    if (!this.isModified("responsed")) return next()

    try {
        const changedToIntrested = this.responsed.filter(status => status.isModified("status") && status.status === "intrested")

        if (changedToIntrested.length > 0) {
            for (let status of changedToIntrested) {
                const user = await userData.findById(status.user)

                if (user) {
                    await sendResponsedMail(user.email, this)
                }
            }
        }

        next()
    } catch (err) {
        console.error("Error in pre-save hook:", err)
        next(err)
    }
})

const productData = model("Products", ProductSchema)

export {
    productData
}