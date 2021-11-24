const express = require("express");
const request = require('request');
const svg2img = require('svg2img');
const fs = require('fs');
const router = express.Router();
const walletTransactionController = require('../controllers/walletTransactionController')
const middleware = require('../middleware')

const omise = require('omise')({
    'secretKey': process.env.OMISE_SECRE_KEY,
    'omiseVersion': '2017-11-02'
});

router.post("/events", async (req, res) => {
    console.log(req.body)
});

router.post("/create", middleware.verifySessionToken, async (req, res) => {

    const sourceId = req.body.source_id;
    const amount = req.body.amount;
    const currency = req.body.currency;

    omise.charges.create({
        'amount': amount,
        'currency': currency,
        'source': sourceId
    }, function (err, resp) {
        if (err) {
            console.log(err)
            const data = {
                status: "error",
            }
            return res.json(data)
        }

        var options = {
            'method': 'GET',
            'url': resp.source.scannable_code.image.download_uri,
            'headers': {
            }
        };

        request(options, async function (error, response) {
            if (error) {
                console.log(err)
                const data = {
                    status: "error",
                }
                return res.json(data)
            }

            svg2img(response.body, { 'width': 680, 'height': 970 }, function (error, buffer) {
                if (error) {
                    const data = {
                        status: "error",
                    }
                    return res.json(data)
                }

                const id = resp.source.id.split("_")[2];

                fs.writeFileSync(`public/qrcode/${id}.png`, buffer);

                const data = {
                    status: "success",
                    image_uri: `https://www.gotogetherapp.me/static/qrcode/${id}.png`,
                    qr_id: resp.source.id.split("_")[2]
                }

                const wallet = {
                    id: id,
                    user_id: req.user.user_id,
                    amount: amount,
                    type: 'promptpay',
                }

                walletTransactionController.addWalletTransaction(wallet)

                return res.json(data)
            });



        });


    });
});

router.post('/check', middleware.verifySessionToken, async (req, res) => {
    const wallet = await walletTransactionController.getPendingWalletTransactionByUserId(req.user.user_id)
    console.log(wallet)
});


module.exports = router;