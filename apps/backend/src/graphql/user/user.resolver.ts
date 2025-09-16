import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';

import { UsersService } from '../../users/users.service';
import { User } from './user.model';
import { CreateUserInput, UpdateUserInput } from './user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { description: 'Get all users with Ethiopian market filters' })
  async users(
    @Args('skip', { nullable: true }) skip: number,
    @Args('take', { nullable: true }) take: number,
  ) {
    return this.usersService.findMany({
      skip,
      take,
      where: { status: { equals: 'ACTIVE' } },
    });
  }

  @Query(() => User, { description: 'Get user by ID for Ethiopian market' })
  async user(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.findOne({ id });
  }

  @Query(() => [User], { description: 'Get creators (users with stores) for Ethiopian market' })
  async creators(
    @Args('category', { nullable: true }) category?: string,
    @Args('skip', { nullable: true }) skip?: number,
    @Args('take', { nullable: true }) take?: number,
  ) {
    return this.usersService.findCreators({
      category,
      skip,
      take,
    });
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

  @Query(() => Int, { description: 'Get total user count for Ethiopian analytics' })
  async usersCount() {
    return this.usersService.count();
  }

  @Query(() => Int, { description: 'Get creator count for Ethiopian market analysis' })
  async creatorsCount(@Args('category', { nullable: true }) category?: string) {
    return this.usersService.countCreators(category);
  }
}
