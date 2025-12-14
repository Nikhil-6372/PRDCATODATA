sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "com/demo/b73ui5app/model/formatter",
    "sap/ui/export/Spreadsheet",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter"

],
    (Controller, JSONModel, MessageBox, formatter, Spreadsheet, Filter, Sorter) => {
        "use strict";

        return Controller.extend("com.demo.b73ui5app.controller.View1", {
            f: formatter,

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

            //*F4help onpress action is here*

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

            // *Adding filtes with onPressGo* 

            //Constructing the filter Here 
            //Remember Constructing the filter takes 3 Parameter 1. OData Field , 2.Operator, 3.Value 
            //If u want to add Multiple filters then u have to create an array in SAP UI5
            //Remember Between Oprator takes 4 Parameter
            //Adding here Sorters also

            onPressGo: function () {
                var aFilters = [];
                var aSorters = [];

                var prdId = this.byId("idPrdid").getValue();
                var prdName = this.byId("idPrdname").getValue();
                var prdCategory = this.byId("idPrdCategory").getValue();
                var prdRating = this.byId("idPrdrating").getValue();

                var prdPriceLow = this.byId("idRangeLow").getValue();
                var prdOpr = this.byId("idPriceOPr").getSelectedKey();

                if (prdId !== "") {
                    aFilters.push(new Filter("Prdid", "EQ", prdId));
                }
                if (prdName !== "") {
                    aFilters.push(new Filter("Prdname", "EQ", prdName));
                }
                if (prdCategory !== "") {
                    aFilters.push(new Filter("Prdcategory", "EQ", prdCategory));
                }
                if (prdRating !== "") {
                    aFilters.push(new Filter("Rating", "EQ", prdRating));
                }

                if (prdOpr !== "" && prdPriceLow !== "") {
                    if (prdOpr === "BT") {
                        var prdPriceHigh = this.byId("idRangeHigh").getValue();
                        aFilters.push(new Filter("Prdprice", prdOpr, prdPriceLow, prdPriceHigh));
                    }
                    else {
                        aFilters.push(new Filter("Prdprice", prdOpr, prdPriceLow));
                    }
                }


                //Code for Sorting
                //If ur preject have both sorting and grouping requirment then grouping takes the priority so keep the grouping code first then sorting.
                //Grouping is nothing but Sorting with Titles.

                var groupField = this.byId("idGroupField").getSelectedKey();
                var groupOrder = this.byId("idGroupOrder").getSelectedIndex();


                if (groupField !== "" && groupOrder !== -1) {
                    aSorters.push(new Sorter(groupField, (groupOrder === 0) ? false : true, function (oBindingContext) {
                        var category = oBindingContext.getProperty("Prdcategory");
                        return {
                            key: category,
                            Text: category
                        }

                    }));  //Sorters take 2 parameters 1.Odata field   2.
                }


                //Sorting & Filtering starts from here actually

                var sortField = this.byId("idSortField").getSelectedKey();
                var sortOrder = this.byId("idSortOrder").getSelectedIndex();


                if (sortField !== "" && sortOrder !== -1) {
                    aSorters.push(new Sorter(sortField, (sortOrder === 0) ? false : true));  //Sorters take 2 parameters 1.Odata field 2.
                }



                this.byId("idTable").getBinding("items").filter(aFilters);
                this.byId("idTable").getBinding("items").sort(aSorters);
            },


            //ReSet
            onPressReset: function () {
                this.byId("idPrdid").setValue("");
                this.byId("idPrdname").setValue("");
                this.byId("idPrdCategory").setValue("");
                this.byId("idPrdrating").setValue("");
                this.byId("idPriceOPr").setSelectedKey("");
                this.byId("idRangeLow").setValue("");
                this.byId("idRangeHigh").setValue("");
                this.byId("idSortField").setSelectedKey("");
                this.byId("idSortOrder").setSelectedIndex(-1);
                this.byId("idGroupField").setSelectedKey("");
                this.byId("idGroupOrder").setSelectedIndex(-1);


                this.byId("idTable").getBinding("items").filter([]);
                this.byId("idTable").getBinding("items").sort([]);
            },

            
            //Create Function remaining in View3 Controller this is only for page navigation

            onPressAdd: function () {
                this.getOwnerComponent().getRouter().navTo("RouteView3");
            },

            //Edit function remaining in View3 Controller this is only for page navigation

            onPressEdit: function() {
                this.getOwnerComponent().getRouter().navTo("RouteView3");
            },




            // *EXPORT TO XL*

            onExportToXL: function () {
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
            },
            onSelOpr: function () {
                var opr = this.byId("idPriceOPr").getSelectedKey();
                if (opr === "BT") {
                    this.byId("idRangeHigh").setVisible(true);
                }
                else {
                    this.byId("idRangeHigh").setVisible(false);
                }
            },

            //Read Operation and nav to anathor View(47.00m/C-25)

            onPressRecord: function (oEvent) {
                var prdId = oEvent.getSource().getBindingContext().getProperty("Prdid");
                this.getOwnerComponent().getRouter().navTo("RouteView2", {
                    key: prdId
                });

            }

        });
    });
