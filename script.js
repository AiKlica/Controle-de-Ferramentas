import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, update, ref, set, get } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

const firebaseConfig = {
    
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const solicitacao = document.getElementById("form");

iniciarTabela();

function iniciarTabela() {
    const referencia = ref(database, "ControleFerramentas/");

    get(referencia)
        .then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    let coleta = childSnapshot.val();
                    inserirTabela(
                        coleta.DataColeta,
                        coleta.NomeAluno,
                        coleta.NomeProfessor,
                        coleta.Ferramenta,
                        coleta.QuantidadeFerramentas,
                        coleta.Devolvido
                    );
                });
            }
            else {
                console.log("Nenhum dado encontrado no Firebase");
            }
        })
        .catch((error) => {
            console.error("Erro ao obter dados do Firebase:", error);
        })
}

solicitacao.addEventListener("submit", function (event) {
    event.preventDefault();
    const dataHoraAtual = new Date();
    const dia = dataHoraAtual.getDate().toString().padStart(2, '0');
    const mes = (dataHoraAtual.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataHoraAtual.getFullYear();
    const hora = dataHoraAtual.getHours().toString().padStart(2, '0');
    const minuto = dataHoraAtual.getMinutes().toString().padStart(2, '0');
    const segundos = dataHoraAtual.getSeconds().toString().padStart(2, '0');
    const horario_formatado = `${dia}-${mes}-${ano} ${hora}:${minuto}:${segundos}`;

    const nome_aluno = document.getElementById("nomeAluno").value;
    const nome_professor = document.getElementById("nomeProfessor").value;
    const ferramenta = document.getElementById("ferramenta").value;
    const quantidade_ferramenta = document.getElementById("quantidadeFerramenta").value;
    const devolvido = "Não";

    let coleta = {
        NomeAluno: nome_aluno,
        NomeProfessor: nome_professor,
        Ferramenta: ferramenta,
        QuantidadeFerramentas: quantidade_ferramenta,
        DataColeta: horario_formatado,
        DataDevolucao: "",
        Devolvido: devolvido
    }

    if (!nome_aluno || !nome_professor || !ferramenta || !quantidade_ferramenta) {
        console.error("Por favor, preencha todos os campos.");
        return;
    }
    inserirDados(coleta, horario_formatado, ferramenta);
});

function inserirDados(coleta, horario_formatado, ferramenta) {
    const referencia = ref(database, "ControleFerramentas/" + horario_formatado + " (" + ferramenta + ")");
    const msg = document.getElementById("msg-registro");
    set(referencia, coleta)
        .then(() => {
            console.log("Inserção bem sucedida");
            inserirTabela(coleta.DataColeta, coleta.NomeAluno, coleta.NomeProfessor, coleta.Ferramenta, coleta.QuantidadeFerramentas, coleta.Devolvido);
            solicitacao.reset();
            msg.textContent = "Coleta Registrada!";
            setTimeout(() => {
                msg.textContent = "";
            }, 2000);
        })
        .catch((error) => {
            console.log(`Erro ao inserir: ${error}`);
            solicitacao.reset();
            msg.textContent = "Erro! Coleta não registrada";
            setTimeout(() => {
                msg.textContent = "";
            }, 2000);
        });
}

function inserirTabela(horario_formatado, nome_aluno, nome_professor, ferramenta, quantidade_ferramenta, devolvido) {
    const tabela = document.getElementById("tabela").getElementsByTagName('tbody')[0];
    const novaLinha = tabela.insertRow();

    const horario_chave = novaLinha.insertCell(0);
    const celulaNome = novaLinha.insertCell(1);
    const celulaProfessor = novaLinha.insertCell(2);
    const celulaFerramenta = novaLinha.insertCell(3);
    const celulaQuantidade = novaLinha.insertCell(4);
    const celulaDevolvido = novaLinha.insertCell(5);
    const celulaBtn = novaLinha.insertCell(6);

    horario_chave.textContent = horario_formatado;
    celulaNome.textContent = nome_aluno;
    celulaProfessor.textContent = nome_professor;
    celulaFerramenta.textContent = ferramenta;
    celulaQuantidade.textContent = quantidade_ferramenta;
    celulaDevolvido.textContent = devolvido;

    const botao = document.createElement("button");
    botao.style.backgroundColor = "black";
    botao.style.color = "white";
    botao.style.padding = "30px";
    botao.style.border = "none";
    botao.style.cursor = "pointer";
    botao.style.borderRadius = "5px";
    botao.style.transition = "background-color 0.8s ease";
    botao.textContent = "Alterar Devolução";
    botao.addEventListener("mouseover", function () {
        botao.style.backgroundColor = "rgba(23, 159, 23, 0.4)";
    });
    botao.addEventListener("mouseout", function () {
        botao.style.backgroundColor = "black";
    });

    if (celulaDevolvido.textContent === "Não") {
        novaLinha.style.backgroundColor = "rgba(277, 15, 15, 0.5)";
    }
    else if (celulaDevolvido.textContent === "Sim") {
        novaLinha.style.backgroundColor = "rgba(155, 205, 50, 0.5)";
    }

    botao.onclick = function atualizarDados(horario_chave, ferramenta) {
        const referencia = ref(database, "ControleFerramentas/", horario_chave, " (", ferramenta, ")/");
        const dataHoraAtual = new Date();
        const ndia = dataHoraAtual.getDate().toString().padStart(2, '0');
        const nmes = (dataHoraAtual.getMonth() + 1).toString().padStart(2, '0');
        const nano = dataHoraAtual.getFullYear();
        const nhora = dataHoraAtual.getHours().toString().padStart(2, '0');
        const nminuto = dataHoraAtual.getMinutes().toString().padStart(2, '0');
        const nsegundos = dataHoraAtual.getSeconds().toString().padStart(2, '0');
        const nhorario_formatado = `${ndia}-${nmes}-${nano} ${nhora}:${nminuto}:${nsegundos}`;

        update((referencia), {
            DataDevolucao: nhorario_formatado,
            Devolvido: "Sim"
        })
            .then(() => {
                console.log("Dados atualizados com sucesso!");
            })
            .catch((error) => {
                console.error(`Erro ao atualizar ${error}`);
            });
    }
    celulaBtn.appendChild(botao);
}
