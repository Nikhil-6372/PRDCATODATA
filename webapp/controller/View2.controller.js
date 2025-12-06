sap.ui.define([
    "sap/ui/core/mvc/Controller",
], (Controller) => {
    "use strict";

    return Controller.extend("com.demo.b73ui5app.controller.View2", {
        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("RouteView2").attachPatternMatched(this.onPatternMatched, this);//This statement is responsible for views pattern matched
        },
        onPatternMatched: function (oEvent) {
            var prdId = oEvent.getParameter("arguments").key;
            this.byId("idSF").bindElement("/ProductSet('" + prdId + "')")
        },
        onNavBack: function () {
            history.go(-1);
        }
    });
});