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

    .login-left {
      flex: 0 0 45%;
      background: linear-gradient(160deg, #0d1456 0%, #1a237e 50%, #1565c0 100%);
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
      background: #f9a825;
    }
    .dc-1 { width: 320px; height: 320px; top: -90px;  right: -110px; opacity: 0.10; }
    .dc-2 { width: 220px; height: 220px; bottom: -70px; left: -70px;  opacity: 0.08; }
    .dc-3 { width: 130px; height: 130px; top: 55%;     left: 72%;     opacity: 0.06; }

    .brand-content {
      position: relative;
      z-index: 1;
      color: #fff;
      text-align: center;
      max-width: 340px;
    }

    .coin-logo {
      display: flex;
      justify-content: center;
      margin-bottom: 1.5rem;
      filter: drop-shadow(0 4px 14px rgba(249,168,37,0.55));
    }

    .brand-title {
      font-size: 2.6rem;
      font-weight: 900;
      line-height: 1.15;
      margin-bottom: 1rem;
      text-shadow: 0 2px 6px rgba(0,0,0,0.35);
      letter-spacing: -0.5px;
    }

    .brand-tagline {
      font-size: 1rem;
      opacity: 0.88;
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .brand-features {
      list-style: none;
      text-align: left;
    }

    .brand-features li {
      display: flex;
      align-items: flex-start;
      gap: 0.7rem;
      margin-bottom: 0.75rem;
      font-size: 0.88rem;
      opacity: 0.93;
      background: rgba(255,255,255,0.09);
      padding: 0.55rem 0.9rem;
      border-radius: 8px;
      border-left: 3px solid #f9a825;
    }

    .feat-icon {
      display: inline-block;
      width: 20px; height: 20px;
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .feat-grad { background: #4caf50; }
    .feat-coin { background: #f9a825; }
    .feat-biz  { background: #7c4dff; }

    .login-right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f4f8;
      padding: 2rem;
    }

    .login-card {
      background: #fff;
      border-radius: 16px;
      padding: 2.5rem;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 4px 28px rgba(0,0,0,0.09);
    }

    .login-card-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .login-coin-sm {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f9a825, #ff8f00);
      color: #5d2e00;
      font-weight: 900;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 2px 10px rgba(249,168,37,0.45);
    }

    .login-card-header h2 {
      font-size: 1.1rem;
      color: #1a237e;
      margin: 0;
      font-weight: 700;
    }

    .login-card-header p {
      font-size: 0.85rem;
      color: #718096;
      margin: 0.2rem 0 0;
    }

    .form-group { margin-bottom: 1.2rem; }

    .form-group label {
      display: block;
      margin-bottom: 0.4rem;
      font-weight: 600;
      font-size: 0.9rem;
      color: #2d3748;
    }

    .form-group input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      font-size: 1rem;
      box-sizing: border-box;
      transition: border-color 0.2s, box-shadow 0.2s;
      outline: none;
      color: #2d3748;
    }

    .form-group input:focus {
      border-color: #1a237e;
      box-shadow: 0 0 0 3px rgba(26,35,126,0.08);
    }

    .btn-login {
      width: 100%;
      padding: 0.85rem;
      background: linear-gradient(135deg, #1565c0, #1a237e);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.1s;
      margin-top: 0.5rem;
      letter-spacing: 0.3px;
    }

    .btn-login:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .btn-login:active:not(:disabled) { transform: translateY(0); }
    .btn-login:disabled { background: #a0aec0; cursor: not-allowed; }

    .alert-danger {
      background: #fff5f5;
      color: #c53030;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      border-left: 3px solid #fc8181;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .links {
      margin-top: 1.75rem;
      text-align: center;
    }

    .links p {
      color: #718096;
      font-size: 0.88rem;
      margin-bottom: 0.75rem;
    }

    .register-links {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
    }

    .reg-link {
      padding: 0.55rem 1.1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      text-decoration: none !important;
      transition: all 0.2s;
      border: 1.5px solid transparent;
    }

    .reg-aluno {
      background: #ebf8ff;
      color: #1a237e;
      border-color: #bee3f8;
    }
    .reg-aluno:hover { background: #1a237e; color: #fff; }

    .reg-empresa {
      background: #faf5ff;
      color: #553c9a;
      border-color: #e9d8fd;
    }
    .reg-empresa:hover { background: #553c9a; color: #fff; }

    @media (max-width: 768px) {
      .login-page { flex-direction: column; }
      .login-left { flex: none; padding: 2rem 1.5rem; min-height: auto; }
      .brand-features { display: none; }
      .brand-title { font-size: 1.8rem; }
      .brand-tagline { margin-bottom: 0; font-size: 0.9rem; }
      .login-right { padding: 1.5rem 1rem; }
      .login-card { padding: 1.75rem; border-radius: 12px; }
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
