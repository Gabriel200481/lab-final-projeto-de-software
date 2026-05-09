import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-cadastro-empresa',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="form-container">
      <div class="form-card">
        <h2>Cadastro de Empresa Parceira</h2>

        <div *ngIf="erro" class="alert alert-danger">{{ erro }}</div>
        <div *ngIf="sucesso" class="alert alert-success">{{ sucesso }}</div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Nome</label>
            <input [(ngModel)]="form.nome" name="nome" required placeholder="Razão social">
          </div>
          <div class="form-group">
            <label>Nome Fantasia</label>
            <input [(ngModel)]="form.nomeFantasia" name="nomeFantasia" required placeholder="Nome fantasia">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="form.email" name="email" required placeholder="empresa@email.com">
          </div>
          <div class="form-group">
            <label>Senha</label>
            <input type="password" [(ngModel)]="form.senha" name="senha" required placeholder="Mínimo 6 caracteres">
          </div>

          <button type="submit" [disabled]="loading" class="btn btn-primary">
            {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
          </button>
        </form>

        <div class="links">
          <a routerLink="/login">Já tem conta? Faça login</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-container { display: flex; justify-content: center; padding: 2rem 1rem; }
    .form-card { background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 100%; max-width: 500px; }
    .form-card h2 { text-align: center; color: #2d3748; margin-bottom: 1.5rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.3rem; font-weight: 600; color: #4a5568; }
    .form-group input { width: 100%; padding: 0.6rem; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 1rem; box-sizing: border-box; }
    .btn { width: 100%; padding: 0.7rem; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; }
    .btn-primary { background: #3182ce; color: #fff; }
    .btn-primary:hover { background: #2b6cb0; }
    .btn-primary:disabled { background: #a0aec0; }
    .alert-danger { background: #fed7d7; color: #c53030; padding: 0.7rem; border-radius: 4px; margin-bottom: 1rem; }
    .alert-success { background: #c6f6d5; color: #276749; padding: 0.7rem; border-radius: 4px; margin-bottom: 1rem; }
    .links { text-align: center; margin-top: 1.5rem; }
    .links a { color: #3182ce; text-decoration: none; }
  `]
})
export class CadastroEmpresaComponent {
  form = { nome: '', email: '', senha: '', nomeFantasia: '' };
  erro = '';
  sucesso = '';
  loading = false;

  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.erro = '';
    this.sucesso = '';
    this.apiService.criarEmpresa(this.form).subscribe({
      next: () => {
        this.loading = false;
        this.sucesso = 'Empresa cadastrada com sucesso! Redirecionando...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.erro = err.error?.error || 'Erro ao cadastrar empresa';
      }
    });
  }
}
