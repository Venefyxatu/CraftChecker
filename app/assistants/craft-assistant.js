function CraftAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */

    this.honest = true;
}

CraftAssistant.prototype.setup = function() {

    this.controller.setupWidget("intbonus", { label: "INT bonus", modelProperty: "value", min: 0, max: 10 }, this.intBonusModel = { value: 4 });
    this.controller.setupWidget("craftranks", { label: "Craft ranks", modelProperty: "value", min: 1, max: 30 }, this.craftRanksModel = { value: 6 });
    this.controller.setupWidget("craftmisc", { label: "Craft misc bonus", modelProperty: "value", min: 0, max: 10 }, this.craftMiscModel = { value: 0 });
    this.controller.setupWidget("dc", { label: "DC", modelProperty: "value", min: 0, max: 50 }, this.dcModel = { value: 15 });
    this.controller.setupWidget("itemprice", 
            { 
              hintText: "store price", 
              charsAllow: function( charCode) 
                  {
                    return ((charCode >= 48 && charCode <= 57)); /*allow 0-9*/
                  }, 
              modifierState: Mojo.Widget.numLock 
            }, 
            this.itemPriceModel = { 
              value: 0, 
              disabled: false 
            });

    this.controller.setupWidget("calculate", { label: "Calculate" }, { disabled: false, label: "Calculate" });
    this.controller.setupWidget("log", 
            {
              hintText: "",
              multiline: true
            },
            this.logModel = {
              value: "",
              disabled: true
            });

    this.controller.setupWidget(Mojo.Menu.commandMenu, undefined, 
            this.cmdMenuModel = {
                visible: true,
                items: [
                    { 
                        toggleCmd: "honest", 
                        items: [
                            {},
                            {label: "Honest", command: "setHonest" }, 
                            { label: "Dishonest", command: "setDishonest" },
                            {}
                        ]
                    }
                ]
            });

    this.cmdMenuModel.items[0].toggleCmd = "setHonest";
    this.controller.modelChanged(this.cmdMenuModel);

    this.calculateHandler = this.calculate.bindAsEventListener(this);

    this.controller.listen("calculate", Mojo.Event.tap, this.calculateHandler);
};

CraftAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
};

CraftAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
};

CraftAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
    this.controller.stopListening(this.controller.get("calculate"), Mojo.Event.tap, this.calculateHandler);
};

CraftAssistant.prototype.handleCommand = function(event) {
    if (event.type == Mojo.Event.command) {
        switch (event.command) {
            case "setHonest":
                this.honest = true;
                break;
            case "setDishonest":
                this.honest = false;
                break;
        }
    }
};

CraftAssistant.prototype.calculate = function(event) {
    this.logModel.value = "";
    this.controller.modelChanged(this.logModel, this);
    Mojo.Log.info("honesty: " + this.honest);
    calculator = new Calculator(this, this.intBonusModel.value, this.craftRanksModel.value, this.craftMiscModel.value, this.dcModel.value, this.itemPriceModel.value, this.honest);
    calculator.calculate()
};

CraftAssistant.prototype.logEntry = function(logLine) {
    Mojo.Log.info(logLine);
    this.logModel.value += logLine;
    this.controller.modelChanged(this.logModel, this);
};
