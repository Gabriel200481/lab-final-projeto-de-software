import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'cadastro-aluno',
    loadComponent: () => import('./pages/cadastro-aluno/cadastro-aluno.component').then(m => m.CadastroAlunoComponent)
  },
  {
    path: 'cadastro-empresa',
    loadComponent: () => import('./pages/cadastro-empresa/cadastro-empresa.component').then(m => m.CadastroEmpresaComponent)
  },
  {
    path: 'aluno',
    loadComponent: () => import('./pages/aluno-dashboard/aluno-dashboard.component').then(m => m.AlunoDashboardComponent),
    canActivate: [roleGuard(['ALUNO'])]
  },
  {
    path: 'professor',
    loadComponent: () => import('./pages/professor-dashboard/professor-dashboard.component').then(m => m.ProfessorDashboardComponent),
    canActivate: [roleGuard(['PROFESSOR'])]
  },
  {
    path: 'empresa',
    loadComponent: () => import('./pages/empresa-dashboard/empresa-dashboard.component').then(m => m.EmpresaDashboardComponent),
    canActivate: [roleGuard(['EMPRESA'])]
  },
  { path: '**', redirectTo: '/login' }
];
