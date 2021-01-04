import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Category} from '../../interfaces';

@Injectable({providedIn: 'root'})
export class CategoryService {
  constructor(private httpClient: HttpClient) {
  }

  getAll(): Observable<Array<Category>> {
    return this.httpClient.get<Array<Category>>(`${environment.dbUrl}/api/category`);
  }

  getById(categoryId: string): Observable<Category> {
    return this.httpClient.get<Category>(`${environment.dbUrl}/api/category/${categoryId}`);
  }

  create(category: Category): Observable<Category> {
    return this.httpClient.post<Category>(`${environment.dbUrl}/api/category`, category);
  }

  update(category: Category): Observable<Category> {
    return this.httpClient.put<Category>(`${environment.dbUrl}/api/category`, category);
  }

  delete(categoryId: number): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(`${environment.dbUrl}/api/category/${categoryId}`);
  }
}
