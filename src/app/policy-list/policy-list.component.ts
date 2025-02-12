import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: 'app-policy-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="policy-list-container">
      <h1>All Policies</h1>
      <div class="content-wrapper">
        <div class="policies-list">
          <ul>
            <li *ngFor="let policy of policies" 
                (click)="showPolicyDetails(policy.policyId)"
                [class.active]="selectedPolicy?.policyId === policy.policyId">
              {{ policy.policyName }}
            </li>
          </ul>
        </div>
        <div *ngIf="selectedPolicy" class="policy-details">
          <h3>Policy Details</h3>
          <div class="details-grid">
            <p><strong>ID:</strong> {{ selectedPolicy.policyId }}</p>
            <p><strong>Name:</strong> {{ selectedPolicy.policyName }}</p>
            <p><strong>Category:</strong> {{ selectedPolicy.policyCategory }}</p>
            <p><strong>Effective Date:</strong> {{ selectedPolicy.policyEffectiveDate }}</p>
            <p><strong>Requires Review:</strong> {{ selectedPolicy.requiresReview }}</p>
            <p><strong>Attestation E-Signature:</strong> {{ selectedPolicy.attestationRequiresESignature }}</p>
            <p><strong>Frequency Type:</strong> {{ selectedPolicy.attestationFrequencyType }}</p>
          </div>
        </div>
      </div>
      <div class="document-viewer">
        <h3>Policy Document</h3>
        <div *ngIf="selectedPolicy?.readLink; else noDocument">
          <iframe
            [src]="getProxiedUrl(selectedPolicy.readLink)"
            width="100%"
            height="1000"
            frameborder="0"
            scrolling="no"
            >
          </iframe>
        </div>
        <ng-template #noDocument>
          <p>No document available for this policy.</p>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    .policy-list-container {
      max-width: 1000px;
      width: 95%;
      margin: 2rem auto;
      padding: 2.5rem;
      background: linear-gradient(135deg, #ffffff 0%, #f7f7f7 100%);
      border-radius: 20px;
      box-shadow: 
        0 10px 40px rgba(0, 0, 0, 0.06),
        0 0 100px rgba(0, 0, 0, 0.03);
      position: relative;
      overflow: hidden;
    }

    .policy-list-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, #2d3748, #4a5568, #718096);
    }

    h1 {
      color: #1e293b;
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2.5rem;
      font-weight: 700;
      position: relative;
      padding-bottom: 1rem;
    }

    h1::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, #4f46e5, #3b82f6);
      border-radius: 2px;
    }

    .content-wrapper {
      display: flex;
      gap: 2rem;
    }

    .policies-list {
      flex: 1;
      background: white;
      padding: 1.5rem;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }

    li {
      padding: 1rem;
      margin-bottom: 0.5rem;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.3s ease;
      background: #f8fafc;
    }

    li:hover {
      background: #f1f5f9;
      transform: translateX(5px);
    }

    li.active {
      background: #e2e8f0;
      border-left: 4px solid #3b82f6;
    }

    .policy-details {
      flex: 2;
      background: white;
      padding: 1.5rem;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .policy-details h3 {
      color: #1e293b;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e2e8f0;
    }

    .details-grid {
      display: grid;
      gap: 1rem;
    }

    .details-grid p {
      margin: 0;
      padding: 0.5rem;
      background: #f8fafc;
      border-radius: 6px;
    }

    .details-grid strong {
      color: #4a5568;
    }

    .document-viewer {
      margin-top: 2rem;
      background: white;
      padding: 1.5rem;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .document-viewer h3 {
      color: #1e293b;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e2e8f0;
    }

    iframe {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }
  `]
})
export class PolicyListComponent implements OnInit {
  policies: any[] = [];
  selectedPolicy: any = null;

  constructor(
    private policyService: PolicyService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadPolicies();
  }

  loadPolicies() {
    this.policyService.getAllPolicies().subscribe({
      next: (policies) => {
        this.policies = policies;
        // console.log('Loaded policies:', policies);
      },
      error: (error) => {
        console.error('Error loading policies:', error);
      }
    });
  }

  showPolicyDetails(policyId: string) {
    this.policyService.getPolicyById(policyId).subscribe({
      next: (policy) => {
        this.selectedPolicy = policy;
        console.log('Selected policy:', policy);
        if (policy.readLink) {
          console.log('Document URL:', this.getProxiedUrl(policy.readLink));
        }
      },
      error: (error) => {
        console.error('Error fetching policy details:', error);
      }
    });
  }

  getProxiedUrl(readLink: string) {
    const proxyUrl = `http://localhost:8000/proxy?url=${encodeURIComponent(readLink)}`;
    console.log('Generated proxy URL:', proxyUrl);
    return this.sanitizer.bypassSecurityTrustResourceUrl(proxyUrl);
  }
}
