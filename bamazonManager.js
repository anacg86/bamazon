// Import npm package
var mysql = require("mysql");
var inquirer = require('inquirer');

//Connection details
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "1111986acg",
    database: "bamazonDB"
});

// Connect to DB
connection.connect(function (err) {
    if (err) throw err;
    console.log("The following products are for sale!!!!!");
    viewProductsForSale();
    //connection.end();
});


//functions for the case scenario
function viewProductsForSale() {
    connection.query("SELECT item_id,product_name,sale_price, shipping,stock_quantity FROM `bamazon` WHERE `sale` = ?", [true], function (err, response) {
        if (err) throw err;
        console.table(response);
        searchAction();
    })
};

function searchAction() {
    inquirer
        .prompt([{
            type: "list",
            message: "Which of the following products would you like to buy",
            choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            name: "itemId"
        },
        {
            type: "input",
            message: "How many products would you like to buy?",
            name: "quantity"
        }])
        .then(answers => {
            var itemId = answers.itemId;
            var quantity = answers.quantity;
            fetchItemById(itemId, quantity);
        });
}

function fetchItemById(id, quantity) {
    connection.query("SELECT item_id,product_name,sale_price, shipping,stock_quantity FROM `bamazon` WHERE `item_id` = ?", id, function (err, response) {
        if (err) throw err;
        var result = response[0];
        if (quantity <= result.stock_quantity) {
            console.log("You can buy this item");
           //if enough, update database to reflect left quantity 
           let sql = `UPDATE bamazon
           SET stock_quantity = ?
           WHERE item_id = ?` ;
            var remainingQuantity = result.stock_quantity - quantity;
            //result nan
            var multiply = parseInt(quantity) * parseFloat(result.sale_price);
            var totalBill = multiply + parseFloat(result.shipping);
            let data = [remainingQuantity, id];
            connection.query(sql, data, function (err, response) {
                console.table(response);
                //show customer the total billing 
                console.log("This is your total bill: $" + totalBill);
            })
        }
        else {
            console.log("Insufficient Quantity");
        }
    });
}
