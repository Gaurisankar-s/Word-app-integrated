import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      userId: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: [''],
      organizationId: ['', [Validators.required]],
      organizationName: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    console.log('User form submitted');
    console.log('Form valid:', this.userForm.valid);

    if (this.userForm.valid) {
      const userData = this.userForm.value;
      console.log('Sending user data:', userData);
      
      this.userService.createUser(userData).subscribe({
        next: (response) => {
          console.log('User created successfully:', response);
          this.userForm.reset();
          alert('User created successfully!');
        },
        error: (error) => {
          console.error('Error creating user:', error);
          alert('Error creating user. Please try again.');
        }
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
