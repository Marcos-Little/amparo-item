document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://dc665461-b486-4aa3-b8bf-6dd536faf3a7-00-jlif411os0dg.riker.replit.dev/itens";

    const formulario = document.getElementById("formulario-item");
    const itemId = document.getElementById("item-id");
    const botaoForm = document.getElementById("form-btn");
    const lista = document.getElementById("lista-itens");
    const titulo = document.getElementById("titulo-form");

    // 🔹 Carregar Itens do servidor (GET)
    const carregarItens = async () => {
        lista.innerHTML = "";
        try {
            const response = await fetch(API_URL);
            const itens = await response.json();

            if (itens.length === 0) {
                lista.innerHTML = `<tr><td colspan="7" class="empty-message">Nenhum item cadastrado ainda.</td></tr>`;
                return;
            }

            itens.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><img src="${item.fotoItem || 'https://via.placeholder.com/60'}" alt="Foto de ${item.nome}" class="animal-photo"></td>  
                    <td>${item.nome}</td>
                    <td>${item.tipoAnimal || 'N/A'}</td>
                    <td>${item.porte || 'N/A'}</td>
                    <td>${item.tempoUso || 'N/A'}</td> 
                    <td>
                        <div class="actions">
                            <button class="btn-edit" data-id="${item.id}">✏️ Editar</button>
                            <button class="btn-delete" data-id="${item.id}">🗑️ Excluir</button>
                        </div>
                    </td>
                `;
                lista.appendChild(tr);
            });
        } catch (error) {
            console.error("Erro ao carregar itens:", error);
            lista.innerHTML = `<tr><td colspan="7" class="empty-message">Erro ao conectar ao servidor.</td></tr>`;
        }
    };

    // 🔹 Resetar formulário
    const resetar = () => {
        formulario.reset();
        itemId.value = '';
        titulo.textContent = 'Cadastrar Novo Item';
        botaoForm.textContent = 'Adicionar Item';
    };

    // 🔹 Enviar formulário (POST ou PUT)
    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = itemId.value;
        const nome = document.getElementById("nome").value;
        const tipoAnimal = document.getElementById("tipoAnimal").value;
        const porte = document.getElementById("porte").value;
        const tempoUso = document.getElementById("tempoUso").value;
        const descricao = document.getElementById("descricao").value;
        const fotoInput = document.getElementById("foto").files[0];

        const reader = new FileReader();
        reader.onloadend = async () => {
            const fotoBase64 = reader.result || "";

            const novoItem = {
                nome,
                tipoAnimal,
                porte,
                tempoUso,
                descricao,
                fotoItem: fotoBase64
            };

            try {
                if (id) {
                    // 🔹 Atualizar item (PUT)
                    await fetch(`${API_URL}/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(novoItem)
                    });
                } else {
                    // 🔹 Criar item (POST)
                    await fetch(API_URL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(novoItem)
                    });
                }

                resetar();
                carregarItens();
            } catch (error) {
                console.error("Erro ao salvar item:", error);
                alert("Erro ao enviar os dados para o servidor!");
            }
        };

        if (fotoInput) reader.readAsDataURL(fotoInput);
        else reader.onloadend();
    });

    // 🔹 Botões de editar e excluir
    lista.addEventListener("click", async (e) => {
        const target = e.target;
        const editButton = target.closest('.btn-edit');
        const deleteButton = target.closest('.btn-delete');

        // 🔸 Editar item
        if (editButton) {
            const id = editButton.getAttribute('data-id');
            try {
                const response = await fetch(`${API_URL}/${id}`);
                const item = await response.json();

                itemId.value = item.id;
                document.getElementById("nome").value = item.nome;
                document.getElementById("tipoAnimal").value = item.tipoAnimal;
                document.getElementById("porte").value = item.porte;
                document.getElementById("tempoUso").value = item.tempoUso;
                document.getElementById("descricao").value = item.descricao;

                titulo.textContent = 'Editar Item';
                botaoForm.textContent = 'Salvar Alterações';
                window.scrollTo(0, 0);
            } catch (error) {
                console.error("Erro ao editar item:", error);
            }
        }

        // 🔸 Excluir item
        if (deleteButton) {
            const id = deleteButton.getAttribute('data-id');
            if (confirm('Tem certeza que deseja excluir este item?')) {
                try {
                    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
                    carregarItens();
                } catch (error) {
                    console.error("Erro ao excluir item:", error);
                    alert("Erro ao excluir o item no servidor!");
                }
            }
        }
    });

    carregarItens();
});
