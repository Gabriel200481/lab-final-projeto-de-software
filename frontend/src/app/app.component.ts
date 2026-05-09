import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: #f7fafc;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
  `]
})
export class AppComponent {}
