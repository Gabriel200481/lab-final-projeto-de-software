import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-cadastro-empresa',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="register-page">
      <div class="deco-circle dc-1"></div>
      <div class="deco-circle dc-2"></div>
      <div class="deco-circle dc-3"></div>

      <div class="register-wrapper">
        <div class="register-card">

          <div class="card-header">
            <a routerLink="/login" class="back-link">&larr; Voltar ao Login</a>
          </div>

          <div class="card-brand">
            <div class="brand-icon brand-empresa">E</div>
            <div>
              <h1>Cadastro de Empresa Parceira</h1>
              <p>Ofereca vantagens e atraia novos clientes</p>
            </div>
          </div>

          <div *ngIf="erro" class="alert alert-danger">{{ erro }}</div>
          <div *ngIf="sucesso" class="alert alert-success">{{ sucesso }}</div>

          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="nome">Razao Social</label>
              <input id="nome" [(ngModel)]="nome" name="nome" required placeholder="Razao social da empresa">
            </div>

            <div class="form-group">
              <label for="nomeFantasia">Nome Fantasia</label>
              <input id="nomeFantasia" [(ngModel)]="nomeFantasia" name="nomeFantasia" placeholder="Nome fantasia (opcional)">
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" [(ngModel)]="email" name="email" required placeholder="empresa&#64;email.com">
            </div>

            <div class="form-group">
              <label for="senha">Senha</label>
              <input type="password" id="senha" [(ngModel)]="senha" name="senha" required placeholder="Crie uma senha">
            </div>

            <button type="submit" [disabled]="loading" class="btn-submit">
              {{ loading ? 'Cadastrando...' : 'Cadastrar Empresa' }}
            </button>
          </form>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-page {
      min-height: 100vh;
      background: linear-gradient(145deg, #0A0F2E 0%, #1a237e 55%, #1565c0 100%);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 2.5rem 1rem 4rem;
      position: relative;
      overflow: hidden;
    }

    .deco-circle {
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle, #F59E0B, #D97706);
      pointer-events: none;
    }
    .dc-1 { width: 500px; height: 500px; top: -180px; right: -180px; opacity: 0.07; }
    .dc-2 { width: 300px; height: 300px; bottom: -100px; left: -100px; opacity: 0.06; }
    .dc-3 { width: 180px; height: 180px; top: 55%; left: 72%; opacity: 0.04; }

    .register-wrapper {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 540px;
    }

    .register-card {
      background: #fff;
      border-radius: 20px;
      padding: 2.25rem 2.75rem 2.75rem;
      box-shadow: 0 8px 16px rgba(0,0,0,0.12), 0 32px 64px rgba(0,0,0,0.16);
      border-top: 4px solid #7C3AED;
    }

    .card-header { margin-bottom: 1.5rem; }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.875rem;
      color: #64748B;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.15s;
    }
    .back-link:hover { color: #2563EB; }

    .card-brand {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.75rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #F1F5F9;
    }

    .brand-icon {
      width: 52px; height: 52px;
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-weight: 900;
      font-size: 1.4rem;
      color: #fff;
      flex-shrink: 0;
    }
    .brand-empresa { background: linear-gradient(135deg, #7C3AED, #6D28D9); box-shadow: 0 4px 12px rgba(124,58,237,0.35); }

    .card-brand h1 { font-size: 1.2rem; font-weight: 700; color: #0F172A; margin: 0; }
    .card-brand p { font-size: 0.85rem; color: #64748B; margin: 0.2rem 0 0; }

    .alert {
      padding: 0.75rem 1rem;
      border-radius: 10px;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .alert-danger { background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; }
    .alert-success { background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }

    .form-group { margin-bottom: 1rem; }

    .form-group label {
      display: block;
      margin-bottom: 0.4rem;
      font-weight: 600;
      font-size: 0.8rem;
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
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
      box-sizing: border-box;
      color: #0F172A;
      background: #FAFAFA;
    }
    .form-group input:focus {
      border-color: #7C3AED;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
    }
    .form-group input::placeholder { color: #94A3B8; }

    .btn-submit {
      width: 100%;
      padding: 0.85rem;
      background: #7C3AED;
      color: #fff;
      border: none;
      border-radius: 10px;
      font-size: 0.95rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      margin-top: 0.75rem;
      transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
      box-shadow: 0 1px 2px rgba(124,58,237,0.3);
    }
    .btn-submit:hover:not(:disabled) {
      background: #6D28D9;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(124,58,237,0.35);
    }
    .btn-submit:disabled { background: #94A3B8; cursor: not-allowed; box-shadow: none; }

    @media (max-width: 640px) {
      .register-card { padding: 1.75rem; }
    }
  `]
})
export class CadastroEmpresaComponent {
  nome = '';
  nomeFantasia = '';
  email = '';
  senha = '';
  erro = '';
  sucesso = '';
  loading = false;

  constructor(private authService: AuthService, private apiService: ApiService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.erro = '';
    this.sucesso = '';
    this.apiService.criarEmpresa({
      nome: this.nome,
      nomeFantasia: this.nomeFantasia,
      email: this.email,
      senha: this.senha
    }).subscribe({
      next: () => {
        this.loading = false;
        this.sucesso = 'Cadastro realizado com sucesso! Redirecionando...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err: any) => {
        this.loading = false;
        this.erro = err.error?.error || 'Erro ao cadastrar';
      }
    });
  }
}
