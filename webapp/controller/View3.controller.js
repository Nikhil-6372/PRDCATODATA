sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("com.demo.b73ui5app.controller.View3", {
        onInit: function () {
        },

        // Create Function
        
        onPressSave: function () {
            //Read  the new Product Data
            var prdId = this.byId("idPrdid").getValue();
            var name = this.byId("idName").getValue();
            var cat = this.byId("idCat").getValue();
            var price = this.byId("idPrice").getValue();
            var currcode = this.byId("idCurrCode").getValue();
            var rating = parseInt(this.byId("idRating").getValue());

            var payload = {
                Prdid : prdId,
                Prdname : name,
                Prdcategory : cat,
                Prdprice : price,
                Currcode : currcode,
                Rating : rating 
            };

            var oModel = this.getOwnerComponent().getModel();
            oModel.create("/ProductSet", payload, {
                success:function(req,res){
                    MessageBox.success("New product created successfully");
                },
                error:function(error) {
                    var error = JSON.parse(error.responseText).error.message.value;
                    MessageBox.error(error);
                }
            })
        },


        onNavBack: function () {
            history.go(-1);
        }
    });
});