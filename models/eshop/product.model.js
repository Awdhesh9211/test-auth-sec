const mongoose = require("mongoose");
const { deleteFileFromS3 } = require("../../services/S3_Services");

const ProductSchema_eshop = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, unique: true, required: true },
    description: { type: String },
    stock: { type: Number, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category_eshop", required: true },
    style: { type: mongoose.Schema.Types.ObjectId, ref: "Style_eshop" },
    collection: { type: mongoose.Schema.Types.ObjectId, ref: "Collection_eshop", required: true },

    color1: { type: mongoose.Schema.Types.ObjectId, ref: "Color_eshop" },
    color2: { type: mongoose.Schema.Types.ObjectId, ref: "Color_eshop" },
    color3: { type: mongoose.Schema.Types.ObjectId, ref: "Color_eshop" },

    images1: [{ _id: false, key: String, url: String }],
    images2: [{ _id: false, key: String, url: String }],
    images3: [{ _id: false, key: String, url: String }],

    product_weight: { type: Number, default: 0 },
    total_gold_weight: { type: Number, required: true },

    diamond_discount: { type: mongoose.Schema.Types.ObjectId, ref: "Discount_eshop" },
    gold_discount: { type: mongoose.Schema.Types.ObjectId, ref: "Discount_eshop" },
    discount_on_total: { type: mongoose.Schema.Types.ObjectId, ref: "Discount_eshop" },

    golds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Gold_eshop", required: true }],
    diamonds: [
      {
        _id: false,
        diamond: { type: mongoose.Schema.Types.ObjectId, ref: "Diamond_eshop", required: true },
        same_pcs: { type: Number, required: true },
        pcs: [{ _id: false, count: { type: Number, required: true }, weight: { type: Number, required: true } }],
      },
    ],

    // Gemstone Details (if applicable)
    gemstone_name: { type: String },
    gemstone_price: { type: Number, default: 0 },
    gemstone_weight: { type: Number, default: 0 },
    gemstone_type: { type: String },

    // Other Costs
    labor: { type: mongoose.Schema.Types.ObjectId, ref: "Labor_eshop" },

    pearl_cost: { type: Number, default: 0 },
    extra_cost: { type: Number, default: 0 },
    extra_fee: { type: Number, default: 0 },

    // GST %
    gst_percent: { type: Number, default: 0 },
    isItRing: { type: Boolean, default: false },

    // Product Dimensions
    height: { type: String },
    width: { type: String },

    // Recommended For
    recommendedFor: [ { type: mongoose.Schema.Types.ObjectId, ref: "recommeded_eshop" }],
  },
  { timestamps: true }
);

ProductSchema_eshop.pre("save", async function (next) {
  const Discount = mongoose.model("Discount_eshop");
  const diamond_discount = await Discount.findOne(
    {
      discount_on: "diamond_discount",
      $or: [
        { category: this.category },
        { collection: this.collection },
        { style: this.style },
      ],
    }
  )
    .sort({ createdAt: -1 })

  const gold_discount = await Discount.findOne(
    {
      discount_on: "gold_discount",
      $or: [
        { category: this.category },
        { collection: this.collection },
        { style: this.style },
      ],
    }
  )
    .sort({ createdAt: -1 })

  const discount_on_total = await Discount.findOne(
    {
      discount_on: "discount_on_total",
      $or: [
        { category: this.category },
        { collection: this.collection },
        { style: this.style },
      ],
    }
  )
    .sort({ createdAt: -1 })

  if (diamond_discount && !diamond_discount.product) {
    this.diamond_discount = diamond_discount._id
  }
  if (gold_discount && !gold_discount.product) {
    this.gold_discount = gold_discount._id
  }
  if (discount_on_total && !discount_on_total.product) {
    this.discount_on_total = discount_on_total._id
  }

  next();
});

ProductSchema_eshop.pre("deleteMany", async function (next) {
  try {
    const products = await this.model.find(this.getFilter());

    const keysToDelete = products.flatMap((product) => [
      ...(product.images1?.map((img) => img.key) || []),
      ...(product.images2?.map((img) => img.key) || []),
      ...(product.images3?.map((img) => img.key) || []),
    ]);

    if (keysToDelete.length > 0) {
      await Promise.all(keysToDelete.map((key) => deleteFileFromS3(key)));
    }

    next();
  } catch (error) {
    next(error);
  }
});
const Products_eshop = mongoose.model("Product_eshop", ProductSchema_eshop);
module.exports = Products_eshop;
