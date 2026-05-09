import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { VantagemResponse, EmpresaResponse } from '../../models/usuario.model';

@Component({
  selector: 'app-empresa-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <header class="dash-header">
        <h2>Painel da Empresa</h2>
        <div class="header-info">
          <span class="user-name">{{ userName }}</span>
          <button class="btn btn-sm btn-logout" (click)="logout()">Sair</button>
        </div>
      </header>

      <div class="tabs">
        <button [class.active]="tab === 'vantagens'" (click)="tab = 'vantagens'; carregarVantagens()">Minhas Vantagens</button>
        <button [class.active]="tab === 'cadastrar'" (click)="tab = 'cadastrar'">Cadastrar Vantagem</button>
      </div>

      <!-- LISTAR VANTAGENS -->
      <div *ngIf="tab === 'vantagens'" class="tab-content">
        <div class="vantagens-list">
          <div *ngFor="let v of vantagens" class="vantagem-card">
            <img [src]="v.fotoUrl" [alt]="v.descricao" class="vantagem-img" onerror="this.src='https://via.placeholder.com/100'">
            <div class="vantagem-info">
              <p class="vantagem-desc">{{ v.descricao }}</p>
              <p class="vantagem-custo">{{ v.custoMoedas | number:'1.2-2' }} moedas</p>
              <span class="badge" [class.ativa]="v.ativa" [class.inativa]="!v.ativa">
                {{ v.ativa ? 'Ativa' : 'Inativa' }}
              </span>
            </div>
          </div>
          <p *ngIf="vantagens.length === 0" class="empty">Nenhuma vantagem cadastrada.</p>
        </div>
      </div>

      <!-- CADASTRAR VANTAGEM -->
      <div *ngIf="tab === 'cadastrar'" class="tab-content">
        <div *ngIf="cadErro" class="alert alert-danger">{{ cadErro }}</div>
        <div *ngIf="cadSucesso" class="alert alert-success">{{ cadSucesso }}</div>

        <form (ngSubmit)="cadastrarVantagem()" class="cad-form">
          <div class="form-group">
            <label>Descrição</label>
            <textarea [(ngModel)]="cadDescricao" name="cadDescricao" required rows="3" placeholder="Descrição da vantagem"></textarea>
          </div>
          <div class="form-group">
            <label>URL da Foto</label>
            <input [(ngModel)]="cadFotoUrl" name="cadFotoUrl" required placeholder="https://exemplo.com/foto.jpg">
          </div>
          <div class="form-group">
            <label>Custo (moedas)</label>
            <input type="number" [(ngModel)]="cadCusto" name="cadCusto" required min="0.01" step="0.01" placeholder="Ex: 100">
          </div>
          <button type="submit" [disabled]="cadLoading" class="btn btn-primary">
            {{ cadLoading ? 'Cadastrando...' : 'Cadastrar Vantagem' }}
          </button>
        </form>
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
    .tabs button.active { background: #805ad5; color: #fff; border-color: #805ad5; }
    .tab-content { background: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
    .vantagens-list { display: flex; flex-direction: column; gap: 0.8rem; }
    .vantagem-card { display: flex; gap: 1rem; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; align-items: center; }
    .vantagem-img { width: 100px; height: 100px; object-fit: cover; border-radius: 4px; }
    .vantagem-info { flex: 1; }
    .vantagem-desc { margin: 0; font-weight: 600; font-size: 1.1rem; }
    .vantagem-custo { margin: 0.3rem 0; color: #2b6cb0; font-weight: 700; }
    .badge { padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600; }
    .badge.ativa { background: #c6f6d5; color: #276749; }
    .badge.inativa { background: #fed7d7; color: #c53030; }
    .cad-form { max-width: 500px; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.3rem; font-weight: 600; color: #4a5568; }
    .form-group input, .form-group textarea { width: 100%; padding: 0.6rem; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 1rem; box-sizing: border-box; }
    .empty { color: #a0aec0; text-align: center; padding: 2rem; }
    .alert-danger { background: #fed7d7; color: #c53030; padding: 0.7rem; border-radius: 4px; margin-bottom: 1rem; }
    .alert-success { background: #c6f6d5; color: #276749; padding: 0.7rem; border-radius: 4px; margin-bottom: 1rem; }
    .btn { padding: 0.5rem 1.2rem; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; background: #edf2f7; }
    .btn-sm { font-size: 0.9rem; }
    .btn-primary { background: #805ad5; color: #fff; }
    .btn-primary:hover { background: #6b46c1; }
    .btn-primary:disabled { background: #a0aec0; }
    .btn-logout { background: #e53e3e; color: #fff; }
    .btn-logout:hover { background: #c53030; }
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
