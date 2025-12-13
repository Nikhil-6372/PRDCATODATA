sap.ui.define([
    "sap/ui/core/mvc/Controller",
], (Controller) => {
    "use strict";

    return Controller.extend("com.demo.b73ui5app.controller.View3", {
        onInit: function () {
        },

        onPressSave: function () {
            //Read  the new Product Data
            var prdId = this.byId("Prdid").getValue();
            var name = this.byId("Prdname").getValue();
            var cat = this.byId("Prdcategory").getvalue();
            var price = this.byId("Prdprice").getValue();
            var currcode = this.byId("Currcode").getvalue();
            var Rating = parseInt(this.byid("Rating").getvalue());

            var payload = {
                Prdid : prdId,
                Prdname : name,
                Prdcategory : cat,
                Prdprice : price,
                Currcode : currcode,
                Rating : Rating 
            };

            var oModel = this.getOwnerComponent().getModel();
        },


        onNavBack: function () {
            history.go(-1);
        }
    });
});