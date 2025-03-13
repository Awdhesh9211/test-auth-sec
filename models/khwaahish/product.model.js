const mongoose = require("mongoose");
const { deleteFileFromS3 } = require("../../services/S3_Services");

const ProductSchema_khw = new mongoose.Schema(
  {
    name: { type: String,unique:true, required: true },
    sku: { type: String, unique: true, required: true },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category_khw", required: true },
    style: { type: mongoose.Schema.Types.ObjectId, ref: "Style_khw" },
    collection: { type: mongoose.Schema.Types.ObjectId, ref: "Collection_khw", required: true },

    images: [{ _id: false, key: String, url: String }],

    youtube_link:{type:String},

    product_weight: { type: Number, default: 0 },
    gold_weight: { type: Number},
    diamond_weight:{type:Number},
    diamond_quality:{type:String},

    gemstone_name: { type: String },
    gemstone_weight: { type: Number, default: 0 },
    gemstone_type: { type: String },

    height: { type: String },
    width: { type: String },

  },
  { timestamps: true }
);

ProductSchema_khw.pre("deleteMany", async function (next) {
  try {
    const products = await this.model.find(this.getFilter());

    const keysToDelete = products.flatMap((product) => [
      ...(product.images?.map((img) => img.key) || [])
    ]);

    if (keysToDelete.length > 0) {
      await Promise.all(keysToDelete.map((key) => deleteFileFromS3(key)));
    }

    next();
  } catch (error) {
    next(error);
  }
});
const Products_khw = mongoose.model("Product_khw", ProductSchema_khw);
module.exports = Products_khw;
