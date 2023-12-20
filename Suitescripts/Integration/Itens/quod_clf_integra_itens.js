/**
 * @copyright © 2022, Oracle and/or its affiliates. All rights reserved.
 *
 * @NApiVersion 2.x
 * @NModuleScope Public
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "N/log", "N/currentRecord", "N/search", "./quod_enums"], function (require, exports, log_1, currentRecord_1, search_1, enums) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSelectedItensFromList = exports.getFieldColumnNS = exports.getOperatorColumnNS = exports.searchItensLocal = exports.checkFilter = void 0;
    log_1 = __importDefault(log_1);
    currentRecord_1 = __importDefault(currentRecord_1);
    search_1 = __importDefault(search_1);
    enums = __importStar(enums);
    function checkFilter(filters) {
        try {
            var filter1 = [["type", "anyof", "Service"], "AND", ["subtype", "anyof", "Sale"]], filterfinal = filters ? filter1.concat(filters) : filter1;
            return filterfinal;
        }
        catch (error) {
            log_1.default.error('checkFilter error', error);
            throw error;
        }
    }
    exports.checkFilter = checkFilter;
    function searchItensLocal(filters) {
        try {
            var buildedFilter = checkFilter(filters), srcItensLocal = search_1.default.create({
                type: "servicesaleitem",
                filters: buildedFilter,
                columns: enums.searchColumnsItens
            });
            return srcItensLocal.run().getRange({ start: 0, end: srcItensLocal.runPaged().count });
        }
        catch (error) {
            log_1.default.error({ title: "searchItens error", details: error });
            throw error;
        }
    }
    exports.searchItensLocal = searchItensLocal;
    function getOperatorColumnNS(id) {
        try {
            var operator;
            switch (id) {
                case 'itemid':
                case 'name':
                case 'custpage_quod_filter_name':
                default:
                    operator = search_1.default.Operator.STARTSWITH;
                    break;
                case 'custpage_quod_filter_sku':
                case 'custpage_quod_filter_area':
                case 'custpage_quod_filter_pessoa':
                case 'custpage_quod_filter_classificacao':
                case 'custpage_quod_filter_status_produto':
                case 'custpage_quod_filter_sel_mod_web':
                case 'custpage_quod_filter_tipo_produto':
                case 'custpage_quod_filter_sel_mod_api':
                    operator = search_1.default.Operator.ANYOF;
                    break;
            }
            return operator;
        }
        catch (error) {
            log_1.default.error('getFieldColumnNS erro', error);
        }
    }
    exports.getOperatorColumnNS = getOperatorColumnNS;
    function getFieldColumnNS(id) {
        try {
            var fname = '';
            switch (id) {
                case 'custpage_quod_filter_name':
                    fname = 'itemid';
                    break;
                case 'custpage_quod_filter_area':
                    fname = 'custitem_quod_field_area_negocio';
                    break;
                case 'custpage_quod_filter_pessoa':
                    fname = 'custitem_quod_field_tipo_pessoa';
                    break;
                case 'custpage_quod_filter_classificacao':
                    fname = 'custitem_quod_field_classif_prod';
                    break;
                case 'custpage_quod_filter_status_produto':
                    fname = 'custitem_quod_status_produto';
                    break;
                case 'custpage_quod_filter_sel_mod_web':
                    fname = 'custitem_quod_selecionar_modulo';
                    break;
                case 'custpage_quod_filter_tipo_produto':
                    fname = 'custitem_quod_field_tipo_prod';
                    break;
                case 'custpage_quod_filter_sel_mod_api':
                    fname = 'custitem_quod_selecionar_modulo_apimbs';
                    break;
                case 'custpage_quod_filter_sku':
                    fname = 'externalid';
                    break;
                default:
                    fname = '';
                    break;
            }
            return fname;
        }
        catch (error) {
            log_1.default.error('getFieldColumnNS erro', error);
            throw error;
        }
    }
    exports.getFieldColumnNS = getFieldColumnNS;
    /**
     * function getSelectedItensFromList()
     * Obtem os valores dos registros selecionados na lista de itens
     */
    function getSelectedItensFromList() {
        try {
            var ret = []; //sublistcount = ncr.get().getLineCount({ sublistId: 'custpage_item_sublist' });
            for (var index = 0; index < currentRecord_1.default.get().getLineCount({ sublistId: 'custpage_item_sublist' }); index++) {
                if (currentRecord_1.default.get().getSublistValue({ fieldId: 'select_item', line: index, sublistId: 'custpage_item_sublist' })) { //Se estiver selecionado
                    //Adiciona o valor da coluna Item name/itemid no array de selecionados
                    ret.push(JSON.parse(String(currentRecord_1.default.get().getSublistValue({ fieldId: 'rec_fields', line: index, sublistId: 'custpage_item_sublist' }))));
                }
            }
            return ret;
            /* .reduce(function (acc: any, field: any, index: any) { //efetua a montagem do filtro para envio
                index > 0 ? acc.push("OR") : acc.push("AND");
                acc.push(["itemid", getOperatorColumnNS("itemid"), field]);
                return acc;
            }, []); */
        }
        catch (error) {
            log_1.default.error({ title: 'Erro getFiltersSelectedItensFromList', details: error });
            throw error;
        }
    }
    exports.getSelectedItensFromList = getSelectedItensFromList;
});
