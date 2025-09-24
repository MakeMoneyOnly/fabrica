import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';

import { UsersService } from '../../users/users.service';
import { User } from './user.model';
import { CreateUserInput, UpdateUserInput } from './user.input';
import { Public } from '../../auth/public.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Query(() => [User], { description: 'Get all users with Ethiopian market filters' })
  async users(
    @Args('skip', { nullable: true }) skip: number,
    @Args('take', { nullable: true }) take: number,
  ) {
    const users = await this.usersService.findMany({
      skip,
      take,
    });

    // Transform to include isCreator field
    return users.map(user => ({
      ...user,
      isCreator: user.stores && user.stores.length > 0,
    }));
  }

  @Public()
  @Query(() => User, { description: 'Get user by ID for Ethiopian market' })
  async user(@Args('id', { type: () => ID }) id: string) {
    const user = await this.usersService.findOne({ id });
    if (!user) return null;

    return {
      ...user,
      isCreator: user.stores && user.stores.length > 0,
    };
  }

  @Public()
  @Query(() => [User], { description: 'Get creators (users with stores) for Ethiopian market' })
  async creators(
    @Args('skip', { nullable: true }) skip?: number,
    @Args('take', { nullable: true }) take?: number,
  ) {
    const users = await this.usersService.findCreators({
      skip,
      take,
    });

    return users.map(user => ({
      ...user,
      isCreator: user.stores && user.stores.length > 0,
    }));
  }

  @Mutation(() => User, { description: 'Create user for Ethiopian market' })
  async createUser(@Args('input') input: CreateUserInput) {
    return this.usersService.create(input);
  }

  @Mutation(() => User, { description: 'Update user for Ethiopian market' })
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateUserInput,
  ) {
    return this.usersService.update(id, input);
  }

  @Public()
  @Query(() => Int, { description: 'Get total user count for Ethiopian analytics' })
  async usersCount() {
    return this.usersService.count();
  }

  @Public()
  @Query(() => Int, { description: 'Get creator count for Ethiopian market analysis' })
  async creatorsCount(@Args('category', { nullable: true }) category?: string) {
    return this.usersService.countCreators(category);
  }
}
