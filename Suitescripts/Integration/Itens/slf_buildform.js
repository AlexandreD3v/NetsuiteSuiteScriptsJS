/**
 * @copyright © 2022, Oracle and/or its affiliates. All rights reserved.
 *
 * @NApiVersion 2.x
 * @NModuleScope Public
 */

define(["N/ui/serverWidget", "N/log", "./_enums", "N/search"], function (serverWidget, log, enums, search) {
    /**
     * Creates a custom form in NetSuite.
     *
     * @param {N.runtime.CurrentScript} nRuntimeCurrentScript - The current script runtime object.
     * @returns {N.ui.Form} - Created form object.
     * @throws {Error} - Throws an error if there is any issue during form creation.
     */
    function createForm(nRuntimeCurrentScript) {
        try {
            // Create a form object with the title 'Item List'
            var form = serverWidget.createForm({ title: 'Item List' });
            // Concatenate script parameters for the 'Destination URL' field
            var urlDestinoValue = "".concat(nRuntimeCurrentScript.getParameter({ name: 'custscript_url_netsuite' }))
                .concat(nRuntimeCurrentScript.getParameter({ name: 'custscript_url_restlet' }));
            // Set the client script module path for the form
            form.clientScriptModulePath = './_cl_integra_itens.js';
            // Add hidden fields to the form
            addHiddenField(form, 'script_id', 'Script ID', nRuntimeCurrentScript.id);
            addHiddenField(form, 'deployment_id', 'Deployment ID', nRuntimeCurrentScript.deploymentId);
            addHiddenField(form, 'token_key', 'Token key', nRuntimeCurrentScript.getParameter({ name: 'custscript_token_key' }));
            // ... (similar hidden fields)
            // Return the created form object
            return form;
        } catch (error) {
            // Log an error in case of exception
            log.error({ title: "createForm error", details: error });
            // Throw the error for external handling, if needed
            throw error;
        }
    }

    /**
     * Adds a hidden field to the form.
     *
     * @param {N.ui.Form} form - Form object to which the field will be added.
     * @param {string} fieldId - Field ID.
     * @param {string} label - Field label.
     * @param {string} defaultValue - Default value of the field.
     */
    var addHiddenField = function (form, fieldId, label, defaultValue) {
        try {
            form.addField({ id: fieldId, type: 'TEXT', label: label })
                .updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN })
                .defaultValue = defaultValue;
        } catch (error) {
            // Log an error in case of exception
            log.error({ title: "addHiddenField error", details: error });
            // Throw the error for external handling
            throw error;
        }
    };

    /**
     * Creates a sublist in the form object.
     *
     * @param {N.ui.Form} form - Form object to which the sublist will be added.
     * @returns {N.ui.Sublist} - Created sublist object.
     * @throws {Error} - Throws an error if there is any issue during sublist creation.
     */
    function createSublist(form) {
        try {
            // Create sublist in the form object
            var sublist = form.addSublist({ id: 'custpage_item_sublist', type: 'INLINEEDITOR', label: 'Items' });
            // Add columns to the sublist
            enums.sublistFields.forEach(function (field) {
                sublist.addField({ id: field.id, type: field.type, label: field.label })
                    .updateDisplayType({ displayType: field.id !== 'rec_fields' ? 'NORMAL' : 'HIDDEN' });
            });
            return sublist;
        } catch (error) {
            log.error('Error createSublist', error);
            throw error;
        }
    }

    /**
     * Adds buttons to the form.
     *
     * @param {N.ui.Form} form - Form to which buttons will be added.
     */
    function createButtons(form) {
        try {
            form.addButton({ label: "Send Items", id: "custpage_check_sb1_rl", functionName: "sendItemListRl" });
            form.addButton({ label: "Filter", id: "custpage_apply_filter", functionName: "applyFilters" });
            form.addButton({ label: "Clear Item List", id: "custpage_clean_sbl", functionName: "cleanSublist" });
        } catch (error) {
            log.error('createButtons error', error);
        }
    }

    /**
     * Builds filters on the suitelet form.
     *
     * @param {N.ui.Form} form - Suitelet form.
     * @param {string} container - Group of fields/filters on the suitelet.
     * @returns {Object} - Filter objects.
     */
    function buildFilters(form, container) {
        try {
            // Add field group for filters
            form.addFieldGroup({
                label: 'Filters',
                id: container
            });
            var filterName = form.addField({
                id: 'custpage_filter_name',
                type: "MULTISELECT",
                label: 'Product Name',
                container: container
            });
            // ... (similar filter fields)
            return {
                filterName: filterName,
                // ... (similar filter objects)
            };
        } catch (error) {
            log.error('Error buildFilters', error);
            throw error;
        }
    }

    /**
     * Populates filter options based on items.
     *
     * @param {any[]} items - Items to populate filter options.
     * @param {Object} filters - Filter objects.
     * @returns {boolean} - Returns true after populating options.
     */
    function populateFilterOpts(items, filters) {
        try {
            // For each item, insert values into filters for filtering
            for (var item in items) {
                populateSelectOpt(filters.filterName, items[item].getValue('itemid')); // Product Name filter
                populateSelectOpt(filters.filterSKU, items[item].getValue('custitem_sku')); // SKU filter
            }
            // ... (similar filters for different fields)
            return true;
        } catch (error) {
            log.error('Error populateFilterOpts', error);
            throw error;
        }
    }

    /**
     * Populates select option in a field.
     *
     * @param {N.ui.Field} field - Field to which the option will be added.
     * @param {Object} opt - Option object.
     */
    function populateSelectOpt(field, opt) {
        try {
            field.addSelectOption({
                value: !opt.value ? opt : opt.value,
                text: !opt.text ? opt : opt.text
            });
        } catch (error) {
            log.error('Error populateSelectOpt', error);
        }
    }

    /**
     * Gets select options list for a given record type.
     *
     * @param {string} recType - Record type for which options will be retrieved.
     * @returns {Object[]} - Array of option objects.
     */
    function getSelectOptionsList(recType) {
        try {
            var searchOptions = search.create({ type: recType, columns: ["name"] });
            var countResult = searchOptions.runPaged().count;
            return countResult > 0 ? searchOptions.run().getRange({ start: 0, end: countResult }) : [];
        } catch (e) {
            log.error({ title: "getSelectOptionsList error", details: e });
            throw e;
        }
    }

    return {
        createForm: createForm,
        createButtons:createButtons,
        createSublist: createSublist,
        buildFilters: buildFilters,
        populateFilterOpts: populateFilterOpts,
        getSelectOptionsList:getSelectOptionsList
    };
});
