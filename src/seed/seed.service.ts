import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';

import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { async } from 'rxjs';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({}); // erase db

    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=10',
    );

    const insertPromisesArray = [];

    data.results.forEach(async (pokemon) => {
      const segments = pokemon.url.split('/');
      const no = +segments[segments.length - 2];

      insertPromisesArray.push(
        this.pokemonModel.create({ no: no, name: pokemon.name }),
      );
    });

    await Promise.all(insertPromisesArray);

    return 'Seed executed';
  }
}
