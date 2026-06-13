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
    .app-wrapper { min-height: 100vh; display: flex; flex-direction: column; background: #F1F5F9; }

    /* ── Header ── */
    .app-header {
      background: #2563EB;
      color: #fff;
      padding: 0 2rem;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 1px 0 rgba(0,0,0,0.1), 0 4px 16px rgba(37,99,235,0.25);
    }

    .header-brand { display: flex; align-items: center; gap: 0.85rem; }

    .header-coin {
      width: 38px; height: 38px;
      border-radius: 10px;
      background: linear-gradient(135deg, #F59E0B, #D97706);
      color: #fff;
      font-weight: 900; font-size: 0.8rem;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(245,158,11,0.5);
      letter-spacing: 0.5px;
    }

    .header-texts { display: flex; flex-direction: column; }
    .brand-name { font-weight: 700; font-size: 0.95rem; line-height: 1.2; letter-spacing: -0.2px; }
    .role-label { font-size: 0.72rem; opacity: 0.7; font-weight: 500; }

    .header-actions { display: flex; align-items: center; gap: 0.75rem; }

    .user-chip {
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 999px;
      padding: 0.3rem 0.85rem;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .btn-logout {
      padding: 0.4rem 0.95rem;
      background: rgba(255,255,255,0.12);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 8px;
      font-size: 0.83rem;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.15s;
    }
    .btn-logout:hover { background: rgba(255,255,255,0.22); }

    /* ── Layout ── */
    .page-content { flex: 1; padding: 1.75rem 1.5rem; }
    .content-wrapper { max-width: 980px; margin: 0 auto; }

    /* ── Tabs ── */
    .tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 1.5rem;
      background: #fff;
      padding: 4px;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      flex-wrap: wrap;
    }

    .tabs button {
      flex: 1;
      min-width: 120px;
      padding: 0.6rem 1rem;
      border: none;
      border-radius: 9px;
      background: transparent;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
      font-family: inherit;
      color: #64748B;
      transition: all 0.15s;
    }
    .tabs button:hover:not(.active) { background: #F8FAFC; color: #2563EB; }
    .tabs button.active {
      background: #2563EB;
      color: #fff;
      box-shadow: 0 1px 3px rgba(37,99,235,0.35);
    }

    /* ── Tab content ── */
    .tab-content {
      background: #fff;
      padding: 1.75rem;
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
    }

    /* ── Saldo card ── */
    .saldo-card {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      background: linear-gradient(135deg, #EFF6FF, #DBEAFE);
      padding: 1.25rem 1.5rem;
      border-radius: 14px;
      margin-bottom: 1.5rem;
      border: 1px solid #BFDBFE;
    }

    .saldo-icon {
      width: 52px; height: 52px;
      border-radius: 14px;
      background: linear-gradient(135deg, #F59E0B, #D97706);
      color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-weight: 900; font-size: 1.3rem;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(245,158,11,0.4);
    }

    .saldo-label { margin: 0; font-size: 0.78rem; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .saldo { font-size: 2.1rem; font-weight: 800; color: #2563EB; letter-spacing: -1px; line-height: 1; }
    .saldo-unit { font-size: 0.9rem; color: #64748B; margin-left: 0.25rem; font-weight: 500; }

    /* ── Filtro ── */
    .filtro { display: flex; gap: 0.75rem; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; }
    .filtro label { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; font-weight: 500; color: #374151; }
    .filtro input {
      padding: 0.4rem 0.75rem;
      border: 1.5px solid #E2E8F0;
      border-radius: 8px;
      font-size: 0.875rem;
      font-family: inherit;
      outline: none;
      color: #0F172A;
      transition: border-color 0.15s;
    }
    .filtro input:focus { border-color: #2563EB; }

    /* ── Table ── */
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th {
      padding: 0.6rem 0.85rem;
      text-align: left;
      font-size: 0.75rem;
      font-weight: 700;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid #F1F5F9;
      background: #F8FAFC;
    }
    .data-table td {
      padding: 0.75rem 0.85rem;
      border-bottom: 1px solid #F1F5F9;
      font-size: 0.875rem;
      color: #374151;
    }
    .data-table tr:last-child td { border-bottom: none; }
    .data-table tbody tr:hover td { background: #FAFBFF; }
    .positivo { color: #059669; font-weight: 700; }
    .negativo { color: #DC2626; font-weight: 700; }

    /* ── Vantagens ── */
    .vantagens-grid { display: flex; flex-direction: column; gap: 1.75rem; }

    .empresa-titulo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #0F172A;
      font-size: 0.95rem;
      font-weight: 700;
      padding-bottom: 0.75rem;
      margin-bottom: 0.85rem;
      border-bottom: 2px solid #EFF6FF;
    }

    .vantagem-card {
      display: flex;
      gap: 1rem;
      padding: 1rem 1.1rem;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      align-items: center;
      margin-bottom: 0.65rem;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .vantagem-card:hover { border-color: #BFDBFE; box-shadow: 0 2px 12px rgba(37,99,235,0.08); }
    .vantagem-img { width: 72px; height: 72px; object-fit: cover; border-radius: 10px; flex-shrink: 0; background: #F1F5F9; }
    .vantagem-info { flex: 1; }
    .vantagem-desc { margin: 0 0 0.3rem; font-weight: 600; color: #0F172A; font-size: 0.9rem; }
    .vantagem-custo { margin: 0 0 0.6rem; color: #2563EB; font-weight: 700; font-size: 0.9rem; }

    /* ── QR / Resgate detail ── */
    .qr-img { max-width: 180px; margin-top: 0.75rem; border-radius: 10px; border: 1px solid #E2E8F0; }

    .form-inline { display: flex; gap: 0.75rem; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; }
    .form-inline input {
      padding: 0.6rem 0.9rem;
      border: 1.5px solid #E2E8F0;
      border-radius: 10px;
      min-width: 280px;
      font-size: 0.9rem;
      font-family: inherit;
      outline: none;
      color: #0F172A;
      transition: border-color 0.15s;
    }
    .form-inline input:focus { border-color: #2563EB; }

    .resgate-detail {
      background: #F8FAFC;
      padding: 1.25rem;
      border-radius: 12px;
      border: 1px solid #E2E8F0;
      line-height: 2;
      font-size: 0.9rem;
    }

    /* ── Alerts ── */
    .alert-danger {
      background: #FEF2F2; color: #DC2626;
      padding: 0.75rem 1rem; border-radius: 10px;
      border: 1px solid #FECACA; margin-bottom: 1rem;
      font-size: 0.875rem; font-weight: 500;
    }
    .alert-success {
      background: #ECFDF5; color: #059669;
      padding: 1rem 1.1rem; border-radius: 10px;
      border: 1px solid #A7F3D0; margin-bottom: 1rem;
      font-size: 0.875rem; font-weight: 500; line-height: 1.9;
    }
    .empty { color: #94A3B8; text-align: center; padding: 3rem; font-size: 0.9rem; }

    /* ── Buttons ── */
    .btn {
      padding: 0.45rem 1rem;
      border: none; border-radius: 8px;
      cursor: pointer; font-size: 0.85rem; font-family: inherit;
      background: #F1F5F9; color: #475569;
      transition: background 0.15s;
    }
    .btn-sm { font-size: 0.82rem; padding: 0.38rem 0.85rem; }
    .btn-primary {
      background: #2563EB;
      color: #fff;
      box-shadow: 0 1px 2px rgba(37,99,235,0.25);
    }
    .btn-primary:hover:not(:disabled) { background: #1D4ED8; }
    .btn-primary:disabled { background: #94A3B8; cursor: not-allowed; box-shadow: none; }
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
