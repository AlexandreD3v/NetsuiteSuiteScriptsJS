/**
 * @copyright © 2022, Oracle and/or its affiliates. All rights reserved.
 *
 * @NApiVersion 2.x
 * @NModuleScope Public
 * @NScriptType Suitelet
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
define(["require", "exports", "N/ui/serverWidget", "N/log", "N/runtime", "./quod_clf_integra_itens", "./quod_slf_buildform"], function (require, exports, serverWidget_1, log_1, runtime_1, clf, fbuilder) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.onRequest = void 0;
    serverWidget_1 = __importDefault(serverWidget_1);
    log_1 = __importDefault(log_1);
    runtime_1 = __importDefault(runtime_1);
    clf = __importStar(clf);
    fbuilder = __importStar(fbuilder);
    function onRequest(context) {
        try {
            switch (context.request.method) {
                case 'GET':
                    _get(context);
                    break;
                /* case 'POST':
                    _post(context);
                    break; */
                default:
                    methodNotFound(context);
                    break;
            }
        }
        catch (error) {
            log_1.default.error({ title: "erro sl", details: error });
        }
    }
    exports.onRequest = onRequest;
    function _get(context) {
        log_1.default.debug({ title: "GET", details: context.request.parameters });
        //Cria o formulário
        var slform = fbuilder.createForm(runtime_1.default.getCurrentScript()), 
        //Cria os filtros - select
        filterFields = fbuilder.buildFilters(slform, 'fg_quod_filtros');
        /* //Executa a busca de itens locais
        itensLocal = clf.searchItensLocal(); */
        //Cria a Sublista
        fbuilder.createSublist(slform);
        //Populas os filtros com os itens do ambiente em execução - select
        fbuilder.populateFilterOpts(clf.searchItensLocal(), filterFields);
        //Cria os filtros - texto
        //filterFields = fbuilder.buildFiltersText(form, 'fg_quod_filtros'); 
        //Caso seja necessário popular a lista ao carregar o suitelet, utilizar esta função
        //clf.populateSublist(itensLocal);
        //Cria os botões do formulário
        fbuilder.createButtons(slform);
        // Monta o formulário
        context.response.writePage(slform);
    }
    /* function _post(context: any) {
        log.error({ title: "POST", details: context.request.parameters });
        //TO-DO: receber lista com itens selecionados na tela anterior
        //para processamento de envio para cadastro
        //e deve enviar para o restlet (POST) para cadastrar o item
        // recebendo a lista de itens selecionados do clf
    
        // var itensSel = clf.getFiltersSelectedItensFromList();
    
        // var headerObj = {
        //     "Content-Type": "application/json"
        // }
    
        // // var response = https.post({
        // //     url: 'https://4860171-sb1.app.netsuite.com/app/site/hosting/restlet.nl?script=1784&deploy=1',
        // //     body: JSON.stringify(itensSel),
        // //     headers: headerObj,
        // // });
    
        
    
        var form = serverWidget.createForm({
            title: "Integra itens",
        });
    
        context.response.writePage(form);
    } */
    function methodNotFound(context) {
        log_1.default.error({ title: context.request.method, details: context.request.parameters });
        var form = serverWidget_1.default.createForm({
            title: "Método não implementado!",
        });
        context.response.writePage(form);
    }
});
