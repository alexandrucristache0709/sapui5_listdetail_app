sap.ui.define(["sap/ui/base/Object"], function (BaseObject) {
    "use strict";

    return BaseObject.extend("acristache..com.sap.training.ux402.listdetail.ux402listdetail.controller.ListSelector",
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
                            //when is "dataReceived" triggered?
                            // maybe: class sap.ui.model.ContextBinding -> attachEventOnce
                            oList.getBinding("items").attachEventOnce("dataReceived",
                                function (oEvent) {
                                    if (!oEvent.getParameter("data")) {
                                        fnReject({
                                            list: oList,
                                            error: true
                                        });
                                    }
                                    var oFirstListItem = oList.getItems()[0];
                                    if (oFirstListItem) {
                                        fnResolve({
                                            list: oList,
                                            firstListItem: oFirstListItem

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
                        //class sap.m.ListBase
                        var oList = this._oList;

                        /*
                        Gets current value of property mode.
                        Defines the mode of the control (e.g. None, SingleSelect, MultiSelect, Delete).
                        Default value is None.
                        */
                        if (oList.getMode() === "None") {
                            return;
                        }

                        /*
                        Returns selected list item. 
                        When no item is selected, "null" is returned. 
                        When "multi-selection" is enabled and multiple items are selected, only the up-most selected item is returned.
                        */
                        var oSelectedItem = oList.getSelectedItem();

                        // skip update if the current selection is already matching the object path
                        if (oSelectedItem && oSelectedItem.getBindingContext().getPath() === sBindingPath) {
                            return;
                        }
                        //what does the some function do?
                        oList.getItems().some(function (oItem) {
                            if (oItem.getBindingContext() && oItem.getBindingContext().getPath() === sBindingPath) {
                                //Selects or deselects the given list item.
                                oList.setSelectedItem(oItem);
                                return true;
                            }
                        });
                    }.bind(this));
            },

            clearMasterListSelection: function () {
                this._oWhenListHasBeenSet.then(function () {
                    //class sap.m.ListBase: Removes visible selections of the current selection mode.
                    this._oList.removeSelections(true);
                }.bind(this));
            }

        });
});