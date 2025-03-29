import { productData } from "../models/product.model.js";
import { cloudinary } from "../middlewares/cloudinary.js";
import { userData } from "../models/user.model.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import axios from "axios";


dotenv.config()


const mediacontroller = async (req) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(req.file.path, (result, error) => {
            if (error) {
                console.log("Error - ", error);
                return reject("Error uploading media");
            }
            
            resolve(result.url); 
        });
    });
};


const UploadProducts = async(req,res) => {
    const { title, description, uploadDate, location, responded, estiimatedPrice, category } = req.body;
    
    if (!title || !location || !estiimatedPrice || !category) {
        return res.status(400).json({ msg: "Missing required fields" });
    }
    try {
        let uploadedMedia = [];
        if(req.file){
            uploadedMedia.push( await mediacontroller(req))
        }

        const newProduct = new productData({
            title,
            desc : description || "",
            uploadDate,
            location,
            responded,
            estiimatedPrice,
            category,
            media: uploadedMedia,
        });
        await newProduct.save();
        return res.status(201).json({ msg: "Product Uploaded successfully!", newProduct });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Error uploading product", error: err.message });
    }
    
}

const getAllProucts = async (req, res) => {
    try {
        const products = await productData.find()
        if (products.length === 0) {
            return res.status(404).json({ msg: "No products available yet." })
        }
        return res.status(200).json({ products })
    } catch (err) {
        return res.status(500).json({ msg: "Error getting products", error: err.message })
    }

}


const getProduct = async (req, res) => {
    const { id } = req.params

    try {
        const product = await productData.findById(id).populate("responded.user")
        if (!product) {
            return res.status(404).json({ msg: "product not found." })
        }

        const productUrl = process.env.WEBSITE_URL + `/products/${product._id}`
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${product.location.lat},${product.location.lng}`

        return res.status(200).json({ product, productUrl, mapUrl })
    } catch (err) {
        return res.status(500).json({ msg: "Error fetching product", error: err.message })
    }
}



export {
    UploadProducts,
    getAllProucts,
    getProduct
}