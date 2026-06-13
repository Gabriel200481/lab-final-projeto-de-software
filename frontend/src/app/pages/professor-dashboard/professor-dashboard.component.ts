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
    .dashboard { min-height: 100vh; background: #F1F5F9; }

    /* ── Header ── */
    .header {
      background: #059669;
      color: #fff;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 0 rgba(0,0,0,0.1), 0 4px 16px rgba(5,150,105,0.25);
    }

    .header-inner {
      max-width: 1120px;
      margin: 0 auto;
      padding: 0 1.75rem;
      height: 64px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-left { display: flex; align-items: center; gap: 0.85rem; }

    .header-icon {
      width: 40px; height: 40px;
      border-radius: 11px;
      background: rgba(255,255,255,0.18);
      border: 1px solid rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center;
      font-weight: 900; font-size: 1.2rem;
    }

    .header-left h1 { font-size: 1.05rem; font-weight: 700; margin: 0; letter-spacing: -0.2px; }
    .header-left p { font-size: 0.78rem; opacity: 0.75; margin: 0.1rem 0 0; }

    .header-right { display: flex; align-items: center; gap: 0.85rem; }

    .saldo-box {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: rgba(255,255,255,0.14);
      border: 1px solid rgba(255,255,255,0.2);
      padding: 0.45rem 0.9rem;
      border-radius: 10px;
    }

    .saldo-icon {
      width: 32px; height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, #F59E0B, #D97706);
      display: flex; align-items: center; justify-content: center;
      font-weight: 900; font-size: 0.9rem;
      box-shadow: 0 2px 6px rgba(245,158,11,0.4);
    }

    .saldo-label { display: block; font-size: 0.68rem; opacity: 0.75; text-transform: uppercase; letter-spacing: 0.5px; }
    .saldo-value { display: block; font-weight: 700; font-size: 1rem; letter-spacing: -0.3px; }

    .btn-logout {
      background: rgba(255,255,255,0.12);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.25);
      padding: 0.4rem 0.95rem;
      border-radius: 8px;
      font-size: 0.83rem;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.15s;
    }
    .btn-logout:hover { background: rgba(255,255,255,0.22); }

    /* ── Content ── */
    .content-area { max-width: 1120px; margin: 0 auto; padding: 1.75rem; }

    /* ── Tabs ── */
    .tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 1.5rem;
      background: #fff;
      padding: 4px;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }

    .tabs button {
      flex: 1;
      padding: 0.65rem 1rem;
      background: transparent;
      border: none;
      border-radius: 9px;
      font-weight: 600;
      font-size: 0.875rem;
      font-family: inherit;
      cursor: pointer;
      color: #64748B;
      transition: all 0.15s;
    }
    .tabs button.active { background: #059669; color: #fff; box-shadow: 0 1px 3px rgba(5,150,105,0.35); }
    .tabs button:not(.active):hover { background: #F8FAFC; color: #059669; }

    /* ── Card ── */
    .card {
      background: #fff;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
    }

    .card h2 { font-size: 1.1rem; font-weight: 700; color: #0F172A; margin: 0 0 0.25rem; }
    .card-subtitle { color: #64748B; font-size: 0.875rem; margin-bottom: 1.5rem; }

    /* ── Form ── */
    .form-group { margin-bottom: 1rem; }

    .form-group label {
      display: block;
      margin-bottom: 0.35rem;
      font-weight: 600;
      font-size: 0.8rem;
      color: #374151;
      letter-spacing: 0.2px;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.7rem 0.9rem;
      border: 1.5px solid #E2E8F0;
      border-radius: 10px;
      font-size: 0.9rem;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
      color: #0F172A;
      font-family: inherit;
      background: #FAFAFA;
    }
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      border-color: #059669;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(5,150,105,0.1);
    }
    .form-group input::placeholder,
    .form-group textarea::placeholder { color: #94A3B8; }

    /* ── Buttons ── */
    .btn-primary {
      padding: 0.75rem 2rem;
      background: #059669;
      color: #fff;
      border: none;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
      box-shadow: 0 1px 2px rgba(5,150,105,0.3);
    }
    .btn-primary:hover:not(:disabled) {
      background: #047857;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(5,150,105,0.35);
    }
    .btn-primary:disabled { background: #94A3B8; cursor: not-allowed; box-shadow: none; }

    .btn-secondary {
      padding: 0.68rem 1.4rem;
      background: #ECFDF5;
      color: #059669;
      border: 1.5px solid #A7F3D0;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.15s;
      align-self: flex-end;
    }
    .btn-secondary:hover { background: #059669; color: #fff; border-color: #059669; }

    /* ── Filter ── */
    .filter-row {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }
    .filter-row .form-group { flex: 1; min-width: 140px; margin-bottom: 0; }

    /* ── Stats ── */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      background: #ECFDF5;
      padding: 1.1rem 1.25rem;
      border-radius: 12px;
      border: 1px solid #A7F3D0;
    }

    .stat-label {
      display: block;
      font-size: 0.72rem;
      color: #059669;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      font-weight: 600;
      margin-bottom: 0.3rem;
    }

    .stat-value { display: block; font-size: 1.4rem; font-weight: 800; color: #047857; letter-spacing: -0.5px; }

    /* ── Table ── */
    .data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }

    .data-table th {
      padding: 0.65rem 0.9rem;
      text-align: left;
      font-weight: 700;
      color: #64748B;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #F1F5F9;
      background: #F8FAFC;
    }

    .data-table td {
      padding: 0.75rem 0.9rem;
      border-bottom: 1px solid #F1F5F9;
      color: #374151;
    }

    .data-table tr:last-child td { border-bottom: none; }
    .data-table tbody tr:hover td { background: #F0FDF4; }

    .empty-state { text-align: center; color: #94A3B8; padding: 2.5rem; font-size: 0.9rem; }

    /* ── Alerts ── */
    .alert { padding: 0.75rem 1rem; border-radius: 10px; margin-bottom: 1rem; font-size: 0.875rem; font-weight: 500; }
    .alert-danger { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }
    .alert-success { background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }

    @media (max-width: 640px) {
      .header-inner { flex-wrap: wrap; height: auto; padding: 0.75rem 1rem; gap: 0.5rem; }
      .header-right { width: 100%; justify-content: space-between; }
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
