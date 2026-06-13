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
    <div class="dashboard">

      <!-- Header -->
      <header class="header">
        <div class="header-inner">
          <div class="header-left">
            <div class="header-icon">E</div>
            <div>
              <h1>Painel da Empresa</h1>
              <p>Bem-vindo, {{ userName }}</p>
            </div>
          </div>
          <div class="header-right">
            <button class="btn-logout" (click)="logout()">Sair</button>
          </div>
        </div>
      </header>

      <!-- Tabs -->
      <div class="content-area">
        <div class="tabs">
          <button [class.active]="tab==='vantagens'" (click)="tab='vantagens'">Minhas Vantagens</button>
          <button [class.active]="tab==='cadastrar'" (click)="tab='cadastrar'">Cadastrar Vantagem</button>
        </div>

        <!-- Tab: Minhas Vantagens -->
        <div class="tab-content" *ngIf="tab==='vantagens'">
          <div class="card">
            <h2>Vantagens Cadastradas</h2>
            <p class="card-subtitle">Gerencie as vantagens oferecidas aos alunos</p>

            <div *ngIf="vantagens.length === 0" class="empty-state">
              Nenhuma vantagem cadastrada ainda.
            </div>

            <div class="vantagens-grid" *ngIf="vantagens.length > 0">
              <div class="vantagem-card" *ngFor="let v of vantagens">
                <div class="vantagem-img" *ngIf="v.fotoUrl">
                  <img [src]="v.fotoUrl" [alt]="v.descricao" loading="lazy">
                </div>
                <div class="vantagem-img vantagem-placeholder" *ngIf="!v.fotoUrl">
                  <span>Sem foto</span>
                </div>
                <div class="vantagem-info">
                  <h3>{{ v.descricao }}</h3>
                  <div class="vantagem-custo">
                    <span class="custo-icon">$</span>
                    <span>{{ v.custoMoedas }} MC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab: Cadastrar Vantagem -->
        <div class="tab-content" *ngIf="tab==='cadastrar'">
          <div class="card">
            <h2>Nova Vantagem</h2>
            <p class="card-subtitle">Cadastre um beneficio para os alunos resgatarem</p>

            <div *ngIf="cadErro" class="alert alert-danger">{{ cadErro }}</div>
            <div *ngIf="cadSucesso" class="alert alert-success">{{ cadSucesso }}</div>

            <div class="form-group">
              <label>Descricao</label>
              <input type="text" [(ngModel)]="cadDescricao" placeholder="Ex: Desconto de 15% em pizzas">
            </div>

            <div class="form-group">
              <label>URL da Foto</label>
              <input type="text" [(ngModel)]="cadFotoUrl" placeholder="https://exemplo.com/foto.jpg">
            </div>

            <div class="form-group">
              <label>Custo em Moedas</label>
              <input type="number" [(ngModel)]="cadCusto" placeholder="Ex: 50" min="1">
            </div>

            <button class="btn-primary" (click)="cadastrarVantagem()" [disabled]="cadLoading">
              {{ cadLoading ? 'Salvando...' : 'Cadastrar Vantagem' }}
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
      background: #7C3AED;
      color: #fff;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 0 rgba(0,0,0,0.1), 0 4px 16px rgba(124,58,237,0.25);
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

    .header-right { display: flex; align-items: center; }

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
    .tabs button.active { background: #7C3AED; color: #fff; box-shadow: 0 1px 3px rgba(124,58,237,0.35); }
    .tabs button:not(.active):hover { background: #F8FAFC; color: #7C3AED; }

    /* ── Card ── */
    .card {
      background: #fff;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
    }

    .card h2 { font-size: 1.1rem; font-weight: 700; color: #0F172A; margin: 0 0 0.25rem; }
    .card-subtitle { color: #64748B; font-size: 0.875rem; margin-bottom: 1.5rem; }

    /* ── Vantagens grid ── */
    .vantagens-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.1rem;
    }

    .vantagem-card {
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      overflow: hidden;
      transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
    }
    .vantagem-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(124,58,237,0.12);
      border-color: #DDD6FE;
    }

    .vantagem-img { height: 148px; overflow: hidden; background: #F5F3FF; }
    .vantagem-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
    .vantagem-card:hover .vantagem-img img { transform: scale(1.04); }

    .vantagem-placeholder {
      height: 148px;
      display: flex; align-items: center; justify-content: center;
      background: #F5F3FF;
      color: #A78BFA;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .vantagem-info { padding: 1rem 1.1rem; }
    .vantagem-info h3 { font-size: 0.9rem; font-weight: 600; color: #0F172A; margin: 0 0 0.5rem; line-height: 1.4; }

    .vantagem-custo {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 700;
      color: #7C3AED;
      font-size: 0.9rem;
    }

    .custo-icon {
      width: 22px; height: 22px;
      border-radius: 6px;
      background: linear-gradient(135deg, #F59E0B, #D97706);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.68rem;
      font-weight: 900;
      color: #fff;
    }

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

    .form-group input {
      width: 100%;
      padding: 0.7rem 0.9rem;
      border: 1.5px solid #E2E8F0;
      border-radius: 10px;
      font-size: 0.9rem;
      font-family: inherit;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
      color: #0F172A;
      background: #FAFAFA;
    }
    .form-group input:focus {
      border-color: #7C3AED;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
    }
    .form-group input::placeholder { color: #94A3B8; }

    /* ── Buttons ── */
    .btn-primary {
      padding: 0.75rem 2rem;
      background: #7C3AED;
      color: #fff;
      border: none;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
      box-shadow: 0 1px 2px rgba(124,58,237,0.3);
    }
    .btn-primary:hover:not(:disabled) {
      background: #6D28D9;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(124,58,237,0.35);
    }
    .btn-primary:disabled { background: #94A3B8; cursor: not-allowed; box-shadow: none; }

    .empty-state { text-align: center; color: #94A3B8; padding: 3rem; font-size: 0.9rem; }

    /* ── Alerts ── */
    .alert { padding: 0.75rem 1rem; border-radius: 10px; margin-bottom: 1rem; font-size: 0.875rem; font-weight: 500; }
    .alert-danger { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }
    .alert-success { background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }

    @media (max-width: 640px) {
      .header-inner { flex-wrap: wrap; height: auto; padding: 0.75rem 1rem; gap: 0.5rem; }
      .tabs { flex-direction: column; }
      .card { padding: 1.25rem; }
      .vantagens-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class EmpresaDashboardComponent implements OnInit {
  tab = 'vantagens';
  userName = '';
  userId = '';
  vantagens: VantagemResponse[] = [];

  cadDescricao = '';
  cadFotoUrl = '';
  cadCusto: number | null = null;
  cadErro = '';
  cadSucesso = '';
  cadLoading = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId() || '';
    this.authService.currentUser$.subscribe(u => this.userName = u?.nome || '');
    this.carregarVantagens();
  }

  carregarVantagens(): void {
    this.apiService.listarVantagens(this.userId).subscribe({
      next: (data) => this.vantagens = data,
      error: () => {}
    });
  }

  cadastrarVantagem(): void {
    if (!this.cadDescricao.trim() || !this.cadFotoUrl.trim() || !this.cadCusto) {
      this.cadErro = 'Preencha todos os campos';
      return;
    }
    this.cadLoading = true;
    this.cadErro = '';
    this.cadSucesso = '';
    this.apiService.adicionarVantagem(this.userId, {
      descricao: this.cadDescricao,
      fotoUrl: this.cadFotoUrl,
      custoMoedas: this.cadCusto
    }).subscribe({
      next: () => {
        this.cadLoading = false;
        this.cadSucesso = 'Vantagem cadastrada com sucesso!';
        this.cadDescricao = '';
        this.cadFotoUrl = '';
        this.cadCusto = null;
        this.carregarVantagens();
      },
      error: (err) => {
        this.cadLoading = false;
        this.cadErro = err.error?.error || 'Erro ao cadastrar vantagem';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
