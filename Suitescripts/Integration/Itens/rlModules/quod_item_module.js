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
define(["require", "exports", "N/search", "N/log", "../quod_enums", "../quod_clf_integra_itens"], function (require, exports, search_1, log_1, enums, clf) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._fetchRecord = exports._updateItem = exports._createUpdateItem = void 0;
    search_1 = __importDefault(search_1);
    log_1 = __importDefault(log_1);
    enums = __importStar(enums);
    clf = __importStar(clf);
    function _createUpdateItem(item) {
        try {
            var defaultValues = getFilledDefaultValues(item);
            log_1.default.error('defaultValues', defaultValues);
            /*
                    nrec.create({
                type: 'servicesaleitem',
                defaultValues: {
                    externalid: item.externalid,
                    itemid: item.itemid,
                    custitemcustitem_quod_field_nome_prod: item.custitemcustitem_quod_field_nome_prod,
                    custitem_quod_item_nome_amigavel: item.custitem_quod_item_nome_amigavel,
                    displayname: item.displayname,
                    salesdescription: item.salesdescription,
                    isinactive: item.isinactive,
                    custitem_quod_field_area_negocio: item.custitem_quod_field_area_negocio,
                    custitem_quod_field_tipo_prod: item.custitem_quod_field_tipo_prod,
                    custitem_quod_field_tipo_pessoa: item.custitem_quod_field_tipo_pessoa,
                    custitem_quod_field_classif_prod: item.custitem_quod_field_classif_prod,
                    custitem_quod_status_produto: item.custitem_quod_status_produto,
                    custitem_quod_margem_receita: item.custitem_quod_margem_receita,
                    custitemquod_impostos_receita: item.custitemquod_impostos_receita,
                    custitem_quod_metodo_de_tarifacao: item.custitem_quod_metodo_de_tarifacao,
                    custitem_quod_flag_backtest: item.custitem_quod_flag_backtest,
                    custitem_quod_clausula_contrat_espec: item.custitem_quod_clausula_contrat_espec,
                    department: item.department,
                    custitem_quod_familia_produto: item.custitem_quod_familia_produto,
                    location: item.location,
                },
                
                    department", label: "Departamento" },
                    custitem_quod_familia_produto", label: "Quod Família de Produtos" },
                    location", label: "Localidade" },
                    subsidiary", label: "Subsidiária" },
                    formulatext", formula: "{ includechildren } ", label: "Incluir filhos" },
                    custitem_quod_access_web", label: "Controla Acesso via Web" },
                    custitem_quod_access_api", label: "Controla Acesso via API" },
                    custitem_quod_access_batch", label: "Controla Acesso via Bacth" },
                    custitem_quod_selecionar_modulo", label: "Selecionar Módulo Web" },
                    formulatext", formula: "{ custitem_quod_mbs_acesso_posivo }", label: "MBS Acesso ao Positivo" },
                    custitem_quod_pix_codigo", label: "Código PIX" },
                    custitem_quod_pix_tipo_servico", label: "Tipo de serviço " },
                    custitem_quod_item_subtype", label: "Subtipo de Item" },
                    custitem_acs_item_type_ls", label: "Tipo" },
                    custitem_quod_billing", label: "Controle de Bilhetagem" },
                    custitem_quod_tipo_receita", label: "Tipo de Receita" },
                    custitem_quod_item_no_hit", label: "Produto No Hit" },
                    custitem_quod_qtd_pacote", label: "Quantidade do Pacote" },
                    custitem_quod_tipo_batch_negativacao", label: "Registro Batch Negativação" },
                    custitem_quod_batch_controlcred_op", label: "Operação Batch Controlcred" },
                    custitem_quod_itens_upgrade", label: "Itens Upgrade" },
                    custitem_quod_itens_downgrade", label: "Itens Downgrade" },
                    formulatext", formula: "{ custitem_quod_item_novoprocesso }", label: "Novo Processo de Compras" },
                    custitem_quod_periodicidade", label: "Periodicidade do Produto" },
                    custitem_quod_cupom_desc_canc_pme", label: "Cupom de desconto cancelamento PME" },
                    custitem_quod_cod_reg_batch", label: "Código Registro Batch" },
                    custitem_quod_canal_comunicacao", label: "Canal de Comunicação" },
                    custitemcustitem_quod_prod_sem_desc_pr", label: "Item Padrão Vinculado(Sem Descontos" },
                        formulatext", formula: "{ custitem_quod_item_vcm_global }", label: "Item de VCM Global" },
                        custitem_quod_numero_logins", label: "Número de logins por plano" },
                        custitem_acs_item_tipo_produto", label: "Tipo de Produto" },
                        custitem_quod_selecionar_modulo_apimbs", label: "Selecionar Módulo API" }
                    ]
                })
                */
        }
        catch (error) {
            log_1.default.error('_createItem Erro', error);
            throw error;
        }
    }
    exports._createUpdateItem = _createUpdateItem;
    function _updateItem() {
        try {
        }
        catch (error) {
        }
    }
    exports._updateItem = _updateItem;
    function _fetchRecord(recToFind, fieldToFind, valueToFind) {
        try {
            var srcItemRP = search_1.default.create({
                type: recToFind ? recToFind : "servicesaleitem",
                filters: getFetchFilter(recToFind, fieldToFind, valueToFind),
                columns: getColumnsFetch(recToFind)
            });
            return srcItemRP.runPaged().count > 0 ? srcItemRP.run().getRange({ start: 0, end: srcItemRP.runPaged().count })[0] : 0;
        }
        catch (error) {
            log_1.default.error('_fetchItem Erro', error);
            return -1;
        }
    }
    exports._fetchRecord = _fetchRecord;
    function getFilledDefaultValues(item) {
        try {
            log_1.default.error('item loop', item);
            item.reduce(function (acc, cv) {
                log_1.default.error('cv', cv);
                if (cv) {
                    acc.push(cv);
                }
                return acc;
            }, []);
            /*
            item.forEach((element: any) => {
                nlog.error('element loop parse', element)
            }); */
            log_1.default.error('item loop parse', JSON.stringify(item));
        }
        catch (error) {
            log_1.default.error('getFilledDefaultValues Erro', error);
            throw error;
        }
    }
    function getFetchFilter(recToFind, fieldToFind, valueToFind) {
        try {
            var retFilter = [];
            if (recToFind == "servicesaleitem") {
                retFilter = [
                    ["type", "anyof", "Service"],
                    "AND",
                    ["subtype", "anyof", "Sale"],
                    "AND",
                    //[fieldToFind, "anyof", "Sale"],
                ];
            }
            retFilter.push([fieldToFind, clf.getOperatorColumnNS(fieldToFind), valueToFind]);
            log_1.default.error('getFetchFilter retFilter', retFilter);
            return retFilter;
        }
        catch (error) {
            log_1.default.error('getFetchFilter Erro', error);
            throw error;
        }
    }
    /* function getElementValue(recToFind: string, valueToFind: any): string {
        try {
            var ret;
            switch (recToFind) {
                case "customrecord_quod_nome_produto":
                    ret = valueToFind.values.custitemcustitem_quod_field_nome_prod[0].text
                    break;
    
                case "customrecord_quod_produtos_web_mbs":
                    ret = valueToFind.values.custitem_quod_selecionar_modulo[0].text
                    break;
    
                case "customrecord_quod_produtos_api_mbs":
                    ret = valueToFind.values.custitem_quod_selecionar_modulo_apimbs[0].text
                    break;
    
                default:
                    ret = valueToFind;
                    break;
            }
            return ret;
        } catch (error) {
    
            nlog.error('getElementValu Erro', error)
            throw error;
        }
    }
    */
    function getColumnsFetch(recToFind) {
        try {
            var ret;
            switch (recToFind) {
                case "customrecord_quod_nome_produto":
                    ret = enums.searchColumnsNomeProduto;
                    break;
                case "customrecord_quod_produtos_web_mbs":
                    ret = enums.searchColumnsModWeb;
                    break;
                case "customrecord_quod_produtos_api_mbs":
                    ret = enums.searchColumnsModApi;
                    break;
                default:
                    ret = enums.searchColumnsItens2;
                    break;
            }
            return ret;
        }
        catch (error) {
            log_1.default.error('getElementValu Erro', error);
            throw error;
        }
    }
});
