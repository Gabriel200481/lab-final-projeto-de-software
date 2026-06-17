import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

interface Instituicao { id: string; nome: string; }

@Component({
  selector: 'app-cadastro-aluno',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="deco dc-1"></div>
      <div class="deco dc-2"></div>

      <div class="wrap">
        <div class="card">

          <div class="card-top">
            <a routerLink="/login" class="back">&larr; Voltar ao Login</a>
          </div>

          <div class="card-head">
            <div class="head-coin">A</div>
            <div>
              <h1>Cadastro de Aluno</h1>
              <p>Crie sua conta e comece a acumular moedas</p>
            </div>
          </div>

          <div *ngIf="erro"    class="alert alert-err">{{ erro }}</div>
          <div *ngIf="sucesso" class="alert alert-ok">{{ sucesso }}</div>

          <form (ngSubmit)="onSubmit()">
            <div class="grid">

              <div class="fg">
                <label>Nome completo</label>
                <input [(ngModel)]="nome" name="nome" required placeholder="Seu nome completo">
              </div>

              <div class="fg">
                <label>Email</label>
                <input type="email" [(ngModel)]="email" name="email" required placeholder="seu@email.com">
              </div>

              <div class="fg">
                <label>Senha</label>
                <div class="input-eye">
                  <input [type]="mostrarSenha ? 'text' : 'password'" [(ngModel)]="senha" name="senha" required placeholder="Crie uma senha">
                  <button type="button" class="eye-btn" (click)="mostrarSenha = !mostrarSenha" tabindex="-1">
                    <svg *ngIf="!mostrarSenha" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    <svg *ngIf="mostrarSenha"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  </button>
                </div>
              </div>

              <div class="fg">
                <label>CPF</label>
                <input [(ngModel)]="cpf" name="cpf" required placeholder="000.000.000-00">
              </div>

              <div class="fg">
                <label>RG</label>
                <input [(ngModel)]="rg" name="rg" required placeholder="Seu RG">
              </div>

              <div class="fg">
                <label>Endereço</label>
                <input [(ngModel)]="endereco" name="endereco" required placeholder="Seu endereço">
              </div>

              <div class="fg">
                <label>Curso</label>
                <input [(ngModel)]="curso" name="curso" required placeholder="Seu curso">
              </div>

              <div class="fg">
                <label>Instituição</label>
                <select [(ngModel)]="instituicaoId" name="instituicaoId" required>
                  <option value="" disabled selected>Selecione a instituição</option>
                  <option *ngFor="let i of instituicoes" [value]="i.id">{{ i.nome }}</option>
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
    * { box-sizing: border-box; margin: 0; padding: 0; }

    .page {
      min-height: 100vh;
      background: #0D0B06;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding: 2.5rem 1rem 4rem;
      position: relative;
      overflow: hidden;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }

    .deco {
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle, #C8961E, #0D0B06);
      pointer-events: none;
    }
    .dc-1 { width: 500px; height: 500px; top: -180px; right: -180px; opacity: 0.05; }
    .dc-2 { width: 320px; height: 320px; bottom: -120px; left: -120px; opacity: 0.04; }

    .wrap { position: relative; z-index: 1; width: 100%; max-width: 700px; }

    .card {
      background: #1A1810;
      border: 1px solid #2A2618;
      border-top: 3px solid #C8961E;
      border-radius: 16px;
      padding: 2rem 2.5rem 2.5rem;
      box-shadow: 0 8px 40px rgba(0,0,0,0.4);
    }

    .card-top { margin-bottom: 1.5rem; }

    .back {
      font-size: 0.8rem;
      color: #5A5244;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.15s;
    }
    .back:hover { color: #F5C842; }

    .card-head {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.75rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid #2A2618;
    }

    .head-coin {
      width: 50px; height: 50px;
      border-radius: 13px;
      background: linear-gradient(135deg, #C8961E, #F5C842);
      color: #0D0B06;
      font-weight: 900;
      font-size: 1.3rem;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 14px rgba(200,150,30,0.35);
    }

    .card-head h1 { font-size: 1.1rem; font-weight: 700; color: #F0EDE5; }
    .card-head p  { font-size: 0.8rem; color: #7A7260; margin-top: 0.15rem; }

    .alert {
      padding: 0.7rem 0.9rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      font-size: 0.82rem;
      font-weight: 500;
    }
    .alert-err { background: rgba(239,68,68,0.08); color: #EF4444; border: 1px solid rgba(239,68,68,0.2); }
    .alert-ok  { background: rgba(34,197,94,0.08);  color: #22C55E; border: 1px solid rgba(34,197,94,0.2); }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.6rem 1.1rem;
    }

    .fg { margin-bottom: 0.2rem; }
    .fg label {
      display: block;
      margin-bottom: 0.32rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: #7A7260;
      letter-spacing: 0.3px;
    }
    .fg input,
    .fg select {
      width: 100%;
      padding: 0.62rem 0.85rem;
      background: #0D0B06;
      border: 1px solid #3A3220;
      border-radius: 8px;
      font-size: 0.87rem;
      font-family: inherit;
      color: #F0EDE5;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .fg input:focus,
    .fg select:focus { border-color: #C8961E; box-shadow: 0 0 0 3px rgba(200,150,30,0.1); }
    .fg input::placeholder { color: #4A4434; }
    .fg select option { background: #1A1810; }

    .input-eye { position: relative; display: flex; align-items: center; }
    .input-eye input { padding-right: 2.5rem; }
    .eye-btn {
      position: absolute; right: 0.7rem;
      background: none; border: none; cursor: pointer; padding: 0;
      color: #4A4434; display: flex; align-items: center; transition: color 0.15s;
    }
    .eye-btn:hover { color: #C8961E; }
    .eye-btn svg { width: 16px; height: 16px; }

    .btn-submit {
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
      margin-top: 1.25rem;
      transition: opacity 0.15s, transform 0.1s;
      box-shadow: 0 4px 16px rgba(200,150,30,0.28);
      letter-spacing: 0.2px;
    }
    .btn-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
    .btn-submit:disabled { background: #2A2618; color: #5A5244; cursor: not-allowed; box-shadow: none; }

    @media (max-width: 640px) {
      .grid { grid-template-columns: 1fr; }
      .card { padding: 1.5rem; }
    }
  `]
})
export class CadastroAlunoComponent implements OnInit {
  mostrarSenha = false;
  nome = ''; email = ''; senha = ''; cpf = '';
  rg = ''; endereco = ''; curso = ''; instituicaoId = '';
  erro = ''; sucesso = ''; loading = false;
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
    this.loading = true; this.erro = ''; this.sucesso = '';
    this.apiService.criarAluno({
      nome: this.nome, email: this.email, senha: this.senha,
      cpf: this.cpf, rg: this.rg, endereco: this.endereco,
      curso: this.curso, instituicaoId: this.instituicaoId
    }).subscribe({
      next: () => {
        this.loading = false;
        this.sucesso = 'Cadastro realizado! Redirecionando...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err: any) => {
        this.loading = false;
        this.erro = err.error?.error || 'Erro ao cadastrar';
      }
    });
  }
}
