const Order = require("./Order");

const OrderState = Object.freeze({
  WELCOMING: Symbol("welcoming"),
  ITEM: Symbol("item"),
  ITEM2: Symbol("item2"),
  SIZE: Symbol("size"),
  SIZE2: Symbol("size2"),
  FILLINGS: Symbol("fillings"),
  FILLINGS2: Symbol("fillings2"),
  DIPS: Symbol("dips"),
  DIPS2: Symbol("dips2"),
  SIDE: Symbol("side"),
  SIDE2: Symbol("side2"),
  ORDERAGAIN: Symbol("orderagain"),
  PAYMENT: Symbol("payment"),
});

module.exports = class KitchenOrder extends Order {
  constructor(sNumber, sUrl) {
    super(sNumber, sUrl);
    this.stateCur = OrderState.WELCOMING;
    this.sItem = "";
    this.sItem2 = "";
    this.sSize = "";
    this.sSize2 = "";
    this.sFillings = "";
    this.sFillings2 = "";
    this.sDips = "";
    this.sDips2 = "";
    this.sSide = "";
    this.sSide2 = "";
    this.sMenu = "Shreya's Home Kitchen";

    // price of first order
    this.cost = 10;
    this.total = 0;
  }
  handleInput(sInput) {
    let aReturn = [];
    switch (this.stateCur) {
      case OrderState.WELCOMING:
        this.stateCur = OrderState.ITEM;
        aReturn.push("Welcome to Shreya's Home Kitchen");
        aReturn.push("What would you like?");
        aReturn.push("Dumplings or Wraps ?");
        break;
      case OrderState.ITEM:
        this.sItem = sInput.toLowerCase();
        if (this.sItem != "dumplings" && this.sItem != "wraps") {
          aReturn.push("Wrong input");
        } else {
          this.stateCur = OrderState.SIZE;
          // this.sItem = sInput;
          aReturn.push("What size would you like ?");
          aReturn.push("Large or Small ?");
        }
        break;
      case OrderState.SIZE:
        this.sSize = sInput.toLowerCase();
        if (this.sSize != "small" && this.sSize != "large") {
          aReturn.push("Wrong input");
        } else {
          this.stateCur = OrderState.FILLINGS;
          this.sSize = sInput;
          aReturn.push("What Fillings would you like?");
        }
        break;
      case OrderState.FILLINGS:
        this.stateCur = OrderState.SIDE;
        this.sFillings = sInput;
        aReturn.push(
          "Do you want to have french fries with that in sides, \n Yes or No?"
        );
        break;
      case OrderState.SIDE:
        this.sSide = sInput.toLowerCase();
        if (sInput.toLowerCase() != "no") {
          this.sSide = sInput;
          this.cost = this.cost + 2;
        }
        this.stateCur = OrderState.DIPS;
        aReturn.push(
          "What Dips would you like to have with that? \n Type no if you don't want any."
        );

        break;
      case OrderState.DIPS:
        this.stateCur = OrderState.ORDERAGAIN;
        //if user select dip , add $2 more to the original cost
        if (sInput.toLowerCase() != "no") {
          this.sDips = sInput;
          this.cost = this.cost + 2;
        }
        aReturn.push(
          "Would you like to order another item? \n Reply with Yes or No"
        );
        break;

      //cases if user wants to order another item
      case OrderState.ORDERAGAIN:
        if (sInput.toLowerCase() == "yes") {
          this.stateCur = OrderState.ITEM2;
          aReturn.push("What would you like to order?");
          aReturn.push("Dumplings or Wraps ?");
        }
        // if only one order, display order details and price to the user
        else if (sInput.toLowerCase() == "no") {
          aReturn.push("Thank-you for your order from");
          aReturn.push(
            `${this.sMenu} .Your order is ${this.sItem} in ${this.sSize} size with ${this.sFillings} filling`
          );
          if (this.sDips) {
            aReturn.push(`Dip included: ${this.sDips}`);
          }
          if (this.sSide == "yes") {
            aReturn.push(` With french fries`);
          }
          var orderTax = 0.13 * this.cost;
          this.total = this.cost + orderTax;
          aReturn.push(
            `Your order total is $${this.cost.toFixed(
              2
            )} \n Total with tax is $${this.total.toFixed(2)}`
          );
          aReturn.push(`Please pay for your order here`);
          aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
          this.stateCur = OrderState.PAYMENT;
        }
        break;

      case OrderState.ITEM2:
        this.sItem2 = sInput.toLowerCase();
        if (this.sItem2 != "dumplings" && this.sItem2 != "wraps") {
          aReturn.push("Wrong input");
        } else {
          this.stateCur = OrderState.SIZE2;
          this.sItem2 = sInput;
          aReturn.push("What size would you like small or large?");
        }
        break;
      case OrderState.SIZE2:
        this.sSize2 = sInput.toLowerCase();
        if (this.sSize2 != "small" && this.sSize2 != "large") {
          aReturn.push("Wrong input");
        } else {
          this.stateCur = OrderState.FILLINGS2;
          this.sSize2 = sInput;
          aReturn.push("What Fillings would you like?");
        }
        break;
      case OrderState.FILLINGS2:
        this.stateCur = OrderState.SIDE2;
        this.sFillings2 = sInput;
        aReturn.push(
          "Do you want to have french fries with that in sides \n Yes or No?"
        );
        break;

      case OrderState.SIDE2:
        this.sSide2 = sInput.toLowerCase();
        if (sInput.toLowerCase() != "no") {
          this.sSide2 = sInput;
          this.cost = this.cost + 2;
        }
        this.stateCur = OrderState.DIPS2;
        aReturn.push(
          "What Dips would you like to have with that? \n Type no if you don't want any."
        );
        break;
      case OrderState.DIPS2:
        this.isDone(true);
        if (sInput.toLowerCase() != "no") {
          this.cost = this.cost + 2;
          this.sDips2 = sInput;
        }

        // final price and tax calculation
        this.cost = this.cost + 8;
        var orderTax = 0.13 * this.cost;

        // display full order details to the user along with price
        aReturn.push(
          `${this.sMenu} .Your order is ${this.sItem} in ${this.sSize} size with ${this.sFillings} filling`
        );
        if (this.sDips) {
          aReturn.push(`Dip included: ${this.sDips}`);
        }
        if (this.sSide == "yes") {
          aReturn.push(`With French Fries`);
        }

        if (this.sItem2) {
          aReturn.push(
            `Your second order item is ${this.sItem2} in ${this.sSize2} size with ${this.sFillings2} filling`
          );
        }
        if (this.sDips2) {
          aReturn.push(`Dip included: ${this.sDips2}`);
        }
        if (this.sSide2 == "yes") {
          aReturn.push(`With French Fries`);
        }

        var orderTax = 0.13 * this.cost;
        this.total = this.cost + orderTax;
        aReturn.push(
          `Your order total is $${this.cost.toFixed(
            2
          )} \n Total with tax is $${this.total.toFixed(2)}`
        );
        aReturn.push(`Please pay for your order here`);
        aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
        this.stateCur = OrderState.PAYMENT;

        break;
      case OrderState.PAYMENT:
        this.isDone(true);
        let d = new Date();
        d.setMinutes(d.getMinutes() + 20);
        aReturn.push(` Thanks ${sInput.purchase_units[0].shipping.name["full_name"]} for ordering. \n We'll deliver your order at ${sInput.purchase_units[0].shipping.address["address_line_1"]} 
        ${sInput.purchase_units[0].shipping.address["admin_area_2"]},
${sInput.purchase_units[0].shipping.address["admin_area_1"]},
        ${sInput.purchase_units[0].shipping.address["postal_code"]},
        ${sInput.purchase_units[0].shipping.address["country_code"]}
        `);
        aReturn.push(`Your order will be delivered at ${d.toTimeString()}`);
        break;
    }
    return aReturn;
  }

  renderForm(sTitle = "-1", sAmount = "-1") {
    // your client id should be kept private
    if (sTitle != "-1") {
      this.sItem = sTitle;
    }
    if (sAmount != "-1") {
      this.nOrder = sAmount;
    }
    const sClientID = process.env.SB_CLIENT_ID || console.log(sClientID);
    ("put your client id here for testing ... Make sure that you delete it before committing");
    return `
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you ${this.sNumber} for your order of $${this.total}.
        <div id="paypal-button-container"></div>
  
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.total}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    window.open("", "_self");
                    window.close(); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `;
  }
};
