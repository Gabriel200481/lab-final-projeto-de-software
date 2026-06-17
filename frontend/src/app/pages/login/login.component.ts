import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">

      <!-- LEFT PANEL -->
      <div class="left">
        <div class="deco dc-1"></div>
        <div class="deco dc-2"></div>

        <div class="brand-wrap">
          <div class="coin-logo">
            <svg viewBox="0 0 80 80" fill="none" width="80" height="80">
              <circle cx="40" cy="40" r="38" fill="#0D0B06" stroke="#F5C842" stroke-width="2"/>
              <circle cx="40" cy="40" r="28" fill="none" stroke="#C8961E" stroke-width="1.5" stroke-dasharray="4 3"/>
              <text x="40" y="47" font-size="18" text-anchor="middle" fill="#F5C842"
                    font-weight="900" font-family="Segoe UI,sans-serif">$</text>
            </svg>
          </div>

          <h1 class="brand-name">STUDENT<br>PERKS <span>🎓</span></h1>
          <p class="brand-sub">Reconhecendo o mérito acadêmico<br>com recompensas reais</p>

          <ul class="features">
            <li>
              <span class="feat-dot feat-green"></span>
              Professores reconhecem alunos com moedas virtuais
            </li>
            <li>
              <span class="feat-dot feat-gold"></span>
              Troque moedas por vantagens exclusivas
            </li>
            <li>
              <span class="feat-dot feat-blue"></span>
              Empresas parceiras oferecem benefícios reais
            </li>
          </ul>
        </div>
      </div>

      <!-- RIGHT PANEL -->
      <div class="right">
        <div class="card">

          <div class="card-head">
            <div class="card-coin">$</div>
            <div>
              <h2>Moeda Estudantil</h2>
              <p>Faça login para continuar</p>
            </div>
          </div>

          <div *ngIf="erro" class="alert-err">{{ erro }}</div>

          <form (ngSubmit)="onLogin()">
            <div class="fg">
              <label for="email">Email</label>
              <input type="email" id="email" [(ngModel)]="email" name="email"
                     required placeholder="seu@email.com">
            </div>
            <div class="fg">
              <label for="senha">Senha</label>
              <div class="input-eye">
                <input [type]="mostrarSenha ? 'text' : 'password'" id="senha" [(ngModel)]="senha"
                       name="senha" required placeholder="Sua senha">
                <button type="button" class="eye-btn" (click)="mostrarSenha = !mostrarSenha" tabindex="-1">
                  <svg *ngIf="!mostrarSenha" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg *ngIf="mostrarSenha"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                </button>
              </div>
            </div>
            <button type="submit" [disabled]="loading" class="btn-login">
              {{ loading ? 'Entrando...' : 'Entrar' }}
            </button>
          </form>

          <div class="reg-links">
            <p>Não tem conta? Cadastre-se:</p>
            <div class="reg-row">
              <a routerLink="/cadastro-aluno" class="reg-btn">Sou Aluno</a>
              <a routerLink="/cadastro-empresa" class="reg-btn">Sou Empresa</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; margin: 0; padding: 0; }

    .page {
      display: flex;
      min-height: 100vh;
      background: #0D0B06;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }

    /* ── LEFT ── */
    .left {
      flex: 0 0 44%;
      background: #131108;
      border-right: 1px solid #2A2618;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem 2.5rem;
    }

    .deco {
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle, #C8961E, #0D0B06);
      pointer-events: none;
    }
    .dc-1 { width: 440px; height: 440px; top: -160px; right: -160px; opacity: 0.06; }
    .dc-2 { width: 300px; height: 300px; bottom: -120px; left: -120px; opacity: 0.05; }

    .brand-wrap {
      position: relative;
      z-index: 1;
      text-align: center;
      max-width: 360px;
    }

    .coin-logo {
      display: flex;
      justify-content: center;
      margin-bottom: 1.75rem;
      filter: drop-shadow(0 4px 20px rgba(245,200,66,0.35));
      animation: float 4s ease-in-out infinite;
    }
    @keyframes float {
      0%,100% { transform: translateY(0); }
      50% { transform: translateY(-7px); }
    }

    .brand-name {
      font-size: 2.6rem;
      font-weight: 900;
      line-height: 1.1;
      color: #F5C842;
      letter-spacing: 1px;
      margin-bottom: 0.75rem;
      text-shadow: 0 0 30px rgba(245,200,66,0.2);
    }
    .brand-name span { font-size: 2rem; }

    .brand-sub {
      font-size: 0.88rem;
      color: #7A7260;
      line-height: 1.7;
      margin-bottom: 2rem;
    }

    .features { list-style: none; text-align: left; }
    .features li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.82rem;
      color: #B0A890;
      background: rgba(255,255,255,0.03);
      border: 1px solid #2A2618;
      padding: 0.65rem 1rem;
      border-radius: 9px;
      margin-bottom: 0.5rem;
      transition: background 0.15s;
    }
    .features li:hover { background: rgba(200,150,30,0.04); }

    .feat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .feat-green { background: #22C55E; box-shadow: 0 0 6px rgba(34,197,94,0.5); }
    .feat-gold  { background: #F5C842; box-shadow: 0 0 6px rgba(245,200,66,0.5); }
    .feat-blue  { background: #3B82F6; box-shadow: 0 0 6px rgba(59,130,246,0.5); }

    /* ── RIGHT ── */
    .right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .card {
      background: #1A1810;
      border: 1px solid #2A2618;
      border-radius: 16px;
      padding: 2.5rem;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.4);
    }

    .card-head {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid #2A2618;
    }

    .card-coin {
      width: 46px; height: 46px;
      border-radius: 12px;
      background: linear-gradient(135deg, #C8961E, #F5C842);
      color: #0D0B06;
      font-weight: 900;
      font-size: 1.1rem;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 14px rgba(200,150,30,0.4);
    }

    .card-head h2 { font-size: 1rem; font-weight: 700; color: #F0EDE5; }
    .card-head p  { font-size: 0.78rem; color: #7A7260; margin-top: 0.1rem; }

    .alert-err {
      background: rgba(239,68,68,0.08);
      color: #EF4444;
      border: 1px solid rgba(239,68,68,0.2);
      padding: 0.7rem 0.9rem;
      border-radius: 8px;
      font-size: 0.82rem;
      font-weight: 500;
      margin-bottom: 1rem;
    }

    .fg { margin-bottom: 1rem; }
    .fg label {
      display: block;
      margin-bottom: 0.35rem;
      font-size: 0.78rem;
      font-weight: 600;
      color: #7A7260;
      letter-spacing: 0.3px;
    }
    .fg input {
      width: 100%;
      padding: 0.7rem 0.9rem;
      background: #0D0B06;
      border: 1px solid #3A3220;
      border-radius: 9px;
      font-size: 0.9rem;
      font-family: inherit;
      color: #F0EDE5;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
      box-sizing: border-box;
    }
    .fg input:focus { border-color: #C8961E; box-shadow: 0 0 0 3px rgba(200,150,30,0.12); }
    .fg input::placeholder { color: #4A4434; }

    .input-eye { position: relative; display: flex; align-items: center; }
    .input-eye input { padding-right: 2.75rem; }
    .eye-btn {
      position: absolute; right: 0.75rem;
      background: none; border: none; cursor: pointer; padding: 0;
      color: #4A4434; display: flex; align-items: center; transition: color 0.15s;
    }
    .eye-btn:hover { color: #C8961E; }
    .eye-btn svg { width: 17px; height: 17px; }

    .btn-login {
      width: 100%;
      padding: 0.82rem;
      background: linear-gradient(135deg, #C8961E, #F5C842);
      color: #0D0B06;
      border: none;
      border-radius: 9px;
      font-size: 0.92rem;
      font-weight: 800;
      font-family: inherit;
      cursor: pointer;
      transition: opacity 0.15s, transform 0.1s;
      margin-top: 0.5rem;
      letter-spacing: 0.3px;
      box-shadow: 0 4px 16px rgba(200,150,30,0.3);
    }
    .btn-login:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
    .btn-login:disabled { background: #2A2618; color: #5A5244; cursor: not-allowed; box-shadow: none; }

    .reg-links { margin-top: 1.75rem; text-align: center; }
    .reg-links p { font-size: 0.8rem; color: #5A5244; margin-bottom: 0.75rem; }
    .reg-row { display: flex; gap: 0.6rem; justify-content: center; }

    .reg-btn {
      flex: 1;
      padding: 0.55rem 1rem;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 700;
      text-decoration: none;
      text-align: center;
      transition: all 0.15s;
      background: rgba(200,150,30,0.07);
      color: #C8961E;
      border: 1px solid #3A3220;
    }
    .reg-btn:hover { background: linear-gradient(135deg,#C8961E,#F5C842); color: #0D0B06; border-color: #C8961E; }

    @media (max-width: 768px) {
      .page { flex-direction: column; }
      .left { flex: none; padding: 2rem 1.5rem; }
      .features { display: none; }
      .brand-name { font-size: 1.8rem; }
      .coin-logo { animation: none; }
      .right { padding: 1.5rem 1rem; }
      .card { padding: 1.75rem; }
    }
  `]
})
export class LoginComponent {
  email = '';
  senha = '';
  erro = '';
  loading = false;
  mostrarSenha = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.loading = true;
    this.erro = '';
    this.authService.login({ email: this.email, senha: this.senha }).subscribe({
      next: (user) => {
        this.loading = false;
        switch (user.papel) {
          case 'ALUNO':     this.router.navigate(['/aluno']);     break;
          case 'PROFESSOR': this.router.navigate(['/professor']); break;
          case 'EMPRESA':   this.router.navigate(['/empresa']);   break;
        }
      },
      error: (err) => {
        this.loading = false;
        this.erro = err.error?.error || 'Credenciais inválidas';
      }
    });
  }
}
