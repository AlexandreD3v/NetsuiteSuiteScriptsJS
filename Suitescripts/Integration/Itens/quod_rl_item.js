/**
 * @copyright © 2022, Oracle and/or its affiliates. All rights reserved.
 *
 * @NApiVersion 2.x
 * @NScriptType Restlet
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
define(["require", "exports", "N/record", "N/log", "./quod_clf_integra_itens", "./rlModules/quod_item_module", "./quod_enums"], function (require, exports, record_1, log_1, clf, itemMod, enums) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.post = exports.get = void 0;
    record_1 = __importDefault(record_1);
    log_1 = __importDefault(log_1);
    clf = __importStar(clf);
    itemMod = __importStar(itemMod);
    enums = __importStar(enums);
    function get(request) {
        try {
            log_1.default.error('request', request);
            return JSON.stringify(clf.searchItensLocal(JSON.parse(request.filters)));
        }
        catch (e) {
            log_1.default.error({ title: 'Erro get', details: e });
            return JSON.stringify(e);
        }
    }
    exports.get = get;
    function post(request) {
        // TODO implementar POST endpoint para receber JSON com os campos do item
        //para efetuar o seu cadastro (Observar como exemplo integração do projuris)
        // e retornar resposta de sucesso
        // com o item criado para posterior atualização
        // no ambiente de origem da requisição
        try {
            log_1.default.error('1 - request', request);
            if (request.itens === undefined)
                return { status: 'erro', msg: 'Itens não foram informados!' };
            var foundItem, ret = [], itemAttId;
            //ret: any = [],
            request.itens.forEach(function (element) {
                var returnElement = __assign({}, element);
                log_1.default.error('2 - returnElement', returnElement);
                foundItem = itemMod._fetchRecord("servicesaleitem", "itemid", element.values.itemid);
                log_1.default.error('3 - foundItem[0]', foundItem);
                //itemIsEqual = isEqual(foundItem[0], element);
                //nlog.error('4 - itemIsEqual', itemIsEqual)
                //Se o item estiver igual, não efetua nenhuma alteração no item
                //e adiciona ao retorno a informação de item já atualizado
                var foundNomeProduto, foundSelModWeb, foundSelModApi;
                var checkIsEqualItem = isEqual(foundItem, element);
                log_1.default.error('checkIsEqualItem', checkIsEqualItem);
                if (checkIsEqualItem)
                    ret.push({ SKU: element.values.externalid[0].value, status: 'Produto não alterado. Já está atualizado!' });
                //Se o item for diferente
                else {
                    //Verificação campo nome produto
                    if (element.values.custitemcustitem_quod_field_nome_prod[0] !== undefined) { //Se o item a ser atualizado possuir o nome produto
                        //Realiza a pesquisa local para localizar/verificar existência
                        foundNomeProduto = itemMod._fetchRecord("customrecord_quod_nome_produto", "name", element.values.custitemcustitem_quod_field_nome_prod[0].text);
                        log_1.default.error('5 - foundNomeProduto', foundNomeProduto);
                        var valuesNomeProduto = getValuesNomeProdutoElem(element);
                        log_1.default.error('valuesNomeProduto', valuesNomeProduto);
                        var checkIsEqualNomeProduto = isEqual(valuesNomeProduto, foundNomeProduto ? getValuesNomeProduto(foundNomeProduto) : 0);
                        log_1.default.error('checkIsEqualNomeProduto', checkIsEqualNomeProduto);
                        if (foundNomeProduto > -1 && !checkIsEqualNomeProduto) { //Caso não seja igual e não seja um erro
                            returnElement.values.custitemcustitem_quod_field_nome_prod[0].value = _createUpdateRecs(valuesNomeProduto, foundNomeProduto ? foundNomeProduto : 0, "customrecord_quod_nome_produto"); //Atualiza ou cria o registro nome produto
                        }
                        if (checkIsEqualNomeProduto && element.values.custitemcustitem_quod_field_nome_prod[0].id !== foundNomeProduto.id) { //Caso não seja igual e não seja um erro
                            returnElement.values.custitemcustitem_quod_field_nome_prod[0].value = foundNomeProduto.id;
                        }
                    }
                    //Verificação campo modulo web
                    if (element.values.custitem_quod_selecionar_modulo[0] !== undefined) { //Se o item a ser atualizado possuir o modulo web
                        foundSelModWeb = itemMod._fetchRecord("customrecord_quod_produtos_web_mbs", "name", element.values.custitem_quod_selecionar_modulo[0].text); //Realiza a pesquisa local para localizar/verificar existência
                        log_1.default.error('foundSelModWeb', foundSelModWeb);
                        var valuesModWeb = getValuesModWebElem(element);
                        log_1.default.error('valuesModWeb', valuesModWeb);
                        var checkIsEqualModWeb = isEqual(valuesModWeb, foundSelModWeb ? getValuesModWeb(foundSelModWeb) : 0);
                        log_1.default.error('checkIsEqualModWeb', checkIsEqualModWeb);
                        if (foundSelModWeb > -1 && !checkIsEqualModWeb) { //Caso não seja igual e não seja um erro
                            returnElement.values.custitem_quod_selecionar_modulo[0].value = _createUpdateRecs(valuesModWeb, foundSelModWeb ? foundSelModWeb : 0, "customrecord_quod_produtos_web_mbs"); //Atualiza ou cria o registro 
                        }
                    }
                    log_1.default.error('6 - foundSelModWeb', foundSelModWeb);
                    //Verificação campo SELECIONAR MÓDULO API
                    if (element.values.custitem_quod_selecionar_modulo_apimbs[0] !== undefined) { //Se o item a ser atualizado possuir o SELECIONAR MÓDULO API
                        foundSelModApi = itemMod._fetchRecord("customrecord_quod_produtos_api_mbs", "name", element.values.custitem_quod_selecionar_modulo_apimbs[0].text); //Realiza a pesquisa local para localizar/verificar existência
                        log_1.default.error('7 - foundSelModApi', foundSelModApi);
                        var valuesModApi = getValuesModApiElem(element);
                        log_1.default.error('valuesModApi', valuesModApi);
                        var checkIsEqualModApi = isEqual(valuesModApi, foundSelModApi ? getValuesModApi(foundSelModApi) : 0);
                        log_1.default.error('checkIsEqualModApi', checkIsEqualModApi);
                        if (foundSelModApi > -1 && !checkIsEqualModApi) { //Caso não seja igual e não seja um erro
                            log_1.default.error('8 - entrou criação', foundSelModApi);
                            returnElement.values.custitem_quod_selecionar_modulo_apimbs[0].value = _createUpdateRecs(valuesModApi, foundSelModApi ? foundSelModApi : 0, "customrecord_quod_produtos_api_mbs"); //Atualiza ou cria o registro 
                        }
                    }
                    log_1.default.error('returnElement before create', returnElement);
                    itemAttId = _createUpdateRecs(returnElement, foundItem ? foundItem : 0, "servicesaleitem");
                    ret.push({
                        id: itemAttId.id,
                        SKU: itemAttId.sku,
                        //Se o item for salvo com sucesso (id > 0), informa sucesso, do contratrio, informa que não foi alterado
                        status: itemAttId.id > 0 ? 'Produto atualizado com sucesso!' : 'Produto não alterado. Já está atualizado!'
                    });
                    log_1.default.error('8 - item atualizado', itemAttId);
                }
            });
            return { ret: ret };
            //return {request:request}
        }
        catch (e) {
            log_1.default.error({ title: 'Erro post', details: e });
            throw e;
        }
    }
    exports.post = post;
    function isEqual(obj1, obj2) {
        log_1.default.error({ title: 'obj1', details: obj1 });
        log_1.default.error({ title: "obj2", details: obj2 });
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }
    function _createUpdateRecs(objFromSuitelet, foundProdutoOnRestlet, recordType) {
        try {
            var recToSave = foundProdutoOnRestlet === 0 ? record_1.default.create({ type: recordType }) : record_1.default.load({ type: recordType, id: foundProdutoOnRestlet.id });
            switch (recordType) {
                case "customrecord_quod_nome_produto":
                    enums.fieldsNomeProdutoRec.forEach(function (element) { return forearchcallbackfunction(element, objFromSuitelet, recToSave); });
                    break;
                case "customrecord_quod_produtos_web_mbs":
                    enums.fieldsNModWebRec.forEach(function (element) { return forearchcallbackfunction(element, objFromSuitelet, recToSave); });
                    break;
                case "customrecord_quod_produtos_api_mbs":
                    enums.fieldsModApiRec.forEach(function (element) { return forearchcallbackfunction(element, objFromSuitelet, recToSave); });
                    break;
                default:
                case "servicesaleitem":
                    enums.fieldsItemRec.forEach(function (element) { return servicesaleitemcallbackfunction(element, objFromSuitelet, recToSave); });
                    break;
            }
            var idret = recToSave ? recToSave.save() : 'Erro ao criar ' + recordType;
            log_1.default.error("idret", idret);
            return "servicesaleitem" ? { id: idret, sku: recToSave.getValue("externalid") } : idret;
        }
        catch (e) {
            log_1.default.error("Erro _createUpdateNomeProduto", e);
            return -1;
        }
    }
    function getValuesNomeProdutoElem(elem) {
        try {
            return {
                values: {
                    name: elem.values["custitemcustitem_quod_field_nome_prod.name"],
                    //parent: elem.values["custitemcustitem_quod_field_nome_prod.parent"], <- Coluna não existe em sb2
                    custrecord_quod_nome_produto: elem.values["custitemcustitem_quod_field_nome_prod.custrecord_quod_nome_produto"] ? elem.values["custitemcustitem_quod_field_nome_prod.custrecord_quod_nome_produto"] : ""
                }
            };
        }
        catch (e) {
            log_1.default.error({ title: 'Erro getObjNomeProduto', details: e });
            throw e;
        }
    }
    function getValuesNomeProduto(foundNomeProduto) {
        try {
            log_1.default.error({ title: 'getValuesNomeProduto elem', details: foundNomeProduto });
            //nlog.error({ title: 'getValuesNomeProduto custitemcustitem_quod_field_nome_prod', details: elem.values.custitemcustitem_quod_field_nome_prod });
            if (foundNomeProduto === 0)
                return 0;
            log_1.default.error({ title: 'getValuesNomeProduto elem after 0', details: foundNomeProduto });
            return {
                values: {
                    name: foundNomeProduto.getValue("name"),
                    //parent: elem[0].getValue("parent") ? elem[0].getValue("parent") : [],
                    custrecord_quod_nome_produto: foundNomeProduto.getValue("custrecord_quod_nome_produto") ? foundNomeProduto.getValue("custrecord_quod_nome_produto") : ""
                }
            };
        }
        catch (e) {
            log_1.default.error({ title: 'Erro getObjNomeProduto', details: e });
            throw e;
        }
    }
    function getValuesModWebElem(elem) {
        try {
            if (elem === undefined)
                return 0;
            return {
                values: {
                    name: elem.values["name"],
                    //parent: elem[0].getValue("parent") ? elem[0].getValue("parent") : [],
                    custrecord_quod_codigo_produto_mbs: elem.values["custrecord_quod_codigo_produto_mbs"] ? elem.values["custrecord_quod_codigo_produto_mbs"] : [],
                    custrecord_quoid_role_mbs: elem.values["custrecord_quoid_role_mbs"] ? elem.values["custrecord_quoid_role_mbs"] : []
                }
            };
        }
        catch (e) {
            log_1.default.error({ title: 'Erro getValuesModWeb', details: e });
            throw e;
        }
    }
    function getValuesModWeb(elem) {
        try {
            if (elem === undefined)
                return 0;
            log_1.default.error({ title: 'getValuesModWeb elem.getValue("name")', details: elem.getValue("name") });
            return {
                values: {
                    name: elem.getValue("name"),
                    //parent: elem[0].getValue("parent") ? elem[0].getValue("parent") : [],
                    custrecord_quod_codigo_produto_mbs: elem.getValue("custrecord_quod_codigo_produto_mbs") ? elem[0].getValue("custrecord_quod_codigo_produto_mbs") : [],
                    custrecord_quoid_role_mbs: elem.getValue("custrecord_quoid_role_mbs") ? elem[0].getValue("custrecord_quoid_role_mbs") : []
                }
            };
        }
        catch (e) {
            log_1.default.error({ title: 'Erro getValuesModWeb', details: e });
            throw e;
        }
    }
    function getValuesModApiElem(elem) {
        try {
            if (elem === undefined)
                return 0;
            return {
                values: {
                    name: elem.values["custitem_quod_selecionar_modulo_apimbs.name"],
                    //parent: elem.values["custitem_quod_selecionar_modulo_apimbs.parent"] ? elem.values["custitem_quod_selecionar_modulo_apimbs.parent"] : [],
                    custrecord_quod_produto_mbs: elem.values["custitem_quod_selecionar_modulo_apimbs.custrecord_quod_produto_mbs"] ? elem.values["custitem_quod_selecionar_modulo_apimbs.custrecord_quod_produto_mbs"] : [],
                    custrecord_quod_role_mbs: elem.values["custitem_quod_selecionar_modulo_apimbs.custrecord_quod_role_mbs"] ? elem.values["custitem_quod_selecionar_modulo_apimbs.custrecord_quod_role_mbs"] : []
                }
            };
        }
        catch (e) {
            log_1.default.error({ title: 'Erro getValuesModWeb', details: e });
            throw e;
        }
    }
    function getValuesModApi(elem) {
        try {
            if (elem === undefined)
                return 0;
            log_1.default.error({ title: 'getValuesModWeb elem', details: elem });
            return {
                /* recordType: "customrecord_quod_nome_produto",
                id: elem.values.custitem_quod_selecionar_modulo[0].value, */
                values: {
                    name: elem.getValue("name"),
                    //parent: elem.getValue("parent") ? elem.getValue("parent") : [],
                    custrecord_quod_produto_mbs: elem.getValue("custrecord_quod_produto_mbs") ? elem.getValue("custrecord_quod_produto_mbs") : [],
                    custrecord_quod_role_mbs: elem.getValue("custrecord_quod_role_mbs") ? elem.getValue("custrecord_quod_role_mbs") : []
                }
            };
        }
        catch (e) {
            log_1.default.error({ title: 'Erro getValuesModWeb', details: e });
            throw e;
        }
    }
    function forearchcallbackfunction(element, objFromSuitelet, recToSave) {
        try {
            var value = objFromSuitelet.values !== undefined ? objFromSuitelet.values[element] : "";
            if (value) {
                recToSave.setValue({ fieldId: element, value: value });
            }
        }
        catch (e) {
            log_1.default.error({ title: 'Erro forearchcbfunction', details: e });
            throw e;
        }
    }
    function servicesaleitemcallbackfunction(element, objFromSuitelet, recToSave) {
        try {
            var value = objFromSuitelet.values[element];
            if (!!String(value)) {
                value = (value && value[0] && value[0].value) !== undefined ? value[0].value : (value !== undefined ? value : "");
                value = element === "custitem_quod_margem_receita" ? String(value).replace("%", "") : value;
                recToSave.setValue({ fieldId: element, value: value });
            }
        }
        catch (e) {
            log_1.default.error({ title: 'Erro servicesaleitemcallbackfunction', details: e });
            throw e;
        }
    }
});
