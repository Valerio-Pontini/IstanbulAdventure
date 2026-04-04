import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppToastComponent } from './components/app-toast.component';
import { ShellFooterComponent } from './components/shell-footer.component';
import { ShellHeaderComponent } from './components/shell-header.component';

@Component({
  selector: 'ia-root',
  standalone: true,
  imports: [RouterOutlet, ShellHeaderComponent, ShellFooterComponent, AppToastComponent],
  template: `
    <div class="app-backdrop" aria-hidden="true"></div>
    <div class="app-shell">
      <ia-shell-header />
      <main class="app-main">
        <router-outlet />
      </main>
      <ia-shell-footer />
    </div>
    <ia-app-toast />
  `
})
export class AppComponent {}
