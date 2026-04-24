const state = {
  token: localStorage.getItem("token") || "",
  user: null,
  instituicoes: [],
  empresas: [],
  alunos: [],
  professores: [],
  vantagensPorEmpresa: new Map(),
};

const DEFAULT_RENDER_API = "https://lab-final-projeto-de-software.onrender.com";
const API_BASE_URL =
  window.API_BASE_URL ||
  localStorage.getItem("apiBaseUrl") ||
  (window.location.hostname.includes("vercel.app") ? DEFAULT_RENDER_API : "");

const el = {
  loginForm: document.getElementById("loginForm"),
  loginMsg: document.getElementById("loginMsg"),
  authSummary: document.getElementById("authSummary"),
  logoutBtn: document.getElementById("logoutBtn"),

  alunoForm: document.getElementById("alunoForm"),
  empresaForm: document.getElementById("empresaForm"),
  alunoMsg: document.getElementById("alunoMsg"),
  empresaMsg: document.getElementById("empresaMsg"),
  extratoResumo: document.getElementById("extratoResumo"),

  instituicoesAluno: document.getElementById("instituicoesAluno"),

  alunosCount: document.getElementById("alunosCount"),
  professoresCount: document.getElementById("professoresCount"),
  empresasCount: document.getElementById("empresasCount"),
  vantagensCount: document.getElementById("vantagensCount"),

  alunosBody: document.getElementById("alunosBody"),
  professoresBody: document.getElementById("professoresBody"),
  empresasBody: document.getElementById("empresasBody"),
  catalogoBody: document.getElementById("catalogoBody"),

  professorActions: document.getElementById("professorActions"),
  alunoActions: document.getElementById("alunoActions"),
  empresaActions: document.getElementById("empresaActions"),

  distribuicaoForm: document.getElementById("distribuicaoForm"),
  professorExtratoForm: document.getElementById("professorExtratoForm"),
  saldoGeralBtn: document.getElementById("saldoGeralBtn"),
  saldoProfessorBtn: document.getElementById("saldoProfessorBtn"),
  msgProfessorActions: document.getElementById("msgProfessorActions"),

  extratoAlunoForm: document.getElementById("extratoAlunoForm"),
  resgateForm: document.getElementById("resgateForm"),
  msgAlunoActions: document.getElementById("msgAlunoActions"),

  vantagemForm: document.getElementById("vantagemForm"),
  msgEmpresaActions: document.getElementById("msgEmpresaActions"),

  distribProfessor: document.getElementById("distribProfessor"),
  distribAluno: document.getElementById("distribAluno"),
  saldoProfessorSelect: document.getElementById("saldoProfessorSelect"),

  extratoAlunoId: document.getElementById("extratoAlunoId"),
  extratoProfessorId: document.getElementById("extratoProfessorId"),
  resgateAlunoId: document.getElementById("resgateAlunoId"),

  vantagemEmpresa: document.getElementById("vantagemEmpresa"),
  resgateEmpresa: document.getElementById("resgateEmpresa"),
  resgateVantagem: document.getElementById("resgateVantagem"),

  transacoesBody: document.getElementById("transacoesBody"),
  resgatesBody: document.getElementById("resgatesBody"),
};

function setMessage(target, message, kind = "ok") {
  target.className = `msg ${kind}`;
  target.textContent = message;
}

function clearMessage(target) {
  target.className = "msg";
  target.textContent = "";
}

function option(value, text) {
  const item = document.createElement("option");
  item.value = value;
  item.textContent = text;
  return item;
}

function resetSelect(select, placeholder = "Selecione") {
  select.innerHTML = "";
  select.appendChild(option("", placeholder));
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("pt-BR");
}

