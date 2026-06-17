import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { VantagemResponse } from '../../models/usuario.model';

@Component({
  selector: 'app-empresa-dashboard',
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
          <div class="avatar">{{ userName.charAt(0) }}</div>
          <div class="user-info">
            <span class="user-name">{{ userName }}</span>
            <span class="user-role">Empresa Parceira</span>
          </div>
          <button class="btn-logout" (click)="logout()">Sair</button>
        </div>
      </header>

      <div class="body-row">

        <!-- SIDEBAR -->
        <aside class="sidebar">
          <button class="nav-item" [class.active]="tab==='vantagens'" (click)="tab='vantagens'" title="Home">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Home</span>
          </button>
          <button class="nav-item" [class.active]="tab==='vantagens'" (click)="tab='vantagens'" title="Vantagens">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>Vantagens</span>
          </button>
          <button class="nav-item" [class.active]="tab==='cadastrar'" (click)="tab='cadastrar'" title="Cadastrar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            <span>Cadastrar</span>
          </button>
          <button class="nav-item" [class.active]="tab==='resgates'" (click)="tab='resgates'; carregarResgates()" title="Resgates">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 11 12 14 22 4"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
            <span>Resgates</span>
          </button>
        </aside>

        <!-- MAIN -->
        <main class="main">

          <!-- TABS -->
          <div class="tabs">
            <button [class.active]="tab==='vantagens'" (click)="tab='vantagens'">Minhas Vantagens</button>
            <button [class.active]="tab==='cadastrar'" (click)="tab='cadastrar'">Cadastrar Vantagem</button>
            <button [class.active]="tab==='resgates'"  (click)="tab='resgates'; carregarResgates()">Resgates</button>
          </div>

          <!-- ── VANTAGENS ── -->
          <div *ngIf="tab==='vantagens'">
            <div class="card-header-row">
              <p class="section-title">Vantagens Cadastradas</p>
              <button class="btn-gold-sm" (click)="tab='cadastrar'">+ Nova Vantagem</button>
            </div>

            <div *ngIf="vantagens.length === 0" class="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <p>Nenhuma vantagem cadastrada ainda.</p>
              <button class="btn-gold" (click)="tab='cadastrar'">Cadastrar primeira vantagem</button>
            </div>

            <div class="vant-grid" *ngIf="vantagens.length > 0">
              <div class="vant-card" *ngFor="let v of vantagens">
                <div class="vant-badge">{{ v.custoMoedas | number:'1.0-0' }} MC</div>
                <p class="vant-desc">{{ v.descricao }}</p>
                <div class="vant-footer">
                  <span [class.vant-ativa]="v.ativa" [class.vant-inativa]="!v.ativa">{{ v.ativa ? 'Ativa' : 'Inativa' }}</span>
                  <span class="vant-foto" *ngIf="v.fotoUrl">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg> Foto
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- ── CADASTRAR ── -->
          <div *ngIf="tab==='cadastrar'">
            <div class="card">
              <p class="card-title">Nova Vantagem</p>
              <p class="card-sub">Crie uma vantagem para atrair alunos parceiros</p>

              <div *ngIf="novErro"    class="alert alert-err">{{ novErro }}</div>
              <div *ngIf="novSucesso" class="alert alert-ok">{{ novSucesso }}</div>

              <div class="fg">
                <label>Descrição da Vantagem</label>
                <textarea [(ngModel)]="novDescricao" rows="3" placeholder="Ex: 15% de desconto em produtos selecionados"></textarea>
              </div>
              <div class="row-2">
                <div class="fg">
                  <label>Custo em Moedas</label>
                  <input type="number" [(ngModel)]="novCustoMoedas" placeholder="Ex: 100" min="1">
                </div>
                <div class="fg">
                  <label>URL da Foto (opcional)</label>
                  <input [(ngModel)]="novFotoUrl" placeholder="https://...">
                </div>
              </div>
              <button class="btn-gold" (click)="cadastrarVantagem()" [disabled]="novLoading">
                {{ novLoading ? 'Cadastrando...' : 'Cadastrar Vantagem' }}
              </button>
            </div>
          </div>

          <!-- ── RESGATES ── -->
          <div *ngIf="tab==='resgates'">
            <p class="section-title" style="margin-bottom:0.85rem">Resgates de Alunos</p>

            <p *ngIf="resgates.length === 0" class="empty">Nenhum resgate encontrado.</p>

            <div class="data-wrap" *ngIf="resgates.length > 0">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Aluno</th><th>Vantagem</th><th>Valor</th><th>Data</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let r of resgates">
                    <td>{{ r.alunoNome || '—' }}</td>
                    <td>{{ r.vantagemNome || '—' }}</td>
                    <td class="val-badge">{{ r.valor | number:'1.0-0' }} MC</td>
                    <td>{{ r.dataResgate | date:'dd/MM/yyyy' }}</td>
                    <td><span class="status-chip">{{ r.status || 'Pendente' }}</span></td>
                  </tr>
                </tbody>
              </table>
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

    /* SECTION HEADER */
    .card-header-row {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 1rem;
    }
    .section-title { font-size: 0.9rem; font-weight: 700; color: #F0EDE5; }

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
    .fg input, .fg textarea {
      width: 100%; padding: 0.7rem 0.9rem;
      background: #0D0B06; border: 1px solid #3A3220; border-radius: 8px;
      font-size: 0.88rem; font-family: inherit; color: #F0EDE5;
      outline: none; transition: border-color 0.15s, box-shadow 0.15s; box-sizing: border-box;
    }
    .fg input:focus, .fg textarea:focus { border-color: #C8961E; box-shadow: 0 0 0 3px rgba(200,150,30,0.1); }
    .fg input::placeholder, .fg textarea::placeholder { color: #4A4434; }
    .fg textarea { resize: vertical; min-height: 80px; }
    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0 1rem; }

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

    .btn-gold-sm {
      padding: 0.4rem 1rem;
      background: linear-gradient(135deg, #C8961E, #F5C842);
      color: #0D0B06; border: none; border-radius: 7px;
      font-size: 0.75rem; font-weight: 800; font-family: inherit;
      cursor: pointer; transition: opacity 0.15s;
    }
    .btn-gold-sm:hover { opacity: 0.85; }

    /* VANT GRID */
    .vant-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 0.85rem; }
    .vant-card {
      background: #1A1810; border: 1px solid #2A2618; border-radius: 10px;
      padding: 1.1rem; position: relative; transition: border-color 0.15s;
    }
    .vant-card:hover { border-color: #3A3220; }
    .vant-badge {
      display: inline-block; background: rgba(200,150,30,0.12);
      color: #F5C842; border: 1px solid rgba(200,150,30,0.25);
      border-radius: 20px; padding: 0.2rem 0.65rem;
      font-size: 0.72rem; font-weight: 800; margin-bottom: 0.6rem;
    }
    .vant-nome { font-size: 0.88rem; font-weight: 700; color: #F0EDE5; margin-bottom: 0.35rem; }
    .vant-desc { font-size: 0.78rem; color: #7A7260; line-height: 1.5; margin-bottom: 0.75rem; }
    .vant-footer { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
    .vant-ativa   { font-size: 0.7rem; color: #22C55E; font-weight: 600; }
    .vant-inativa { font-size: 0.7rem; color: #EF4444; font-weight: 600; }
    .vant-foto { display: flex; align-items: center; gap: 0.25rem; font-size: 0.7rem; color: #5A5244; }

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
    .val-badge { color: #F5C842; font-weight: 700; }
    .status-chip {
      display: inline-block; padding: 0.2rem 0.55rem; border-radius: 20px;
      font-size: 0.7rem; font-weight: 600;
      background: rgba(59,130,246,0.1); color: #3B82F6; border: 1px solid rgba(59,130,246,0.2);
    }

    /* EMPTY */
    .empty-state {
      text-align: center; padding: 3rem; color: #4A4434;
      display: flex; flex-direction: column; align-items: center; gap: 1rem;
    }
    .empty-state svg { width: 48px; height: 48px; opacity: 0.3; }
    .empty-state p { font-size: 0.88rem; }
    .empty { text-align: center; color: #4A4434; padding: 3rem; font-size: 0.85rem; }

    /* ALERTS */
    .alert { padding: 0.7rem 0.9rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.82rem; font-weight: 500; }
    .alert-err { background: rgba(239,68,68,0.08); color: #EF4444; border: 1px solid rgba(239,68,68,0.2); }
    .alert-ok  { background: rgba(34,197,94,0.08);  color: #22C55E; border: 1px solid rgba(34,197,94,0.2); }

    @media (max-width: 640px) {
      .sidebar { display: none; }
      .tabs { flex-direction: column; }
      .row-2 { grid-template-columns: 1fr; }
      .vant-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class EmpresaDashboardComponent implements OnInit {
  tab = 'vantagens';
  userName = ''; empresaId = '';

  vantagens: VantagemResponse[] = [];
  resgates: any[] = [];

  novDescricao = ''; novCustoMoedas: number | null = null; novFotoUrl = '';
  novErro = ''; novSucesso = ''; novLoading = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.empresaId = this.authService.getUserId() || '';
    this.authService.currentUser$.subscribe(u => this.userName = u?.nome || '');
    this.carregarVantagens();
  }

  carregarVantagens(): void {
    this.apiService.listarVantagens(this.empresaId).subscribe({
      next: (data: VantagemResponse[]) => this.vantagens = data, error: () => {}
    });
  }

  carregarResgates(): void {
    this.resgates = [];
  }

  cadastrarVantagem(): void {
    if (!this.novDescricao.trim() || !this.novCustoMoedas) {
      this.novErro = 'Preencha a descrição e o custo em moedas.'; return;
    }
    this.novLoading = true; this.novErro = ''; this.novSucesso = '';
    this.apiService.adicionarVantagem(this.empresaId, {
      descricao: this.novDescricao,
      custoMoedas: this.novCustoMoedas,
      fotoUrl: this.novFotoUrl || ''
    }).subscribe({
      next: () => {
        this.novLoading = false;
        this.novSucesso = 'Vantagem cadastrada com sucesso!';
        this.novDescricao = ''; this.novCustoMoedas = null; this.novFotoUrl = '';
        this.carregarVantagens();
      },
      error: (err: any) => { this.novLoading = false; this.novErro = err.error?.error || 'Erro ao cadastrar'; }
    });
  }

  logout(): void { this.authService.logout(); this.router.navigate(['/login']); }
}
