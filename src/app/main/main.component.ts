import { Component } from '@angular/core';
import { PolicyFormComponent } from '../policy-form/policy-form.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { PolicyListComponent } from '../policy-list/policy-list.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, PolicyFormComponent, UserFormComponent, PolicyListComponent],
  template: `
    <main class="main">
      <div class="forms-container">
        <div class="form-section">
          <button class="toggle-form policy-toggle" (click)="togglePolicyForm()">
            <span>Create Policy</span>
            <i class="arrow" [class.down]="!showPolicyForm" [class.up]="showPolicyForm"></i>
          </button>
          <div class="form-wrapper" [class.expanded]="showPolicyForm">
            <app-policy-form></app-policy-form>
          </div>
        </div>

        <div class="form-section">
          <button class="toggle-form user-toggle" (click)="toggleUserForm()">
            <span>Create User</span>
            <i class="arrow" [class.down]="!showUserForm" [class.up]="showUserForm"></i>
          </button>
          <div class="form-wrapper" [class.expanded]="showUserForm">
            <app-user-form></app-user-form>
          </div>
        </div>
      </div>
      <div class="policy-list-container">
        <app-policy-list></app-policy-list>
      </div>
      <button class="logout-btn" (click)="logout()">Logout</button>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: #1a1a1a;
      padding: 2rem 1rem;
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .main {
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
    }

    .forms-container {
      display: flex;
      gap: 2rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .form-section {
      flex: 1;
      min-width: 300px;
      max-width: 600px;
    }

    .toggle-form {
      width: 100%;
      padding: 1.25rem;
      border: none;
      border-radius: 12px;
      font-size: 1.125rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      margin-bottom: 1rem;
      letter-spacing: 0.025em;
    }

    .policy-toggle {
      background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
      color: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .user-toggle {
      background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
      color: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .toggle-form:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .toggle-form:active {
      transform: translateY(0);
    }

    .arrow {
      border: solid white;
      border-width: 0 3px 3px 0;
      display: inline-block;
      padding: 3px;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .arrow.down {
      transform: rotate(45deg);
    }

    .arrow.up {
      transform: rotate(-135deg);
    }

    .form-wrapper {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
    }

    .form-wrapper.expanded {
      max-height: 2000px;
      transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .policy-list-container {
      background: #1a1a1a;
      border-radius: 12px;
      padding: 1.5rem;
      margin-top: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    ::ng-deep .policy-list-container .policy-list-container {
      margin: 0;
      background: white;
      border-radius: 8px;
    }

    @media (max-width: 768px) {
      .forms-container {
        flex-direction: column;
      }
      
      .form-section {
        max-width: 100%;
      }

      :host {
        padding: 1rem 0.75rem;
      }
    }

    .logout-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 8px 16px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    .logout-btn:hover {
      background: #dc2626;
      transform: translateY(-1px);
    }
  `]
})
export class MainComponent {
  showUserForm = false;
  showPolicyForm = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  toggleUserForm() {
    this.showUserForm = !this.showUserForm;
  }

  togglePolicyForm() {
    this.showPolicyForm = !this.showPolicyForm;
  }

  logout() {
    this.userService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error during logout:', error);
        // Even if there's an error, we'll redirect to login
        this.router.navigate(['/login']);
      }
    });
  }
}