function formatMoney(value) {
  if (value === null || value === undefined) return "-";
  return Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function api(path, { method = "GET", body = null, auth = true } = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const headers = { "Content-Type": "application/json" };
  if (auth && state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    let detail = `Falha ${response.status}`;
    try {
      const data = await response.json();
      detail = data.error || data.message || JSON.stringify(data);
    } catch (error) {
      const txt = await response.text();
      if (txt) detail = txt;
    }
    throw new Error(detail);
  }

  if (response.status === 204) return null;
  return response.json();
}

function applyRoleVisibility() {
  const role = state.user?.papel || "";
  el.professorActions.classList.toggle("hidden", role !== "PROFESSOR");
  el.alunoActions.classList.toggle("hidden", role !== "ALUNO");
  el.empresaActions.classList.toggle("hidden", role !== "EMPRESA");

  if (!role) {
    el.authSummary.textContent = "Sem sessao ativa.";
    return;
  }

  el.authSummary.textContent = `${state.user.nome} (${state.user.papel}) - ${state.user.email}`;
}

function fillIdentityHints() {
  if (!state.user) return;
  const id = state.user.id;
  if (state.user.papel === "PROFESSOR") {
    el.extratoProfessorId.value = id;
    el.distribProfessor.value = id;
    el.saldoProfessorSelect.value = id;
  }
  if (state.user.papel === "ALUNO") {
    el.extratoAlunoId.value = id;
    el.resgateAlunoId.value = id;
  }
  if (state.user.papel === "EMPRESA") {
    el.vantagemEmpresa.value = id;
    el.resgateEmpresa.value = id;
  }
}

async function loadInstituicoes() {
  state.instituicoes = await api("/api/instituicoes", { auth: false });
  resetSelect(el.instituicoesAluno, "Instituicao");
  for (const item of state.instituicoes) {
    const label = `${item.sigla} - ${item.nome}`;
    el.instituicoesAluno.appendChild(option(item.id, label));
  }
}

async function loadPublicCards() {
  const useAuth = Boolean(state.token);
  const [alunos, professores, empresas] = await Promise.all([
    api("/api/alunos", { auth: useAuth }).catch(() => []),
    api("/api/professores", { auth: useAuth }).catch(() => []),
    api("/api/empresas", { auth: useAuth }).catch(() => []),
  ]);

  state.alunos = alunos;
  state.professores = professores;
  state.empresas = empresas;

  let totalVantagens = 0;
  for (const e of empresas) totalVantagens += (e.vantagens || []).length;

  el.alunosCount.textContent = alunos.length;
  el.professoresCount.textContent = professores.length;
  el.empresasCount.textContent = empresas.length;
  el.vantagensCount.textContent = totalVantagens;

  el.alunosBody.innerHTML = alunos
    .slice(0, 8)
    .map((a) => `<tr><td>${a.nome}</td><td>${a.email}</td><td>${a.curso}</td><td>${a.instituicaoSigla || "-"}</td></tr>`)
    .join("");

  el.professoresBody.innerHTML = professores
    .slice(0, 8)
    .map((p) => `<tr><td>${p.nome}</td><td>${p.email}</td><td>${p.departamento}</td><td>${formatMoney(p.saldoAtual)}</td></tr>`)
    .join("");

  el.empresasBody.innerHTML = empresas
    .slice(0, 8)
    .map((e) => `<tr><td>${e.nomeFantasia}</td><td>${e.email}</td><td>${(e.vantagens || []).length}</td></tr>`)
    .join("");

  renderCatalogoVantagens();

  fillEntitySelectors();
}

function renderCatalogoVantagens() {
  const linhas = [];
  for (const empresa of state.empresas) {
    const vantagens = empresa.vantagens || [];
    for (const vantagem of vantagens) {
      linhas.push(`<tr>
        <td>${empresa.nomeFantasia || empresa.nome || "-"}</td>
        <td>${vantagem.descricao || "-"}</td>
        <td>${formatMoney(vantagem.custoMoedas)}</td>
        <td>${vantagem.fotoUrl ? `<a href="${vantagem.fotoUrl}" target="_blank" rel="noopener noreferrer">Ver foto</a>` : "-"}</td>
        <td>${vantagem.ativa ? "Ativa" : "Inativa"}</td>
      </tr>`);
    }
  }

  if (!linhas.length) {
    el.catalogoBody.innerHTML = "<tr><td colspan='5'>Nenhuma vantagem cadastrada.</td></tr>";
    return;
  }

  el.catalogoBody.innerHTML = linhas.join("");
}

function fillEntitySelectors() {
  const selects = [el.distribAluno, el.extratoAlunoId, el.resgateAlunoId];
  for (const select of selects) {
    resetSelect(select, "Aluno");
    for (const aluno of state.alunos) select.appendChild(option(aluno.id, `${aluno.nome} (${aluno.email})`));
  }

  const professorSelects = [el.distribProfessor, el.extratoProfessorId, el.saldoProfessorSelect];
  for (const select of professorSelects) {
    resetSelect(select, "Professor");
    for (const professor of state.professores) select.appendChild(option(professor.id, `${professor.nome} (${professor.email})`));
  }

  const empresaSelects = [el.vantagemEmpresa, el.resgateEmpresa];
  for (const select of empresaSelects) {
    resetSelect(select, "Empresa");
    for (const empresa of state.empresas) select.appendChild(option(empresa.id, `${empresa.nomeFantasia}`));
  }

  fillIdentityHints();
}

async function loadVantagensEmpresa(empresaId) {
  if (!empresaId) {
    resetSelect(el.resgateVantagem, "Vantagem");
    return;
  }

  if (!state.token) {
    setMessage(el.msgAlunoActions, "Faca login para carregar vantagens da empresa.", "err");
    return;
  }

  if (!state.vantagensPorEmpresa.has(empresaId)) {
    const vantagens = await api(`/api/empresas/${empresaId}/vantagens`);
    state.vantagensPorEmpresa.set(empresaId, vantagens);
  }

  const vantagens = state.vantagensPorEmpresa.get(empresaId) || [];
  resetSelect(el.resgateVantagem, "Vantagem");
  for (const v of vantagens) {
    el.resgateVantagem.appendChild(option(v.id, `${v.descricao} - ${formatMoney(v.custoMoedas)} moedas`));
  }
}

function renderTransacoes(items) {
  if (!items || !items.length) {
    el.transacoesBody.innerHTML = "<tr><td colspan='6'>Nenhuma transacao encontrada.</td></tr>";
    return;
  }
  el.transacoesBody.innerHTML = items
    .map((t) => `<tr><td>${formatDate(t.dataHora)}</td><td>${t.remetenteNome || "-"}</td><td>${t.destinatarioNome || "-"}</td><td>${formatMoney(t.valor)}</td><td>${t.mensagem}</td><td>${t.id}</td></tr>`)
    .join("");
}

function renderExtratoResumo(resumo) {
  if (!resumo || !el.extratoResumo) return;
  el.extratoResumo.textContent = `${resumo.perfil}: ${resumo.usuarioNome} | Total no periodo: ${formatMoney(resumo.totalMoedasPeriodo)} moedas | Saldo atual: ${formatMoney(resumo.saldoAtual)} moedas`;
}

function addResgateRow(item) {
  const row = document.createElement("tr");
  row.innerHTML = `<td>${formatDate(item.dataHora)}</td><td>${item.codigoUnico}</td><td>${item.alunoId}</td><td>${item.vantagemId}</td><td>${formatMoney(item.valorDebitado)}</td>`;
  el.resgatesBody.prepend(row);
}

el.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage(el.loginMsg);
  try {
    const payload = {
      email: document.getElementById("loginEmail").value,
      senha: document.getElementById("loginSenha").value,
    };
    const auth = await api("/api/auth/login", { method: "POST", body: payload, auth: false });
    state.token = auth.token;
    state.user = auth;
    localStorage.setItem("token", auth.token);
    localStorage.setItem("user", JSON.stringify(auth));
    applyRoleVisibility();
    await loadPublicCards();
    setMessage(el.loginMsg, "Login realizado com sucesso.");
  } catch (error) {
    setMessage(el.loginMsg, error.message, "err");
  }
});

