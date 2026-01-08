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
            this.getView().bindElement("/ProductSet('" + prdId + "')")
        },
        onNavBack: function () {
            history.go(-1);
        },
        onDownload: function (oEvent) {
            var prdId = oEvent.getSource().getParent().getBindingContext().getProperty("Prdid");
            var fileName = oEvent.getSource().getParent().getBindingContext().getProperty("Filename");
            var url = "/sap/opu/odata/sap/ZB73_ODATA_SRV/AttachmentSet(Prdid='"  + prdId + "',Filename='" + fileName + "')/$value";
            sap.m.URLHelper.redirect(url, false);
        }

    });
});