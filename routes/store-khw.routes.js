const express = require("express")

const { uploadFilesOnS3 } = require("../services/S3_Services")

const { addCollection, getAllCollections, updateCollection, deleteCollection, getCollectionByName } = require("../controllers/khwaahish/collections.controller")
const { addCategory, getAllCategories, updateCategory, deleteCategory, getCategoryByName } = require("../controllers/khwaahish/category.controller")
const { addStyle, getAllStyles, updateStyle, deleteStyle } = require("../controllers/khwaahish/styles.controller")
const { addProduct, getProducts, getProductById, updateProduct, deleteProduct, getProductForUpdate, getProductByName } = require("../controllers/khwaahish/product.controller")

const router = express.Router()

router.post("/collections/add-collection",uploadFilesOnS3,addCollection) 
router.get("/collections/get-all-collections",getAllCollections)
router.get("/collections/get-collection-by-name/:name",getCollectionByName)
router.put("/collections/update-collection/:id",uploadFilesOnS3,updateCollection)
router.delete("/collections/delete-collection/:id",deleteCollection)

router.post("/categories/add-category",uploadFilesOnS3,addCategory)
router.get("/categories/get-all-categories",getAllCategories)
router.put("/categories/update-category/:id",uploadFilesOnS3,updateCategory)
router.get("/categories/get-category-by-name/:name",getCategoryByName)
router.delete("/categories/delete-category/:id",deleteCategory)

router.post("/styles/add-style",addStyle)
router.get("/styles/get-all-styles",getAllStyles)
router.put("/styles/update-style/:id",updateStyle)
router.delete("/styles/delete-style/:id",deleteStyle)

router.post("/products/add-product",uploadFilesOnS3,addProduct)
router.post("/products/get-products",getProducts)
router.get("/products/get-product/:id",getProductById)
router.get("/products/get-product-by-name/:name",getProductByName)
router.get("/products/get-product-for-update/:id",getProductForUpdate)
router.put("/products/update-product/:id",uploadFilesOnS3,updateProduct)
router.delete("/products/delete-product/:id",deleteProduct)


module.exports = router;