el.logoutBtn.addEventListener("click", () => {
  state.token = "";
  state.user = null;
  state.vantagensPorEmpresa.clear();
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  applyRoleVisibility();
  loadPublicCards();
  setMessage(el.loginMsg, "Sessao encerrada.");
});

el.alunoForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage(el.alunoMsg);
  try {
    const payload = {
      nome: document.getElementById("alunoNome").value,
      email: document.getElementById("alunoEmail").value,
      senha: document.getElementById("alunoSenha").value,
      cpf: document.getElementById("alunoCpf").value,
      rg: document.getElementById("alunoRg").value,
      endereco: document.getElementById("alunoEndereco").value,
      curso: document.getElementById("alunoCurso").value,
      instituicaoId: el.instituicoesAluno.value,
    };
    await api("/api/alunos", { method: "POST", body: payload, auth: false });
    event.target.reset();
    await loadPublicCards();
    setMessage(el.alunoMsg, "Aluno cadastrado com sucesso.");
  } catch (error) {
    setMessage(el.alunoMsg, error.message, "err");
  }
});

el.empresaForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage(el.empresaMsg);
  try {
    const payload = {
      nome: document.getElementById("empresaNome").value,
      email: document.getElementById("empresaEmail").value,
      senha: document.getElementById("empresaSenha").value,
      nomeFantasia: document.getElementById("empresaFantasia").value,
    };
    await api("/api/empresas", { method: "POST", body: payload, auth: false });
    event.target.reset();
    await loadPublicCards();
    setMessage(el.empresaMsg, "Empresa cadastrada com sucesso.");
  } catch (error) {
    setMessage(el.empresaMsg, error.message, "err");
  }
});

el.distribuicaoForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage(el.msgProfessorActions);
  try {
    const payload = {
      professorId: el.distribProfessor.value,
      alunoId: el.distribAluno.value,
      valor: Number(document.getElementById("distribValor").value),
      mensagem: document.getElementById("distribMensagem").value,
    };
    const tx = await api("/api/transacoes/distribuicao", { method: "POST", body: payload });
    renderTransacoes([tx]);
    setMessage(el.msgProfessorActions, "Distribuicao registrada com sucesso.");
    await loadPublicCards();
  } catch (error) {
    setMessage(el.msgProfessorActions, error.message, "err");
  }
});

