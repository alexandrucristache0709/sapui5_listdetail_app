
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
                this._oList = this.byId("list");

                /*
                Before the navigation animation starts, the NavContainer fires the following events:
                
                beforeHide on the page which is about to be left
                beforeFirstShow on the page which is about to be shown; this event is only fired if the respective page has not been shown before
                beforeShow on the page which is about to be shown
                
                These events can be used to create or update the user interface of the new page and to stop any activity (such as animations or repeated data polling) on the page which is left.
                
                After the navigation has been completed and the new page has covered the whole screen, the following events are fired:
                
                afterShow on the page which is now shown
                afterHide on the page which has been left
                
                You can use the addEventDelegate function to register to these events. This function is available on every control.
                */
                this.getView().addEventDelegate({
                    //Only called once when page is first shown.
                    onBeforeFirstShow: function () {
                        //Pass the list to the ListSelector.
                        this.getOwnerComponent().oListSelector.setBoundMasterList(this._oList);
                    }.bind(this)
                });

                //Attaches event handler fnFunction to the patternMatched event of this sap.ui.core.routing.Route
                this.getRouter().getRoute("masterlist").attachPatternMatched(this._onListMatched, this);

                //Attaches event handler fnFunction to the bypassed event of this sap.ui.core.routing.Router
                this.getRouter().attachBypassed(this.onBypassed, this);
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
            },

            _navigateToCarrierDetails: function (sCarrierId, bReplace) {
                this.getRouter().navTo("carrierdetails", {
                    objectId: sCarrierId
                }, bReplace);
            },

            onBypassed: function () {
                //class sap.m.ListBase: Removes visible selections of the current selection mode.
                this._oList.removeSelections(true);
            },

            //see: /home/user/projects/ux402_listdetail/webapp/view/List.view.xml
            onSelect: function (oEvent) {
                //the List-control has the selectionChange-event with listItem param
                //the ObjectListItem inherits the press-event from sap.m.ListItemBase
                this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
            },

            _showDetail: function (oItem) {
                //No history on phone
                var bReplace = !Device.system.phone;
                var sCarrierId = oItem.getBindingContext().getProperty("Carrid");
                this._navigateToCarrierDetails(sCarrierId, bReplace);
            }
        });
    });