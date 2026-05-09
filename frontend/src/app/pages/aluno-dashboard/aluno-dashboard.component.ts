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
    <div class="dashboard">
      <header class="dash-header">
        <h2>Painel do Aluno</h2>
        <div class="header-info">
          <span class="user-name">{{ userName }}</span>
          <button class="btn btn-sm btn-logout" (click)="logout()">Sair</button>
        </div>
      </header>

      <div class="tabs">
        <button [class.active]="tab === 'extrato'" (click)="tab = 'extrato'; carregarExtrato()">Extrato</button>
        <button [class.active]="tab === 'vantagens'" (click)="tab = 'vantagens'; carregarVantagens()">Resgatar Vantagem</button>
        <button [class.active]="tab === 'resgate'" (click)="tab = 'resgate'">Consultar Resgate</button>
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
        <p *ngIf="resumo && resumo.transacoes.length === 0" class="empty">Nenhuma transação encontrada.</p>
      </div>

      <!-- RESGATAR VANTAGEM -->
      <div *ngIf="tab === 'vantagens'" class="tab-content">
        <div *ngIf="resgateErro" class="alert alert-danger">{{ resgateErro }}</div>
        <div *ngIf="resgateSucesso" class="alert alert-success">
          <p>Resgate realizado com sucesso!</p>
          <p>Código: <strong>{{ ultimoResgate?.codigoUnico }}</strong></p>
          <p>Valor debitado: {{ ultimoResgate?.valorDebitado | number:'1.2-2' }} moedas</p>
          <p *ngIf="ultimoResgate?.qrCodeUrl">
            <img [src]="ultimoResgate!.qrCodeUrl" alt="QR Code" class="qr-img">
          </p>
        </div>

        <div class="vantagens-grid">
          <div *ngFor="let emp of empresas" class="empresa-block">
            <h4>{{ emp.nomeFantasia }}</h4>
            <div *ngFor="let v of emp.vantagens" class="vantagem-card">
              <img [src]="v.fotoUrl" [alt]="v.descricao" class="vantagem-img" onerror="this.src='https://via.placeholder.com/100'">
              <div class="vantagem-info">
                <p class="vantagem-desc">{{ v.descricao }}</p>
                <p class="vantagem-custo">{{ v.custoMoedas | number:'1.2-2' }} moedas</p>
                <button class="btn btn-sm btn-primary" (click)="resgatar(v.id)" [disabled]="resgatando">Resgatar</button>
              </div>
            </div>
          </div>
          <p *ngIf="empresas.length === 0" class="empty">Nenhuma vantagem disponível.</p>
        </div>
      </div>

      <!-- CONSULTAR RESGATE -->
      <div *ngIf="tab === 'resgate'" class="tab-content">
        <div class="form-inline">
          <label>ID do Resgate:
            <input [(ngModel)]="resgateConsultaId" name="resgateConsultaId" placeholder="UUID do resgate">
          </label>
          <button class="btn btn-sm" (click)="consultarResgate()">Consultar</button>
        </div>
        <div *ngIf="resgateConsulta" class="resgate-detail">
          <p><strong>Código:</strong> {{ resgateConsulta.codigoUnico }}</p>
          <p><strong>Data:</strong> {{ resgateConsulta.dataHora | date:'dd/MM/yyyy HH:mm' }}</p>
          <p><strong>Valor:</strong> {{ resgateConsulta.valorDebitado | number:'1.2-2' }} moedas</p>
          <p *ngIf="resgateConsulta.qrCodeUrl"><img [src]="resgateConsulta.qrCodeUrl" alt="QR Code" class="qr-img"></p>
        </div>
        <div *ngIf="resgateConsultaErro" class="alert alert-danger">{{ resgateConsultaErro }}</div>
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
    .tabs button.active { background: #3182ce; color: #fff; border-color: #3182ce; }
    .tab-content { background: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
    .saldo-card { text-align: center; background: #ebf8ff; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
    .saldo-card h3 { margin: 0; color: #2b6cb0; }
    .saldo { font-size: 2rem; font-weight: 700; color: #2b6cb0; }
    .filtro { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; }
    .filtro label { display: flex; align-items: center; gap: 0.3rem; }
    .filtro input { padding: 0.3rem; border: 1px solid #e2e8f0; border-radius: 4px; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 0.6rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
    .data-table th { background: #f7fafc; font-weight: 600; }
    .positivo { color: #38a169; }
    .negativo { color: #e53e3e; }
    .vantagens-grid { display: flex; flex-direction: column; gap: 1rem; }
    .empresa-block h4 { color: #2d3748; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3rem; }
    .vantagem-card { display: flex; gap: 1rem; padding: 0.8rem; border: 1px solid #e2e8f0; border-radius: 8px; align-items: center; margin-bottom: 0.5rem; }
    .vantagem-img { width: 80px; height: 80px; object-fit: cover; border-radius: 4px; }
    .vantagem-info { flex: 1; }
    .vantagem-desc { margin: 0; font-weight: 600; }
    .vantagem-custo { margin: 0.3rem 0; color: #2b6cb0; font-weight: 700; }
    .qr-img { max-width: 200px; margin-top: 0.5rem; }
    .form-inline { display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; }
    .form-inline input { padding: 0.4rem; border: 1px solid #e2e8f0; border-radius: 4px; min-width: 250px; }
    .resgate-detail { background: #f7fafc; padding: 1rem; border-radius: 8px; }
    .empty { color: #a0aec0; text-align: center; padding: 2rem; }
    .alert-danger { background: #fed7d7; color: #c53030; padding: 0.7rem; border-radius: 4px; margin-bottom: 1rem; }
    .alert-success { background: #c6f6d5; color: #276749; padding: 0.7rem; border-radius: 4px; margin-bottom: 1rem; }
    .btn { padding: 0.4rem 1rem; border: none; border-radius: 4px; cursor: pointer; background: #edf2f7; }
    .btn-sm { font-size: 0.9rem; }
    .btn-primary { background: #3182ce; color: #fff; }
    .btn-primary:hover { background: #2b6cb0; }
    .btn-primary:disabled { background: #a0aec0; }
    .btn-logout { background: #e53e3e; color: #fff; }
    .btn-logout:hover { background: #c53030; }
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
      error: (err) => this.resgateConsultaErro = err.error?.error || 'Resgate não encontrado'
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
