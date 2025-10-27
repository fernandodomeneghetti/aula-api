const API_BASE = "http://localhost:3000/api"; // ajuste conforme a porta da API
let token = null;

// Elementos de login
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const loginMsg = document.getElementById("login-msg");

// CRUD elementos
const crudSection = document.getElementById("crud-section");
const logoutBtn = document.getElementById("logout-btn");
const formAluno = document.getElementById("form-aluno");
const tabela = document.getElementById("tabela-alunos");
const inputId = document.getElementById("id");
const inputNome = document.getElementById("nome");
const inputCurso = document.getElementById("curso");

// ==== LOGIN ====
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const credenciais = {
    email: emailInput.value,
    senha: senhaInput.value
  };

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credenciais)
    });

    if (!res.ok) throw new Error("Falha no login");

    const data = await res.json();
    token = data.token;

    if (!token) throw new Error("Token não retornado!");

    // Interface
    loginForm.style.display = "none";
    crudSection.style.display = "block";
    carregarAlunos();

  } catch (err) {
    loginMsg.textContent = "❌ E-mail ou senha inválidos.";
  }
});

// ==== LOGOUT ====
logoutBtn.addEventListener("click", () => {
  token = null;
  loginForm.reset();
  formAluno.reset();
  crudSection.style.display = "none";
  loginForm.style.display = "block";
});

// ==== CRUD ====
async function carregarAlunos() {
  try {
    const res = await fetch(`${API_BASE}/alunos`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Erro ao carregar alunos");

    const alunos = await res.json();

    tabela.innerHTML = alunos.map(a => `
      <tr>
        <td>${a.id}</td>
        <td>${a.nome}</td>
        <td>${a.curso}</td>
        <td>
          <span class="edit-btn" onclick="editarAluno(${a.id}, '${a.nome}', '${a.curso}')">Editar</span> |
          <span class="delete-btn" onclick="excluirAluno(${a.id})">Excluir</span>
        </td>
      </tr>
    `).join("");

  } catch (err) {
    alert("Erro: " + err.message);
  }
}

formAluno.addEventListener("submit", async (e) => {
  e.preventDefault();

  const aluno = { nome: inputNome.value, curso: inputCurso.value };
  const id = inputId.value;

  const method = id ? "PUT" : "POST";
  const url = id ? `${API_BASE}/alunos/${id}` : `${API_BASE}/alunos`;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(aluno)
    });

    if (!res.ok) throw new Error("Erro ao salvar aluno");

    formAluno.reset();
    carregarAlunos();

  } catch (err) {
    alert("Erro: " + err.message);
  }
});

async function excluirAluno(id) {
  if (!confirm("Deseja excluir este aluno?")) return;

  try {
    const res = await fetch(`${API_BASE}/alunos/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Erro ao excluir aluno");
    carregarAlunos();

  } catch (err) {
    alert("Erro: " + err.message);
  }
}

function editarAluno(id, nome, curso) {
  inputId.value = id;
  inputNome.value = nome;
  inputCurso.value = curso;
}
