sap.ui.define(["sap/ui/base/Object"], function (BaseObject) {
    "use strict";

    return BaseObject.extend("acristache.com.sap.training.ux402.listdetail.ux402listdetail.controller.ListSelector",
        {

            constructor: function () {

                /*
                The Promise-constructor receives an executor fn which takes 2 params: resolveFunc and rejectFunc;
                e.g. the fnResolve_ListHasBeenSet is set to this._fnResolve_ListHasBeenSet.
                The argument passed to the resolveFunc represents the eventual value of the deferred action.
                A Promise executor should call only one resolve or one reject. 
                Any further calls to resolve or reject will be ignored.
                */
                this._oWhenListHasBeenSet = new Promise(function (fnResolve_ListHasBeenSet) {
                    this._fnResolve_ListHasBeenSet = fnResolve_ListHasBeenSet;
                }.bind(this));

                /*
                The list is loaded if it has been set and the "dataReceived" event of the "items" context binding was triggred
                If there is no data in the context binding or if there are no items in the list the promise is rejected
                */
                this.oWhenListLoadingIsDone = new Promise(function (fnResolve, fnReject) {
                    this._oWhenListHasBeenSet
                        .then(function (oList) {
                            /* 
                            when is "dataReceived" triggered?
                            maybe: class sap.ui.model.ContextBinding -> attachEventOnce
                            */
                            oList.getBinding("items").attachEventOnce(
                                "dataReceived",
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

            /*
            calling this fn fulfills the first Promise, i.e _oWhenListHasBeenSet
            called from the init method of the List-control
            */
            setBoundMasterList: function (oList) {
                this._oList = oList;
                this._fnResolve_ListHasBeenSet(oList);
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
                        //see Array.prototype.some()
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