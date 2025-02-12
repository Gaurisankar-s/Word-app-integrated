import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3001/api/users';
  private passkeyUrl = 'http://localhost:3001/api/passkeys';

  constructor(private http: HttpClient) { }

  createUser(userData: any): Observable<any> {
    console.log('Sending user data:', userData);
    return this.http.post(this.apiUrl, userData).pipe(
      catchError(this.handleError)
    );
  }

  checkUserEmail(email: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(users => users.length > 0),
      catchError(this.handleError)
    );
  }

  storePasskey(email: string, passkey: string): Observable<any> {
    return this.http.post(this.passkeyUrl, { email, passkey }).pipe(
      catchError(this.handleError)
    );
  }

  updateJWT(email: string, passkey: string): Observable<any> {
    return this.http.post(`${this.passkeyUrl}/update-jwt`, { email, passkey }).pipe(
      catchError(this.handleError)
    );
  }

  killJWT(email: string): Observable<any> {
    return this.http.post(`${this.passkeyUrl}/kill-jwt`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  logout(): Observable<any> {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      return throwError(() => 'No user email found');
    }
    
    return this.killJWT(email).pipe(
      map(response => {
        localStorage.removeItem('userEmail');
        return response;
      })
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