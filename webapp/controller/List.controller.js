
sap.ui.define([
    "./BaseController",
    "sap/ui/Device"
],
    /**
    * @param {typeof sap.ui.core.mvc.Controller} Controller
    */
    function (Controller, Device) {
        "use strict";

        return Controller.extend("acristache.com.sap.training.ux402.listdetail.ux402listdetail.controller.List", {
            onInit() {
                this._oList = this.byId("list");;
                this.getView().addEventDelegate({
                    onBeforeFirstShow: function () {
                        this.getOwnerComponent().oListSelector.setBoundMasterList(this._oList);
                    }.bind(this)
                });
                this.getRouter().getRoute("masterlist").attachPatternMatched(this._onListMatched, this);
                this.getRouter().attachBypassed(this.onBypassed, this);
            },

            _navigateToCarrierDetails: function (sCarrierId, bReplace) {
                this.getRouter().navTo("carrierdetails", {
                    objectId: sCarrierId
                }, bReplace);
            },

            _showDetail: function (oItem) {
                //No history on phone
                var bReplace = !Device.system.phone;
                var sCarrierId = oItem.getBindingContext().getProperty("Carrid");
                this._navigateToCarrierDetails(sCarrierId, bReplace);
            },

            onSelect: function (oEvent) {
                this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
            },

            onBypassed: function () {
                this._oList.removeSelections(true);
            },

            _onListMatched: function () {
                this.getListSelector().oWhenListLoadingIsDone.then(
                    function (mParams) {
                        if (mParams.list.getMode() === "None") {
                            return;
                        }
                        var sObjectId = mParams.firstListitem.getBindingContext().getProperty("Carrid");
                        this._navigateToCarrierDetails(sObjectId, true);
                    }.bind(this)
                );
            }
        });
    });