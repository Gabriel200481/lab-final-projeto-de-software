import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import {
  ExtratoResumoResponse, TransacaoResponse,
  VantagemResponse, EmpresaResponse, ResgateResponse
} from '../../models/usuario.model';

@Component({
  selector: 'app-aluno-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="app-wrapper">

      <header class="app-header">
        <div class="header-brand">
          <div class="header-coin">ME</div>
          <div class="header-texts">
            <span class="brand-name">Moeda Estudantil</span>
            <span class="role-label">Painel do Aluno</span>
          </div>
        </div>
        <div class="header-actions">
          <div class="user-chip">
            <span class="user-name">{{ userName }}</span>
          </div>
          <button class="btn-logout" (click)="logout()">Sair</button>
        </div>
      </header>

      <main class="page-content">
        <div class="content-wrapper">

          <div class="tabs">
            <button [class.active]="tab === 'extrato'"   (click)="tab = 'extrato';   carregarExtrato()">Extrato</button>
            <button [class.active]="tab === 'vantagens'" (click)="tab = 'vantagens'; carregarVantagens()">Resgatar Vantagem</button>
            <button [class.active]="tab === 'resgate'"   (click)="tab = 'resgate'">Consultar Resgate</button>
          </div>

          <!-- EXTRATO -->
          <div *ngIf="tab === 'extrato'" class="tab-content">
            <div class="saldo-card" *ngIf="resumo">
              <div class="saldo-icon">$</div>
              <div>
                <p class="saldo-label">Saldo Atual</p>
                <span class="saldo">{{ (resumo.saldoAtual ?? 0) | number:'1.2-2' }}</span>
                <span class="saldo-unit"> moedas</span>
              </div>
            </div>

            <div class="filtro">
              <label>De: <input type="date" [(ngModel)]="filtroInicio" name="filtroInicio"></label>
              <label>Ate: <input type="date" [(ngModel)]="filtroFim" name="filtroFim"></label>
              <button class="btn btn-sm" (click)="carregarExtrato()">Filtrar</button>
            </div>

            <table *ngIf="resumo && resumo.transacoes.length > 0" class="data-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Remetente</th>
                  <th>Valor</th>
                  <th>Mensagem</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let t of resumo.transacoes">
                  <td>{{ t.dataHora | date:'dd/MM/yyyy HH:mm' }}</td>
                  <td>{{ t.remetenteNome }}</td>
                  <td [class.positivo]="t.valor > 0" [class.negativo]="t.valor < 0">
                    {{ t.valor > 0 ? '+' : '' }}{{ t.valor | number:'1.2-2' }}
                  </td>
                  <td>{{ t.mensagem }}</td>
                </tr>
              </tbody>
            </table>
            <p *ngIf="resumo && resumo.transacoes.length === 0" class="empty">Nenhuma transacao encontrada.</p>
          </div>

          <!-- RESGATAR VANTAGEM -->
          <div *ngIf="tab === 'vantagens'" class="tab-content">
            <div *ngIf="resgateErro" class="alert alert-danger">{{ resgateErro }}</div>
            <div *ngIf="resgateSucesso" class="alert alert-success">
              <p>Resgate realizado com sucesso!</p>
              <p>Codigo: <strong>{{ ultimoResgate?.codigoUnico }}</strong></p>
              <p>Valor debitado: {{ ultimoResgate?.valorDebitado | number:'1.2-2' }} moedas</p>
              <p *ngIf="ultimoResgate?.qrCodeUrl">
                <img [src]="ultimoResgate!.qrCodeUrl" alt="QR Code" class="qr-img">
              </p>
            </div>

            <div class="vantagens-grid">
              <div *ngFor="let emp of empresas" class="empresa-block">
                <h4 class="empresa-titulo">{{ emp.nomeFantasia }}</h4>
                <div *ngFor="let v of emp.vantagens" class="vantagem-card">
                  <img [src]="v.fotoUrl" [alt]="v.descricao" class="vantagem-img"
                       onerror="this.src='https://via.placeholder.com/100'">
                  <div class="vantagem-info">
                    <p class="vantagem-desc">{{ v.descricao }}</p>
                    <p class="vantagem-custo">{{ v.custoMoedas | number:'1.2-2' }} moedas</p>
                    <button class="btn btn-sm btn-primary" (click)="resgatar(v.id)" [disabled]="resgatando">
                      Resgatar
                    </button>
                  </div>
                </div>
              </div>
              <p *ngIf="empresas.length === 0" class="empty">Nenhuma vantagem disponivel.</p>
            </div>
          </div>

          <!-- CONSULTAR RESGATE -->
          <div *ngIf="tab === 'resgate'" class="tab-content">
            <div class="form-inline">
              <label>ID do Resgate:
                <input [(ngModel)]="resgateConsultaId" name="resgateConsultaId" placeholder="UUID do resgate">
              </label>
              <button class="btn btn-sm btn-primary" (click)="consultarResgate()">Consultar</button>
            </div>
            <div *ngIf="resgateConsulta" class="resgate-detail">
              <p><strong>Codigo:</strong> {{ resgateConsulta.codigoUnico }}</p>
              <p><strong>Data:</strong> {{ resgateConsulta.dataHora | date:'dd/MM/yyyy HH:mm' }}</p>
              <p><strong>Valor:</strong> {{ resgateConsulta.valorDebitado | number:'1.2-2' }} moedas</p>
              <p *ngIf="resgateConsulta.qrCodeUrl">
                <img [src]="resgateConsulta.qrCodeUrl" alt="QR Code" class="qr-img">
              </p>
            </div>
            <div *ngIf="resgateConsultaErro" class="alert alert-danger">{{ resgateConsultaErro }}</div>
          </div>

        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: #eef2f7;
    }

    .app-header {
      background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
      color: #fff;
      padding: 0 2rem;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 12px rgba(0,0,0,0.22);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-brand { display: flex; align-items: center; gap: 0.9rem; }

    .header-coin {
      width: 40px; height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f9a825, #ff8f00);
      color: #5d2e00;
      font-weight: 900; font-size: 0.9rem;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      flex-shrink: 0;
    }

    .header-texts { display: flex; flex-direction: column; }
    .brand-name   { font-weight: 700; font-size: 1rem; line-height: 1.2; }
    .role-label   { font-size: 0.75rem; opacity: 0.75; }

    .header-actions { display: flex; align-items: center; gap: 1rem; }

    .user-chip {
      display: flex; align-items: center; gap: 0.4rem;
      background: rgba(255,255,255,0.15);
      border-radius: 20px;
      padding: 0.3rem 0.8rem;
      font-size: 0.88rem;
    }

    .btn-logout {
      padding: 0.35rem 0.9rem;
      background: rgba(255,255,255,0.18);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 6px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-logout:hover { background: rgba(255,255,255,0.28); }

    .page-content { flex: 1; padding: 2rem 1.5rem; }
    .content-wrapper { max-width: 960px; margin: 0 auto; }

    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .tabs button {
      padding: 0.55rem 1.2rem;
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      background: #fff;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      color: #4a5568;
      transition: all 0.2s;
    }

    .tabs button:hover { border-color: #1565c0; color: #1565c0; }
    .tabs button.active {
      background: linear-gradient(135deg, #1565c0, #0d47a1);
      color: #fff;
      border-color: transparent;
      box-shadow: 0 2px 8px rgba(21,101,192,0.3);
    }

    .tab-content {
      background: #fff;
      padding: 1.75rem;
      border-radius: 12px;
      box-shadow: 0 1px 6px rgba(0,0,0,0.07);
    }

    .saldo-card {
      display: flex;
      align-items: center;
      gap: 1.2rem;
      background: linear-gradient(135deg, #ebf8ff, #dbeafe);
      padding: 1.25rem 1.5rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      border-left: 4px solid #1565c0;
    }

    .saldo-icon {
      font-size: 1.5rem;
      width: 50px; height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f9a825, #ff8f00);
      color: #5d2e00;
      display: flex; align-items: center; justify-content: center;
      font-weight: 900;
      flex-shrink: 0;
    }
    .saldo-label { margin: 0; font-size: 0.85rem; color: #4a5568; font-weight: 600; }
    .saldo { font-size: 2rem; font-weight: 800; color: #1565c0; }
    .saldo-unit { font-size: 1rem; color: #4a5568; }

    .filtro { display: flex; gap: 1rem; align-items: center; margin-bottom: 1.2rem; flex-wrap: wrap; }
    .filtro label { display: flex; align-items: center; gap: 0.3rem; font-size: 0.9rem; }
    .filtro input {
      padding: 0.35rem 0.6rem;
      border: 1.5px solid #e2e8f0;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td {
      padding: 0.65rem 0.75rem;
      text-align: left;
      border-bottom: 1px solid #f0f4f8;
      font-size: 0.9rem;
    }
    .data-table th { background: #f7fafc; font-weight: 700; color: #4a5568; }
    .data-table tr:hover td { background: #fafbfd; }
    .positivo { color: #2e7d32; font-weight: 700; }
    .negativo { color: #c62828; font-weight: 700; }

    .vantagens-grid { display: flex; flex-direction: column; gap: 1.5rem; }
    .empresa-titulo {
      color: #1a237e;
      font-size: 1rem;
      font-weight: 700;
      padding: 0.4rem 0;
      margin-bottom: 0.75rem;
      border-bottom: 2px solid #ebf8ff;
    }
    .vantagem-card {
      display: flex; gap: 1rem; padding: 1rem;
      border: 1.5px solid #e2e8f0; border-radius: 10px;
      align-items: center; margin-bottom: 0.6rem;
      transition: box-shadow 0.2s;
    }
    .vantagem-card:hover { box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
    .vantagem-img { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; }
    .vantagem-info { flex: 1; }
    .vantagem-desc { margin: 0; font-weight: 600; color: #2d3748; }
    .vantagem-custo { margin: 0.3rem 0; color: #1565c0; font-weight: 700; font-size: 0.95rem; }

    .qr-img { max-width: 180px; margin-top: 0.75rem; border-radius: 8px; }
    .form-inline { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; }
    .form-inline input {
      padding: 0.5rem 0.8rem;
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      min-width: 260px;
      font-size: 0.9rem;
    }
    .resgate-detail {
      background: #f7fafc;
      padding: 1.2rem;
      border-radius: 10px;
      border-left: 3px solid #1565c0;
      line-height: 1.9;
    }

    .alert-danger {
      background: #fff5f5; color: #c53030;
      padding: 0.75rem 1rem; border-radius: 8px;
      border-left: 3px solid #fc8181; margin-bottom: 1rem; font-size: 0.9rem;
    }
    .alert-success {
      background: #f0fff4; color: #276749;
      padding: 0.75rem 1rem; border-radius: 8px;
      border-left: 3px solid #68d391; margin-bottom: 1rem; font-size: 0.9rem;
      line-height: 1.8;
    }
    .empty { color: #a0aec0; text-align: center; padding: 3rem; font-size: 0.95rem; }

    .btn {
      padding: 0.45rem 1.1rem;
      border: none; border-radius: 6px;
      cursor: pointer; font-size: 0.88rem;
      background: #edf2f7; color: #4a5568;
      transition: background 0.2s;
    }
    .btn-sm { font-size: 0.85rem; padding: 0.4rem 0.9rem; }
    .btn-primary { background: linear-gradient(135deg, #1565c0, #0d47a1); color: #fff; }
    .btn-primary:hover:not(:disabled) { opacity: 0.9; }
    .btn-primary:disabled { background: #a0aec0; cursor: not-allowed; }
  `]
})
export class AlunoDashboardComponent implements OnInit {
  tab = 'extrato';
  userName = '';
  userId = '';
  resumo: ExtratoResumoResponse | null = null;
  filtroInicio = '';
  filtroFim = '';

  empresas: EmpresaResponse[] = [];
  resgatando = false;
  resgateErro = '';
  resgateSucesso = false;
  ultimoResgate: ResgateResponse | null = null;

  resgateConsultaId = '';
  resgateConsulta: ResgateResponse | null = null;
  resgateConsultaErro = '';

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId() || '';
    this.authService.currentUser$.subscribe(u => this.userName = u?.nome || '');
    this.carregarExtrato();
  }

  carregarExtrato(): void {
    this.apiService.extratoAlunoResumo(this.userId, this.filtroInicio || undefined, this.filtroFim || undefined).subscribe({
      next: (data) => this.resumo = data,
      error: () => {}
    });
  }

  carregarVantagens(): void {
    this.resgateSucesso = false;
    this.resgateErro = '';
    this.apiService.listarEmpresas().subscribe({
      next: (data) => this.empresas = data.filter(e => e.vantagens && e.vantagens.length > 0),
      error: () => this.resgateErro = 'Erro ao carregar vantagens'
    });
  }

  resgatar(vantagemId: string): void {
    this.resgatando = true;
    this.resgateErro = '';
    this.resgateSucesso = false;
    this.apiService.resgatar({ alunoId: this.userId, vantagemId }).subscribe({
      next: (data) => {
        this.resgatando = false;
        this.resgateSucesso = true;
        this.ultimoResgate = data;
        this.carregarExtrato();
      },
      error: (err) => {
        this.resgatando = false;
        this.resgateErro = err.error?.error || 'Erro ao resgatar vantagem';
      }
    });
  }

  consultarResgate(): void {
    this.resgateConsulta = null;
    this.resgateConsultaErro = '';
    if (!this.resgateConsultaId.trim()) return;
    this.apiService.buscarResgate(this.resgateConsultaId).subscribe({
      next: (data) => this.resgateConsulta = data,
      error: (err) => this.resgateConsultaErro = err.error?.error || 'Resgate nao encontrado'
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
