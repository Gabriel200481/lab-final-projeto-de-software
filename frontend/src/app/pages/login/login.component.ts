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
    <div class="login-page">

      <div class="login-left">
        <div class="deco-circle dc-1"></div>
        <div class="deco-circle dc-2"></div>
        <div class="deco-circle dc-3"></div>

        <div class="brand-content">
          <div class="coin-logo">
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="90" height="90">
              <circle cx="40" cy="40" r="38" fill="#f9a825" stroke="#e65100" stroke-width="2.5"/>
              <circle cx="40" cy="40" r="29" fill="none" stroke="#fff8e1" stroke-width="2"/>
              <text x="40" y="48" font-size="17" text-anchor="middle" fill="#7f3500"
                    font-weight="900" font-family="Segoe UI, sans-serif">ME</text>
            </svg>
          </div>

          <h1 class="brand-title">Moeda<br>Estudantil</h1>
          <p class="brand-tagline">
            Reconhecendo o merito academico<br>com recompensas reais
          </p>

          <ul class="brand-features">
            <li>
              <span class="feat-icon feat-grad"></span>
              <span>Professores reconhecem alunos com moedas virtuais</span>
            </li>
            <li>
              <span class="feat-icon feat-coin"></span>
              <span>Troque moedas por vantagens exclusivas</span>
            </li>
            <li>
              <span class="feat-icon feat-biz"></span>
              <span>Empresas parceiras oferecem beneficios reais</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="login-right">
        <div class="login-card">

          <div class="login-card-header">
            <div class="login-coin-sm">ME</div>
            <div>
              <h2>Moeda Estudantil</h2>
              <p>Faca login para continuar</p>
            </div>
          </div>

          <div *ngIf="erro" class="alert alert-danger">{{ erro }}</div>

          <form (ngSubmit)="onLogin()">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" [(ngModel)]="email" name="email"
                     required placeholder="seu&#64;email.com">
            </div>
            <div class="form-group">
              <label for="senha">Senha</label>
              <input type="password" id="senha" [(ngModel)]="senha" name="senha"
                     required placeholder="Sua senha">
            </div>
            <button type="submit" [disabled]="loading" class="btn-login">
              {{ loading ? 'Entrando...' : 'Entrar' }}
            </button>
          </form>

          <div class="links">
            <p>Nao tem conta? Cadastre-se:</p>
            <div class="register-links">
              <a routerLink="/cadastro-aluno" class="reg-link reg-aluno">Sou Aluno</a>
              <a routerLink="/cadastro-empresa" class="reg-link reg-empresa">Sou Empresa</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      display: flex;
      min-height: 100vh;
    }

    /* ── Left panel ── */
    .login-left {
      flex: 0 0 44%;
      background: linear-gradient(145deg, #0A0F2E 0%, #1a237e 55%, #1565c0 100%);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem 2.5rem;
    }

    .deco-circle {
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle, #F59E0B, #D97706);
      pointer-events: none;
    }
    .dc-1 { width: 420px; height: 420px; top: -140px; right: -150px; opacity: 0.09; }
    .dc-2 { width: 280px; height: 280px; bottom: -100px; left: -100px; opacity: 0.07; }
    .dc-3 { width: 160px; height: 160px; top: 52%; left: 68%; opacity: 0.05; }

    .brand-content {
      position: relative;
      z-index: 1;
      color: #fff;
      text-align: center;
      max-width: 360px;
    }

    .coin-logo {
      display: flex;
      justify-content: center;
      margin-bottom: 2rem;
      filter: drop-shadow(0 6px 20px rgba(245,158,11,0.6));
      animation: float 4s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    .brand-title {
      font-size: 2.8rem;
      font-weight: 900;
      line-height: 1.1;
      margin-bottom: 0.75rem;
      letter-spacing: -1px;
    }

    .brand-tagline {
      font-size: 0.95rem;
      opacity: 0.78;
      margin-bottom: 2.5rem;
      line-height: 1.7;
    }

    .brand-features { list-style: none; text-align: left; }

    .brand-features li {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      margin-bottom: 0.65rem;
      font-size: 0.875rem;
      opacity: 0.92;
      background: rgba(255,255,255,0.07);
      backdrop-filter: blur(4px);
      padding: 0.65rem 1rem;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.1);
      transition: background 0.2s;
    }
    .brand-features li:hover { background: rgba(255,255,255,0.12); }

    .feat-icon {
      width: 28px; height: 28px;
      border-radius: 8px;
      flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .feat-grad { background: linear-gradient(135deg,#059669,#047857); }
    .feat-coin { background: linear-gradient(135deg,#F59E0B,#D97706); }
    .feat-biz  { background: linear-gradient(135deg,#7C3AED,#6D28D9); }

    /* ── Right panel ── */
    .login-right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #F1F5F9;
      padding: 2rem;
    }

    .login-card {
      background: #fff;
      border-radius: 20px;
      padding: 2.75rem;
      width: 100%;
      max-width: 430px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 20px 40px rgba(0,0,0,0.08);
    }

    .login-card-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #F1F5F9;
    }

    .login-coin-sm {
      width: 50px; height: 50px;
      border-radius: 14px;
      background: linear-gradient(135deg, #F59E0B, #D97706);
      color: #fff;
      font-weight: 900;
      font-size: 0.95rem;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(245,158,11,0.4);
      letter-spacing: 0.5px;
    }

    .login-card-header h2 {
      font-size: 1.05rem;
      color: #0F172A;
      margin: 0;
      font-weight: 700;
    }

    .login-card-header p {
      font-size: 0.82rem;
      color: #64748B;
      margin: 0.15rem 0 0;
    }

    .form-group { margin-bottom: 1.1rem; }

    .form-group label {
      display: block;
      margin-bottom: 0.4rem;
      font-weight: 600;
      font-size: 0.82rem;
      color: #374151;
      letter-spacing: 0.2px;
    }

    .form-group input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1.5px solid #E2E8F0;
      border-radius: 10px;
      font-size: 0.95rem;
      font-family: inherit;
      box-sizing: border-box;
      transition: border-color 0.15s, box-shadow 0.15s;
      outline: none;
      color: #0F172A;
      background: #FAFAFA;
    }
    .form-group input:focus {
      border-color: #2563EB;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
    }
    .form-group input::placeholder { color: #94A3B8; }

    .btn-login {
      width: 100%;
      padding: 0.85rem;
      background: #2563EB;
      color: #fff;
      border: none;
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
      margin-top: 0.5rem;
      letter-spacing: 0.2px;
      box-shadow: 0 1px 2px rgba(37,99,235,0.3);
    }
    .btn-login:hover:not(:disabled) {
      background: #1D4ED8;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(37,99,235,0.35);
    }
    .btn-login:active:not(:disabled) { transform: translateY(0); }
    .btn-login:disabled { background: #94A3B8; cursor: not-allowed; box-shadow: none; }

    .alert-danger {
      background: #FEF2F2;
      color: #DC2626;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      border: 1px solid #FECACA;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .links { margin-top: 1.75rem; text-align: center; }

    .links p {
      color: #64748B;
      font-size: 0.85rem;
      margin-bottom: 0.75rem;
    }

    .register-links { display: flex; gap: 0.65rem; justify-content: center; }

    .reg-link {
      flex: 1;
      padding: 0.6rem 1rem;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 600;
      text-decoration: none !important;
      transition: all 0.15s;
      border: 1.5px solid transparent;
      text-align: center;
    }

    .reg-aluno {
      background: #EFF6FF;
      color: #2563EB;
      border-color: #BFDBFE;
    }
    .reg-aluno:hover { background: #2563EB; color: #fff; border-color: #2563EB; }

    .reg-empresa {
      background: #F5F3FF;
      color: #7C3AED;
      border-color: #DDD6FE;
    }
    .reg-empresa:hover { background: #7C3AED; color: #fff; border-color: #7C3AED; }

    @media (max-width: 768px) {
      .login-page { flex-direction: column; }
      .login-left { flex: none; padding: 2rem 1.5rem; min-height: auto; }
      .brand-features { display: none; }
      .brand-title { font-size: 2rem; }
      .brand-tagline { margin-bottom: 0; }
      .coin-logo { animation: none; }
      .login-right { padding: 1.5rem 1rem; }
      .login-card { padding: 2rem; border-radius: 16px; }
    }
  `]
})
export class LoginComponent {
  email = '';
  senha = '';
  erro = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.loading = true;
    this.erro = '';
    this.authService.login({ email: this.email, senha: this.senha }).subscribe({
      next: (user) => {
        this.loading = false;
        switch (user.papel) {
          case 'ALUNO': this.router.navigate(['/aluno']); break;
          case 'PROFESSOR': this.router.navigate(['/professor']); break;
          case 'EMPRESA': this.router.navigate(['/empresa']); break;
        }
      },
      error: (err) => {
        this.loading = false;
        this.erro = err.error?.error || 'Credenciais invalidas';
      }
    });
  }
}
