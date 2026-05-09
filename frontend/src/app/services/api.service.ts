import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AlunoRequest, AlunoResponse,
  EmpresaRequest, EmpresaResponse,
  InstituicaoResponse,
  VantagemRequest, VantagemResponse,
  DistribuicaoMoedaRequest, TransacaoResponse,
  ExtratoResumoResponse,
  ResgateRequest, ResgateResponse,
  SaldoSemestralResponse,
  ProfessorResponse
} from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // Instituições
  listarInstituicoes(): Observable<InstituicaoResponse[]> {
    return this.http.get<InstituicaoResponse[]>('/api/instituicoes');
  }

  // Alunos
  criarAluno(request: AlunoRequest): Observable<AlunoResponse> {
    return this.http.post<AlunoResponse>('/api/alunos', request);
  }

  listarAlunos(): Observable<AlunoResponse[]> {
    return this.http.get<AlunoResponse[]>('/api/alunos');
  }

  buscarAluno(id: string): Observable<AlunoResponse> {
    return this.http.get<AlunoResponse>(`/api/alunos/${id}`);
  }

  atualizarAluno(id: string, request: AlunoRequest): Observable<AlunoResponse> {
    return this.http.put<AlunoResponse>(`/api/alunos/${id}`, request);
  }

  excluirAluno(id: string): Observable<void> {
    return this.http.delete<void>(`/api/alunos/${id}`);
  }

  // Empresas
  criarEmpresa(request: EmpresaRequest): Observable<EmpresaResponse> {
    return this.http.post<EmpresaResponse>('/api/empresas', request);
  }

  listarEmpresas(): Observable<EmpresaResponse[]> {
    return this.http.get<EmpresaResponse[]>('/api/empresas');
  }

  buscarEmpresa(id: string): Observable<EmpresaResponse> {
    return this.http.get<EmpresaResponse>(`/api/empresas/${id}`);
  }

  atualizarEmpresa(id: string, request: EmpresaRequest): Observable<EmpresaResponse> {
    return this.http.put<EmpresaResponse>(`/api/empresas/${id}`, request);
  }

  excluirEmpresa(id: string): Observable<void> {
    return this.http.delete<void>(`/api/empresas/${id}`);
  }

  // Vantagens
  adicionarVantagem(empresaId: string, request: VantagemRequest): Observable<VantagemResponse> {
    return this.http.post<VantagemResponse>(`/api/empresas/${empresaId}/vantagens`, request);
  }

  listarVantagens(empresaId: string): Observable<VantagemResponse[]> {
    return this.http.get<VantagemResponse[]>(`/api/empresas/${empresaId}/vantagens`);
  }

  // Professores
  listarProfessores(): Observable<ProfessorResponse[]> {
    return this.http.get<ProfessorResponse[]>('/api/professores');
  }

  buscarProfessor(id: string): Observable<ProfessorResponse> {
    return this.http.get<ProfessorResponse>(`/api/professores/${id}`);
  }

  // Transações
  distribuirMoedas(request: DistribuicaoMoedaRequest): Observable<TransacaoResponse> {
    return this.http.post<TransacaoResponse>('/api/transacoes/distribuicao', request);
  }

  // Extratos
  extratoAluno(alunoId: string, dataInicio?: string, dataFim?: string): Observable<TransacaoResponse[]> {
    let params = new HttpParams();
    if (dataInicio) params = params.set('dataInicio', dataInicio);
    if (dataFim) params = params.set('dataFim', dataFim);
    return this.http.get<TransacaoResponse[]>(`/api/extratos/alunos/${alunoId}`, { params });
  }

  extratoAlunoResumo(alunoId: string, dataInicio?: string, dataFim?: string): Observable<ExtratoResumoResponse> {
    let params = new HttpParams();
    if (dataInicio) params = params.set('dataInicio', dataInicio);
    if (dataFim) params = params.set('dataFim', dataFim);
    return this.http.get<ExtratoResumoResponse>(`/api/extratos/alunos/${alunoId}/resumo`, { params });
  }

  extratoProfessor(professorId: string, dataInicio?: string, dataFim?: string): Observable<TransacaoResponse[]> {
    let params = new HttpParams();
    if (dataInicio) params = params.set('dataInicio', dataInicio);
    if (dataFim) params = params.set('dataFim', dataFim);
    return this.http.get<TransacaoResponse[]>(`/api/extratos/professores/${professorId}`, { params });
  }

  extratoProfessorResumo(professorId: string, dataInicio?: string, dataFim?: string): Observable<ExtratoResumoResponse> {
    let params = new HttpParams();
    if (dataInicio) params = params.set('dataInicio', dataInicio);
    if (dataFim) params = params.set('dataFim', dataFim);
    return this.http.get<ExtratoResumoResponse>(`/api/extratos/professores/${professorId}/resumo`, { params });
  }

  // Resgates
  resgatar(request: ResgateRequest): Observable<ResgateResponse> {
    return this.http.post<ResgateResponse>('/api/resgates', request);
  }

  buscarResgate(id: string): Observable<ResgateResponse> {
    return this.http.get<ResgateResponse>(`/api/resgates/${id}`);
  }

  // Saldo Semestral
  aplicarRecargaTodos(): Observable<SaldoSemestralResponse[]> {
    return this.http.post<SaldoSemestralResponse[]>('/api/saldo-semestral/aplicar', {});
  }

  aplicarRecargaProfessor(professorId: string): Observable<SaldoSemestralResponse> {
    return this.http.post<SaldoSemestralResponse>(`/api/saldo-semestral/professor/${professorId}`, {});
  }
}
