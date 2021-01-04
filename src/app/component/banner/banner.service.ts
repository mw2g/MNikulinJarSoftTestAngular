import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Banner} from '../../interfaces';

@Injectable({providedIn: 'root'})
export class BannerService {
  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Array<Banner>> {
    return this.httpClient.get<Array<Banner>>(`${environment.dbUrl}/api/banner`);
  }

  getById(bannerId: string): Observable<Banner> {
    return this.httpClient.get<Banner>(`${environment.dbUrl}/api/banner/${bannerId}`);
  }

  create(banner: Banner): Observable<Banner> {
    return this.httpClient.post<Banner>(`${environment.dbUrl}/api/banner`, banner);
  }

  update(banner: Banner): Observable<Banner> {
    return this.httpClient.put<Banner>(`${environment.dbUrl}/api/banner`, banner);
  }

  delete(bannerId: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(`${environment.dbUrl}/api/banner/${bannerId}`);
  }
}
