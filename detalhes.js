document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = "https://dc665461-b486-4aa3-b8bf-6dd536faf3a7-00-jlif411os0dg.riker.replit.dev/itens";

    // 🔹 Função para pegar o ID da URL
    const pegarId = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    };

    // 🔹 Função para buscar item pelo ID (GET /itens/:id)
    const buscarItemPorId = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) throw new Error("Item não encontrado no servidor.");
            const item = await response.json();
            return item;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    // 🔹 Exibir mensagem de erro na tela
    const showError = (message) => {
        const container = document.getElementById('detalhe-container');
        if (container) {
            container.innerHTML = `<h1 style="text-align: center;">${message}</h1>`;
        }
    };

    // 🔹 Função principal para carregar detalhes do item
    const carregarDetalhes = async () => {
        const itemId = pegarId();

        if (!itemId) {
            showError("ID do item não fornecido.");
            return;
        }

        const item = await buscarItemPorId(itemId);
        if (!item) {
            showError("Item não encontrado.");
            return;
        }

        // Preenche os dados no HTML
        document.getElementById('nome-item').textContent = item.nome;
        document.getElementById('item-foto').src = item.fotoItem || 'https://via.placeholder.com/400';
        document.getElementById('tempo').textContent = item.tempoUso || 'N/D';
        document.getElementById('animal').textContent = item.tipoAnimal || 'N/D';
        document.getElementById('porte').textContent = item.porte || 'N/D';
        document.getElementById('item-descricao').textContent = item.descricao || 'Nenhuma descrição disponível.';

        // Botão de solicitação
        const solicitarButton = document.querySelector('.solicitar-item');
        if (solicitarButton) {
            solicitarButton.addEventListener('click', (e) => {
                e.preventDefault();
                alert("Sua solicitação foi enviada para o anunciante!");
                window.location.href = 'index.html';
            });
        }
    };

    carregarDetalhes();
});
