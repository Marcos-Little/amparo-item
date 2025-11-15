window.addEventListener("DOMContentLoaded", async () => {

    const imprimir = (item) => {
        return `
            <div class="card-item">
                <div class="imagem-card">
                    <img src="${item.fotoItem || 'https://via.placeholder.com/150'}" 
                         alt="Foto de ${item.nome}">
                </div>
                <div class="conteudo-card">
                    <div class="titulo-card">
                        <h3>${item.nome}</h3>
                    </div>
                    <p class="paragrafo-card">${item.tipoAnimal}</p>
                    <p class="paragrafo-card">${item.tempoUso || "Não informado"}</p>
                    <a href="itens-detalhes.html?id=${item.id}" 
                    class="informacoes-card">Mais detalhes</a>
                </div>
            </div>
        `;
    };

    const lista = document.getElementById("itens-container");
    const filtroNome = document.getElementById("filtro-nome");
    const filtroTipo = document.getElementById("filtro-tipoAnimal");
    const filtroPorte = document.getElementById("filtro-porte");
    const btnLimpar = document.getElementById("btn-limpar");

    let vetorGlobal = []; 

    const replit = "https://dc665461-b486-4aa3-b8bf-6dd536faf3a7-00-jlif411os0dg.riker.replit.dev/";
    const url = replit + "itens";

    const buscar = async () => {
        const resposta = await fetch(url);
        return await resposta.json();
    };

    vetorGlobal = await buscar();
    atualizarLista(vetorGlobal);

    function atualizarLista(vetor) {
        lista.innerHTML = "";
        vetor.forEach(item => {
            const div = document.createElement("div");
            div.classList.add("card-wrapper");
            div.innerHTML = imprimir(item);
            lista.appendChild(div);
        });
    }

    function aplicarFiltros() {
        const nomeTermo = filtroNome.value.toLowerCase();
        const tipoTermo = filtroTipo.value;
        const porteTermo = filtroPorte.value;

        const filtrados = vetorGlobal.filter(item => {
            const matchNome = item.nome.toLowerCase().includes(nomeTermo);
            const matchTipo = tipoTermo === "" || item.tipoAnimal === tipoTermo;
            const matchPorte = porteTermo === "" || item.porte === porteTermo;
            return matchNome && matchTipo && matchPorte;
        });

        atualizarLista(filtrados);
    }

    filtroNome.addEventListener("keyup", aplicarFiltros);
    filtroTipo.addEventListener("change", aplicarFiltros);
    filtroPorte.addEventListener("change", aplicarFiltros);

    btnLimpar.addEventListener("click", () => {
        filtroNome.value = "";
        filtroTipo.value = "";
        filtroPorte.value = "";
        atualizarLista(vetorGlobal);
    });

});
