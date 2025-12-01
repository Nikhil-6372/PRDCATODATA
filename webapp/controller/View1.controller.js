sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("com.demo.b73ui5app.controller.View1", {
        onInit() {

            //Read Method (This Method is only use when u need to do some mandatoruy configuration which is not present) *We use JSON model  here
            //no need but for the understanding purpose i add a SNo. column here ,it works when u bind the data with json modulu configuration ([JSON Model name>/array name (results)])

            var prdJSONModel = new JSONModel();
            this.getView().setModel(prdJSONModel, "prdJSONModel");

            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/ProductSet", {
                success: function (data) {
                    for (var i = -0; i < data.results.length; i++) {
                        data.results[i].SNo = i + 1;
                    }
                    prdJSONModel.setData(data);
                },
               onPressRow:function(oEvent){
                
               },
               onPressF4Help:function(){
                alert("Hii");
               }
            });
        }
    });
});