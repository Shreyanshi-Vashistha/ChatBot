const Order = require("./homeKitchenOrder");

const OrderState = Object.freeze({
  WELCOMING: Symbol("welcoming"),
  ITEM: Symbol("item"),
  ITEM2: Symbol("item2"),
  FILLINGS: Symbol("fillings"),
  FILLINGS2: Symbol("fillings2"),
  DIPS: Symbol("dips"),
  DIPS2: Symbol("dips2"),
  ORDERAGAIN: Symbol("orderagain"),
});

module.exports = class kitchenOrder extends Order {
  constructor() {
    super();
    this.stateCur = OrderState.WELCOMING;
    this.sItem = "";
    this.sItem2 = "";
    this.sFillings = "";
    this.sFillings2 = "";
    this.sDips = "";
    this.sDips2 = "";
    this.sMenu = "Shreya's Home Kitchen";

    // price of first order
    this.cost = 10;
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
        this.stateCur = OrderState.FILLINGS;
        this.sItem = sInput;
        aReturn.push("What Fillings would you like?");
        aReturn.push("Diced Veggies, Diced Meat, Potatoes");
        break;
      case OrderState.FILLINGS:
        this.stateCur = OrderState.DIPS;
        this.sFillings = sInput;
        aReturn.push("What Dips would you like to have with that?");
        break;
      case OrderState.DIPS:
        this.stateCur = OrderState.ORDERAGAIN;
        //if user select dip , add $2 more to the original cost
        if (sInput.toLowerCase() != "no") {
          this.sDips = sInput;
          this.cost = this.cost + 2;
        }
        aReturn.push(
          "Would you like to order another item? \n Reply with y/Y or n/N"
        );
        break;

      //cases if user wants to order another item
      case OrderState.ORDERAGAIN:
        if (sInput.toLowerCase() == "y") {
          this.stateCur = OrderState.ITEM2;
          aReturn.push("What would you like to order?");
          aReturn.push("Dumplings or Wraps ?");
        }
        // if only one order, display order details and price to the user
        else if (sInput.toLowerCase() == "n") {
          aReturn.push("Thank-you for your order from");
          aReturn.push(
            `${this.sMenu} .Your order is ${this.sItem} with ${this.sFillings} filling`
          );
          if (this.sDips) {
            aReturn.push(`Dip included: ${this.sDips}`);
          }
          var orderTax = 0.13 * this.cost;
          aReturn.push(
            `Your order total is $${this.cost.toFixed(
              2
            )} \n Total with tax is $${(this.cost + orderTax).toFixed(2)}`
          );
        }
        break;

      case OrderState.ITEM2:
        this.stateCur = OrderState.FILLINGS2;
        this.sItem2 = sInput;
        aReturn.push("What Fillings would you like?");
        aReturn.push("Diced Veggies, Diced Meat, Potatoes");
        break;
      case OrderState.FILLINGS2:
        this.stateCur = OrderState.DIPS2;
        this.sFillings2 = sInput;
        aReturn.push("What Dips would you like to have with that?");
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
          `${this.sMenu} .Your order is ${this.sItem} with ${this.sFillings} filling`
        );
        if (this.sDips) {
          aReturn.push(`Dip included: ${this.sDips}`);
        }
        if (this.sItem2) {
          aReturn.push(
            `Your second order item is ${this.sItem2} with ${this.sFillings2} filling`
          );
          if (this.sDips2) {
            aReturn.push(`Dip included: ${this.sDips2}`);
          }
        }

        let d = new Date();
        d.setMinutes(d.getMinutes() + 20);
        aReturn.push(
          `Your order total is $${this.cost.toFixed(
            2
          )} \n Total with tax is $${(this.cost + orderTax).toFixed(
            2
          )} \nPlease pick up the order at ${d.toTimeString()}`
        );
        break;
    }
    return aReturn;
  }
};
