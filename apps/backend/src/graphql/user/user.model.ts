import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType({ description: 'User model for Ethiopian creator platform' })
export class User {
  @Field(() => ID, { description: 'Unique identifier for the user' })
  id!: string;

  @Field({ description: 'User email address' })
  email!: string;

  @Field({ nullable: true, description: 'User full name' })
  name?: string;

  @Field({ nullable: true, description: 'User name in Amharic for localization' })
  amharicName?: string;

  @Field({ nullable: true, description: 'Profile avatar URL' })
  avatarUrl?: string;

  @Field({ description: 'Two-factor authentication enabled' })
  twoFactorEnabled!: boolean;

  @Field({ description: 'User creation timestamp' })
  createdAt!: Date;

  @Field({ description: 'User last updated timestamp' })
  updatedAt!: Date;

  @Field({ description: 'Whether user is a creator with a store' })
  isCreator!: boolean;
}
