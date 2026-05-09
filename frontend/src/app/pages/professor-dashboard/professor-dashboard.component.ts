import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import {
  ExtratoResumoResponse, AlunoResponse,
  SaldoSemestralResponse
} from '../../models/usuario.model';

@Component({
  selector: 'app-professor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <header class="dash-header">
        <h2>Painel do Professor</h2>
        <div class="header-info">
          <span class="user-name">{{ userName }}</span>
          <button class="btn btn-sm btn-logout" (click)="logout()">Sair</button>
        </div>
      </header>

      <div class="tabs">
        <button [class.active]="tab === 'distribuir'" (click)="tab = 'distribuir'; carregarAlunos()">Distribuir Moedas</button>
        <button [class.active]="tab === 'extrato'" (click)="tab = 'extrato'; carregarExtrato()">Extrato</button>
        <button [class.active]="tab === 'recarga'" (click)="tab = 'recarga'">Recarga Semestral</button>
      </div>

      <!-- DISTRIBUIR MOEDAS -->
      <div *ngIf="tab === 'distribuir'" class="tab-content">
        <div *ngIf="resumo" class="saldo-card">
          <h3>Saldo Disponível</h3>
          <span class="saldo">{{ resumo.saldoAtual | number:'1.2-2' }} moedas</span>
        </div>

        <div *ngIf="distErro" class="alert alert-danger">{{ distErro }}</div>
        <div *ngIf="distSucesso" class="alert alert-success">{{ distSucesso }}</div>

        <form (ngSubmit)="distribuir()" class="dist-form">
          <div class="form-group">
            <label>Aluno destinatário</label>
            <select [(ngModel)]="distAlunoId" name="distAlunoId" required>
              <option value="">Selecione o aluno...</option>
              <option *ngFor="let a of alunos" [value]="a.id">{{ a.nome }} ({{ a.email }})</option>
            </select>
          </div>
          <div class="form-group">
            <label>Valor (moedas)</label>
            <input type="number" [(ngModel)]="distValor" name="distValor" required min="0.01" step="0.01" placeholder="Ex: 50">
          </div>
          <div class="form-group">
            <label>Mensagem (obrigatória)</label>
            <textarea [(ngModel)]="distMensagem" name="distMensagem" required rows="3" placeholder="Justificativa do reconhecimento..."></textarea>
          </div>
          <button type="submit" [disabled]="distLoading" class="btn btn-primary">
            {{ distLoading ? 'Enviando...' : 'Enviar Moedas' }}
          </button>
        </form>
      </div>

      <!-- EXTRATO -->
      <div *ngIf="tab === 'extrato'" class="tab-content">
        <div class="saldo-card" *ngIf="resumo">
          <h3>Saldo Atual</h3>
          <span class="saldo">{{ resumo.saldoAtual | number:'1.2-2' }} moedas</span>
        </div>

        <div class="filtro">
          <label>De: <input type="date" [(ngModel)]="filtroInicio" name="filtroInicio"></label>
          <label>Até: <input type="date" [(ngModel)]="filtroFim" name="filtroFim"></label>
          <button class="btn btn-sm" (click)="carregarExtrato()">Filtrar</button>
        </div>

        <table *ngIf="resumo && resumo.transacoes.length > 0" class="data-table">
          <thead>
            <tr><th>Data</th><th>Destinatário</th><th>Valor</th><th>Mensagem</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of resumo.transacoes">
              <td>{{ t.dataHora | date:'dd/MM/yyyy HH:mm' }}</td>
              <td>{{ t.destinatarioNome }}</td>
              <td class="negativo">-{{ t.valor | number:'1.2-2' }}</td>
              <td>{{ t.mensagem }}</td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="resumo && resumo.transacoes.length === 0" class="empty">Nenhuma transação encontrada.</p>
      </div>

      <!-- RECARGA SEMESTRAL -->
      <div *ngIf="tab === 'recarga'" class="tab-content">
        <div *ngIf="recargaErro" class="alert alert-danger">{{ recargaErro }}</div>
        <div *ngIf="recargaResp" class="alert alert-success">
          <p>Recarga aplicada com sucesso!</p>
          <p>Saldo anterior: {{ recargaResp.saldoAnterior | number:'1.2-2' }}</p>
          <p>Saldo atual: {{ recargaResp.saldoAtual | number:'1.2-2' }}</p>
        </div>
        <p>A cada semestre, 1.000 moedas são adicionadas ao seu saldo. O saldo é acumulável.</p>
        <button class="btn btn-primary" (click)="aplicarRecarga()" [disabled]="recargaLoading">
          {{ recargaLoading ? 'Aplicando...' : 'Aplicar Recarga Semestral' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { max-width: 900px; margin: 0 auto; padding: 1rem; }
    .dash-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }
    .header-info { display: flex; align-items: center; gap: 1rem; }
    .user-name { font-weight: 600; color: #2d3748; }
    .tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
    .tabs button { padding: 0.5rem 1rem; border: 1px solid #e2e8f0; border-radius: 4px; background: #fff; cursor: pointer; }
    .tabs button.active { background: #38a169; color: #fff; border-color: #38a169; }
    .tab-content { background: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
    .saldo-card { text-align: center; background: #f0fff4; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
    .saldo-card h3 { margin: 0; color: #276749; }
    .saldo { font-size: 2rem; font-weight: 700; color: #276749; }
    .dist-form { max-width: 500px; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.3rem; font-weight: 600; color: #4a5568; }
    .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.6rem; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 1rem; box-sizing: border-box; }
    .filtro { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; }
    .filtro label { display: flex; align-items: center; gap: 0.3rem; }
    .filtro input { padding: 0.3rem; border: 1px solid #e2e8f0; border-radius: 4px; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 0.6rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
    .data-table th { background: #f7fafc; font-weight: 600; }
    .negativo { color: #e53e3e; }
    .empty { color: #a0aec0; text-align: center; padding: 2rem; }
    .alert-danger { background: #fed7d7; color: #c53030; padding: 0.7rem; border-radius: 4px; margin-bottom: 1rem; }
    .alert-success { background: #c6f6d5; color: #276749; padding: 0.7rem; border-radius: 4px; margin-bottom: 1rem; }
    .btn { padding: 0.5rem 1.2rem; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; background: #edf2f7; }
    .btn-sm { font-size: 0.9rem; padding: 0.4rem 1rem; }
    .btn-primary { background: #38a169; color: #fff; }
    .btn-primary:hover { background: #2f855a; }
    .btn-primary:disabled { background: #a0aec0; }
    .btn-logout { background: #e53e3e; color: #fff; }
    .btn-logout:hover { background: #c53030; }
  `]
})
export class ProfessorDashboardComponent implements OnInit {
  tab = 'distribuir';
  userName = '';
  userId = '';
  resumo: ExtratoResumoResponse | null = null;
  filtroInicio = '';
  filtroFim = '';

  alunos: AlunoResponse[] = [];
  distAlunoId = '';
  distValor: number | null = null;
  distMensagem = '';
  distErro = '';
  distSucesso = '';
  distLoading = false;

  recargaResp: SaldoSemestralResponse | null = null;
  recargaErro = '';
  recargaLoading = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId() || '';
    this.authService.currentUser$.subscribe(u => this.userName = u?.nome || '');
    this.carregarExtrato();
    this.carregarAlunos();
  }

  carregarExtrato(): void {
    this.apiService.extratoProfessorResumo(this.userId, this.filtroInicio || undefined, this.filtroFim || undefined).subscribe({
      next: (data) => this.resumo = data,
      error: () => {}
    });
  }

  carregarAlunos(): void {
    this.alunos = [];
    this.apiService.listarAlunos().subscribe({
      next: (data) => this.alunos = data,
      error: () => {}
    });
  }

  distribuir(): void {
    if (!this.distAlunoId || !this.distValor || !this.distMensagem.trim()) {
      this.distErro = 'Preencha todos os campos. A mensagem é obrigatória.';
      return;
    }
    this.distLoading = true;
    this.distErro = '';
    this.distSucesso = '';
    this.apiService.distribuirMoedas({
      professorId: this.userId,
      alunoId: this.distAlunoId,
      valor: this.distValor,
      mensagem: this.distMensagem
    }).subscribe({
      next: (data) => {
        this.distLoading = false;
        this.distSucesso = `Moedas enviadas com sucesso para ${data.destinatarioNome}!`;
        this.distAlunoId = '';
        this.distValor = null;
        this.distMensagem = '';
        this.carregarExtrato();
      },
      error: (err) => {
        this.distLoading = false;
        this.distErro = err.error?.error || 'Erro ao distribuir moedas';
      }
    });
  }

  aplicarRecarga(): void {
    this.recargaLoading = true;
    this.recargaErro = '';
    this.recargaResp = null;
    this.apiService.aplicarRecargaProfessor(this.userId).subscribe({
      next: (data) => {
        this.recargaLoading = false;
        this.recargaResp = data;
        this.carregarExtrato();
      },
      error: (err) => {
        this.recargaLoading = false;
        this.recargaErro = err.error?.error || 'Erro ao aplicar recarga';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
