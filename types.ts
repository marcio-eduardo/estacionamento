interface Veiculo {
  nome: string;
  placa: string;
  entrada: Date;
}


(function() {
  const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

  function padTo2Digits(num: number) {
     return num.toString().padStart(2, '0');
  }

  //Gera datas e formata
  function formatDate(date: Date) {
    date.getFullYear();

    const dataAtual = {
      dia: padTo2Digits(date.getDate()),
      mes: padTo2Digits(date.getMonth() + 1),
      ano: padTo2Digits(date.getFullYear())
    }
         
    const data = (dataAtual.dia + '/' + dataAtual.mes + '/' + dataAtual.ano);
      
    return data; 
  }

  function formatHour(hour: Date) { 
    
    const horaAtual = {   
      hora: padTo2Digits(hour.getHours()),
      minutos: padTo2Digits(hour.getMinutes()),
      segundos: padTo2Digits(hour.getSeconds()),
    }

    const hora = (horaAtual.hora + ' : ' + horaAtual.minutos);
    
    return hora;
  }
 
 function calTempo(mil: number){

    //const hora = veiculoEntrada!.horaEntrada
    const hor = Math.floor(mil / 3600000);
    const min = Math.floor((mil % 3600000) / 60000);
    const sec = Math.floor((mil % 60000) / 1000)

    return `${hor}h ${min}m e ${sec}s`;
  }

  function patio(){
    function ler(): Veiculo[] {
      return localStorage.patio ? JSON.parse(localStorage.patio) : [];
      
    }

    function salvar(veiculos: Veiculo[]){
      localStorage.setItem("patio", JSON.stringify(veiculos));
    }

    function adicionar(veiculo: Veiculo, salva?: boolean){
      const row = document.createElement("tr");     
      const hora = formatHour(new Date(veiculo.entrada));
      const data = formatDate(new Date(veiculo.entrada))
      row.innerHTML =` 
        <td>${veiculo.nome}</td>
        <td>${veiculo.placa}</td>
        <td>${data}</td>
        <td>${hora}</td>
        <td class="delete" data-placa="${veiculo.placa}">Finalizar</td>
      `;

        //adiciona evento de clique quando encontra classe delete
        row.querySelector(".delete")?.addEventListener("click", function(){
          remover(this.dataset.placa);
        })
        
        
        $("#patio")?.appendChild(row);

        if (salva) salvar([...ler(), veiculo]);
        
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

    function remover(placa: string){
      
      const veiculo  = (ler().find((veiculo) => veiculo.placa === placa));
      

      //Configura hora de entrada e saida
      const chegada = new Date(veiculo!.entrada);
      const saida = new Date(); 
      const timeOut = calTempo(Math.abs(chegada.getTime() - saida.getTime()));

      if(
        !confirm(`
        O veículo: ${veiculo?.nome}
        Chegou às: ${formatHour(chegada)}
        Saiu às: ${formatHour(saida)} 
        Tempo na Garagem: ${timeOut}. 
        Deseja encerrar?`
        
                )
        ) 
          return;

      salvar(ler().filter(veiculo => veiculo.placa !== placa));
      render();


      console.log("Chegou as: " + formatHour(chegada));
      console.log("saiu as: " + formatHour(saida));
      console.log(veiculo);
      console.log(saida);
      console.log('Tempo de permanência: ' + timeOut);
      
    }

    function render(){
      $("#patio")!.innerHTML = "";//a exclamação serve para forçar o código
      const patio = ler();

      if(patio.length) {
        patio.forEach((veiculo) => adicionar(veiculo));
      }
    }

    return { ler, adicionar, remover, salvar, render };

  }

  patio().render();

  $("#cadastrar")?.addEventListener("click", () => {
    const nome = $("#nome")?.value;
    const placa = $("#placa")?.value;
    
    if(!nome || !placa) {
     alert("Os campos nome e placa são obrigatórios");
     return;
    }
       
    patio().adicionar({ 
      nome, 
      placa, 
      entrada: new Date()      
    }, true);
  })
})();




