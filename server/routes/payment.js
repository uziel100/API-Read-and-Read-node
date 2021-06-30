const express = require("express");

const SaleOrder = require("../models/SaleOrder");
const Book = require("../models/Book");

const app = express();

app.post("/payment", async (req, res) => {
    const { country, state, postalCode, products } = req.body;
    let totalPayment = 0;    

    for (const product of products) {        
        const data = await Book.findById(product.id);
        totalPayment += data.price;
    }

    res.json({        
        products,
        totalPayment,
        country,
        state,
        postalCode,
    });
});

const getProductsId = async (products) => {
    let totalPayment = 0;
    products.forEach(async (idBook) => {
        // console.log('proceso...')
        const data = await Book.findById(idBook);
        console.log(data.price);
        totalPayment += data.price;
    });
    return totalPayment;
};

module.exports = app;
