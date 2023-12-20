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
define(["require", "exports", "N/ui/serverWidget", "N/log", "./quod_enums", "N/search"], function (require, exports, serverWidget_1, log_1, enums, search_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.populateSelectOpt = exports.populateFilterOpts = exports.buildFilters = exports.createButtons = exports.createSublist = exports.createForm = void 0;
    serverWidget_1 = __importDefault(serverWidget_1);
    log_1 = __importDefault(log_1);
    enums = __importStar(enums);
    search_1 = __importDefault(search_1);
    /**
     * Cria um formulário personalizado no NetSuite.
     *
     * @returns {nsw.Form} - Objeto de formulário criado.
     * @throws {Error} - Lança um erro se houver algum problema durante a criação do formulário.
     */
    function createForm(nRuntimeCurrentScript) {
        try {
            // Cria um objeto de formulário com o título 'Lista de itens'
            var form = serverWidget_1.default.createForm({ title: 'Lista de itens' }), 
            // Concatena os parâmetros de script para o campo 'URL destino'
            urlDestinoValue = "".concat(nRuntimeCurrentScript.getParameter({ name: 'custscript_quod_url_netsuite' })).concat(nRuntimeCurrentScript.getParameter({ name: 'custscript_quod_url_restlet' }));
            // Define o caminho do módulo do script do cliente para o formulário
            form.clientScriptModulePath = './quod_cl_integra_itens.js';
            // Adiciona campos ocultos ao formulário
            addHiddenField(form, 'script_id', 'Script ID', nRuntimeCurrentScript.id);
            addHiddenField(form, 'deployment_id', 'Deployment ID', nRuntimeCurrentScript.deploymentId);
            addHiddenField(form, 'token_key', 'Token key', nRuntimeCurrentScript.getParameter({ name: 'custscript_quod_token_key' }));
            addHiddenField(form, 'token_secret', 'Token secret', nRuntimeCurrentScript.getParameter({ name: 'custscript_quod_token_secret' }));
            addHiddenField(form, 'consumer_key', 'consumer key', nRuntimeCurrentScript.getParameter({ name: 'custscript_quod_consumer_key' }));
            addHiddenField(form, 'consumer_secret', 'consumer secret', nRuntimeCurrentScript.getParameter({ name: 'custscript_quod_consumer_secret' }));
            addHiddenField(form, 'id_destino', 'Id do destino', nRuntimeCurrentScript.getParameter({ name: 'custscript_quod_sb2_id' }));
            addHiddenField(form, 'realm_destino', 'Realm do destino', nRuntimeCurrentScript.getParameter({ name: 'custscript_quod_sb2_realm' }));
            addHiddenField(form, 'url_destino', 'url do destino', urlDestinoValue);
            // Retorna o objeto de formulário criado
            return form;
        }
        catch (error) {
            // Registra um erro no log em caso de exceção
            log_1.default.error({ title: "createForm error", details: error });
            // Lança o erro para tratamento externo, se necessário
            throw error;
        }
    }
    exports.createForm = createForm;
    /**
     * Adiciona um campo oculto ao formulário.
     *
     * @param {nsw.Form} form - Objeto de formulário ao qual o campo será adicionado.
     * @param {string} fieldId - ID do campo.
     * @param {string} label - Rótulo do campo.
     * @param {string} defaultValue - Valor padrão do campo.
     */
    var addHiddenField = function (form, fieldId, label, defaultValue) {
        try {
            form.addField({ id: fieldId, type: 'TEXT', label: label })
                .updateDisplayType({ displayType: serverWidget_1.default.FieldDisplayType.HIDDEN })
                .defaultValue = defaultValue;
        }
        catch (error) {
            // Registra um erro no log em caso de exceção
            log_1.default.error({ title: "createForm error", details: error });
            // Lança o erro para tratamento externo
            throw error;
        }
    };
    /**
     * function createSublist(form) - receives a suitelet form object to create a add the sublist fields
     * @param form - form object of the suitelet
     * @returns sublist with added fields present on the enums.sublistFields
     */
    function createSublist(form) {
        try {
            // Create sublist in the form object
            var sublist = form.addSublist({ id: 'custpage_item_sublist', type: 'INLINEEDITOR', label: 'Items' });
            // Add columns to the sublist
            enums.sublistFields.forEach(function (field) { sublist.addField({ id: field.id, type: field.type, label: field.label }).updateDisplayType({ displayType: field.id !== 'rec_fields' ? 'NORMAL' : 'HIDDEN' }); });
            return sublist;
        }
        catch (error) {
            log_1.default.error('Erro createSublist', error);
            throw error;
        }
    }
    exports.createSublist = createSublist;
    /**
     * function createButtons(form) - receives a form from the suitelet and add their buttons
     * @param form - form from suitelet
     */
    function createButtons(form) {
        try {
            form.addButton({ label: "Enviar itens", id: "custpage_check_sb1_rl", functionName: "sendItemListRl" });
            form.addButton({ label: "Filtrar", id: "custpage_apply_filter", functionName: "applyFilters" });
            form.addButton({ label: "Limpar lista de itens", id: "custpage_clean_sbl", functionName: "cleanSublist" });
            //enums.buttonsSl.forEach(button => { form.addButton({ label: button.label, id: button.id, functonName: button.functionName }) })
            //form.addSubmitButton({ label: "Enviar" });
        }
        catch (error) {
            log_1.default.error('createButtons error', error);
        }
    }
    exports.createButtons = createButtons;
    /**
     * function buildFilters(form: any, container: any) - build the suitelet form filters
     * @param form - form from the suitelet
     * @param container - Group of fields/filters on the suitelet
     * @returns {filterName:any,filterArea:any,filterPessoa:any,filterClassificacao:any,filterStatusProduto:any,filterSelModWeb:any,filterTipoProduto:any,filterSelModApi:any,filterSKU:any}
     */
    function buildFilters(form, container) {
        try {
            form.addFieldGroup({
                label: 'Filtros',
                id: container
            });
            var filterName = form.addField({
                id: 'custpage_quod_filter_name',
                type: "MULTISELECT",
                label: 'Nome do produto',
                container: container
            }), filterArea = form.addField({
                id: 'custpage_quod_filter_area',
                type: "MULTISELECT",
                label: 'Área de négocio',
                container: container
            }), filterPessoa = form.addField({
                id: 'custpage_quod_filter_pessoa',
                type: "MULTISELECT",
                label: 'Tipo pessoa',
                container: container
            }), filterClassificacao = form.addField({
                id: 'custpage_quod_filter_classificacao',
                type: "MULTISELECT",
                label: 'Classificação',
                container: container
            }), filterStatusProduto = form.addField({
                id: 'custpage_quod_filter_status_produto',
                type: "MULTISELECT",
                label: 'Status produto',
                container: container
            }), filterSelModWeb = form.addField({
                id: 'custpage_quod_filter_sel_mod_web',
                type: "MULTISELECT",
                label: 'Selecionar módulo web',
                container: container
            }), filterTipoProduto = form.addField({
                id: 'custpage_quod_filter_tipo_produto',
                type: "MULTISELECT",
                label: 'Tipo produto',
                container: container
            }), filterSelModApi = form.addField({
                id: 'custpage_quod_filter_sel_mod_api',
                type: "MULTISELECT",
                label: 'Selecionar módulo API',
                container: container
            }), filterSKU = form.addField({
                id: 'custpage_quod_filter_sku',
                type: "MULTISELECT",
                label: 'SKU',
                container: container
            });
            form.addField({
                id: 'custpage_campos_filtros',
                type: "LONGTEXT",
                label: 'Filter fields'
            })
                .updateDisplayType({
                displayType: serverWidget_1.default.FieldDisplayType.HIDDEN
            })
                .defaultValue = JSON.stringify([
                filterName,
                filterArea,
                filterPessoa,
                filterClassificacao,
                filterStatusProduto,
                filterSelModWeb,
                filterTipoProduto,
                filterSelModApi,
                filterSKU
            ]);
            return {
                filterName: filterName,
                filterArea: filterArea,
                filterPessoa: filterPessoa,
                filterClassificacao: filterClassificacao,
                filterStatusProduto: filterStatusProduto,
                filterSelModWeb: filterSelModWeb,
                filterTipoProduto: filterTipoProduto,
                filterSelModApi: filterSelModApi,
                filterSKU: filterSKU
            };
        }
        catch (error) {
            log_1.default.error('Erro buildFilterNomeProduto', error);
            throw error;
        }
    }
    exports.buildFilters = buildFilters;
    function populateFilterOpts(itens, filters) {
        try {
            //Para cada item encontrado, são inseridos os valores deste item nos filtros
            //e assim serem filtrados
            for (var item in itens) {
                populateSelectOpt(filters.filterName, itens[item].getValue('itemid')); //Filtro Nome do Produto
                populateSelectOpt(filters.filterSKU, itens[item].getValue('custitem_quod_sku')); //Filtro SKU
            }
            [
                { idRec: "customlist_quod_tipo_produto", filterObj: filters.filterTipoProduto },
                { idRec: "customrecord_quod_produtos_api_mbs", filterObj: filters.filterSelModApi },
                { idRec: "customrecord_quod_produtos_web_mbs", filterObj: filters.filterSelModWeb },
                { idRec: "customlist_quod_tipo_pessoa", filterObj: filters.filterPessoa },
                { idRec: "customlist_quod_area_de_negocio", filterObj: filters.filterArea },
                { idRec: "customlist_quod_class_prod", filterObj: filters.filterClassificacao },
                { idRec: "customlist_quod_status_prod_list", filterObj: filters.filterStatusProduto }
            ].forEach(function (recOrListName) {
                getSelectOptionsList(recOrListName.idRec).forEach(function (element) {
                    populateSelectOpt(recOrListName.filterObj, { value: element.id, text: element.getValue({ name: "name" }) }); //Filtro Tipo Produto
                });
            });
            return true;
        }
        catch (error) {
            log_1.default.error('Erro populateFilterOpts', error);
            throw error;
        }
    }
    exports.populateFilterOpts = populateFilterOpts;
    function populateSelectOpt(campo, opt) {
        try {
            campo.addSelectOption({
                value: !opt.value ? opt : opt.value,
                text: !opt.text ? opt : opt.text
            });
        }
        catch (error) {
            log_1.default.error('Erro buildFilterNomeProduto', error);
        }
    }
    exports.populateSelectOpt = populateSelectOpt;
    function getSelectOptionsList(recType) {
        try {
            var buscaOpcoes = search_1.default.create({ type: recType, columns: ["name"] }), countResult = buscaOpcoes.runPaged().count;
            return countResult > 0 ? buscaOpcoes.run().getRange({ start: 0, end: countResult }) : [];
        }
        catch (e) {
            log_1.default.error({ title: "getSelectOptionsList erro ", details: e });
            throw e;
        }
    }
});
/* function isSkuValid(values: any) {
    return values.externalid[0] ? !(String(values.externalid[0].value).length < 5) ? "" + values.externalid[0].value : "Fora do padrão" : "Não gerado"
}
function isSkuValidSR(sku: any) {
    return sku ? !(String(sku.value).length < 5) ? "" + sku : "Fora do padrão" : "Não gerado"
} */
