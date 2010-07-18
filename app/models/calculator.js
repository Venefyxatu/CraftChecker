var Calculator = Class.create({
    initialize: function(sceneController, intbonus, craftranks, craftmisc, dc, itemprice) {
        this.sceneController = sceneController;
        this.intbonus = intbonus;
        this.craftranks = craftranks;
        this.craftmisc = craftmisc;
        this.dc = dc;
        this.itemprice = itemprice;
        this.origprice = itemprice;
    },

    calculate: function() {
        days = 0;
        ok = false;
        while (ok == false) {
            craftCheck = this.rollDie();
            result = craftCheck * (this.craftranks + this.intbonus);
            days += 1;
            if (result >= this.itemprice) {
                ok = true;
            }
            else {
                Mojo.Log.info("Item price left at the end of day " + days + ": " + this.itemprice);
                this.sceneController.logEntry("\rDay " + days + "\r");
                this.sceneController.logEntry("-----------\r");
                this.sceneController.logEntry("    Check result: D20 (" + craftCheck + ") * (Craft (" + this.craftranks + ") + INT (" + this.intbonus + ")) = " + result + "\r");
                this.sceneController.logEntry("    Price left: " + this.itemprice + " - " + result + " = " + (this.itemprice - result) + "\r");
                this.itemprice -= result;
            }
        }

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
                this.sceneController.logEntry("\r\rThe item is not finished, even though it looks like it is.");
            }
        }

        Mojo.Log.info("Crafting this item took " + days + " days");
        this.sceneController.logEntry("\r\rCrafting this item took " + days + " days.");
    },

    rollDie: function() {
        result = Math.floor(Math.random() * 21 + 1);
        Mojo.Log.info("D20 rolled " + result);
        return result;
    }

});
