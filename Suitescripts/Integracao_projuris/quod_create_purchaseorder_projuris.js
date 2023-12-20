/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 *
 * @author Rafael Oliveira <rafael.oliveira@quod.com.br>
 * @since 19/05/2021
 * @version 1.0
 * Review - Alexandre J. Corrêa <alexandre.correa@quod.com.br>
 * @since 13/07/2022
 * @version 2.0
 */

define(["./quod_create_update_vendor", "./quod_create_update_purchaseorder", "N/search"],
    function (createVendor, createPurchaseOrder, search) {

        function _get(context) {
            //Search the purchas eorder by his external id
            if (context.externalid) {

                var pedidoDeCompra = new Object();
                var idPurchaseOrder;

                try {
                    search.create({
                        type: "purchaseorder",
                        filters:
                            [
                                ["type", "anyof", "PurchOrd"],
                                "AND",
                                ["externalid", "anyof", context.externalid.toString()],
                                "AND",
                                ["mainline", "is", "T"]
                            ],
                        columns:
                            [
                                search.createColumn({ name: "internalid", label: "ID interna" })
                            ]
                    }).run().each(function (result) {
                        idPurchaseOrder = result.getValue({ name: "internalid" })
                        return true;
                    });

                    if (idPurchaseOrder) {
                        pedidoDeCompra.status = "Success"
                        pedidoDeCompra.codigo = 1
                        pedidoDeCompra.message = "Pedido de Compra localizado com sucesso"
                        pedidoDeCompra.internalid = idPurchaseOrder
                    } else {
                        pedidoDeCompra.status = "Error"
                        pedidoDeCompra.codigo = 4
                        pedidoDeCompra.message = "Pedido de Compra não localizado"
                        pedidoDeCompra.externalid = context.externalid
                    }

                } catch (error) {
                    pedidoDeCompra.status = "Error"
                    pedidoDeCompra.codigo = 4
                    pedidoDeCompra.message = error
                    pedidoDeCompra.externalid = context.externalid
                }
                return pedidoDeCompra
            }
            //var status = consultaStatus(context)

            return
        }

        function _post(context) {
            try {
                var pedidoDeCompraRecebido = context.pedidoDeCompra,
                    pedidoDeCompra = new Object(),
                    vendor = new Object(),
                    objVendor = new createVendor.CreateConstructor(pedidoDeCompraRecebido),
                    objPo = new createPurchaseOrder.CreateConstructor(pedidoDeCompraRecebido),
                    vendorId = _fetchVendor(objVendor);

                //Caso os campos do fornecedor foram informados
                if (objVendor.campos) {
                    //Executada a busca do fornecedor, caso ele não exista é criado
                    vendorId = vendorId ? vendorId : getIdVendor(objVendor, vendor);

                    //Caso os campos do padido foram informados
                    if (objPo.campos) {
                        //Após o fornecedor ter sido localizado/criado, é inserido o seu ID no campo entity do pedido a ser criado
                        objPo.campos.entity = vendorId;
                        pedidoDeCompra.entity = vendorId;

                        //Cria o pedido de compra
                        return createPurchaseOrder.CreateConstructor.prototype.createRecord(objPo, pedidoDeCompra);
                    }
                    else {
                        pedidoDeCompra.status = "Erro Pedido de compra"
                        pedidoDeCompra.codigo = 3
                        pedidoDeCompra.message = `JSON não atende aos requisitos, por favor revisa-lo.`
                        return pedidoDeCompra
                    }
                }
                else {
                    pedidoDeCompra.status = "Erro Fornecedor"
                    pedidoDeCompra.codigo = 3
                    pedidoDeCompra.message = `JSON não atende aos requisitos, por favor revisa-lo.`
                    return pedidoDeCompra;
                }
            } catch (error) {
                pedidoDeCompra.status = "Erro _post"
                pedidoDeCompra.codigo = 3
                pedidoDeCompra.message = error
                return pedidoDeCompra;
            }
        }

        function _fetchVendor(objVendor) {
            var id;
            search.create({
                type: "vendor",
                filters:
                    [
                        ["custentity_psg_br_cnpj", "contains", objVendor.campos.cnpj]
                    ]
            }).run().each(function (result) {
                log.audit("result _fetchVendor", result.id);
                id = result.id;
            });
            return id;
        }

        function consultaStatus(context) {

            var recType = ""
            var recId = ""
            var consultarStatus = new Object();

            try {

                for (var i in context) {
                    if (context.hasOwnProperty(i)) {
                        recType = i
                        recId = context[i]
                    }
                }

                var status = search.lookupFields({
                    type: recType,
                    id: recId,
                    columns: 'status'
                })


            } catch (error) {

                log.debug("Erro ao tentar consultar o status", error)

                consultarStatus.status = "Error"
                consultarStatus.codigo = 4
                consultarStatus.message = error
                consultarStatus.internalid = recId
                status = consultarStatus
                log.debug('erro', status)

            }

            return status


        }

        function getIdVendor(objVendor, vendor) {
            var resp = JSON.parse(createVendor.CreateConstructor.prototype.createRecord(objVendor, vendor));
            if (resp.codigo == 1) {
                return resp.internalid;
            }
            else {
                return resp;
            }
        }

        return {
            post: _post,
            get: _get
        }
    });