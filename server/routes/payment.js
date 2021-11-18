const express = require("express");
const Stripe = require("stripe");
const mongoose = require("mongoose");
const SaleOrder = require("../models/SaleOrder");
const UserBook = require("../models/UserBook");
const Book = require("../models/Book");
const Wishlist = require("../models/Wishlist");
const { checkToken } = require("../middlewares/autentication");
const { Expo } = require('expo-server-sdk');
const User = require("../models/User");

const stripe = Stripe(
    "sk_test_51IHhWfCIDQWOdpTOmaemMvWBJIgDOrC2BNukykbC25Q46dhohuCjdcEj46owAA9GmMaItpnV4xxRaHubQLLBIray00ePr3SQrl"
);

const app = express();

app.post("/payment", checkToken, async (req, res) => {
    const { country, state, postalCode, products, nameCard, tokenStripe } =
        req.body;
    const { _id: user } = req.user;
    let totalPayment = 0;
    let productsTemp = [];
    try {
        // search producs and get total payment
        for (const product of products) {
            const data = await Book.findById(product._id);
            totalPayment += data.price;
            productsTemp.push(data);
        }

        const charge = await stripe.charges.create({
            amount: totalPayment * 100,
            currency: "mxn",
            source: tokenStripe,
            description: `ID usuario: ${user}`,
        });

        for (const product of productsTemp) {
            const payload = {
                user,
                product: product._id,
                paymentId: charge.id,
                totalPayment,
                priceProduct: product.price,
                postalCode,
                nameCard,
                country,
                state,
            };

            const payloadBook = {
                user,
                book: product._id,
            };

            const newOrderSale = new SaleOrder(payload);
            const newUserBook = new UserBook(payloadBook);
            await newOrderSale.save();
            await newUserBook.save();
        }

        // --------------
        // expo push notification
        // --------------
        let pushToken = '';
        await User.findById(user, (err, userDb) => {
            if (err) {
                console.log("error");
            }

            if (!userDb) {
                console.log("Usuario no encontrado");
            }

            const { pToken } = userDb;

            pushToken = pToken;
        });

        let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

        // Create the messages that you want to send to clients
        let messages = [];

        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
        }

        (async () => {
            messages.push({
                to: pushToken,
                sound: 'default',
                body: '¡Tu compra ha sido exitosa!',
                data: { withSome: 'data' },
            })
            try {
                await expo.sendPushNotificationsAsync(messages);
            } catch (error) {
                console.error(error);
            }
        })();


        // delete books if you have in wishlist

        const wishlist = await Wishlist.find({ userId: user });
        const arrayProducts = products.map((book) => book._id);

        for (const item of wishlist) {
            const idBook = item.bookId.toString();
            const id = item._id.toString();

            if (arrayProducts.includes(idBook)) {
                await Wishlist.findByIdAndUpdate(id, { status: false });
            }
        }

        res.json({
            status: true,
            message: "¡El pago se realizo correctamente!",
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message:
                "Ha ocurrido un error al momento de realizar el pago, intentalo de nuevo",
        });
    }
});

app.post("/payment/book", async (req, res) => {
    const booksId = req.body.books;

    try {
        const idObjects = booksId.map((id) => mongoose.Types.ObjectId(id));
        const books = await Book.find({ _id: { $in: idObjects } }, '_id title price imgUrl')
        res.json({
            status: true,
            books,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Ha ocurrido un error *',
            error
        })
    }

});

module.exports = app;
