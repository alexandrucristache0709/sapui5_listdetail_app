
sap.ui.define([
    "./BaseController",
    "sap/ui/Device"
],
    /**
    * @param {typeof sap.ui.core.mvc.Controller} Controller
    */
    function (Controller, Device) {
        "use strict";

        return Controller.extend("acristache.com.sap.training.ux402.listdetail.ux402listdetail.controller.Detail", {

            onInit: function () {
                this.getRouter().getRoute("carrierdetails").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oEvent) {
                this.getView().getModel("mainView").setProperty("/layout", "TwoColumnsMidExpanded");
                
                /*
                arguments => A key-value pair object which contains the arguments defined in the route resolved with the corresponding information from the current URL hash
                e.g. "pattern": "Carriers/{objectId}"
                */
                var sObjectPath = "/UX_C_Carrier_TP('" + oEvent.getParameter("arguments").objectId + "')";
                this._bindView(sObjectPath);
            },

            _bindView: function (sObjectPath) {
                var oView = this.getView();

                /*
                Bind the object to the referenced entity in the model, which is used as the binding context to resolve bound properties or aggregations of the object itself and all of its children relatively to the given path.
                If a relative binding path is used, this will be applied whenever the parent context changes.
                */
                this.getView().bindElement({
                    path: sObjectPath,
                    events: {
                        change: this._onBindingChange.bind(this),
                        dataRequested: function () {
                            oView.setBusy(true);
                        },
                        dataReceived: function () {
                            oView.setBusy(false);
                        }
                    }
                });
            },

            _onBindingChange: function () {
                var oElementBinding = this.getView().getElementBinding();

                if (!oElementBinding.getBoundContext()) {
                    //other way to display targets than navTo??
                    this.getRouter().getTargets().display("detailObjectNotFound");
                    this.getOwnerComponent().oListSelector.clearMasterListSelection();
                    return;
                }

                var sPath = oElementBinding.getPath();
                this.getOwnerComponent().oListSelector.selectAListItem(sPath);
            }
        });
    });