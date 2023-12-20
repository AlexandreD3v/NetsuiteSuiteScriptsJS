/**
 * @copyright © 2022, Oracle and/or its affiliates. All rights reserved.
 *
 * @NApiVersion 2.x
 * @NModuleScope Public
 * @NScriptType ClientScript
 */

define(["N/https", "N/log", "N/format", "N/search", "N/currentRecord", "./_enums", "./oAuth/_oAuth", "./_clf_integrate_items"],
 function (https, log, format, search, currentRecord, enums, qOAuth, clf) {
    
    /**
     * ClientScript pageInit function.
     */
    function pageInit() {
        try {
            alert("Welcome to the item integration Suitelet!\n"
                + "How to use:\n"
                + "1 - Select one of the filters. \n"
                + "2 - Click on Filter. \n"
                + "3 - Select the item to be sent in the list.\n"
                + "4 - Click on Send.\n");
        }
        catch (error) {
            log.error('pageInit error', error);
        }
    }
    
    /**
     * Sends the list of items to the restlet.
     */
    function sendItemListRl() {
        try {
            var selectedItems = clf.getSelectedItemsFromList();
            if (selectedItems.length < 1) {
                alert('No items selected!');
                return;
            }
            alert('Sending selected items, please wait.');
            log.debug({ title: 'selectedItems sendItemListRl', details: selectedItems });
            var url = String(currentRecord.get().getValue({ fieldId: 'url_destino' })), nsInfosSel = {
                url: url,
                realm: String(currentRecord.get().getValue({ fieldId: 'realm_destino' })),
                consumer: {
                    key: String(currentRecord.get().getValue({ fieldId: 'consumer_key' })),
                    secret: String(currentRecord.get().getValue({ fieldId: 'consumer_secret' }))
                },
                token: {
                    key: String(currentRecord.get().getValue({ fieldId: 'token_key' })),
                    secret: String(currentRecord.get().getValue({ fieldId: 'token_secret' }))
                }
            }, itemsSb1 = https.post({ url: url, headers: getOAuthHeader(nsInfosSel), body: JSON.stringify({ items: selectedItems }) });
            log.debug({ title: 'return sendItemListRl', details: itemsSb1 });
            checkRequestSuccess(itemsSb1);
        }
        catch (error) {
            log.error({ title: 'Error sendItemListRl', details: error });
            alert("An error occurred! Contact the system administrator.");
            throw error;
        }
    }
    
    /**
     * Retrieves OAuth headers for the restlet call.
     */
    function getOAuthHeader(environmentInfo) {
        try {
            var url = environmentInfo.url, headers = qOAuth.OAuth({
                realm: environmentInfo.realm,
                consumer: { key: environmentInfo.consumer.key, secret: environmentInfo.consumer.secret },
                signature_method: "HMAC-SHA256",
                hash_function: qOAuth.OAuth.hash_function_sha256
            }).getHeaders({
                url: url,
                method: "POST",
                tokenKey: environmentInfo.token.key,
                tokenSecret: environmentInfo.token.secret
            });
            headers['User-Agent-x'] = 'SuiteScript-Call';
            headers['Content-Type'] = 'application/json';
            log.error('environmentInfo', environmentInfo);
            log.error('headers', headers);
            return headers;
        }
        catch (error) {
            log.error({ title: 'Error getOAuthHeader', details: error });
            throw error;
        }
    }
    
    /**
     * Applies the selected filters to build the search filters.
     */
    function applyFilters() {
        try {
            // Get the array of filters
            var filterFields = JSON.parse(String(currentRecord.get().getValue({ fieldId: 'custpage_campos_filtros' })));
            // Reduce to get selected values and build filters
            var params = filterFields.reduce(function (acc, field) {
                // Get the value of the selected field
                var fieldValue = currentRecord.get().getValue({ fieldId: field.id });
                // If the filter field is of type date, format the value appropriately
                if (field.type === 'date' && fieldValue) {
                    fieldValue = format.format({ type: format.Type.DATE, value: fieldValue });
                }
                // If it is a multiselect type, get all selected values
                else if (field.type === 'multiselect') {
                    fieldValue = fieldValue ? fieldValue.join() : [];
                }
                // If there is a selected value
                if (fieldValue) {
                    // Split to transform selected items into an array
                    var filspl = String(fieldValue).split(',');
                    // For each selected value
                    for (var fvalue in filspl) {
                        // Check if it is the first item to add OR or AND
                        acc.length < 1 || field.id == 'custpage_filter_pessoa' ? acc.push("AND") : acc.push("OR");
                        var result = [clf.getFieldColumnNS(field.id), clf.getOperatorColumnNS(field.id), filspl[fvalue]];
                        log.debug('result applyFilters', result);
                        // Build the filter for the search and add to the accumulator (acc)
                        acc.push(result);
                    }
                }
                // Return the built filters based on the selection
                return acc;
            }, []);
            // Add to the Suitelet list the items returned by the search that received the filters
            populateSublist(clf.searchLocalItems(params));
        }
        catch (e) {
            log.error('Error applyFilters', e);
            throw e;
        }
    }
    
    /**
     * Populates the sublist with the provided list of items.
     */
    function populateSublist(list) {
        if (list.length < 1) {
            alert('No items found!');
            return;
        }
        ;
        var cr = currentRecord.get(), strsbid = 'custpage_item_sublist';
        list.forEach(function (item) {
            if (item == 'error') {
                alert('Try again');
                return;
            }
            ;
            cr.selectNewLine({ sublistId: 'custpage_item_sublist' });
            enums.sublistPopulateFields.forEach(function (field) {
                var fieldValue = "";
                switch (field.type) {
                    case 'id':
                        fieldValue = "" + item.id;
                        break;
                    case 'getValue':
                        fieldValue = "" + item.getValue(field.id);
                        break;
                    case 'sku':
                        fieldValue = isSkuValid(item.getValue('custitem_sku'));
                        break;
                    case 'rec_fields':
                        fieldValue = JSON.stringify(item);
                        break;
                    default:
                        fieldValue = "" + item.getText(field.id);
                        break;
                }
                cr.setCurrentSublistValue({ sublistId: strsbid, fieldId: field.id, value: fieldValue });
            });
            cr.commitLine({ sublistId: strsbid });
        });
    }
    
    /**
     * Clears the sublist.
     */
    function cleanSublist() {
        try {
            // Inverted the for (i--) to remove lines from the last to the first
            for (var i = currentRecord.get().getLineCount({ sublistId: 'custpage_item_sublist' }); i > 0; i--) {
                currentRecord.get().removeLine({ sublistId: 'custpage_item_sublist', line: i - 1 });
            }
        }
        catch (error) {
            log.error('cleanSublist error', error);
        }
    }
    
    /**
     * Checks if an item with the given SKU exists.
     */
    function checkExists(sku) {
        return search.create({
            type: "servicesaleitem",
            filters: [
                ["type", "anyof", "Service"],
                "AND",
                ["subtype", "anyof", "Sale"],
                "AND",
                ["externalidstring", "startswith", sku]
            ],
        }).runPaged().count > 0 ? 'T' : 'F';
    }
    
    /**
     * Checks the success of the request and displays appropriate alerts.
     */
    function checkRequestSuccess(itemsSb1) {
        if (itemsSb1.code == "200") {
            var strSuccess = "";
            JSON.parse(itemsSb1.body).ret.forEach(function (element) {
                console.log(element);
                strSuccess += "Item " + element.custitem_sku + " - " + element.status + " - ID: " + element.id + "\n";
            });
            alert('Success! \n' + strSuccess);
        }
        else {
            alert("Error! " + itemsSb1.body);
        }
    }

    return{
        pageInit: pageInit,
        sendItemListRl: sendItemListRl,
        applyFilters: applyFilters,
        cleanSublist: cleanSublist,
        checkExists: checkExists
    }
});
