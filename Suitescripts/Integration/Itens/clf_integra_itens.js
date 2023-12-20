/**
 * @copyright © 2022, Oracle and/or its affiliates. All rights reserved.
 *
 * @NApiVersion 2.x
 * @NModuleScope Public
 */

define(["N/log", "N/currentRecord", "N/search", "./_enums"], function (log, currentRecord, search, enums) {
    
    /**
     * Checks and builds filters for the search.
     */
    function checkFilter(filters) {
        try {
            var filter1 = [["type", "anyof", "Service"], "AND", ["subtype", "anyof", "Sale"]];
            var finalFilter = filters ? filter1.concat(filters) : filter1;
            return finalFilter;
        }
        catch (error) {
            log.error('checkFilter error', error);
            throw error;
        }
    }
    
    /**
     * Searches for local items based on the provided filters.
     */
    function searchItensLocal(filters) {
        try {
            var builtFilter = checkFilter(filters);
            var localItemsSearch = search.create({
                type: "servicesaleitem",
                filters: builtFilter,
                columns: enums.searchColumnsItems
            });
            return localItemsSearch.run().getRange({ start: 0, end: localItemsSearch.runPaged().count });
        }
        catch (error) {
            log.error({ title: "searchItems error", details: error });
            throw error;
        }
    }
    
    /**
     * Gets the appropriate operator for the search column based on the field ID.
     */
    function getOperatorColumnNS(id) {
        try {
            var operator;
            switch (id) {
                case 'itemid':
                case 'name':
                case 'custpage_filter_name':
                default:
                    operator = search.Operator.STARTSWITH;
                    break;
                case 'custpage_filter_sku':
                case 'custpage_filter_area':
                case 'custpage_filter_person':
                case 'custpage_filter_classification':
                case 'custpage_filter_product_status':
                case 'custpage_filter_sel_web_mod':
                case 'custpage_filter_product_type':
                case 'custpage_filter_sel_api_mod':
                    operator = search.Operator.ANYOF;
                    break;
            }
            return operator;
        }
        catch (error) {
            log.error('getOperatorColumnNS error', error);
        }
    }
    
    /**
     * Gets the corresponding field/column name for a given field ID.
     */
    function getFieldColumnNS(id) {
        try {
            var fieldName = '';
            switch (id) {
                case 'custpage_filter_name':
                    fieldName = 'itemid';
                    break;
                case 'custpage_filter_area':
                    fieldName = 'custitem_field_business_area';
                    break;
                case 'custpage_filter_person':
                    fieldName = 'custitem_field_person_type';
                    break;
                case 'custpage_filter_classification':
                    fieldName = 'custitem_field_prod_class';
                    break;
                case 'custpage_filter_product_status':
                    fieldName = 'custitem_product_status';
                    break;
                case 'custpage_filter_sel_web_mod':
                    fieldName = 'custitem_select_module';
                    break;
                case 'custpage_filter_product_type':
                    fieldName = 'custitem_field_prod_type';
                    break;
                case 'custpage_filter_sel_api_mod':
                    fieldName = 'custitem_select_module_apimbs';
                    break;
                case 'custpage_filter_sku':
                    fieldName = 'externalid';
                    break;
                default:
                    fieldName = '';
                    break;
            }
            return fieldName;
        }
        catch (error) {
            log.error('getFieldColumnNS error', error);
            throw error;
        }
    }
    
    /**
     * Retrieves the values of the selected records in the item list.
     */
    function getSelectedItemsFromList() {
        try {
            var ret = [];
            for (var index = 0; index < currentRecord.get().getLineCount({ sublistId: 'custpage_item_sublist' }); index++) {
                if (currentRecord.get().getSublistValue({ fieldId: 'select_item', line: index, sublistId: 'custpage_item_sublist' })) {
                    ret.push(JSON.parse(String(currentRecord.get().getSublistValue({ fieldId: 'rec_fields', line: index, sublistId: 'custpage_item_sublist' }))));
                }
            }
            return ret;
        }
        catch (error) {
            log.error({ title: 'Error getFiltersSelectedItemsFromList', details: error });
            throw error;
        }
    }
    
    return{
        checkFilter: checkFilter,
        searchItensLocal: searchItensLocal,
        getOperatorColumnNS: getOperatorColumnNS,
        getFieldColumnNS: getFieldColumnNS,
        getSelectedItemsFromList:getSelectedItemsFromList
    }
});
