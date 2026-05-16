import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { ExtratoResumoResponse, AlunoResponse, SaldoSemestralResponse } from '../../models/usuario.model';

@Component({
  selector: 'app-professor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">

      <!-- Header -->
      <header class="header">
        <div class="header-inner">
          <div class="header-left">
            <div class="header-icon">P</div>
            <div>
              <h1>Painel do Professor</h1>
              <p>Bem-vindo, {{ userName }}</p>
            </div>
          </div>
          <div class="header-right">
            <div class="saldo-box" *ngIf="resumo">
              <div class="saldo-icon">$</div>
              <div>
                <span class="saldo-label">Saldo</span>
                <span class="saldo-value">{{ resumo.saldoAtual }} MC</span>
              </div>
            </div>
            <button class="btn-logout" (click)="logout()">Sair</button>
          </div>
        </div>
      </header>

      <!-- Tabs -->
      <div class="content-area">
        <div class="tabs">
          <button [class.active]="tab==='distribuir'" (click)="tab='distribuir'">Distribuir Moedas</button>
          <button [class.active]="tab==='extrato'" (click)="tab='extrato'">Extrato</button>
          <button [class.active]="tab==='recarga'" (click)="tab='recarga'">Recarga Semestral</button>
        </div>

        <!-- Tab: Distribuir Moedas -->
        <div class="tab-content" *ngIf="tab==='distribuir'">
          <div class="card">
            <h2>Enviar Moedas para Aluno</h2>
            <p class="card-subtitle">Reconheca o merito academico distribuindo moedas</p>

            <div *ngIf="distErro" class="alert alert-danger">{{ distErro }}</div>
            <div *ngIf="distSucesso" class="alert alert-success">{{ distSucesso }}</div>

            <div class="form-group">
              <label>Aluno</label>
              <select [(ngModel)]="distAlunoId">
                <option value="" disabled selected>Selecione o aluno</option>
                <option *ngFor="let a of alunos" [value]="a.id">{{ a.nome }} - {{ a.email }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Quantidade de Moedas</label>
              <input type="number" [(ngModel)]="distValor" placeholder="Ex: 10" min="1">
            </div>

            <div class="form-group">
              <label>Mensagem (obrigatoria)</label>
              <textarea [(ngModel)]="distMensagem" placeholder="Descreva o motivo do reconhecimento" rows="3"></textarea>
            </div>

            <button class="btn-primary" (click)="distribuir()" [disabled]="distLoading">
              {{ distLoading ? 'Enviando...' : 'Enviar Moedas' }}
            </button>
          </div>
        </div>

        <!-- Tab: Extrato -->
        <div class="tab-content" *ngIf="tab==='extrato'">
          <div class="card">
            <h2>Extrato de Transacoes</h2>

            <div class="filter-row">
              <div class="form-group">
                <label>Data Inicio</label>
                <input type="date" [(ngModel)]="filtroInicio">
              </div>
              <div class="form-group">
                <label>Data Fim</label>
                <input type="date" [(ngModel)]="filtroFim">
              </div>
              <button class="btn-secondary" (click)="carregarExtrato()">Filtrar</button>
            </div>

            <div *ngIf="resumo">
              <div class="stats-row">
                <div class="stat-card">
                  <span class="stat-label">Saldo Atual</span>
                  <span class="stat-value">{{ resumo.saldoAtual }} MC</span>
                </div>
                <div class="stat-card">
                  <span class="stat-label">Total no Periodo</span>
                  <span class="stat-value">{{ resumo.totalMoedasPeriodo }} MC</span>
                </div>
              </div>

              <div *ngIf="resumo.transacoes && resumo.transacoes.length > 0">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Valor</th>
                      <th>Destinatario</th>
                      <th>Mensagem</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let t of resumo.transacoes">
                      <td>{{ t.dataHora | date:'dd/MM/yy HH:mm' }}</td>
                      <td>{{ t.valor }} MC</td>
                      <td>{{ t.destinatarioNome || '-' }}</td>
                      <td>{{ t.mensagem || '-' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div *ngIf="!resumo.transacoes || resumo.transacoes.length === 0" class="empty-state">
                Nenhuma transacao encontrada.
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Recarga Semestral -->
        <div class="tab-content" *ngIf="tab==='recarga'">
          <div class="card">
            <h2>Recarga Semestral</h2>
            <p class="card-subtitle">Solicite a recarga de moedas para o semestre atual</p>

            <div *ngIf="recargaErro" class="alert alert-danger">{{ recargaErro }}</div>

            <div *ngIf="recargaResp" class="alert alert-success">
              Recarga aplicada! Saldo anterior: {{ recargaResp.saldoAnterior }} MC.
              Saldo atual: {{ recargaResp.saldoAtual }} MC.
            </div>

            <button class="btn-primary" (click)="aplicarRecarga()" [disabled]="recargaLoading">
              {{ recargaLoading ? 'Aplicando...' : 'Aplicar Recarga' }}
            </button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      background: #f0f4f8;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    }

    /* Header */
    .header {
      background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
      color: #fff;
      padding: 0;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 12px rgba(0,0,0,0.15);
    }

    .header-inner {
      max-width: 1100px;
      margin: 0 auto;
      padding: 1rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 0.9rem;
    }

    .header-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: rgba(255,255,255,0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 1.3rem;
      color: #fff;
    }

    .header-left h1 {
      font-size: 1.15rem;
      font-weight: 700;
      margin: 0;
    }

    .header-left p {
      font-size: 0.82rem;
      opacity: 0.85;
      margin: 0.15rem 0 0;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .saldo-box {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: rgba(255,255,255,0.14);
      padding: 0.5rem 1rem;
      border-radius: 10px;
    }

    .saldo-icon {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f9a825, #ff8f00);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 1rem;
      color: #5d2e00;
    }

    .saldo-label {
      display: block;
      font-size: 0.72rem;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .saldo-value {
      display: block;
      font-weight: 700;
      font-size: 1.05rem;
    }

    .btn-logout {
      background: rgba(255,255,255,0.15);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.3);
      padding: 0.5rem 1.1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-logout:hover { background: rgba(255,255,255,0.25); }

    /* Tabs */
    .content-area {
      max-width: 1100px;
      margin: 0 auto;
      padding: 1.5rem;
    }

    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      background: #fff;
      padding: 0.4rem;
      border-radius: 10px;
      box-shadow: 0 1px 6px rgba(0,0,0,0.06);
    }

    .tabs button {
      flex: 1;
      padding: 0.7rem 1rem;
      background: transparent;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.88rem;
      cursor: pointer;
      color: #4a5568;
      transition: all 0.2s;
    }

    .tabs button.active {
      background: linear-gradient(135deg, #2e7d32, #1b5e20);
      color: #fff;
      box-shadow: 0 2px 8px rgba(46,125,50,0.3);
    }

    .tabs button:not(.active):hover { background: #f7fafc; color: #2e7d32; }

    /* Card */
    .card {
      background: #fff;
      border-radius: 14px;
      padding: 2rem;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }

    .card h2 {
      font-size: 1.15rem;
      font-weight: 700;
      color: #1b5e20;
      margin: 0 0 0.3rem;
    }

    .card-subtitle {
      color: #718096;
      font-size: 0.88rem;
      margin-bottom: 1.5rem;
    }

    /* Form */
    .form-group { margin-bottom: 1rem; }

    .form-group label {
      display: block;
      margin-bottom: 0.35rem;
      font-weight: 600;
      font-size: 0.85rem;
      color: #2d3748;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.7rem 0.9rem;
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      font-size: 0.95rem;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.2s, box-shadow 0.2s;
      color: #2d3748;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      border-color: #2e7d32;
      box-shadow: 0 0 0 3px rgba(46,125,50,0.08);
    }

    /* Buttons */
    .btn-primary {
      padding: 0.75rem 2rem;
      background: linear-gradient(135deg, #2e7d32, #1b5e20);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.1s;
    }
    .btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .btn-primary:disabled { background: #a0aec0; cursor: not-allowed; }

    .btn-secondary {
      padding: 0.7rem 1.5rem;
      background: #f7fafc;
      color: #2e7d32;
      border: 1.5px solid #2e7d32;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      align-self: flex-end;
    }
    .btn-secondary:hover { background: #2e7d32; color: #fff; }

    /* Filter */
    .filter-row {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .filter-row .form-group {
      flex: 1;
      min-width: 140px;
      margin-bottom: 0;
    }

    /* Stats */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
      padding: 1rem 1.25rem;
      border-radius: 10px;
      border-left: 3px solid #2e7d32;
    }

    .stat-label {
      display: block;
      font-size: 0.78rem;
      color: #4a5568;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 0.25rem;
    }

    .stat-value {
      display: block;
      font-size: 1.3rem;
      font-weight: 700;
      color: #1b5e20;
    }

    /* Table */
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.88rem;
    }

    .data-table thead { background: #f7fafc; }

    .data-table th {
      padding: 0.7rem 0.9rem;
      text-align: left;
      font-weight: 600;
      color: #4a5568;
      border-bottom: 2px solid #e2e8f0;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .data-table td {
      padding: 0.7rem 0.9rem;
      border-bottom: 1px solid #edf2f7;
      color: #2d3748;
    }

    .data-table tr:hover { background: #f7fafc; }

    .badge {
      padding: 0.2rem 0.6rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-send { background: #fed7d7; color: #c53030; }
    .badge-recv { background: #c6f6d5; color: #276749; }

    .empty-state {
      text-align: center;
      color: #a0aec0;
      padding: 2rem;
      font-size: 0.95rem;
    }

    /* Alerts */
    .alert {
      padding: 0.75rem 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      font-size: 0.88rem;
    }

    .alert-danger {
      background: #fff5f5;
      color: #c53030;
      border-left: 3px solid #fc8181;
    }

    .alert-success {
      background: #f0fff4;
      color: #276749;
      border-left: 3px solid #68d391;
    }

    @media (max-width: 640px) {
      .header-inner { flex-direction: column; gap: 0.75rem; text-align: center; }
      .header-right { width: 100%; justify-content: center; }
      .tabs { flex-direction: column; }
      .card { padding: 1.25rem; }
      .filter-row { flex-direction: column; }
    }
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
      this.distErro = 'Preencha todos os campos. A mensagem e obrigatoria.';
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
        this.distSucesso = 'Moedas enviadas com sucesso para ' + data.destinatarioNome + '!';
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
