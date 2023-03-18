const express = require("express")
const router = express.Router()
const Product = require("../models/Product.model")
const { isLoggedOut, isLoggedIn } = require("../utils/middleware/middleware.js")
const fileUploader = require("../config/cloudinary.config")

// GET FORM PAGE

router.get("/new-listing", isLoggedIn, (req, res, next) => {
  {
    try {
      res.render("newlisting", { userInSession: req.session.currentUser })
    } catch {
      console.log(`Error while getting new listings page: ${error}`)
    }
  }
})

// POST CREATE PRODUCT

router.post("/new-listing", fileUploader.array("image"), isLoggedIn, (req, res, next) => {
  req.body.image = []
  console.log(req.body)
  req.files.forEach((element) => {
    req.body.image.push(element.path)
  })

  Product.create(req.body)
    .then((newProduct) => {
      res.redirect(`/product/${newProduct._id}`)
    })
    .catch((error) => console.log(`Error while creating a new product: ${error}`))
})

// GET PRODUCT DETAILS

router.get("/product/:productID", (req, res, next) => {
  const { productID } = req.params

  Product.findById(productID)
    .then((product) => {
      res.render("product", { product, userInSession: req.session.currentUser })
    })
    .catch((error) => console.log(`Error while creating a new productID page: ${error}`))
})

//GET EDIT PRODUCT PAGE

router.get("/product/:productID/edit", (req, res, next) => {
  const { productID } = req.params
  Product.findById(productID).then((response) => {
    console.log(response)
    res.render("editpage", { product: response, userInSession: req.session.currentUser })
  })
})

// POST EDIT PRODUCT

router.post("/product/:productID/edit", fileUploader.array("image"), (req, res, next) => {
  const { productID } = req.params
  console.log(req.body)
  Product.findById(productID)
    .then((product) => {
      Object.assign(product, req.body)
      console.log(product)
      return product.save()
    })
    .then(() => {
      res.redirect(`/product/${productID}`)
    })
    .catch((error) => console.log(`Error editing this product: ${error}`))
})

// POST DELETE PRODUCT

router.post("/allListings", isLoggedIn, (req, res, next) => {
  const id = req.body.id
  Product.findByIdAndDelete(id)
    .then((response) => {
      res.redirect("/allListings")
    })
    .catch((error) => console.log(`Error deleting product: ${error}`))
})

// ALL LISTINGS PAGE GET

router.get("/allListings", isLoggedIn, (req, res, next) => {
  const postedBy = req.session.currentUser._id

  Product.find({ postedBy: postedBy })
    .then((response) => {
      console.log(response)
      res.render("allListings", { response, userInSession: req.session.currentUser })
    })
    .catch((error) => console.log(`Error while getting all listings page: ${error}`))
})

module.exports = router
