document.addEventListener("DOMContentLoaded", async () => {
    const API_URL = "https://dc665461-b486-4aa3-b8bf-6dd536faf3a7-00-jlif411os0dg.riker.replit.dev/itens";
    const containerItens = document.getElementById("itens-container");

    // 🔹 Função para buscar itens do servidor (GET)
    const procurarItens = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Erro ao buscar itens no servidor");
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    // 🔹 Função para adicionar exemplos iniciais (caso o servidor esteja vazio)
    const adicionarItensExemplo = async () => {
        const itensExemplo = [
            {
                nome: "Coleira Ajustável",
                tipoAnimal: "Cachorro",
                porte: "Médio",
                tempoUso: "6 meses",
                descricao: "Coleira de nylon ajustável, resistente e confortável.",
                fotoItem: "coleira.webp"
            },
            {
                nome: "Bebedouro",
                tipoAnimal: "Gato",
                porte: "Pequeno",
                tempoUso: "1 ano",
                descricao: "Bebedouro automático com filtro e reservatório de 2 litros.",
                fotoItem: "bebedouro.jpeg"
            }
        ];

        for (const item of itensExemplo) {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=UTF-8" },
                body: JSON.stringify(item)
            });
        }
    };

    // 🔹 Função para carregar e exibir os itens na tela
    const carregarItens = async () => {
        const itens = await procurarItens();
        containerItens.innerHTML = "";

        if (itens.length === 0) {
            containerItens.innerHTML = `<p class="empty-message" style="grid-column: 1 / -1; background-color: var(--card); padding: 20px; border-radius: var(--radius);">Nenhum item cadastrado ainda.</p>`;
            // Se estiver vazio, cria itens exemplo automaticamente
            await adicionarItensExemplo();
            return carregarItens(); // recarrega após inserir os exemplos
        }

        itens.forEach(item => {
            const card = document.createElement("div");
            card.className = "itens-card";

            card.innerHTML = `
                <div class="imagem-card">
                    <img src="${item.fotoItem || 'https://via.placeholder.com/150'}" alt="Foto de ${item.nome}">
                </div>
                <div class="conteudo-card">
                    <div class="titulo-card">
                        <h3>${item.nome}</h3>
                    </div>
                    <p class="paragrafo-card">${item.tipoAnimal}</p>
                    <p class="paragrafo-card">${item.tempoUso}</p>
                    <a href="itens-detalhes.html?id=${item.id}" class="informacoes-card">Mais detalhes</a>
                </div>
            `;
            containerItens.appendChild(card);
        });
    };

    carregarItens();
});
