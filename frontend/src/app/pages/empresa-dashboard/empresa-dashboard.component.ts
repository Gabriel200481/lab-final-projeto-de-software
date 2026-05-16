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
    .dashboard {
      min-height: 100vh;
      background: #f0f4f8;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    }

    /* Header */
    .header {
      background: linear-gradient(135deg, #6a1b9a 0%, #4a148c 100%);
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
      background: linear-gradient(135deg, #6a1b9a, #4a148c);
      color: #fff;
      box-shadow: 0 2px 8px rgba(106,27,154,0.3);
    }

    .tabs button:not(.active):hover { background: #f7fafc; color: #6a1b9a; }

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
      color: #4a148c;
      margin: 0 0 0.3rem;
    }

    .card-subtitle {
      color: #718096;
      font-size: 0.88rem;
      margin-bottom: 1.5rem;
    }

    /* Vantagens grid */
    .vantagens-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.2rem;
    }

    .vantagem-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .vantagem-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }

    .vantagem-img {
      height: 140px;
      overflow: hidden;
      background: #f7fafc;
    }

    .vantagem-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .vantagem-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #a0aec0;
      font-size: 0.88rem;
    }

    .vantagem-info {
      padding: 1rem;
    }

    .vantagem-info h3 {
      font-size: 0.95rem;
      font-weight: 600;
      color: #2d3748;
      margin: 0 0 0.5rem;
    }

    .vantagem-custo {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 700;
      color: #6a1b9a;
      font-size: 0.95rem;
    }

    .custo-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f9a825, #ff8f00);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 900;
      color: #5d2e00;
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

    .form-group input {
      width: 100%;
      padding: 0.7rem 0.9rem;
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      font-size: 0.95rem;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.2s, box-shadow 0.2s;
      color: #2d3748;
    }

    .form-group input:focus {
      border-color: #6a1b9a;
      box-shadow: 0 0 0 3px rgba(106,27,154,0.08);
    }

    /* Buttons */
    .btn-primary {
      padding: 0.75rem 2rem;
      background: linear-gradient(135deg, #6a1b9a, #4a148c);
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
