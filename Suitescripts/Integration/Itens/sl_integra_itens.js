/**
 * @copyright © 2022, Oracle and/or its affiliates. All rights reserved.
 *
 * @NApiVersion 2.x
 * @NModuleScope Public
 * @NScriptType Suitelet
 */
define(["N/ui/serverWidget", "N/log", "N/runtime", "./_clf_integrate_items", "./_slf_buildform"],
    function (serverWidget, log, runtime, clf, fbuilder) {

        /**
         * Suitelet onRequest function.
         *
         * @param {Object} context - Suitelet context object.
         */
        function onRequest(context) {
            try {
                switch (context.request.method) {
                    case 'GET':
                        handleGetRequest(context);
                        break;
                    /* case 'POST':
                        handlePostRequest(context);
                        break; */
                    default:
                        methodNotFound(context);
                        break;
                }
            }
            catch (error) {
                log.error({ title: "Suitelet error", details: error });
            }
        }

        /**
         * Handles GET request for the Suitelet.
         *
         * @param {Object} context - Suitelet context object.
         */
        function handleGetRequest(context) {
            log.debug({ title: "GET", details: context.request.parameters });
            // Create the form
            var suiteletForm = fbuilder.createForm(runtime.getCurrentScript()),
                // Create filters - select
                filterFields = fbuilder.buildFilters(suiteletForm, 'fg_filters');
            /* // Execute local item search
            localItems = clf.searchLocalItems(); */
            // Create the Sublist
            fbuilder.createSublist(suiteletForm);
            // Populate filters with items from the current environment - select
            fbuilder.populateFilterOpts(clf.searchLocalItems(), filterFields);
            // Create filters - text
            // filterFields = fbuilder.buildFiltersText(form, 'fg_filters'); 
            // If populating the list on Suitelet load is needed, use this function
            // clf.populateSublist(localItems);
            // Create form buttons
            fbuilder.createButtons(suiteletForm);
            // Render the form
            context.response.writePage(suiteletForm);
        }

        /**
         * Handles cases where the requested method is not found.
         *
         * @param {Object} context - Suitelet context object.
         */
        function methodNotFound(context) {
            log.error({ title: context.request.method, details: context.request.parameters });
            var form = serverWidget.createForm({
                title: "Method Not Implemented!",
            });
            context.response.writePage(form);
        }

        return {
            onRequest: onRequest
        };
    });
