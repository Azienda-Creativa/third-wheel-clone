// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config()

// ℹ️ Connects to the database
require("./db")

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express")

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs")
// Handles access to the partials
hbs.registerPartials(__dirname + "/views/partials")

const app = express()

require("./config/session.config")(app)

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app)

// default value for title local
const capitalize = require("./utils/capitalize")
const projectName = "third-wheel"

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes")
app.use("/", indexRoutes)

const authRoutes = require("./routes/auth.routes")
app.use("/", authRoutes)

const quickLinkRoutes = require("./routes/quickLink.routes")
app.use("/", quickLinkRoutes)

const newListing = require("./routes/Product.routes")
app.use("/", newListing)

const newCart = require("./routes/cart.routes")
app.use("/", newCart)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app)

module.exports = app

// push commit
