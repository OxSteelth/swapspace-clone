import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, retry, of } from 'rxjs';
import { ENVIRONMENT } from 'src/environments/environment';
import { catchError, map, shareReplay, tap, timeout } from 'rxjs/operators';

export const SERVER_REST_URL = `${ENVIRONMENT.apiBaseUrl}/`;

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private cache: Map<string, Observable<any>> = new Map();

  constructor(private http: HttpClient) {}

  public get<T>(url: string, data?: {}, path?: string): Observable<T> {
    if (!this.cache.has(url) || url.includes('amounts') || url.includes('exchange')) {
      const response$ = this.http
        .get<T>((path || SERVER_REST_URL) + (url || ''), {
          params: data || {}
        })
        .pipe(
          shareReplay(1), // Cache the response
          catchError(error => {
            console.error('Error fetching data:', error);
            // Remove the cached entry on error
            this.cache.delete(url);

            return of(null); // Handle error gracefully
          })
        );

      this.cache.set(url, path ? response$ : response$.pipe(timeout(5_000), retry(1)));
    }

    return this.cache.get(url);
  }

  public patch<T>(url: string, data?: {}, params?: {}, path?: string): Observable<T> {
    return this.http.request<T>('patch', (path || SERVER_REST_URL) + (url || ''), {
      body: data,
      params
    });
  }

  public post<T>(url: string, body?: {}, path?: string, params?: {}): Observable<T> {
    return this.http.post<T>((path || SERVER_REST_URL) + (url || ''), body, params);
  }

  public customDelete<T>(url: string, options?: {}): Observable<T> {
    return this.http.request<T>('delete', SERVER_REST_URL + (url || ''), options);
  }

  public delete<T>(url: string, params?: {}, path?: string): Observable<T> {
    return this.http.delete<T>((path || SERVER_REST_URL) + (url || ''), params);
  }
}
