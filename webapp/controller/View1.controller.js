sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "com/demo/b73ui5app/model/formatter",
    "sap/ui/export/Spreadsheet"

], 
(Controller, JSONModel, MessageBox, formatter, Spreadsheet) => {
    "use strict";

    return Controller.extend("com.demo.b73ui5app.controller.View1", {
        f:formatter,

        onInit() {

            //Read Method (This Method is only use when u need to do some mandatoruy configuration which is not present) 
            //We use JSON model here
            //no need but for the understanding purpose i add a SNo. column here ,it works when u bind the data with json module configuration ([JSON Model name>/array name (results)])
            
            var prdJSONModel = new JSONModel();
            this.getView().setModel(prdJSONModel, "prdJSONModel");

            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/ProductSet", {
                success: function (data) {
                    for (var i = 0; i < data.results.length; i++) {
                        data.results[i].SNo = i + 1;
                    }
                    prdJSONModel.setData(data);
                }
            });
        },

        //*f4help onpress action is here*

        onPressRow: function (oEvent) {
            var prdId = oEvent.getSource().getBindingContext().getProperty("Prdid"); 
            //oevent.getsource returns the source ui element on which the action performed and binding conext bind the row data
            this.byId("idPrdid").setValue(prdId);
            this.oDialog.close();
        },

        //*F4Help Functionality*

        //F4Help Functionality(It takes 3 parameter one is Views Id, second parameter is Path of the fragment,3rd is controller of the fragment means(this) )
        //Remember if u want to load the data in this pop-up u need to make ur dailog dependant

        onPressF4Help: function () {
            if (this.oDialog === undefined) {
                this.oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.demo.b73ui5app.view.PrdIdF4Help", this);
                //using (this. makes oDialog is controller varriable or global varriable)
                this.getView().addDependent(this.oDialog);
            }
            this.oDialog.open();
        },
        onCloseDialog: function () {
            this.oDialog.close();
        },

        // *EXPORT TO XL*

        onExportToXL:function() {
            var aCols, oRowBinding, oSettings, oSheet, oTable;
            oTable = this.getView().byId('idTable'); //Change ID as per ur table ID
            oRowBinding = oTable.getBinding('items');
            var oModel = this.getOwnerComponent().getModel();
            
            //Place Your table Columns and OData Properties 
            aCols = [{
                label: 'Product ID',
                property: 'Prdid'
            },
            {
             label: 'Product Name',
                proerty: 'Prdname'   
            },
            {
             label: 'Product Catagory',
                property: 'Prdcategory'   
            },
            {
             label: 'Product Price',
                property: 'Prdprice'   
            },
            {
             label: 'Currency Code',
                property: 'Currcode'   
            },
            {
             label: 'Ratings',
                property: 'Rating'   
            }];
            oSettings = {
                workbook: {
                    columns: aCols
                },
                dataSource: oRowBinding,
                fileName: 'Products.xlsx',
                worker: true 
            };
            oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(function () {
                oSheet.destroy();
            });
        }

    });
});
