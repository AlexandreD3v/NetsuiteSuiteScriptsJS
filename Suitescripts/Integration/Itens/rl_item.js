/**
 * @copyright © 2022, Oracle and/or its affiliates. All rights reserved.
 *
 * @NApiVersion 2.x
 * @NScriptType Restlet
 */
define(["N/log", "./clf_integra_itens", "./rlModules/item_module", "./rl_functions"],
    function ( log, clf, itemMod, rlFunction) {
        function get(request) {
            try {
                log.error('request', request);
                return JSON.stringify(clf.searchItensLocal(JSON.parse(request.filters)));
            }
            catch (e) {
                log.error({ title: 'Erro get', details: e });
                return JSON.stringify(e);
            }
        }
        
        function post(request) {
            // TODO implementar POST endpoint para receber JSON com os campos do item
            //para efetuar o seu cadastro (Observar como exemplo integração do projuris)
            // e retornar resposta de sucesso
            // com o item criado para posterior atualização
            // no ambiente de origem da requisição
            try {
                log.error('1 - request', request);
                if (request.itens === undefined)
                    return { status: 'erro', msg: 'Itens não foram informados!' };
                var foundItem, ret = [], itemAttId;
                //ret: any = [],
                request.itens.forEach(function (element) {
                    var returnElement = _assign({}, element);
                    log.error('2 - returnElement', returnElement);
                    foundItem = itemMod._fetchRecord("servicesaleitem", "itemid", element.values.itemid);
                    log.error('3 - foundItem[0]', foundItem);
                    
                    var foundNomeProduto, foundSelModWeb, foundSelModApi;
                    var checkIsEqualItem = rlFunction.isEqual(foundItem, element);
                    log.error('checkIsEqualItem', checkIsEqualItem);
                    if (checkIsEqualItem)
                        ret.push({ SKU: element.values.externalid[0].value, status: 'Produto não alterado. Já está atualizado!' });
                    //Se o item for diferente
                    else {
                        //Verificação campo nome produto
                        if (element.values.custitemcustitem_field_nome_prod[0] !== undefined) { //Se o item a ser atualizado possuir o nome produto
                            //Realiza a pesquisa local para localizar/verificar existência
                            foundNomeProduto = itemMod._fetchRecord("customrecord_nome_produto", "name", element.values.custitemcustitem_field_nome_prod[0].text);
                            log.error('5 - foundNomeProduto', foundNomeProduto);
                            var valuesNomeProduto = getValuesNomeProdutoElem(element);
                            log.error('valuesNomeProduto', valuesNomeProduto);
                            var checkIsEqualNomeProduto = isEqual(valuesNomeProduto, foundNomeProduto ? getValuesNomeProduto(foundNomeProduto) : 0);
                            log.error('checkIsEqualNomeProduto', checkIsEqualNomeProduto);
                            if (foundNomeProduto > -1 && !checkIsEqualNomeProduto) { //Caso não seja igual e não seja um erro
                                returnElement.values.custitemcustitem_field_nome_prod[0].value = rlFunction._createUpdateRecs(valuesNomeProduto, foundNomeProduto ? foundNomeProduto : 0, "customrecord_nome_produto"); //Atualiza ou cria o registro nome produto
                            }
                            if (checkIsEqualNomeProduto && element.values.custitemcustitem_field_nome_prod[0].id !== foundNomeProduto.id) { //Caso não seja igual e não seja um erro
                                returnElement.values.custitemcustitem_field_nome_prod[0].value = foundNomeProduto.id;
                            }
                        }
                        //Verificação campo modulo web
                        if (element.values.custitem_selecionar_modulo[0] !== undefined) { //Se o item a ser atualizado possuir o modulo web
                            foundSelModWeb = itemMod._fetchRecord("customrecord_produtos_web_mbs", "name", element.values.custitem_selecionar_modulo[0].text); //Realiza a pesquisa local para localizar/verificar existência
                            log.error('foundSelModWeb', foundSelModWeb);
                            var valuesModWeb = rlFunction.getValuesModWebElem(element);
                            log.error('valuesModWeb', valuesModWeb);
                            var checkIsEqualModWeb = isEqual(valuesModWeb, foundSelModWeb ? rlFunction.getValuesModWeb(foundSelModWeb) : 0);
                            log.error('checkIsEqualModWeb', checkIsEqualModWeb);
                            if (foundSelModWeb > -1 && !checkIsEqualModWeb) { //Caso não seja igual e não seja um erro
                                returnElement.values.custitem_selecionar_modulo[0].value = rlFunction._createUpdateRecs(valuesModWeb, foundSelModWeb ? foundSelModWeb : 0, "customrecord_produtos_web_mbs"); //Atualiza ou cria o registro 
                            }
                        }
                        log.error('6 - foundSelModWeb', foundSelModWeb);
                        //Verificação campo SELECIONAR MÓDULO API
                        if (element.values.custitem_selecionar_modulo_apimbs[0] !== undefined) { //Se o item a ser atualizado possuir o SELECIONAR MÓDULO API
                            foundSelModApi = itemMod._fetchRecord("customrecord_produtos_api_mbs", "name", element.values.custitem_selecionar_modulo_apimbs[0].text); //Realiza a pesquisa local para localizar/verificar existência
                            log.error('7 - foundSelModApi', foundSelModApi);
                            var valuesModApi = rlFunction.rlFunction.getValuesModApiElem(element);
                            log.error('valuesModApi', valuesModApi);
                            var checkIsEqualModApi = isEqual(valuesModApi, foundSelModApi ? rlFunction.getValuesModApi(foundSelModApi) : 0);
                            log.error('checkIsEqualModApi', checkIsEqualModApi);
                            if (foundSelModApi > -1 && !checkIsEqualModApi) { //Caso não seja igual e não seja um erro
                                log.error('8 - entrou criação', foundSelModApi);
                                returnElement.values.custitem_selecionar_modulo_apimbs[0].value = rlFunction._createUpdateRecs(valuesModApi, foundSelModApi ? foundSelModApi : 0, "customrecord_produtos_api_mbs"); //Atualiza ou cria o registro 
                            }
                        }
                        log.error('returnElement before create', returnElement);
                        itemAttId = rlFunction._createUpdateRecs(returnElement, foundItem ? foundItem : 0, "servicesaleitem");
                        ret.push({
                            id: itemAttId.id,
                            SKU: itemAttId.sku,
                            //Se o item for salvo com sucesso (id > 0), informa sucesso, do contratrio, informa que não foi alterado
                            status: itemAttId.id > 0 ? 'Produto atualizado com sucesso!' : 'Produto não alterado. Já está atualizado!'
                        });
                        log.error('8 - item atualizado', itemAttId);
                    }
                });
                return { ret: ret };
                //return {request:request}
            }
            catch (e) {
                log.error({ title: 'Erro post', details: e });
                throw e;
            }
        }
        
       
        return{
            get:get,
            post:post
        }
    });
