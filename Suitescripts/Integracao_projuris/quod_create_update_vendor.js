/**
 * @NApiVersion 2.1
 * @author Alexandre Corrêa <alexandre.correa@quod.com.br>
 * @since 19/04/2022
 * @version 1.0
 * Review - Alexandre J. Corrêa <alexandre.correa@quod.com.br>
 * @since 13/07/2022
 * @version 2.0
 */
define(["N/search", "N/record", "N/format", "N/workflow", 'N/file'],
    function (search, record, format, workflow, file) {
        /**
        * @param {Object} campos 
        * @param {​​​​​​​​String} context.fornecedor.nomeempresa
        * @param {​​​​​​​​String} context.fornecedor.cnpj
        * @param {​​​​​​​​String} context.fornecedor.subsidiariaprincipal
        * @param {​​​​​​​​String} context.fornecedor.nomecontato
        * @param {​​​​​​​​String} context.fornecedor.email
        */

        function CreateConstructor(context) {

            var itemsVazios = [],
                jsonEnviado = [],
                jsonEsperado = [
                    "nomeempresa",
                    "cnpj",
                    "subsidiariaprincipal",
                    "nomecontato",
                    "email"
                ],
                comparaJsonEnviadoRecebido;


            validaArray(context.fornecedor, itemsVazios, jsonEnviado);
            //valida de o Json recebido é o mesmo que o esperado 
            comparaJsonEnviadoRecebido = comparaJson(jsonEnviado, jsonEsperado);
            if (!itemsVazios.length == 0) {
                return itemsVazios;
            }

            try {
                this.campos = {};
                this.campos.nomeempresa = context.fornecedor.nomeempresa;
                this.campos.cnpj = context.fornecedor.cnpj;
                this.campos.subsidiariaprincipal = context.fornecedor.subsidiariaprincipal;
                this.campos.nomecontato = context.fornecedor.nomecontato;
                this.campos.email = context.fornecedor.email;
            } catch (error) {
                log.audit("Error ao tentar criar construtor Vendor", error)
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

        CreateConstructor.prototype.createRecord = function (context, fornecedor) {

            try {

                var createVendor = record.create({
                    type: record.Type.VENDOR,
                    isDynamic: true,
                });
                createVendor.setValue("companyname", context.campos.nomeempresa);
                createVendor.setValue("custentity_psg_br_cnpj", context.campos.cnpj);
                createVendor.setValue("subsidiary", context.campos.subsidiariaprincipal);
                createVendor.setValue("email", context.campos.email);

                var idVendor = createVendor.save();

                fornecedor.status = "Success"
                fornecedor.codigo = 1
                fornecedor.message = "Fornecedor criado com sucesso"
                fornecedor.internalid = idVendor

            } catch (error) {
                log.audit("Erro ao tentar criar o fornecedor", error)
                fornecedor.status = "Error"
                fornecedor.codigo = 4
                fornecedor.message = error
                fornecedor.externalid = context.campos.externalid
            }
            log.audit("Retorno da requisição", fornecedor);
            return JSON.stringify(fornecedor);
        }

        return {
            CreateConstructor: CreateConstructor
        };
    });