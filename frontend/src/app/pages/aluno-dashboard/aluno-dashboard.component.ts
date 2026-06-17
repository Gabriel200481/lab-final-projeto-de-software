import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import {
  ExtratoResumoResponse,
  EmpresaResponse, ResgateResponse
} from '../../models/usuario.model';

@Component({
  selector: 'app-aluno-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="shell">

      <!-- TOP BAR -->
      <header class="topbar">
        <div class="brand">
          <div class="coin-logo">
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <circle cx="12" cy="12" r="10" fill="#0D0B06" stroke="#F5C842" stroke-width="1.5"/>
              <text x="12" y="16" text-anchor="middle" font-size="9" font-weight="900" fill="#F5C842" font-family="sans-serif">$</text>
            </svg>
          </div>
          <span class="brand-text">STUDENT PERKS <span class="brand-cap">🎓</span></span>
        </div>
        <div class="topbar-right">
          <div class="avatar">{{ userName.charAt(0) }}</div>
          <div class="user-info">
            <span class="user-name">{{ userName }}</span>
            <span class="user-role">Aluno</span>
          </div>
          <button class="icon-btn" title="Notificações">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </button>
          <button class="icon-btn" title="Configurações">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
          </button>
          <button class="btn-logout" (click)="logout()">Sair</button>
        </div>
      </header>

      <div class="body-row">

        <!-- SIDEBAR -->
        <aside class="sidebar">
          <button class="nav-item" [class.active]="tab === 'extrato'" (click)="tab='extrato'; carregarExtrato()" title="Home">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Home</span>
          </button>
          <button class="nav-item" [class.active]="tab === 'vantagens'" (click)="tab='vantagens'; carregarVantagens()" title="Vantagens">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 12 20 22 4 22 4 12"/>
              <rect x="2" y="7" width="20" height="5"/>
              <line x1="12" y1="22" x2="12" y2="7"/>
              <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
              <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
            </svg>
            <span>Vantagens</span>
          </button>
          <button class="nav-item" [class.active]="tab === 'extrato'" (click)="tab='extrato'; carregarExtrato()" title="Histórico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Histórico</span>
          </button>
          <button class="nav-item" [class.active]="tab === 'resgate'" (click)="tab='resgate'" title="Perfil">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Perfil</span>
          </button>
        </aside>

        <!-- MAIN -->
        <main class="main">

          <!-- TABS -->
          <div class="tabs">
            <button [class.active]="tab === 'extrato'"   (click)="tab='extrato';   carregarExtrato()">Extrato</button>
            <button [class.active]="tab === 'vantagens'" (click)="tab='vantagens'; carregarVantagens()">Resgatar Vantagem</button>
            <button [class.active]="tab === 'resgate'"   (click)="tab='resgate'">Consultar Resgate</button>
          </div>

          <!-- ── EXTRATO ── -->
          <div *ngIf="tab === 'extrato'">

            <div class="saldo-card" *ngIf="resumo">
              <div>
                <p class="saldo-label">Saldo Atual</p>
                <div class="saldo-row">
                  <span class="saldo-num">{{ resumo.saldoAtual | number:'1.0-0' }}</span>
                  <span class="saldo-unit">MOEDAS</span>
                </div>
              </div>
              <span class="saldo-updated">Atualizado em: {{ hoje | date:'dd/MM/yyyy' }}</span>
            </div>

            <div class="filter-bar">
              <span class="filter-label">Filtrar por data:</span>
              <div class="date-input">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <input type="date" [(ngModel)]="filtroInicio" name="filtroInicio">
              </div>
              <span class="filter-sep">a</span>
              <div class="date-input">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <input type="date" [(ngModel)]="filtroFim" name="filtroFim">
              </div>
              <button class="btn-filter" (click)="carregarExtrato()">Filtrar</button>
            </div>

            <div class="data-wrap" *ngIf="resumo && resumo.transacoes.length > 0">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Descrição</th>
                    <th>Valor (Moedas)</th>
                    <th>Tipo</th>
                    <th>Origem</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let t of resumo.transacoes">
                    <td>{{ t.dataHora | date:'dd/MM/yyyy' }}</td>
                    <td>
                      <div class="desc-cell">
                        <span class="tx-icon" [class.entrada]="t.valor > 0" [class.saida]="t.valor < 0">
                          <svg *ngIf="t.valor > 0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 5 5 12"/></svg>
                          <svg *ngIf="t.valor < 0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 19 19 12"/></svg>
                        </span>
                        {{ t.mensagem || '—' }}
                      </div>
                    </td>
                    <td [class.valor-positivo]="t.valor > 0" [class.valor-negativo]="t.valor < 0">
                      {{ t.valor > 0 ? '+' : '' }}{{ t.valor | number:'1.0-0' }}
                    </td>
                    <td>
                      <span class="badge" [class.badge-entrada]="t.valor > 0" [class.badge-saida]="t.valor < 0">
                        <span class="badge-dot"></span>
                        {{ t.valor > 0 ? 'Entrada (+)' : 'Saída (-)' }}
                      </span>
                    </td>
                    <td>{{ t.remetenteNome || '—' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p *ngIf="resumo && resumo.transacoes.length === 0" class="empty">Nenhuma transação encontrada.</p>

          </div>

          <!-- ── RESGATAR VANTAGEM ── -->
          <div *ngIf="tab === 'vantagens'">
            <div *ngIf="resgateErro" class="alert alert-danger">{{ resgateErro }}</div>
            <div *ngIf="resgateSucesso" class="alert alert-success">
              <p>Resgate realizado! Código: <strong>{{ ultimoResgate?.codigoUnico }}</strong></p>
              <p>Debitado: {{ ultimoResgate?.valorDebitado | number:'1.0-0' }} moedas</p>
              <img *ngIf="ultimoResgate?.qrCodeUrl" [src]="ultimoResgate!.qrCodeUrl" alt="QR Code" class="qr-img">
            </div>

            <div *ngFor="let emp of empresas" class="empresa-block">
              <p class="empresa-titulo">{{ emp.nomeFantasia }}</p>
              <div *ngFor="let v of emp.vantagens" class="vantagem-item">
                <img [src]="v.fotoUrl" [alt]="v.descricao" class="vantagem-img"
                     onerror="this.src='https://via.placeholder.com/64'">
                <div class="vantagem-info">
                  <p class="vantagem-desc">{{ v.descricao }}</p>
                  <p class="vantagem-custo">{{ v.custoMoedas | number:'1.0-0' }} moedas</p>
                </div>
                <button class="btn-resgatar" (click)="resgatar(v.id)" [disabled]="resgatando">
                  Resgatar
                </button>
              </div>
            </div>
            <p *ngIf="empresas.length === 0" class="empty">Nenhuma vantagem disponível.</p>
          </div>

          <!-- ── CONSULTAR RESGATE ── -->
          <div *ngIf="tab === 'resgate'">
            <div class="resgate-form">
              <p class="form-title">Consultar Resgate</p>
              <div class="input-group">
                <input class="input-dark" [(ngModel)]="resgateConsultaId" name="resgateConsultaId"
                       placeholder="Cole o UUID do resgate aqui...">
                <button class="btn-buscar" (click)="consultarResgate()">Consultar</button>
              </div>
              <div *ngIf="resgateConsulta" class="resgate-result">
                <p><strong>Código:</strong> {{ resgateConsulta.codigoUnico }}</p>
                <p><strong>Data:</strong> {{ resgateConsulta.dataHora | date:'dd/MM/yyyy HH:mm' }}</p>
                <p><strong>Valor:</strong> {{ resgateConsulta.valorDebitado | number:'1.0-0' }} moedas</p>
                <img *ngIf="resgateConsulta.qrCodeUrl" [src]="resgateConsulta.qrCodeUrl" alt="QR Code" class="qr-img">
              </div>
              <div *ngIf="resgateConsultaErro" class="alert alert-danger">{{ resgateConsultaErro }}</div>
            </div>
          </div>

        </main>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .shell {
      min-height: 100vh;
      background: #0D0B06;
      color: #F0EDE5;
      font-family: 'Segoe UI', system-ui, sans-serif;
      display: flex;
      flex-direction: column;
    }

    /* ── TOPBAR ── */
    .topbar {
      height: 58px;
      background: #131108;
      border-bottom: 1px solid #2A2618;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      flex-shrink: 0;
    }

    .brand { display: flex; align-items: center; gap: 0.65rem; }

    .coin-logo {
      width: 34px; height: 34px;
      background: linear-gradient(135deg, #C8961E, #F5C842);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 14px rgba(245,200,66,0.35);
    }

    .brand-text {
      font-size: 0.92rem;
      font-weight: 800;
      color: #F5C842;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .brand-cap { font-size: 1rem; }

    .topbar-right { display: flex; align-items: center; gap: 0.6rem; }

    .avatar {
      width: 34px; height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #C8961E, #F5C842);
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 0.9rem; color: #0D0B06;
      border: 2px solid #2A2618;
    }

    .user-info { display: flex; flex-direction: column; line-height: 1.2; }
    .user-name { font-size: 0.82rem; font-weight: 600; color: #F0EDE5; }
    .user-role { font-size: 0.68rem; color: #7A7260; }

    .icon-btn {
      width: 30px; height: 30px;
      background: rgba(255,255,255,0.04);
      border: 1px solid #2A2618;
      border-radius: 7px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      color: #5A5244;
      transition: all 0.15s;
    }
    .icon-btn:hover { background: rgba(245,200,66,0.08); color: #F5C842; border-color: #C8961E; }
    .icon-btn svg { width: 15px; height: 15px; }

    .btn-logout {
      padding: 0.3rem 0.8rem;
      background: rgba(239,68,68,0.08);
      color: #EF4444;
      border: 1px solid rgba(239,68,68,0.2);
      border-radius: 7px;
      font-size: 0.73rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn-logout:hover { background: rgba(239,68,68,0.18); }

    /* ── BODY ── */
    .body-row { display: flex; flex: 1; overflow: hidden; }

    /* ── SIDEBAR ── */
    .sidebar {
      width: 78px;
      background: #131108;
      border-right: 1px solid #2A2618;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 1.25rem;
      gap: 0.15rem;
      flex-shrink: 0;
    }

    .nav-item {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.28rem;
      padding: 0.7rem 0;
      background: none;
      border: none;
      border-left: 3px solid transparent;
      cursor: pointer;
      color: #4A4434;
      font-size: 0.6rem;
      font-family: inherit;
      font-weight: 500;
      letter-spacing: 0.3px;
      transition: all 0.15s;
    }
    .nav-item:hover { color: #C8961E; background: rgba(200,150,30,0.04); }
    .nav-item.active {
      color: #F5C842;
      border-left-color: #F5C842;
      background: rgba(245,200,66,0.06);
    }
    .nav-item svg { width: 20px; height: 20px; }

    /* ── MAIN ── */
    .main {
      flex: 1;
      padding: 1.5rem 1.75rem;
      overflow-y: auto;
    }

    /* ── TABS ── */
    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }

    .tabs button {
      flex: 1;
      padding: 0.6rem 0.75rem;
      background: transparent;
      border: 1.5px solid #2A2618;
      border-radius: 7px;
      color: #4A4434;
      font-size: 0.72rem;
      font-weight: 700;
      font-family: inherit;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.15s;
    }
    .tabs button:hover:not(.active) { border-color: #5A5244; color: #9A8860; }
    .tabs button.active {
      border-color: #C8961E;
      color: #F5C842;
      background: rgba(200,150,30,0.06);
      box-shadow: 0 0 14px rgba(200,150,30,0.1);
    }

    /* ── SALDO CARD ── */
    .saldo-card {
      background: #1A1810;
      border: 1px solid #2A2618;
      border-radius: 12px;
      padding: 1.1rem 1.4rem;
      margin-bottom: 0.85rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .saldo-label {
      font-size: 0.68rem;
      font-weight: 700;
      color: #F5C842;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      margin-bottom: 0.3rem;
    }

    .saldo-row { display: flex; align-items: baseline; gap: 0.45rem; }

    .saldo-num {
      font-size: 3.2rem;
      font-weight: 900;
      color: #F5C842;
      line-height: 1;
      letter-spacing: -2px;
      text-shadow: 0 0 24px rgba(245,200,66,0.25);
    }

    .saldo-unit {
      font-size: 0.75rem;
      font-weight: 700;
      color: #5A5244;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .saldo-updated {
      font-size: 0.7rem;
      color: #4A4434;
    }

    /* ── FILTER BAR ── */
    .filter-bar {
      background: #1A1810;
      border: 1px solid #2A2618;
      border-radius: 10px;
      padding: 0.75rem 1.1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.85rem;
      flex-wrap: wrap;
    }

    .filter-label { font-size: 0.78rem; color: #7A7260; font-weight: 500; flex-shrink: 0; }

    .date-input {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      background: #0D0B06;
      border: 1px solid #3A3220;
      border-radius: 7px;
      padding: 0.38rem 0.7rem;
      transition: border-color 0.15s;
    }
    .date-input:focus-within { border-color: #C8961E; }
    .date-input svg { width: 13px; height: 13px; color: #5A5244; flex-shrink: 0; }
    .date-input input {
      background: none;
      border: none;
      color: #C8BEA8;
      font-size: 0.8rem;
      font-family: inherit;
      outline: none;
      width: 108px;
    }
    .date-input input::-webkit-calendar-picker-indicator {
      filter: invert(0.4) sepia(1) hue-rotate(10deg);
      cursor: pointer;
    }

    .filter-sep { color: #4A4434; font-size: 0.8rem; }

    .btn-filter {
      padding: 0.4rem 1.1rem;
      background: #2563EB;
      color: #fff;
      border: none;
      border-radius: 7px;
      font-size: 0.78rem;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.15s;
    }
    .btn-filter:hover { background: #1D4ED8; }

    /* ── TABLE ── */
    .data-wrap {
      background: #1A1810;
      border: 1px solid #2A2618;
      border-radius: 12px;
      overflow: hidden;
    }

    .data-table { width: 100%; border-collapse: collapse; }

    .data-table th {
      padding: 0.65rem 1rem;
      text-align: left;
      font-size: 0.65rem;
      font-weight: 700;
      color: #C8961E;
      letter-spacing: 0.9px;
      text-transform: uppercase;
      border-bottom: 1px solid #2A2618;
      background: #1A1810;
    }

    .data-table td {
      padding: 0.8rem 1rem;
      font-size: 0.8rem;
      color: #B0A890;
      border-bottom: 1px solid #1E1C12;
    }
    .data-table tr:last-child td { border-bottom: none; }
    .data-table tbody tr:hover td { background: rgba(255,255,255,0.015); }

    .desc-cell { display: flex; align-items: center; gap: 0.55rem; color: #D4CCB4; }

    .tx-icon {
      width: 26px; height: 26px;
      border-radius: 7px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .tx-icon.entrada { background: rgba(34,197,94,0.12); color: #22C55E; }
    .tx-icon.saida   { background: rgba(239,68,68,0.12);  color: #EF4444; }

    .valor-positivo { color: #22C55E; font-weight: 700; }
    .valor-negativo { color: #EF4444; font-weight: 700; }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.22rem 0.6rem;
      border-radius: 999px;
      font-size: 0.7rem;
      font-weight: 600;
      white-space: nowrap;
    }
    .badge-entrada { background: rgba(34,197,94,0.1);  color: #22C55E; border: 1px solid rgba(34,197,94,0.22); }
    .badge-saida   { background: rgba(239,68,68,0.1);  color: #EF4444; border: 1px solid rgba(239,68,68,0.22); }
    .badge-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
    .badge-entrada .badge-dot { background: #22C55E; }
    .badge-saida   .badge-dot { background: #EF4444; }

    /* ── VANTAGENS ── */
    .empresa-block { margin-bottom: 1.5rem; }

    .empresa-titulo {
      font-size: 0.82rem;
      font-weight: 700;
      color: #F5C842;
      margin-bottom: 0.65rem;
      padding-bottom: 0.45rem;
      border-bottom: 1px solid #2A2618;
      letter-spacing: 0.3px;
    }

    .vantagem-item {
      display: flex;
      gap: 0.9rem;
      padding: 0.75rem 0.9rem;
      background: #1A1810;
      border: 1px solid #2A2618;
      border-radius: 10px;
      align-items: center;
      margin-bottom: 0.5rem;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .vantagem-item:hover { border-color: #C8961E; box-shadow: 0 0 14px rgba(200,150,30,0.07); }

    .vantagem-img {
      width: 60px; height: 60px;
      border-radius: 8px;
      object-fit: cover;
      background: #2A2618;
      flex-shrink: 0;
    }

    .vantagem-info { flex: 1; }
    .vantagem-desc { font-size: 0.85rem; font-weight: 600; color: #D4CCB4; margin-bottom: 0.25rem; }
    .vantagem-custo { font-size: 0.8rem; color: #F5C842; font-weight: 700; }

    .btn-resgatar {
      padding: 0.4rem 1rem;
      background: linear-gradient(135deg, #C8961E, #F5C842);
      color: #0D0B06;
      border: none;
      border-radius: 7px;
      font-size: 0.78rem;
      font-weight: 800;
      font-family: inherit;
      cursor: pointer;
      transition: opacity 0.15s, transform 0.1s;
      flex-shrink: 0;
    }
    .btn-resgatar:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
    .btn-resgatar:disabled { background: #2A2618; color: #5A5244; cursor: not-allowed; }

    /* ── CONSULTAR RESGATE ── */
    .resgate-form {
      background: #1A1810;
      border: 1px solid #2A2618;
      border-radius: 12px;
      padding: 1.5rem;
    }

    .form-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: #F5C842;
      margin-bottom: 1rem;
      letter-spacing: 0.3px;
    }

    .input-group { display: flex; gap: 0.65rem; margin-bottom: 1rem; }

    .input-dark {
      flex: 1;
      padding: 0.6rem 0.9rem;
      background: #0D0B06;
      border: 1px solid #3A3220;
      border-radius: 8px;
      color: #F0EDE5;
      font-size: 0.85rem;
      font-family: inherit;
      outline: none;
      transition: border-color 0.15s;
    }
    .input-dark:focus { border-color: #C8961E; }
    .input-dark::placeholder { color: #4A4434; }

    .btn-buscar {
      padding: 0.6rem 1.2rem;
      background: #2563EB;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.15s;
      flex-shrink: 0;
    }
    .btn-buscar:hover { background: #1D4ED8; }

    .resgate-result {
      background: #0D0B06;
      border: 1px solid #2A2618;
      border-radius: 9px;
      padding: 1rem 1.1rem;
      font-size: 0.82rem;
      color: #B0A890;
      line-height: 2;
    }
    .resgate-result strong { color: #F5C842; }

    .qr-img {
      max-width: 150px;
      margin-top: 0.75rem;
      border-radius: 8px;
      border: 1px solid #2A2618;
      display: block;
    }

    /* ── ALERTS ── */
    .alert {
      padding: 0.75rem 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      font-size: 0.82rem;
      font-weight: 500;
      line-height: 1.7;
    }
    .alert strong { font-weight: 800; }
    .alert-danger  { background: rgba(239,68,68,0.08);  color: #EF4444; border: 1px solid rgba(239,68,68,0.2); }
    .alert-success { background: rgba(34,197,94,0.08);  color: #22C55E; border: 1px solid rgba(34,197,94,0.2); }

    .empty { text-align: center; color: #4A4434; padding: 3rem; font-size: 0.85rem; }

    /* ── RESPONSIVE ── */
    @media (max-width: 640px) {
      .sidebar { display: none; }
      .tabs { flex-direction: column; }
      .saldo-num { font-size: 2.4rem; }
      .filter-bar { gap: 0.5rem; }
      .date-input input { width: 90px; }
    }
  `]
})
export class AlunoDashboardComponent implements OnInit {
  tab = 'extrato';
  userName = '';
  userId = '';
  hoje = new Date();
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
    this.hoje = new Date();
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
