export type PapelUsuario = 'ALUNO' | 'PROFESSOR' | 'EMPRESA';

export interface AuthRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  id: string;
  nome: string;
  email: string;
  papel: PapelUsuario;
  token: string;
}

export interface InstituicaoResponse {
  id: string;
  nome: string;
  sigla: string;
}

export interface AlunoRequest {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  rg: string;
  endereco: string;
  curso: string;
  instituicaoId: string;
}

export interface AlunoResponse {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  rg: string;
  endereco: string;
  curso: string;
  instituicaoId: string;
  instituicaoNome: string;
  instituicaoSigla: string;
}

export interface EmpresaRequest {
  nome: string;
  email: string;
  senha: string;
  nomeFantasia: string;
}

export interface EmpresaResponse {
  id: string;
  nome: string;
  email: string;
  nomeFantasia: string;
  vantagens: VantagemResponse[];
}

export interface ProfessorResponse {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  departamento: string;
  instituicaoId: string;
  instituicaoNome: string;
  instituicaoSigla: string;
  saldoAtual: number;
}

export interface VantagemRequest {
  descricao: string;
  fotoUrl: string;
  custoMoedas: number;
}

export interface VantagemResponse {
  id: string;
  descricao: string;
  fotoUrl: string;
  custoMoedas: number;
  ativa: boolean;
}

export interface DistribuicaoMoedaRequest {
  professorId: string;
  alunoId: string;
  valor: number;
  mensagem: string;
}

export interface TransacaoResponse {
  id: string;
  remetenteId: string;
  remetenteNome: string;
  destinatarioId: string;
  destinatarioNome: string;
  valor: number;
  mensagem: string;
  dataHora: string;
}

export interface ExtratoResumoResponse {
  usuarioId: string;
  usuarioNome: string;
  perfil: string;
  saldoAtual: number;
  totalMoedasPeriodo: number;
  transacoes: TransacaoResponse[];
}

export interface ResgateRequest {
  alunoId: string;
  vantagemId: string;
}

export interface ResgateResponse {
  id: string;
  alunoId: string;
  vantagemId: string;
  codigoUnico: string;
  qrCodeUrl: string;
  dataHora: string;
  valorDebitado: number;
}

export interface SaldoSemestralResponse {
  professorId: string;
  saldoAnterior: number;
  saldoAtual: number;
}
