const express = require("express");
const Stripe = require("stripe");
const SaleOrder = require("../models/SaleOrder");
const UserBook = require("../models/UserBook");
const Book = require("../models/Book");
const { checkToken } = require("../middlewares/autentication");

const stripe = Stripe(
    "sk_test_51IHhWfCIDQWOdpTOmaemMvWBJIgDOrC2BNukykbC25Q46dhohuCjdcEj46owAA9GmMaItpnV4xxRaHubQLLBIray00ePr3SQrl"
);

const app = express();

app.post("/payment", checkToken, async (req, res) => {
    const { country, state, postalCode, products, nameCard, tokenStripe } = req.body;
    const { _id: user } = req.user;
    let totalPayment = 0;
    let productsTemp = [];
    try {
        // search producs and get total payment
        for (const product of products) {
            const data = await Book.findById(product._id);
            totalPayment += data.price;
            productsTemp.push( data );
        }

        const charge = await stripe.charges.create({
            amount: totalPayment * 100,
            currency: "mxn",
            source: tokenStripe,
            description: `ID usuario: ${user}`,
        });

        for(const product of productsTemp){
            const payload = {
                user,
                product: product._id,
                paymentId: charge.id,
                totalPayment,
                priceProduct: product.price,
                postalCode,
                nameCard,
                country,
                state
            }

            const payloadBook = {
                user,
                book: product._id,                
            }

            const newOrderSale = new SaleOrder( payload );
            const newUserBook = new UserBook( payloadBook );
            await newOrderSale.save();
            await newUserBook.save();
        }

        res.json({
            status: true,
            message: '¡El pago se realizo correctamente!'
        });

    } catch (error) {
    	console.log(error)
        res.status(500).json({
            status: false,
            message: "Ha ocurrido un error al momento de realizar el pago, intentalo de nuevo",
        });
    }
});

module.exports = app;
