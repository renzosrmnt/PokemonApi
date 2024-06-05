import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Pokemon } from '../../pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl: string = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getPokemon(id: string): Observable<Pokemon | undefined> {
    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${id}`).pipe(
      catchError((error) => {
        console.log(error);
        return of(undefined);
      })
    );
  }

  getPokemonByColor(color: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon-color/${color}`).pipe(
      catchError((error) => {
        console.log(error);
        return of(undefined);
      })
    );
  }
}
