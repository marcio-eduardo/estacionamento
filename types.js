var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
(function () {
    var _a;
    var $ = function (query) { return document.querySelector(query); };
    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }
    //Gera datas e formata
    function formatDate(date) {
        date.getFullYear();
        var dataAtual = {
            dia: padTo2Digits(date.getDate()),
            mes: padTo2Digits(date.getMonth() + 1),
            ano: padTo2Digits(date.getFullYear())
        };
        var data = (dataAtual.dia + '/' + dataAtual.mes + '/' + dataAtual.ano);
        return data;
    }
    function formatHour(hour) {
        var horaAtual = {
            hora: padTo2Digits(hour.getHours()),
            minutos: padTo2Digits(hour.getMinutes()),
            segundos: padTo2Digits(hour.getSeconds())
        };
        var hora = (horaAtual.hora + ' : ' + horaAtual.minutos);
        return hora;
    }
    function calTempo(mil) {
        //const hora = veiculoEntrada!.horaEntrada
        var hor = Math.floor(mil / 3600000);
        var min = Math.floor((mil % 3600000) / 60000);
        var sec = Math.floor((mil % 60000) / 1000);
        return "".concat(hor, "h ").concat(min, "m e ").concat(sec, "s");
    }
    function patio() {
        function ler() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function salvar(veiculos) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }
        function adicionar(veiculo, salva) {
            var _a, _b;
            var row = document.createElement("tr");
            var hora = formatHour(new Date(veiculo.entrada));
            var data = formatDate(new Date(veiculo.entrada));
            row.innerHTML = " \n        <td>".concat(veiculo.nome, "</td>\n        <td>").concat(veiculo.placa, "</td>\n        <td>").concat(data, "</td>\n        <td>").concat(hora, "</td>\n        <td class=\"delete\" data-placa=\"").concat(veiculo.placa, "\">Finalizar</td>\n      ");
            //adiciona evento de clique quando encontra classe delete
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remover(this.dataset.placa);
            });
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (salva)
                salvar(__spreadArray(__spreadArray([], ler(), true), [veiculo], false));
        }
        //converter string em array
        /*function toArray(entrada: string){
          const enter = entrada.split('');
         // const exit = saida.split('');
    
          const hora = parseInt(enter[0] + enter[1]);
          const min = parseInt(enter[5] + enter[6]);
    
          const milessegundos= ((hora * 60) + min) * 60;
    
          return milessegundos;
        }*/
        function remover(placa) {
            var veiculo = (ler().find(function (veiculo) { return veiculo.placa === placa; }));
            //Configura hora de entrada e saida
            var chegada = new Date(veiculo.entrada);
            var saida = new Date();
            var timeOut = calTempo(Math.abs(chegada.getTime() - saida.getTime()));
            if (!confirm("\n        O ve\u00EDculo: ".concat(veiculo === null || veiculo === void 0 ? void 0 : veiculo.nome, "\n        Chegou \u00E0s: ").concat(formatHour(chegada), "\n        Saiu \u00E0s: ").concat(formatHour(saida), " \n        Tempo na Garagem: ").concat(timeOut, ". \n        Deseja encerrar?")))
                return;
            salvar(ler().filter(function (veiculo) { return veiculo.placa !== placa; }));
            render();
            console.log("Chegou as: " + formatHour(chegada));
            console.log("saiu as: " + formatHour(saida));
            console.log(veiculo);
            console.log(saida);
            console.log('Tempo de permanência: ' + timeOut);
        }
        function render() {
            $("#patio").innerHTML = ""; //a exclamação serve para forçar o código
            var patio = ler();
            if (patio.length) {
                patio.forEach(function (veiculo) { return adicionar(veiculo); });
            }
        }
        return { ler: ler, adicionar: adicionar, remover: remover, salvar: salvar, render: render };
    }
    patio().render();
    (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        var _a, _b;
        var nome = (_a = $("#nome")) === null || _a === void 0 ? void 0 : _a.value;
        var placa = (_b = $("#placa")) === null || _b === void 0 ? void 0 : _b.value;
        if (!nome || !placa) {
            alert("Os campos nome e placa são obrigatórios");
            return;
        }
        patio().adicionar({
            nome: nome,
            placa: placa,
            entrada: new Date()
        }, true);
    });
})();
