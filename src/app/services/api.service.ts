import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  toolCount: number;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  popularity: number;
}

export interface SearchResult {
  type: 'category' | 'tool';
  id: string;
  name: string;
  description: string;
  color?: string;
  categoryId?: string;
  category?: string;
  categoryColor?: string;
}
export interface SearchResult {
  type: 'tool' | 'category';
  id: string;
  name: string;
  description: string;
  url?: string;
  category?: string;
  categoryId?: string;
  categoryColor?: string;
  color?: string;
  icon?: string;
  toolCount?: number;
  popularity?: number;
}

export interface SunburstData {
  value: number;
  name: string;
  children: Array<{
    name: string;
    description: string;
    color: string;
    id: string;
    children: Array<{
      name: string;
      description: string;
      url: string;
      value: number;
      id: string;
      color: string;
    }>;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'https://ai-server-859193427822.asia-south1.run.app/api';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getCategory(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/categories/${id}`);
  }

  getCategoryTools(id: string): Observable<Tool[]> {
    return this.http.get<Tool[]>(`${this.baseUrl}/categories/${id}/tools`);
  }

  search(query: string): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
  }

  getSunburstData(): Observable<SunburstData> {
    return this.http.get<SunburstData>(`${this.baseUrl}/sunburst-data`);
  }
}