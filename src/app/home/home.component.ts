import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { NgFor } from "@angular/common";
import { PokemonService } from '../services/pokemon.service';
import { Pokemon } from '../../pokemon';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [NavbarComponent, NgFor]
})
export class HomeComponent implements OnInit {
  pokemonsShow: Pokemon[] = [];
  pokemonsAll: Pokemon[] = [];

  constructor(private servicePokemon: PokemonService) { }

  ngOnInit(): void {
    this.getData(151);  // Load the first 151 Pokémon by default
  }

  getData(cantidad: number) {
    for (let i = 1; i <= cantidad; i++) {
      this.servicePokemon.getPokemon(i.toString()).subscribe({
        next: (poke: Pokemon | undefined) => {
          if (poke) {
            this.pokemonsShow.push(poke);
            this.pokemonsAll.push(poke);
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  onColorSelected(colorId: string) {
    if (colorId === 'ver-todos') {
      this.pokemonsShow = [...this.pokemonsAll];
      return;
    }

    this.servicePokemon.getPokemonByColor(colorId).subscribe({
      next: (data: any) => {
        const pokemonIds = data.pokemon_species.map((species: any) => this.extractIdFromUrl(species.url));
        const pokemonObservables: Observable<Pokemon | undefined>[] = pokemonIds.map((id: string) => this.servicePokemon.getPokemon(id));

        forkJoin(pokemonObservables).pipe(
          map((pokemons: (Pokemon | undefined)[]): Pokemon[] => pokemons.filter((poke): poke is Pokemon => poke !== undefined))
        ).subscribe({
          next: (pokemons: Pokemon[]) => {
            this.pokemonsShow = pokemons;
          },
          error: (err) => {
            console.log(err);
          }
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  extractIdFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2];
  }
}
