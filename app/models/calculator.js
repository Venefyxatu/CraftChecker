var Calculator = Class.create({
    initialize: function(sceneController, intbonus, craftranks, craftmisc, dc, itemprice, honest) {
        this.sceneController = sceneController;
        this.intbonus = intbonus;
        this.craftranks = craftranks;
        this.craftmisc = craftmisc;
        this.dc = dc;
        this.itemprice = itemprice;
        this.origprice = itemprice;
        this.honest = honest;
        this.cost = Math.round(this.origprice / 3);
    },

    singleCraftCheck: function(remainingPrice) {
        dieRoll = this.rollDie();
        result = dieRoll * (this.craftranks + this.intbonus + this.craftmisc);
        if (result >= remainingPrice) {
            success = true;
        }
        else {
            success = false;
        }
        return { dieRoll: dieRoll, result: result, success: success };
    },

    craftItem: function(remainingPrice, days) {
        ok = false;
        while (ok == false) {
            days += 1;
            craftResult = this.singleCraftCheck(remainingPrice);
            if (craftResult.success == true) {
                ok = true;
            }
            this.sceneController.logEntry("\rDay " + days + "\r");
            this.sceneController.logEntry("-----------\r");
            this.sceneController.logEntry("    Check result: D20 (" + craftResult.dieRoll + ") * (Craft (" + this.craftranks + " + " + this.craftmisc + ") + INT (" + this.intbonus + ")) = " + craftResult.result + "\r");
            this.sceneController.logEntry("    Price left: " + remainingPrice + " - " + craftResult.result + " = " + (remainingPrice - craftResult.result) + "\r");
            remainingPrice -= craftResult.result;
            if (remainingPrice < 0) {
                // blehh - find a cleaner way to do this
                this.itemprice = remainingPrice + craftResult.result;
            }
            else {
                this.itemprice = remainingPrice;
            }

        }

        return days
    },

    calculate: function() {
        days = 0;

        days = this.craftItem(this.itemprice, days);

        craftCheck = this.rollDie();
        result = craftCheck + this.intbonus + this.craftranks + this.craftmisc;
        if (result >= this.dc) {
            this.sceneController.logEntry("\r\rFinal craft check succeeded. The item is finished.");
        }
        else {
            craftCalculation = craftCheck * (this.craftranks + this.intbonus);
            if (craftCalculation >= (this.itemprice - (this.origprice / 10))) {
                this.sceneController.logEntry("\r\rThe item is finished.");
            }
            else {
                if (this.honest == true) {
                    if (this.dc - result > 5) {
                        this.cost += Math.round(this.cost / 2);
                    }
                    this.sceneController.logEntry("\r\rItem looks finished, but isn't. Continuing the crafting process with item price " + this.itemprice);
                    days = this.craftItem(this.itemprice, days)
                }
                else {
                    this.sceneController.logEntry("\r\rThe item is not finished, even though it looks like it is.");
                }
            }
        }

        this.sceneController.logEntry("\r\rCrafting this item took " + days + " days.\r");
        this.sceneController.logEntry("Total cost price is " + this.cost);
    },

    rollDie: function() {
        result = Math.floor(Math.random() * 20 + 1);
        Mojo.Log.info("D20 rolled " + result);
        return result;
    }

});
