import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private apiUrl = 'http://localhost:3001/api/policies';  // Updated port to 3001

  constructor(private http: HttpClient) { }

  createPolicy(policyData: any): Observable<any> {
    console.log('Sending policy data:', policyData);
    return this.http.post(this.apiUrl, policyData).pipe(
      catchError(this.handleError)
    );
  }

  getAllPolicies(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getPolicyById(policyId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/policy/${policyId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError(() => 'Something went wrong; please try again later.');
  }
} 