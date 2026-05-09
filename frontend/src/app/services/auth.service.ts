import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthRequest, AuthResponse, PapelUsuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = '/api/auth';
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.loadUser());

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/login`, request).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return this.currentUserSubject.value?.token ?? null;
  }

  getUserId(): string | null {
    return this.currentUserSubject.value?.id ?? null;
  }

  getPapel(): PapelUsuario | null {
    return this.currentUserSubject.value?.papel ?? null;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  private loadUser(): AuthResponse | null {
    const data = localStorage.getItem('currentUser');
    if (!data) return null;
    try {
      return JSON.parse(data) as AuthResponse;
    } catch {
      return null;
    }
  }
}
