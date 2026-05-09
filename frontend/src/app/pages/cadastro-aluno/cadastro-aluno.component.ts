import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { InstituicaoResponse } from '../../models/usuario.model';

@Component({
  selector: 'app-cadastro-aluno',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="form-container">
      <div class="form-card">
        <h2>Cadastro de Aluno</h2>

        <div *ngIf="erro" class="alert alert-danger">{{ erro }}</div>
        <div *ngIf="sucesso" class="alert alert-success">{{ sucesso }}</div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Nome</label>
            <input [(ngModel)]="form.nome" name="nome" required placeholder="Seu nome completo">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="form.email" name="email" required placeholder="seu@email.com">
          </div>
          <div class="form-group">
            <label>Senha</label>
            <input type="password" [(ngModel)]="form.senha" name="senha" required placeholder="Mínimo 6 caracteres">
          </div>
          <div class="form-group">
            <label>CPF</label>
            <input [(ngModel)]="form.cpf" name="cpf" required placeholder="11 dígitos numéricos" maxlength="11">
          </div>
          <div class="form-group">
            <label>RG</label>
            <input [(ngModel)]="form.rg" name="rg" required placeholder="Seu RG">
          </div>
          <div class="form-group">
            <label>Endereço</label>
            <input [(ngModel)]="form.endereco" name="endereco" required placeholder="Seu endereço completo">
          </div>
          <div class="form-group">
            <label>Curso</label>
            <input [(ngModel)]="form.curso" name="curso" required placeholder="Ex: Engenharia de Software">
          </div>
          <div class="form-group">
            <label>Instituição de Ensino</label>
            <select [(ngModel)]="form.instituicaoId" name="instituicaoId" required>
              <option value="">Selecione...</option>
              <option *ngFor="let inst of instituicoes" [value]="inst.id">{{ inst.nome }} ({{ inst.sigla }})</option>
            </select>
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
    .form-group input, .form-group select { width: 100%; padding: 0.6rem; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 1rem; box-sizing: border-box; }
    .btn { width: 100%; padding: 0.7rem; border: none; border-radius: 4px; font-size: 1rem; cursor: pointer; }
    .btn-primary { background: #38a169; color: #fff; }
    .btn-primary:hover { background: #2f855a; }
    .btn-primary:disabled { background: #a0aec0; }
    .alert-danger { background: #fed7d7; color: #c53030; padding: 0.7rem; border-radius: 4px; margin-bottom: 1rem; }
    .alert-success { background: #c6f6d5; color: #276749; padding: 0.7rem; border-radius: 4px; margin-bottom: 1rem; }
    .links { text-align: center; margin-top: 1.5rem; }
    .links a { color: #3182ce; text-decoration: none; }
  `]
})
export class CadastroAlunoComponent implements OnInit {
  form = { nome: '', email: '', senha: '', cpf: '', rg: '', endereco: '', curso: '', instituicaoId: '' };
  instituicoes: InstituicaoResponse[] = [];
  erro = '';
  sucesso = '';
  loading = false;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.listarInstituicoes().subscribe({
      next: (data) => this.instituicoes = data,
      error: () => this.erro = 'Erro ao carregar instituições'
    });
  }

  onSubmit(): void {
    this.erro = '';
    this.sucesso = '';
    if (!this.form.instituicaoId) {
      this.erro = 'Selecione uma instituição de ensino';
      return;
    }
    this.loading = true;
    this.apiService.criarAluno(this.form).subscribe({
      next: () => {
        this.loading = false;
        this.sucesso = 'Cadastro realizado com sucesso! Redirecionando...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.erro = err.error?.error || err.error?.fields ? JSON.stringify(err.error.fields) : 'Erro ao cadastrar';
      }
    });
  }
}
