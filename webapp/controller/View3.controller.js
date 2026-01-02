sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("com.demo.b73ui5app.controller.View3", {
        onInit: function () {
            this.getOwnerComponent().getRouter()
                .getRoute("RouteView3")
                .attachPatternMatched(this.onPatternMatched, this);
        },

        onPatternMatched: function (oEvent) {
            this.prdId = oEvent.getParameter("arguments").key;

            if (this.prdId !== undefined) {
                // EDIT mode
                this.getView().bindElement("/ProductSet('" + this.prdId + "')");
            } else {
                // CREATE mode
                this.getView().unbindElement();
            }
        },

        // Create / Update Function
        onPressSave: function () {
            var prdId = this.byId("idPrdid").getValue();
            var name = this.byId("idName").getValue();
            var cat = this.byId("idCat").getValue();
            var price = this.byId("idPrice").getValue();
            var currcode = this.byId("idCurrCode").getValue();
            var rating = parseInt(this.byId("idRating").getValue());

            var payload = {
                Prdid: prdId,
                Prdname: name,
                Prdcategory: cat,
                Prdprice: price,
                Currcode: currcode,
                Rating: rating
            };

            var oModel = this.getOwnerComponent().getModel();

            if (this.prdId !== undefined) {
                // UPDATE
                oModel.update("/ProductSet('" + prdId + "')", payload, {
                    success: function () {
                        MessageBox.success("Product updated successfully");
                    },
                    error: function (error) {
                        var msg = JSON.parse(error.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            } else {
                // CREATE
                oModel.create("/ProductSet", payload, {
                    success: function () {
                        MessageBox.success("New product created successfully");
                        //Call File Upload Logic
                        this.triggerFileUpload();
                    }.bind(this),
                    error: function (error) {
                        var msg = JSON.parse(error.responseText).error.message.value;
                        MessageBox.error(msg);
                    }
                });
            }
        },

        onUploadCompleted: function (oEvent) {
            var status = oEvent.getParameter("status");
            var fileName = oEvent.getParameter("item").getFileName();
            if (status === 201) {
                MessageBox.success(fileName + " Uploaded Successfully");
            }
            else {
                MessageBox.error(fileName + " Not Uploaded Successfully");

            }
        },

        triggerFileUpload: function () {
            var prdId = this.byId("idPrdid").getvalue();
            var uploadSet = this.byId("idUploadSet");
            var aFiles = oUploadSet.getIncompleteItems();

            for (var i = 0; i < aFiles.length; i++) {
                var fileName = aFiles[i].getFileName();

                //Step1 construct Slug
                var slug = prdId + "," + fileName;

                var oSlug = new sap.ui.core.Item({
                    key: "SLUG",
                    text: slug
                });

                //Step-2 Construct X-CSRF Token
                this.getOwnerComponent().getModel().refreshSecurityToken();
                var oXCSRFToken = new sap.ui.core.Item({
                    key: "X-CSRF-Token",
                    text: this.getOwnerComponent().getModel().getSecurityToken()
                });
                oUploadSet.addHeaderField(oSlug);
                oUploadSet.addHeaderField(oXCSRFToken);
                oUploadSet.uploadItem(aFiles[i]);
                oUploadSet.removeAllHeaderFields();
            }
        },

        onNavBack: function () {
            history.go(-1);
        }
    });
});
