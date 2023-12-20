/**
 * @copyright © 2022, Oracle and/or its affiliates. All rights reserved.
 *
 * @NApiVersion 2.x
 * @NModuleScope Public
 * @NScriptType ClientScript
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
define(["require", "exports", "N/https", "N/log", "N/format", "N/search", "N/currentRecord", "./quod_enums", "./oAuth/Quod_oAuth", "./quod_clf_integra_itens"], function (require, exports, https_1, log_1, format_1, search_1, currentRecord_1, enums, qOAuth, clf) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checkExists = exports.cleanSublist = exports.populateSublist = exports.applyFilters = exports.getOAuthHeader = exports.sendItemListRl = exports.pageInit = void 0;
    https_1 = __importDefault(https_1);
    log_1 = __importDefault(log_1);
    format_1 = __importDefault(format_1);
    search_1 = __importDefault(search_1);
    currentRecord_1 = __importDefault(currentRecord_1);
    enums = __importStar(enums);
    qOAuth = __importStar(qOAuth);
    clf = __importStar(clf);
    function pageInit() {
        try {
            alert("Bem vindo ao suitelet de integração de itens!\n"
                + "Modo de usar:\n"
                + "1 - Selecione um dos filtros. \n"
                + "2 - Clique em filtrar. \n"
                + "3 - Selecione o item a ser enviado na lista.\n"
                + "4 - Clique em enviar.\n");
        }
        catch (error) {
            log_1.default.error('error pageinit', error);
        }
    }
    exports.pageInit = pageInit;
    /**
     * function sendItemListRl()
     * Envia a lista de itens para o restlet
     */
    function sendItemListRl() {
        try {
            var selectedItens = clf.getSelectedItensFromList();
            if (selectedItens.length < 1) {
                alert('Não foram selecionados itens!');
                return;
            }
            alert('Envio dos itens selecionados em andamento, aguarde.');
            log_1.default.debug({ title: 'selectedItens sendItemListRl', details: selectedItens });
            var url = String(currentRecord_1.default.get().getValue({ fieldId: 'url_destino' })), nsInfosSel = {
                url: url,
                realm: String(currentRecord_1.default.get().getValue({ fieldId: 'realm_destino' })),
                consumer: {
                    key: String(currentRecord_1.default.get().getValue({ fieldId: 'consumer_key' })),
                    secret: String(currentRecord_1.default.get().getValue({ fieldId: 'consumer_secret' }))
                },
                token: {
                    key: String(currentRecord_1.default.get().getValue({ fieldId: 'token_key' })),
                    secret: String(currentRecord_1.default.get().getValue({ fieldId: 'token_secret' }))
                }
            }, itensSb1 = https_1.default.post({ url: url, headers: getOAuthHeader(nsInfosSel), body: JSON.stringify({ itens: selectedItens }) });
            log_1.default.debug({ title: 'retorno sendItemListRl', details: itensSb1 });
            checkRequestSuccess(itensSb1);
        }
        catch (error) {
            log_1.default.error({ title: 'Erro sendItemListRl', details: error });
            alert("Ocorreu um erro! Entre em contato com o administrador do sistema.");
            throw error;
        }
    }
    exports.sendItemListRl = sendItemListRl;
    /**
     * function getSb1OAuth()
     * Chamada do restlet com oAuth
     */
    //export function getSb1ItemListRlOAuh() {
    function getOAuthHeader(ambienteInfos) {
        try {
            var url = ambienteInfos.url, headers = qOAuth.OAuth({
                realm: ambienteInfos.realm,
                consumer: { key: ambienteInfos.consumer.key, secret: ambienteInfos.consumer.secret },
                signature_method: "HMAC-SHA256",
                hash_function: qOAuth.OAuth.hash_function_sha256
            }).getHeaders({
                url: url,
                method: "POST",
                tokenKey: ambienteInfos.token.key,
                tokenSecret: ambienteInfos.token.secret
            });
            headers['User-Agent-x'] = 'SuiteScript-Call';
            headers['Content-Type'] = 'application/json';
            log_1.default.error('ambienteInfos', ambienteInfos);
            log_1.default.error('headers', headers);
            return headers;
        }
        catch (error) {
            log_1.default.error({ title: 'Erro getOAuthHeader', details: error });
            throw error;
        }
    }
    exports.getOAuthHeader = getOAuthHeader;
    /**
     * function applyFilters()
     * Executa a montagem doss filtros de busca dos filtros selecionados
     */
    function applyFilters() {
        try {
            // Obtém o array de filtros
            var filterFields = JSON.parse(String(currentRecord_1.default.get().getValue({ fieldId: 'custpage_campos_filtros' })));
            // Reduce que obtém os valores selecionados e monta os filtros
            var params = filterFields.reduce(function (acc, field) {
                // Obtém o valor do campo selecionado
                var fieldValue = currentRecord_1.default.get().getValue({ fieldId: field.id });
                // Se o campo de filtro for do tipo data, formata o valor adequadamente
                if (field.type === 'date' && fieldValue) {
                    fieldValue = format_1.default.format({ type: format_1.default.Type.DATE, value: fieldValue });
                }
                // Caso seja do tipo multiselect, obtém todos os valores selecionados
                else if (field.type === 'multiselect') {
                    fieldValue = fieldValue ? fieldValue.join() : [];
                }
                // Se existir valor selecionado
                if (fieldValue) {
                    // Efetua split para transformar os itens selecionados em array
                    var filspl = String(fieldValue).split(',');
                    // Para cada valor selecionado
                    for (var fvalue in filspl) {
                        // Verifica se é o primeiro item para adicionar OR ou AND
                        acc.length < 1 || field.id == 'custpage_quod_filter_pessoa' ? acc.push("AND") : acc.push("OR");
                        var resultado = [clf.getFieldColumnNS(field.id), clf.getOperatorColumnNS(field.id), filspl[fvalue]];
                        log_1.default.debug('resultado applyFilters', resultado);
                        // Executa a montagem do filtro para a busca e adiciona ao acumulador (acc)
                        acc.push(resultado);
                    }
                }
                // Retorna os filtros montados de acordo com a seleção
                return acc;
            }, []);
            // Adiciona na lista do suitelet os items retornados pela busca que recebeu os filtros
            populateSublist(clf.searchItensLocal(params));
        }
        catch (e) {
            log_1.default.error('Erro applyFilters', e);
            throw e;
        }
    }
    exports.applyFilters = applyFilters;
    function populateSublist(list) {
        if (list.length < 1) {
            alert('Não foram encontrados itens!');
            return;
        }
        ;
        var cr = currentRecord_1.default.get(), strsbid = 'custpage_item_sublist';
        list.forEach(function (item) {
            if (item == 'erro') {
                alert('tente novamente');
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
                        fieldValue = isSkuValid(item.getValue('custitem_quod_sku'));
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
    exports.populateSublist = populateSublist;
    function cleanSublist() {
        try { //Invertido o for (i--) para retirar as linhas a partir da última até a primeira
            for (var i = currentRecord_1.default.get().getLineCount({ sublistId: 'custpage_item_sublist' }); i > 0; i--) {
                currentRecord_1.default.get().removeLine({ sublistId: 'custpage_item_sublist', line: i - 1 });
            }
        }
        catch (error) {
            log_1.default.error('cleanSublist erro', error);
        }
    }
    exports.cleanSublist = cleanSublist;
    function checkExists(sku) {
        return search_1.default.create({
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
    exports.checkExists = checkExists;
    function isSkuValid(values) {
        return values ? !(String(values).length < 5) ? "" + values : "Fora do padrão" : "Não gerado";
    }
    function checkRequestSuccess(itensSb1) {
        if (itensSb1.code == "200") {
            var strSuccess = "";
            JSON.parse(itensSb1.body).ret.forEach(function (element) {
                console.log(element);
                strSuccess += "Item " + element.custitem_quod_sku + " - " + element.status + " - ID: " + element.id + "\n";
            });
            alert('Sucesso! \n' + strSuccess);
        }
        else {
            alert("Erro! " + itensSb1.body);
        }
    }
});