el.professorExtratoForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage(el.msgProfessorActions);
  try {
    const id = el.extratoProfessorId.value;
    const inicio = document.getElementById("profDataInicio").value;
    const fim = document.getElementById("profDataFim").value;
    const query = new URLSearchParams();
    if (inicio) query.append("dataInicio", inicio);
    if (fim) query.append("dataFim", fim);
    const result = await api(`/api/extratos/professores/${id}/resumo?${query.toString()}`);
    renderTransacoes(result.transacoes);
    renderExtratoResumo(result);
    setMessage(el.msgProfessorActions, "Extrato carregado.");
  } catch (error) {
    setMessage(el.msgProfessorActions, error.message, "err");
  }
});

el.saldoGeralBtn.addEventListener("click", async () => {
  clearMessage(el.msgProfessorActions);
  try {
    const result = await api("/api/saldo-semestral/aplicar", { method: "POST" });
    setMessage(el.msgProfessorActions, `Recarga aplicada para ${result.length} professores.`);
    await loadPublicCards();
  } catch (error) {
    setMessage(el.msgProfessorActions, error.message, "err");
  }
});

el.saldoProfessorBtn.addEventListener("click", async () => {
  clearMessage(el.msgProfessorActions);
  try {
    const professorId = el.saldoProfessorSelect.value;
    const result = await api(`/api/saldo-semestral/professor/${professorId}`, { method: "POST" });
    setMessage(el.msgProfessorActions, `Recarga aplicada: ${result.professorNome} agora possui ${formatMoney(result.saldoAtual)} moedas.`);
    await loadPublicCards();
  } catch (error) {
    setMessage(el.msgProfessorActions, error.message, "err");
  }
});

el.extratoAlunoForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage(el.msgAlunoActions);
  try {
    const id = el.extratoAlunoId.value;
    const inicio = document.getElementById("alunoDataInicio").value;
    const fim = document.getElementById("alunoDataFim").value;
    const query = new URLSearchParams();
    if (inicio) query.append("dataInicio", inicio);
    if (fim) query.append("dataFim", fim);
    const result = await api(`/api/extratos/alunos/${id}/resumo?${query.toString()}`);
    renderTransacoes(result.transacoes);
    renderExtratoResumo(result);
    setMessage(el.msgAlunoActions, "Extrato do aluno carregado.");
  } catch (error) {
    setMessage(el.msgAlunoActions, error.message, "err");
  }
});

el.resgateEmpresa.addEventListener("change", async () => {
  clearMessage(el.msgAlunoActions);
  try {
    await loadVantagensEmpresa(el.resgateEmpresa.value);
  } catch (error) {
    setMessage(el.msgAlunoActions, error.message, "err");
  }
});

el.resgateForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage(el.msgAlunoActions);
  try {
    const payload = {
      alunoId: el.resgateAlunoId.value,
      vantagemId: el.resgateVantagem.value,
    };
    const result = await api("/api/resgates", { method: "POST", body: payload });
    addResgateRow(result);
    const detalheQr = result.qrCodeUrl ? ` | QR Code: ${result.qrCodeUrl}` : "";
    setMessage(el.msgAlunoActions, `Resgate concluido. Codigo unico: ${result.codigoUnico}${detalheQr}`);
    await loadPublicCards();
  } catch (error) {
    setMessage(el.msgAlunoActions, error.message, "err");
  }
});

el.vantagemForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage(el.msgEmpresaActions);
  try {
    const empresaId = el.vantagemEmpresa.value;
    const payload = {
      descricao: document.getElementById("vantagemDescricao").value,
      fotoUrl: document.getElementById("vantagemFoto").value,
      custoMoedas: Number(document.getElementById("vantagemCusto").value),
    };
    await api(`/api/empresas/${empresaId}/vantagens`, { method: "POST", body: payload });
    event.target.reset();
    state.vantagensPorEmpresa.delete(empresaId);
    await loadPublicCards();
    setMessage(el.msgEmpresaActions, "Vantagem cadastrada com sucesso.");
  } catch (error) {
    setMessage(el.msgEmpresaActions, error.message, "err");
  }
});

async function restoreSession() {
  const raw = localStorage.getItem("user");
  if (!raw || !state.token) {
    applyRoleVisibility();
    return;
  }

  try {
    state.user = JSON.parse(raw);
    applyRoleVisibility();
    await loadPublicCards();
  } catch {
    localStorage.removeItem("user");
  }
}

async function bootstrap() {
  await loadInstituicoes();
  await loadPublicCards();
  await restoreSession();
}

bootstrap().catch((error) => {
  setMessage(el.loginMsg, `Erro ao carregar tela: ${error.message}`, "err");
});
