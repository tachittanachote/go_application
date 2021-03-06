//Packages
const express = require("express");
const cors = require('cors');


//Routes
const usersRoute = require("./routes/user");
const otpRoute = require("./routes/otp");
const carsRoute = require("./routes/cars");
const devicesRoute = require("./routes/device");
const authRoute = require("./routes/auth");
const invoiceRoute = require("./routes/invoices");
const locationRoute = require("./routes/location");
const profileRoute = require("./routes/profile");
const emergencyRoute = require("./routes/emergency")
const omiseRoute = require("./routes/omise");
const historyRoute = require("./routes/history");
const feedbackRoute = require("./routes/feedback");
const transactionRoute = require("./routes/transaction");
const walletRoute = require("./routes/wallet");
const webRoute = require("./routes/web");
const favoriteRoute = require("./routes/favorite");

//Middleware
const middleware = require("./middleware");

require("dotenv").config();

const app = express()
const router = express.Router();
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use('/static', express.static('public'))
app.use('/api/v1', router);

app.get("/", (req, res) => {
    //res.redirect("https://www.google.com");
    res.sendFile(__dirname + '/views/index.html');
})

//web
router.use('/system', webRoute)

//No middleware require
router.use('/device', devicesRoute)
router.use('/emergency', emergencyRoute)
//Middleware verify token
router.use('/otp', middleware.verifyDevice, otpRoute)

//Middleware access token
router.use('/auth', middleware.verifyAccessToken, authRoute)

//Middleware session token
router.use('/user', middleware.verifySessionToken, usersRoute)
router.use('/cars', carsRoute)
router.use('/location', middleware.verifySessionToken, locationRoute)
router.use('/invoices', middleware.verifySessionToken, invoiceRoute)
router.use('/profile', middleware.verifySessionToken, profileRoute)
router.use('/omise', omiseRoute)
router.use('/history', historyRoute)
router.use('/feedback', feedbackRoute)
router.use('/transaction', transactionRoute)
router.use('/wallet', walletRoute)
router.use('/favorite', middleware.verifySessionToken, favoriteRoute)

app.listen(PORT, () => {
    console.log(`SERVER: listening on 0.0.0.0:${PORT}`)
})

//Test
const test = require("./test")
test.runTest();