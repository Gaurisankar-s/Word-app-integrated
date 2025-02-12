import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: 'app-policy-form',
  templateUrl: './policy-form.component.html',
  styleUrls: ['./policy-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class PolicyFormComponent implements OnInit {
  policyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private policyService: PolicyService
  ) {
    this.policyForm = this.fb.group({
      userId: ['', [Validators.required]],
      policyId: ['', [Validators.required]],
      policyName: ['', [Validators.required]],
      policyCategory: [''],
      policyEffectiveDate: [''],
      requiresReview: [false],
      attestationRequiresESignature: [false],
      attestationFrequencyType: ['monthly']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    console.log('Form submitted');
    console.log('Form valid:', this.policyForm.valid);
    console.log('Form errors:', this.getFormValidationErrors());

    if (this.policyForm.valid) {
      const formData = this.policyForm.value;
      
      const policyData = {
        userId: formData.userId,
        policyId: formData.policyId,
        policyName: formData.policyName,
        policyCategory: formData.policyCategory || null,
        policyEffectiveDate: formData.policyEffectiveDate || null,
        requiresReview: formData.requiresReview === true,
        attestationRequiresESignature: formData.attestationRequiresESignature || false,
        attestationFrequencyType: formData.attestationFrequencyType || 'monthly'
      };

      console.log('Sending policy data:', policyData);
      
      this.policyService.createPolicy(policyData).subscribe({
        next: (response) => {
          console.log('Policy created successfully:', response);
          this.policyForm.reset();
          alert('Policy created successfully!');
          // window.open('https://www.office.com/launch/Word?ui=en-US', '_blank');
          window.open('https://office.live.com/start/Word.aspx', '_blank');
          window.location.reload();
        },
        error: (error) => {
          console.error('Error creating policy:', error);
          let errorMessage = 'Error creating policy. ';
          
          if (error.error && error.error.message) {
            if (error.error.message.includes('validation failed')) {
              errorMessage += 'Please check your form data. Some fields are invalid.';
            } else {
              errorMessage += error.error.message;
            }
          } else {
            errorMessage += 'Please try again.';
          }
          
          alert(errorMessage);
        }
      });
    } else {
      const invalidFields = Object.keys(this.policyForm.controls)
        .filter(key => this.policyForm.get(key)?.errors)
        .map(key => {
          return key.replace(/([A-Z])/g, ' $1')
            .toLowerCase()
            .replace(/^\w/, c => c.toUpperCase());
        });

      const errorMessage = `Please fill in all required fields:\n${invalidFields.join('\n')}`;
      alert(errorMessage);
    }
  }

  private getFormValidationErrors(): any {
    const errors: any = {};
    Object.keys(this.policyForm.controls).forEach(key => {
      const controlErrors = this.policyForm.get(key)?.errors;
      if (controlErrors != null) {
        errors[key] = controlErrors;
      }
    });
    return errors;
  }
}
