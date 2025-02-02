sap.ui.define(["sap/ui/base/Object"], function (BaseObject) {
    "use strict";

    return BaseObject.extend("acristache.com.sap.training.ux402.listdetail.ux402listdetail.controller.ListSelector",
        {

            constructor: function () {

                /*who is fnResolveListHasBeenSet? 
                where do we define it?
                what does this do?*/
                this._oWhenListHasBeenSet = new Promise(function (fnResolveListHasBeenSet) {
                    this._fnResolveListHasBeenSet = fnResolveListHasBeenSet;
                }.bind(this));

                this.oWhenListLoadingIsDone = new Promise(function (fnResolve, fnReject) {
                    this._oWhenListHasBeenSet
                        .then(function (oList) {
                            //how does attachEventOnce work? when is "dataReceived" triggered?
                            oList.getBinding("items").attachEventOnce("dataReceived",
                                function (oData) {
                                    if (!oData.getParameter("data")) {
                                        fnReject({
                                            list: oList,
                                            error: true
                                        });
                                    }
                                    var oFirstListItem = oList.getItems()[0];
                                    if (oFirstListItem) {
                                        fnResolve({
                                            list: oList,
                                            oFirstListItem: oFirstListItem

                                        })
                                    }
                                    else {
                                        // No items in the list
                                        fnReject({
                                            list: oList,
                                            error: false
                                        });
                                    }
                                }
                            );
                        });
                }.bind(this));
            },

            setBoundMasterList: function (oList) {
                this._oList = oList;
                this._fnResolveListHasBeenSet(oList);
            },

            selectAListItem: function (sBindingPath) {
                this.oWhenListLoadingIsDone.then(
                    function () {
                        var oList = this._oList;
                        if (oList.getMode() === "None") {
                            return;
                        }

                        var oSelectedItem = oList.getSelectedItem();

                        // skip update if the current selection is already matching the object path
                        if (oSelectedItem && oSelectedItem.getBindingContext().getPath() === sBindingPath) {
                            return;
                        }
                        //what does the some function do?
                        oList.getItems().some(function (oItem) {
                            if (oItem.getBindingContext() && oItem.getBindingContext().getPath() === sBindingPath) {
                                oList.setSelectedItem(oItem);
                                return true;
                            }
                        });
                    }.bind(this));
            },

            clearMasterListSelection: function () {
                this._oWhenListHasBeenSet.then(function () {
                    this._oList.removeSelections(true);
                }.bind(this));
            }

        });
});