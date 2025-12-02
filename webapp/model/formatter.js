sap.ui.define([
    "sap/ui/core/format/NumberFormat"

], function(NumberFormat) {
    "use strict";

    return{
        colorCategory:function(Prdcategory) {
            if(Prdcategory === "ELECTRONICS") {
                return "Error";
            }
            else if(Prdcategory === "SPORTS") {
                return "Success"
            }
             else if(Prdcategory === "ACCESSORIES") {
                return "Warning"
            }
        },
        formatCurrency:function(Prdprice,Country) {
            var oFormat = NumberFormat.getFloatInstance({
                "groupingEnabled": true,    // Grouping is enabled
                "groupingSeparator": ',',   // Grouping Separetor is '.'
                "groupingSize": 3,          // The amounts of digits to be grouped (Here thousand)
                "decimalSeparator": ".",     // The decimal Separator must be different from grouping separator
                "decimals": 2
            });
            return oFormat.format(Prdprice);                         
        }
        };
});