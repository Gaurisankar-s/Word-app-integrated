import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { WebSocketService } from '../services/websocket.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  readonly DEMO_PASSWORD = '123456';
  generatedPasskey: string = '';
  showPasskey: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private wsService: WebSocketService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Get email from URL parameters and set it in the form
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.loginForm.patchValue({
          email: params['email']
        });
      }
    });

    // Connect WebSocket when email is available
    this.loginForm.get('email')?.valueChanges.subscribe(email => {
      if (email) {
        this.wsService.connect(email);
      }
    });
  }

  private generatePasskey(): string {
    // Generate a random passkey using crypto API
    const array = new Uint8Array(4); // 32 bits (4 bytes) for 8 hex characters
    crypto.getRandomValues(array);
    return Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      if (password !== this.DEMO_PASSWORD) {
        alert('Invalid password.');
        return;
      }

      this.userService.checkUserEmail(email).subscribe({
        next: (exists) => {
          if (exists) {
            const passkey = this.generatePasskey();
            
            // First store the passkey
            this.userService.storePasskey(email, passkey).subscribe({
              next: (response) => {
                console.log('Passkey stored successfully:', response);
                
                // Only after successful storage, send through WebSocket
                this.wsService.sendPasskey(email, passkey).subscribe({
                  next: (response) => {
                    console.log('Passkey sent through WebSocket:', response);
                    this.generatedPasskey = passkey;
                    this.showPasskey = true;
                    console.log('Login successful');
                    localStorage.setItem('userEmail', email);
                    setTimeout(() => {
                      this.router.navigate(['/main']);
                    }, 10000);
                  },
                  error: (error) => {
                    console.error('Error sending passkey through WebSocket:', error);
                  }
                });
              },
              error: (error) => {
                console.error('Error storing passkey:', error);
                alert('Error during login. Please try again.');
              }
            });
          } else {
            console.error('Login failed: Email not found');
            alert('Login failed: Email not found in users collection');
          }
        },
        error: (error) => {
          console.error('Error checking email:', error);
          alert('Error during login. Please try again.');
        }
      });
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }

  async copyPasskey(passkeyInput: HTMLInputElement) {
    try {
      await navigator.clipboard.writeText(this.generatedPasskey);
      console.log('Passkey copied to clipboard');
    } catch (err) {
      console.error('Failed to copy passkey:', err);
    }
  }
} 