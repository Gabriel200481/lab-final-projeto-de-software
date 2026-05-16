import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

interface Instituicao {
  id: string;
  nome: string;
}

@Component({
  selector: 'app-cadastro-aluno',
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
            <div class="brand-icon brand-aluno">A</div>
            <div>
              <h1>Cadastro de Aluno</h1>
              <p>Crie sua conta e comece a acumular moedas</p>
            </div>
          </div>

          <div *ngIf="erro" class="alert alert-danger">{{ erro }}</div>
          <div *ngIf="sucesso" class="alert alert-success">{{ sucesso }}</div>

          <form (ngSubmit)="onSubmit()">
            <div class="form-grid">

              <div class="form-group">
                <label for="nome">Nome completo</label>
                <input id="nome" [(ngModel)]="nome" name="nome" required placeholder="Seu nome completo">
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" [(ngModel)]="email" name="email" required placeholder="seu&#64;email.com">
              </div>

              <div class="form-group">
                <label for="senha">Senha</label>
                <input type="password" id="senha" [(ngModel)]="senha" name="senha" required placeholder="Crie uma senha">
              </div>

              <div class="form-group">
                <label for="cpf">CPF</label>
                <input id="cpf" [(ngModel)]="cpf" name="cpf" required placeholder="000.000.000-00">
              </div>

              <div class="form-group">
                <label for="rg">RG</label>
                <input id="rg" [(ngModel)]="rg" name="rg" required placeholder="Seu RG">
              </div>

              <div class="form-group">
                <label for="endereco">Endereco</label>
                <input id="endereco" [(ngModel)]="endereco" name="endereco" required placeholder="Seu endereco">
              </div>

              <div class="form-group">
                <label for="curso">Curso</label>
                <input id="curso" [(ngModel)]="curso" name="curso" required placeholder="Seu curso">
              </div>

              <div class="form-group">
                <label for="instituicao">Instituicao</label>
                <select id="instituicao" [(ngModel)]="instituicaoId" name="instituicaoId" required>
                  <option value="" disabled selected>Selecione a instituicao</option>
                  <option *ngFor="let inst of instituicoes" [value]="inst.id">{{ inst.nome }}</option>
                </select>
              </div>

            </div>

            <button type="submit" [disabled]="loading" class="btn-submit">
              {{ loading ? 'Cadastrando...' : 'Criar Conta' }}
            </button>
          </form>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-page {
      min-height: 100vh;
      background: linear-gradient(160deg, #0d1456 0%, #1a237e 50%, #1565c0 100%);
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 2.5rem 1rem 3rem;
      position: relative;
      overflow: hidden;
    }

    .deco-circle {
      position: absolute;
      border-radius: 50%;
      background: #f9a825;
      pointer-events: none;
    }
    .dc-1 { width: 380px; height: 380px; top: -120px; right: -130px; opacity: 0.08; }
    .dc-2 { width: 250px; height: 250px; bottom: -80px; left: -80px;  opacity: 0.07; }
    .dc-3 { width: 140px; height: 140px; top: 60%;    left: 75%;      opacity: 0.05; }

    .register-wrapper {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 680px;
    }

    .register-card {
      background: #fff;
      border-radius: 16px;
      padding: 2rem 2.5rem 2.5rem;
      box-shadow: 0 8px 40px rgba(0,0,0,0.18);
      border-top: 4px solid #2e7d32;
    }

    .card-header {
      margin-bottom: 1.5rem;
    }

    .back-link {
      font-size: 0.9rem;
      color: #1565c0;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    .back-link:hover { color: #0d47a1; }

    .card-brand {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .brand-icon {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 1.4rem;
      color: #fff;
      flex-shrink: 0;
    }

    .brand-aluno {
      background: linear-gradient(135deg, #1565c0, #1a237e);
    }

    .card-brand h1 {
      font-size: 1.2rem;
      font-weight: 700;
      color: #1a237e;
      margin: 0;
    }

    .card-brand p {
      font-size: 0.85rem;
      color: #718096;
      margin: 0.2rem 0 0;
    }

    .alert {
      padding: 0.75rem 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      font-size: 0.88rem;
    }

    .alert-danger {
      background: #fff5f5;
      color: #c53030;
      border-left: 3px solid #fc8181;
    }

    .alert-success {
      background: #f0fff4;
      color: #276749;
      border-left: 3px solid #68d391;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem 1.2rem;
    }

    .form-group { margin-bottom: 0.5rem; }

    .form-group label {
      display: block;
      margin-bottom: 0.35rem;
      font-weight: 600;
      font-size: 0.85rem;
      color: #2d3748;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 0.65rem 0.9rem;
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
      color: #2d3748;
      background: #fff;
    }

    .form-group input:focus,
    .form-group select:focus {
      border-color: #1a237e;
      box-shadow: 0 0 0 3px rgba(26,35,126,0.08);
    }

    .btn-submit {
      width: 100%;
      padding: 0.85rem;
      background: linear-gradient(135deg, #2e7d32, #1b5e20);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 1.2rem;
      transition: opacity 0.2s, transform 0.1s;
    }

    .btn-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .btn-submit:disabled { background: #a0aec0; cursor: not-allowed; }

    @media (max-width: 640px) {
      .form-grid { grid-template-columns: 1fr; }
      .register-card { padding: 1.5rem; }
    }
  `]
})
export class CadastroAlunoComponent implements OnInit {
  nome = '';
  email = '';
  senha = '';
  cpf = '';
  rg = '';
  endereco = '';
  curso = '';
  instituicaoId = '';
  erro = '';
  sucesso = '';
  loading = false;
  instituicoes: Instituicao[] = [];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.apiService.listarInstituicoes().subscribe({
      next: (data) => this.instituicoes = data,
      error: () => {}
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.erro = '';
    this.sucesso = '';
    this.apiService.criarAluno({
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      cpf: this.cpf,
      rg: this.rg,
      endereco: this.endereco,
      curso: this.curso,
      instituicaoId: this.instituicaoId
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
