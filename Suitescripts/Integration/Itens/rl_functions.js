/**
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(["N/record", "N/log", "./enums"],
function (record, log, enums) {

    function _createUpdateRecs(objFromSuitelet, foundProdutoOnRestlet, recordType) {
        try {
            var recToSave = foundProdutoOnRestlet === 0 ? record.create({ type: recordType }) : record.load({ type: recordType, id: foundProdutoOnRestlet.id });
            switch (recordType) {
                case "customrecord_nome_produto":
                    enums.fieldsNomeProdutoRec.forEach(function (element) { return forearchcallbackfunction(element, objFromSuitelet, recToSave); });
                    break;
                case "customrecord_produtos_web_mbs":
                    enums.fieldsNModWebRec.forEach(function (element) { return forearchcallbackfunction(element, objFromSuitelet, recToSave); });
                    break;
                case "customrecord_produtos_api_mbs":
                    enums.fieldsModApiRec.forEach(function (element) { return forearchcallbackfunction(element, objFromSuitelet, recToSave); });
                    break;
                default:
                case "servicesaleitem":
                    enums.fieldsItemRec.forEach(function (element) { return servicesaleitemcallbackfunction(element, objFromSuitelet, recToSave); });
                    break;
            }
            var idret = recToSave ? recToSave.save() : 'Erro ao criar ' + recordType;
            log.error("idret", idret);
            return "servicesaleitem" ? { id: idret, sku: recToSave.getValue("externalid") } : idret;
        }
        catch (e) {
            log.error("Erro _createUpdateNomeProduto", e);
            return -1;
        }
    }
    function getValuesNomeProdutoElem(elem) {
        try {
            return {
                values: {
                    name: elem.values["custitemcustitem_field_nome_prod.name"],
                    //parent: elem.values["custitemcustitem_field_nome_prod.parent"], <- Coluna não existe em sb2
                    custrecord_nome_produto: elem.values["custitemcustitem_field_nome_prod.custrecord_nome_produto"] ? elem.values["custitemcustitem_field_nome_prod.custrecord_nome_produto"] : ""
                }
            };
        }
        catch (e) {
            log.error({ title: 'Erro getObjNomeProduto', details: e });
            throw e;
        }
    }
    function getValuesNomeProduto(foundNomeProduto) {
        try {
            log.error({ title: 'getValuesNomeProduto elem', details: foundNomeProduto });
            //nlog.error({ title: 'getValuesNomeProduto custitemcustitem_field_nome_prod', details: elem.values.custitemcustitem_field_nome_prod });
            if (foundNomeProduto === 0)
                return 0;
            log.error({ title: 'getValuesNomeProduto elem after 0', details: foundNomeProduto });
            return {
                values: {
                    name: foundNomeProduto.getValue("name"),
                    //parent: elem[0].getValue("parent") ? elem[0].getValue("parent") : [],
                    custrecord_nome_produto: foundNomeProduto.getValue("custrecord_nome_produto") ? foundNomeProduto.getValue("custrecord_nome_produto") : ""
                }
            };
        }
        catch (e) {
            log.error({ title: 'Erro getObjNomeProduto', details: e });
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
                    custrecord_codigo_produto_mbs: elem.values["custrecord_codigo_produto_mbs"] ? elem.values["custrecord_codigo_produto_mbs"] : [],
                    custrecord_quoid_role_mbs: elem.values["custrecord_quoid_role_mbs"] ? elem.values["custrecord_quoid_role_mbs"] : []
                }
            };
        }
        catch (e) {
            log.error({ title: 'Erro getValuesModWeb', details: e });
            throw e;
        }
    }
    function getValuesModWeb(elem) {
        try {
            if (elem === undefined)
                return 0;
            log.error({ title: 'getValuesModWeb elem.getValue("name")', details: elem.getValue("name") });
            return {
                values: {
                    name: elem.getValue("name"),
                    //parent: elem[0].getValue("parent") ? elem[0].getValue("parent") : [],
                    custrecord_codigo_produto_mbs: elem.getValue("custrecord_codigo_produto_mbs") ? elem[0].getValue("custrecord_codigo_produto_mbs") : [],
                    custrecord_quoid_role_mbs: elem.getValue("custrecord_quoid_role_mbs") ? elem[0].getValue("custrecord_quoid_role_mbs") : []
                }
            };
        }
        catch (e) {
            log.error({ title: 'Erro getValuesModWeb', details: e });
            throw e;
        }
    }
    function getValuesModApiElem(elem) {
        try {
            if (elem === undefined)
                return 0;
            return {
                values: {
                    name: elem.values["custitem_selecionar_modulo_apimbs.name"],
                    //parent: elem.values["custitem_selecionar_modulo_apimbs.parent"] ? elem.values["custitem_selecionar_modulo_apimbs.parent"] : [],
                    custrecord_produto_mbs: elem.values["custitem_selecionar_modulo_apimbs.custrecord_produto_mbs"] ? elem.values["custitem_selecionar_modulo_apimbs.custrecord_produto_mbs"] : [],
                    custrecord_role_mbs: elem.values["custitem_selecionar_modulo_apimbs.custrecord_role_mbs"] ? elem.values["custitem_selecionar_modulo_apimbs.custrecord_role_mbs"] : []
                }
            };
        }
        catch (e) {
            log.error({ title: 'Erro getValuesModWeb', details: e });
            throw e;
        }
    }
    function getValuesModApi(elem) {
        try {
            if (elem === undefined)
                return 0;
            log.error({ title: 'getValuesModWeb elem', details: elem });
            return {
                /* recordType: "customrecord_nome_produto",
                id: elem.values.custitem_selecionar_modulo[0].value, */
                values: {
                    name: elem.getValue("name"),
                    //parent: elem.getValue("parent") ? elem.getValue("parent") : [],
                    custrecord_produto_mbs: elem.getValue("custrecord_produto_mbs") ? elem.getValue("custrecord_produto_mbs") : [],
                    custrecord_role_mbs: elem.getValue("custrecord_role_mbs") ? elem.getValue("custrecord_role_mbs") : []
                }
            };
        }
        catch (e) {
            log.error({ title: 'Erro getValuesModWeb', details: e });
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
            log.error({ title: 'Erro forearchcbfunction', details: e });
            throw e;
        }
    }
    function servicesaleitemcallbackfunction(element, objFromSuitelet, recToSave) {
        try {
            var value = objFromSuitelet.values[element];
            if (!!String(value)) {
                value = (value && value[0] && value[0].value) !== undefined ? value[0].value : (value !== undefined ? value : "");
                value = element === "custitem_margem_receita" ? String(value).replace("%", "") : value;
                recToSave.setValue({ fieldId: element, value: value });
            }
        }
        catch (e) {
            log.error({ title: 'Erro servicesaleitemcallbackfunction', details: e });
            throw e;
        }
    }

    
    function isEqual(obj1, obj2) {
        log.error({ title: 'obj1', details: obj1 });
        log.error({ title: "obj2", details: obj2 });
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }

    return{
        isEqual:isEqual
    }

  });
  