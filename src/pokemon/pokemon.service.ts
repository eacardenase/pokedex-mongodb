import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name) // required to make Pokemon model a service
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    // MongoID
    if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // No
    if (!pokemon && !isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({
        no: term,
      });
    }

    // Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Pokémon with id, name or no "${term}" not found.`,
      );
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemonDB = await this.findOne(term);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemonDB.updateOne(updatePokemonDto, {
        new: true,
      });

      return {
        ...pokemonDB.toJSON(),
        // ...pokemonDB.toObject(), // achieves the same
        ...updatePokemonDto,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    // const pokemonDB = await this.findOne(id);
    // await pokemonDB.deleteOne();

    const result = this.pokemonModel.findByIdAndDelete(id);

    return result;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokémon exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }

    console.log(error);

    throw new InternalServerErrorException(
      `Can't update Pokémon - Check server logs.`,
    );
  }
}
