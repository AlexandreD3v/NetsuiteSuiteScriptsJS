/**
 * @NApiVersion 2.1
 * @author Rafael Oliveira <rafael.oliveira@quod.com.br>
 * @since 19/05/2021
 * @version 1.0 
 * Review - Alexandre J. Corrêa <alexandre.correa@quod.com.br>
 * @since 13/07/2022
 * @version 2.0
 */
define(["N/search", "N/record", "N/format", "N/workflow", 'N/file'],
    function (search, record, format, workflow, file) {
        /**
        * @param {Object} campos 
        * @param {​​​​​​​​String} context.externalid
        * @param {​​​​​​​​String} context.fornecedor
        * @param {​​​​​​​​String} context.dataCriacao
        * @param {​​​​​​​​String} context.dataVencimento
        * @param {​​​​​​​​String} context.descricao
        * @param {​​​​​​​​String} context.departamento
        * @param {Integer} context.tipoDeCompra
        * @param {​​​​​​​​String} context.tipoDeDocumento
        * @param {​​​​​​​​String} context.anexo
        * @param {​​​​​​​​String} context.numeroProcesso
        * @param {​​​​​​​​String} context.numeroRequisicao
        * @param {​​​​​​​​String} context.numeroPastaProjuris
        * @param {Integer} context.item
        * @param {Integer} context.valor
        */

        function CreateConstructor(context) {

            var itemsVazios = [],
                jsonEnviado = [],
                jsonEsperado = [
                    "externalid",
                    "fornecedor",
                    "dataVencimento",
                    "descricao",
                    "departamento",
                    "tipoDeCompra",
                    "tipoDeDocumento",
                    "itens",
                    "item",
                    "valor",
                    "anexo",
                    "nome",
                    "conteudo",
                    "numeroProcesso",
                    "numeroRequisicao",
                    "numeroPastaProjuris"
                ],
                comparaJsonEnviadoRecebido;

            validaArray(context, itemsVazios, jsonEnviado);
            validaArray(context.itens, itemsVazios, jsonEnviado);
            validaArray(context.anexo, itemsVazios, jsonEnviado);
            //valida de o Json recebido é o mesmo que o esperado 
            comparaJsonEnviadoRecebido = comparaJson(jsonEnviado, jsonEsperado);

            if (!itemsVazios.length == 0) {
                return itemsVazios;
            }

            try {
                this.campos = {};
                this.campos.externalid = context.externalid;
                this.campos.entity = context.fornecedor;
                this.campos.trandate = context.data;
                this.campos.duedate = context.dataVencimento;
                this.campos.custbody_acs_justificativa_compra = context.descricao;
                this.campos.department = context.departamento;
                this.campos.custbody_acs_impostos = context.tipoDeCompra;
                this.campos.custbody_o2s_transaction_l_tip_doc_fis = context.tipoDeDocumento;
                this.campos.anexo = context.anexo;
                this.campos.item = context.itens;
                this.campos.numeroProcesso = context.numeroProcesso;
                this.campos.numeroRequisicao = context.numeroRequisicao;
                this.campos.numeroPastaProjuris = context.numeroPastaProjuris;


            } catch (error) {
                log.audit("Error ao tentar criar construtor", error)
                return error
            }

        }
        
        /**
        * @param {​​​​​​​​Object} context 
        * @param {​​​​​​​​Object} itemsVazios 
        */
        function validaArray(context, itemsVazios, jsonEnviado) {
            Object.keys(context).forEach(function (item) {
                jsonEnviado.push(item);
                if (!context[item]) {
                    itemsVazios.push(item);
                }
            });

            log.audit("Items enviado sem valor", itemsVazios)
            log.audit("JSON Enviado", jsonEnviado)
            return true
        }

        function comparaJson(jsonEnviado, jsonEsperado) {

            log.debug("Json Esperado", jsonEsperado);
            log.debug("Json Enviado", jsonEnviado);

            //retira valores iguais enviados via Json 
            var novaJsonEnviado = jsonEnviado.filter(function (valorAtual, i) {
                return jsonEnviado.indexOf(valorAtual) === i;
            });
            //compara Arrays
            const equals = (novaJsonEnviado, jsonEsperado) => JSON.stringify(novaJsonEnviado) === JSON.stringify(jsonEsperado);
            var comparaArrays = equals(novaJsonEnviado.sort(), jsonEsperado.sort());
            log.audit("Os Arrays comparado são iguais", comparaArrays);

            return comparaArrays
        }

        function adicionarAnexo(context, idPedido) {

            for (var i = 0; i < context.length; i++) {

                var nomeArquivo = context[i].nome
                var conteudo = context[i].conteudo

                var pedidoDeCompraId = idPedido

                var arquivo = file.create({
                    name: nomeArquivo,
                    fileType: file.Type.PDF,
                    contents: conteudo,
                    description: `Arquivo de anexo Projuris, pedido de compra ${pedidoDeCompraId}`,
                    folder: '<folder_id>',
                    isOnline: true
                })

                var arquivoid = arquivo.save()
                var id = record.attach({
                    record: {
                        type: 'file',
                        id: arquivoid
                    },
                    to: {
                        type: record.Type.PURCHASE_ORDER,
                        id: pedidoDeCompraId
                    }
                });

            }

        }

        CreateConstructor.prototype.createRecord = function (context, pedidoDeCompra) {

            try {

                var createPurchaseOrder = record.create({
                    type: record.Type.PURCHASE_ORDER,
                    isDynamic: true,
                });
                createPurchaseOrder.setValue("customform", "yor_form_id");
                createPurchaseOrder.setValue("employee", "your_employee_id");
                createPurchaseOrder.setValue("externalid", context.campos.externalid);
                createPurchaseOrder.setValue("entity", context.campos.entity);
                createPurchaseOrder.setValue("duedate", formatDate(context.campos.duedate));
                createPurchaseOrder.setValue("custbody_acs_justificativa_compra", context.campos.custbody_acs_justificativa_compra);
                createPurchaseOrder.setValue("department", context.campos.department);
                createPurchaseOrder.setValue("custbody_acs_impostos", context.campos.custbody_acs_impostos);
                createPurchaseOrder.setValue("custbody_o2s_transaction_l_tip_doc_fis", context.campos.custbody_o2s_transaction_l_tip_doc_fis);
                createPurchaseOrder.setValue("custbody_quod_numero_processo_judicial", context.campos.numeroProcesso);
                createPurchaseOrder.setValue("custbody_quod_numero_requisicao", context.campos.numeroRequisicao);
                createPurchaseOrder.setValue("custbody_quod_id_tran_pasta_projuris", context.campos.numeroPastaProjuris);

                for (var i = 0; i < context.campos.item.length; i++) {

                    createPurchaseOrder.selectNewLine({ sublistId: 'item' });
                    createPurchaseOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: 'item', value: context.campos.item[i].item });
                    createPurchaseOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: context.campos.item[i].valor });
                    createPurchaseOrder.commitLine({ sublistId: 'item' });

                }

                var idPurchaseOrder = createPurchaseOrder.save({});


                adicionarAnexo(context.campos.anexo, idPurchaseOrder)

                pedidoDeCompra.status = "Success"
                pedidoDeCompra.codigo = 1
                pedidoDeCompra.message = "Pedido de Compra criado com sucesso"
                pedidoDeCompra.internalid = idPurchaseOrder

            } catch (error) {
                log.audit("Erro ao tentar criar o pedido de compra", error)
                pedidoDeCompra.status = "Error"
                pedidoDeCompra.codigo = 4
                pedidoDeCompra.message = error
                pedidoDeCompra.externalid = context.campos.externalid
            }
            log.audit("Retorno da requisição", pedidoDeCompra);
            return JSON.stringify(pedidoDeCompra);
        }

        function formatDate(date) {
            log.audit('date', date)
            var dataFormatada = format.parse({
                value: date,
                type: format.Type.DATE
            });
            return dataFormatada
        }


        return {
            CreateConstructor: CreateConstructor
        };
    });