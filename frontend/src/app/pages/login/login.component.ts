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
    <div class="login-container">
      <div class="login-card">
        <h2>Sistema de Moeda Estudantil</h2>
        <h3>Login</h3>

        <div *ngIf="erro" class="alert alert-danger">{{ erro }}</div>

        <form (ngSubmit)="onLogin()">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" [(ngModel)]="email" name="email" required placeholder="seu@email.com">
          </div>

          <div class="form-group">
            <label for="senha">Senha</label>
            <input type="password" id="senha" [(ngModel)]="senha" name="senha" required placeholder="Sua senha">
          </div>

          <button type="submit" [disabled]="loading" class="btn btn-primary">
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <div class="links">
          <p>Não tem conta?</p>
          <a routerLink="/cadastro-aluno">Cadastrar como Aluno</a> |
          <a routerLink="/cadastro-empresa">Cadastrar como Empresa</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container { display: flex; justify-content: center; align-items: center; min-height: 80vh; }
    .login-card { background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
    .login-card h2 { text-align: center; color: #2d3748; margin-bottom: 0.5rem; font-size: 1.3rem; }
    .login-card h3 { text-align: center; color: #4a5568; margin-bottom: 1.5rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.3rem; font-weight: 600; color: #4a5568; }
    .form-group input { width: 100%; padding: 0.6rem; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 1rem; box-sizing: border-box; }
    .btn { width: 100%; padding: 0.7rem; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; }
    .btn-primary { background: #3182ce; color: #fff; }
    .btn-primary:hover { background: #2b6cb0; }
    .btn-primary:disabled { background: #a0aec0; }
    .alert-danger { background: #fed7d7; color: #c53030; padding: 0.7rem; border-radius: 4px; margin-bottom: 1rem; }
    .links { text-align: center; margin-top: 1.5rem; }
    .links p { color: #718096; margin-bottom: 0.5rem; }
    .links a { color: #3182ce; text-decoration: none; }
    .links a:hover { text-decoration: underline; }
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
        this.erro = err.error?.error || 'Credenciais inválidas';
      }
    });
  }
}
