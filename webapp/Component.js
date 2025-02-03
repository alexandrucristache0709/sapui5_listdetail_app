sap.ui.define([
    "sap/ui/core/UIComponent",
    "acristache//com/sap/training/ux402/listdetail/ux402listdetail/model/models",
    "student##/com/sap/training/ux402/listdetail/ux402listdetail/controller/ListSelector"
], (UIComponent, models, ListSelector) => {
    "use strict";

    return UIComponent.extend("acristache.com.sap.training.ux402.listdetail.ux402listdetail.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();

            // instantiation of the listselector
            this.oListSelector = new ListSelector();
        }
    });
});