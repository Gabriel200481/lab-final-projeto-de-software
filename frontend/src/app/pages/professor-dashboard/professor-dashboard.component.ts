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
    <div class="shell">

      <!-- TOPBAR -->
      <header class="topbar">
        <div class="brand">
          <div class="coin-logo">
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <circle cx="12" cy="12" r="10" fill="#0D0B06" stroke="#F5C842" stroke-width="1.5"/>
              <text x="12" y="16" text-anchor="middle" font-size="9" font-weight="900" fill="#F5C842" font-family="sans-serif">$</text>
            </svg>
          </div>
          <span class="brand-text">STUDENT PERKS <span>🎓</span></span>
        </div>
        <div class="topbar-right">
          <div class="saldo-chip" *ngIf="resumo">
            <span class="saldo-chip-label">Saldo</span>
            <span class="saldo-chip-val">{{ resumo.saldoAtual | number:'1.0-0' }} MC</span>
          </div>
          <div class="avatar">{{ userName.charAt(0) }}</div>
          <div class="user-info">
            <span class="user-name">{{ userName }}</span>
            <span class="user-role">Professor</span>
          </div>
          <button class="btn-logout" (click)="logout()">Sair</button>
        </div>
      </header>

      <div class="body-row">

        <!-- SIDEBAR -->
        <aside class="sidebar">
          <button class="nav-item" [class.active]="tab==='distribuir'" (click)="tab='distribuir'" title="Home">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Home</span>
          </button>
          <button class="nav-item" [class.active]="tab==='distribuir'" (click)="tab='distribuir'" title="Distribuir">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            <span>Enviar</span>
          </button>
          <button class="nav-item" [class.active]="tab==='extrato'" (click)="tab='extrato'; carregarExtrato()" title="Extrato">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Extrato</span>
          </button>
          <button class="nav-item" [class.active]="tab==='recarga'" (click)="tab='recarga'" title="Recarga">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
            </svg>
            <span>Recarga</span>
          </button>
        </aside>

        <!-- MAIN -->
        <main class="main">

          <!-- TABS -->
          <div class="tabs">
            <button [class.active]="tab==='distribuir'" (click)="tab='distribuir'">Distribuir Moedas</button>
            <button [class.active]="tab==='extrato'"    (click)="tab='extrato'; carregarExtrato()">Extrato</button>
            <button [class.active]="tab==='recarga'"    (click)="tab='recarga'">Recarga Semestral</button>
          </div>

          <!-- ── DISTRIBUIR ── -->
          <div *ngIf="tab==='distribuir'">
            <div class="card">
              <p class="card-title">Enviar Moedas para Aluno</p>
              <p class="card-sub">Reconheça o mérito acadêmico distribuindo moedas</p>

              <div *ngIf="distErro"    class="alert alert-err">{{ distErro }}</div>
              <div *ngIf="distSucesso" class="alert alert-ok">{{ distSucesso }}</div>

              <div class="fg">
                <label>Aluno</label>
                <select [(ngModel)]="distAlunoId">
                  <option value="" disabled selected>Selecione o aluno</option>
                  <option *ngFor="let a of alunos" [value]="a.id">{{ a.nome }} — {{ a.email }}</option>
                </select>
              </div>

              <div class="fg">
                <label>Quantidade de Moedas</label>
                <input type="number" [(ngModel)]="distValor" placeholder="Ex: 10" min="1">
              </div>

              <div class="fg">
                <label>Mensagem (obrigatória)</label>
                <textarea [(ngModel)]="distMensagem" placeholder="Descreva o motivo do reconhecimento" rows="3"></textarea>
              </div>

              <button class="btn-gold" (click)="distribuir()" [disabled]="distLoading">
                {{ distLoading ? 'Enviando...' : 'Enviar Moedas' }}
              </button>
            </div>
          </div>

          <!-- ── EXTRATO ── -->
          <div *ngIf="tab==='extrato'">
            <div class="stats-row" *ngIf="resumo">
              <div class="stat-card">
                <p class="stat-label">Saldo Atual</p>
                <p class="stat-val">{{ resumo.saldoAtual | number:'1.0-0' }} <span class="stat-unit">MC</span></p>
              </div>
              <div class="stat-card">
                <p class="stat-label">Total no Período</p>
                <p class="stat-val">{{ resumo.totalMoedasPeriodo | number:'1.0-0' }} <span class="stat-unit">MC</span></p>
              </div>
            </div>

            <div class="filter-bar">
              <span class="filter-label">Filtrar por data:</span>
              <div class="date-input">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <input type="date" [(ngModel)]="filtroInicio">
              </div>
              <span class="filter-sep">a</span>
              <div class="date-input">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <input type="date" [(ngModel)]="filtroFim">
              </div>
              <button class="btn-filter" (click)="carregarExtrato()">Filtrar</button>
            </div>

            <div class="data-wrap" *ngIf="resumo && resumo.transacoes && resumo.transacoes.length > 0">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Data</th><th>Valor</th><th>Destinatário</th><th>Mensagem</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let t of resumo.transacoes">
                    <td>{{ t.dataHora | date:'dd/MM/yyyy' }}</td>
                    <td class="val-neg">{{ t.valor | number:'1.0-0' }} MC</td>
                    <td>{{ t.destinatarioNome || '—' }}</td>
                    <td class="msg-cell">{{ t.mensagem || '—' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p *ngIf="resumo && (!resumo.transacoes || resumo.transacoes.length === 0)" class="empty">Nenhuma transação encontrada.</p>
          </div>

          <!-- ── RECARGA ── -->
          <div *ngIf="tab==='recarga'">
            <div class="card">
              <p class="card-title">Recarga Semestral</p>
              <p class="card-sub">Adicione +1.000 moedas ao seu saldo do semestre atual</p>

              <div *ngIf="recargaErro" class="alert alert-err">{{ recargaErro }}</div>

              <div *ngIf="recargaResp" class="recarga-result">
                <p>✅ Recarga aplicada com sucesso!</p>
                <p>Saldo anterior: <strong>{{ recargaResp.saldoAnterior | number:'1.0-0' }} MC</strong></p>
                <p>Saldo atual: <strong>{{ recargaResp.saldoAtual | number:'1.0-0' }} MC</strong></p>
              </div>

              <button class="btn-gold" (click)="aplicarRecarga()" [disabled]="recargaLoading">
                {{ recargaLoading ? 'Aplicando...' : 'Aplicar Recarga (+1.000 MC)' }}
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :host { display: block; }

    .shell {
      min-height: 100vh; background: #0D0B06; color: #F0EDE5;
      font-family: 'Segoe UI', system-ui, sans-serif;
      display: flex; flex-direction: column;
    }

    /* TOPBAR */
    .topbar {
      height: 58px; background: #131108; border-bottom: 1px solid #2A2618;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 1.5rem; flex-shrink: 0;
    }
    .brand { display: flex; align-items: center; gap: 0.65rem; }
    .coin-logo {
      width: 34px; height: 34px;
      background: linear-gradient(135deg, #C8961E, #F5C842);
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 14px rgba(245,200,66,0.35);
    }
    .brand-text { font-size: 0.9rem; font-weight: 800; color: #F5C842; letter-spacing: 1.5px; text-transform: uppercase; }

    .topbar-right { display: flex; align-items: center; gap: 0.6rem; }

    .saldo-chip {
      display: flex; flex-direction: column; align-items: flex-end;
      background: rgba(200,150,30,0.08); border: 1px solid #3A3220;
      padding: 0.25rem 0.75rem; border-radius: 8px;
    }
    .saldo-chip-label { font-size: 0.62rem; color: #7A7260; text-transform: uppercase; letter-spacing: 0.5px; }
    .saldo-chip-val   { font-size: 0.88rem; font-weight: 800; color: #F5C842; }

    .avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: linear-gradient(135deg, #C8961E, #F5C842);
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 0.9rem; color: #0D0B06; border: 2px solid #2A2618;
    }
    .user-info { display: flex; flex-direction: column; line-height: 1.2; }
    .user-name { font-size: 0.82rem; font-weight: 600; color: #F0EDE5; }
    .user-role { font-size: 0.68rem; color: #7A7260; }

    .btn-logout {
      padding: 0.3rem 0.8rem;
      background: rgba(239,68,68,0.08); color: #EF4444;
      border: 1px solid rgba(239,68,68,0.2); border-radius: 7px;
      font-size: 0.73rem; font-weight: 600; font-family: inherit;
      cursor: pointer; transition: all 0.15s;
    }
    .btn-logout:hover { background: rgba(239,68,68,0.18); }

    /* BODY */
    .body-row { display: flex; flex: 1; overflow: hidden; }

    /* SIDEBAR */
    .sidebar {
      width: 78px; background: #131108; border-right: 1px solid #2A2618;
      display: flex; flex-direction: column; align-items: center;
      padding-top: 1.25rem; gap: 0.15rem; flex-shrink: 0;
    }
    .nav-item {
      width: 100%; display: flex; flex-direction: column; align-items: center;
      gap: 0.28rem; padding: 0.7rem 0; background: none; border: none;
      border-left: 3px solid transparent; cursor: pointer;
      color: #4A4434; font-size: 0.6rem; font-family: inherit; font-weight: 500;
      letter-spacing: 0.3px; transition: all 0.15s;
    }
    .nav-item:hover { color: #C8961E; background: rgba(200,150,30,0.04); }
    .nav-item.active { color: #F5C842; border-left-color: #F5C842; background: rgba(245,200,66,0.06); }
    .nav-item svg { width: 20px; height: 20px; }

    /* MAIN */
    .main { flex: 1; padding: 1.5rem 1.75rem; overflow-y: auto; }

    /* TABS */
    .tabs { display: flex; gap: 0.5rem; margin-bottom: 1.25rem; }
    .tabs button {
      flex: 1; padding: 0.6rem 0.75rem; background: transparent;
      border: 1.5px solid #2A2618; border-radius: 7px;
      color: #4A4434; font-size: 0.72rem; font-weight: 700; font-family: inherit;
      letter-spacing: 0.6px; text-transform: uppercase; cursor: pointer; transition: all 0.15s;
    }
    .tabs button:hover:not(.active) { border-color: #5A5244; color: #9A8860; }
    .tabs button.active {
      border-color: #C8961E; color: #F5C842;
      background: rgba(200,150,30,0.06); box-shadow: 0 0 14px rgba(200,150,30,0.1);
    }

    /* CARD */
    .card {
      background: #1A1810; border: 1px solid #2A2618;
      border-radius: 12px; padding: 1.75rem;
    }
    .card-title { font-size: 1rem; font-weight: 700; color: #F5C842; margin-bottom: 0.25rem; }
    .card-sub   { font-size: 0.8rem; color: #7A7260; margin-bottom: 1.5rem; }

    /* FORM */
    .fg { margin-bottom: 1rem; }
    .fg label {
      display: block; margin-bottom: 0.35rem;
      font-size: 0.75rem; font-weight: 600; color: #7A7260; letter-spacing: 0.3px;
    }
    .fg input, .fg select, .fg textarea {
      width: 100%; padding: 0.7rem 0.9rem;
      background: #0D0B06; border: 1px solid #3A3220; border-radius: 8px;
      font-size: 0.88rem; font-family: inherit; color: #F0EDE5;
      outline: none; transition: border-color 0.15s, box-shadow 0.15s; box-sizing: border-box;
    }
    .fg input:focus, .fg select:focus, .fg textarea:focus {
      border-color: #C8961E; box-shadow: 0 0 0 3px rgba(200,150,30,0.1);
    }
    .fg input::placeholder, .fg textarea::placeholder { color: #4A4434; }
    .fg select option { background: #1A1810; }
    .fg textarea { resize: vertical; min-height: 80px; }

    /* BUTTONS */
    .btn-gold {
      padding: 0.78rem 2rem;
      background: linear-gradient(135deg, #C8961E, #F5C842);
      color: #0D0B06; border: none; border-radius: 9px;
      font-size: 0.9rem; font-weight: 800; font-family: inherit;
      cursor: pointer; transition: opacity 0.15s, transform 0.1s;
      box-shadow: 0 4px 16px rgba(200,150,30,0.28);
    }
    .btn-gold:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
    .btn-gold:disabled { background: #2A2618; color: #5A5244; cursor: not-allowed; box-shadow: none; }

    .btn-filter {
      padding: 0.4rem 1.1rem; background: #2563EB; color: #fff;
      border: none; border-radius: 7px; font-size: 0.78rem; font-weight: 700;
      font-family: inherit; cursor: pointer; transition: background 0.15s;
    }
    .btn-filter:hover { background: #1D4ED8; }

    /* STATS */
    .stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; margin-bottom: 0.85rem; }
    .stat-card {
      background: #1A1810; border: 1px solid #2A2618; border-radius: 10px; padding: 1rem 1.25rem;
    }
    .stat-label { font-size: 0.68rem; font-weight: 700; color: #7A7260; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 0.3rem; }
    .stat-val   { font-size: 1.8rem; font-weight: 900; color: #F5C842; line-height: 1; letter-spacing: -1px; }
    .stat-unit  { font-size: 0.75rem; color: #5A5244; font-weight: 600; }

    /* FILTER */
    .filter-bar {
      background: #1A1810; border: 1px solid #2A2618; border-radius: 10px;
      padding: 0.75rem 1.1rem; display: flex; align-items: center;
      gap: 0.75rem; margin-bottom: 0.85rem; flex-wrap: wrap;
    }
    .filter-label { font-size: 0.78rem; color: #7A7260; font-weight: 500; }
    .date-input {
      display: flex; align-items: center; gap: 0.45rem;
      background: #0D0B06; border: 1px solid #3A3220; border-radius: 7px; padding: 0.38rem 0.7rem;
    }
    .date-input:focus-within { border-color: #C8961E; }
    .date-input svg { width: 13px; height: 13px; color: #5A5244; flex-shrink: 0; }
    .date-input input {
      background: none; border: none; color: #C8BEA8; font-size: 0.8rem;
      font-family: inherit; outline: none; width: 108px;
    }
    .date-input input::-webkit-calendar-picker-indicator { filter: invert(0.4) sepia(1) hue-rotate(10deg); cursor: pointer; }
    .filter-sep { color: #4A4434; font-size: 0.8rem; }

    /* TABLE */
    .data-wrap { background: #1A1810; border: 1px solid #2A2618; border-radius: 12px; overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th {
      padding: 0.65rem 1rem; text-align: left; font-size: 0.65rem; font-weight: 700;
      color: #C8961E; letter-spacing: 0.9px; text-transform: uppercase;
      border-bottom: 1px solid #2A2618;
    }
    .data-table td { padding: 0.8rem 1rem; font-size: 0.8rem; color: #B0A890; border-bottom: 1px solid #1E1C12; }
    .data-table tr:last-child td { border-bottom: none; }
    .data-table tbody tr:hover td { background: rgba(255,255,255,0.015); }
    .val-neg { color: #EF4444; font-weight: 700; }
    .msg-cell { max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    /* RECARGA */
    .recarga-result {
      background: rgba(34,197,94,0.06); border: 1px solid rgba(34,197,94,0.2);
      border-radius: 9px; padding: 1rem 1.1rem; font-size: 0.85rem;
      color: #22C55E; line-height: 2; margin-bottom: 1.25rem;
    }
    .recarga-result strong { font-weight: 800; }

    /* ALERTS */
    .alert { padding: 0.7rem 0.9rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.82rem; font-weight: 500; }
    .alert-err { background: rgba(239,68,68,0.08); color: #EF4444; border: 1px solid rgba(239,68,68,0.2); }
    .alert-ok  { background: rgba(34,197,94,0.08);  color: #22C55E; border: 1px solid rgba(34,197,94,0.2); }

    .empty { text-align: center; color: #4A4434; padding: 3rem; font-size: 0.85rem; }

    @media (max-width: 640px) {
      .sidebar { display: none; }
      .tabs { flex-direction: column; }
      .stats-row { grid-template-columns: 1fr; }
      .filter-bar { flex-wrap: wrap; }
    }
  `]
})
export class ProfessorDashboardComponent implements OnInit {
  tab = 'distribuir';
  userName = ''; userId = '';
  resumo: ExtratoResumoResponse | null = null;
  filtroInicio = ''; filtroFim = '';

  alunos: AlunoResponse[] = [];
  distAlunoId = ''; distValor: number | null = null; distMensagem = '';
  distErro = ''; distSucesso = ''; distLoading = false;

  recargaResp: SaldoSemestralResponse | null = null;
  recargaErro = ''; recargaLoading = false;

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
      next: (data) => this.resumo = data, error: () => {}
    });
  }

  carregarAlunos(): void {
    this.apiService.listarAlunos().subscribe({
      next: (data) => this.alunos = data, error: () => {}
    });
  }

  distribuir(): void {
    if (!this.distAlunoId || !this.distValor || !this.distMensagem.trim()) {
      this.distErro = 'Preencha todos os campos. A mensagem é obrigatória.'; return;
    }
    this.distLoading = true; this.distErro = ''; this.distSucesso = '';
    this.apiService.distribuirMoedas({
      professorId: this.userId, alunoId: this.distAlunoId,
      valor: this.distValor, mensagem: this.distMensagem
    }).subscribe({
      next: (data) => {
        this.distLoading = false;
        this.distSucesso = `Moedas enviadas com sucesso para ${data.destinatarioNome}!`;
        this.distAlunoId = ''; this.distValor = null; this.distMensagem = '';
        this.carregarExtrato();
      },
      error: (err) => { this.distLoading = false; this.distErro = err.error?.error || 'Erro ao distribuir moedas'; }
    });
  }

  aplicarRecarga(): void {
    this.recargaLoading = true; this.recargaErro = ''; this.recargaResp = null;
    this.apiService.aplicarRecargaProfessor(this.userId).subscribe({
      next: (data) => { this.recargaLoading = false; this.recargaResp = data; this.carregarExtrato(); },
      error: (err) => { this.recargaLoading = false; this.recargaErro = err.error?.error || 'Erro ao aplicar recarga'; }
    });
  }

  logout(): void { this.authService.logout(); this.router.navigate(['/login']); }
}
