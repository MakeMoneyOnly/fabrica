import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType({ description: 'User model for Ethiopian creator platform' })
export class User {
  @Field(() => ID, { description: 'Unique identifier for the user' })
  id!: string;

  @Field({ description: 'User email address' })
  email!: string;

  @Field({ description: 'User first name' })
  firstName!: string;

  @Field({ description: 'User last name' })
  lastName!: string;

  @Field({ description: 'Ethiopian phone number with local format (+251)' })
  phoneNumber!: string;

  @Field({ description: 'User status: ACTIVE, INACTIVE, SUSPENDED' })
  status!: string;

  @Field({ nullable: true, description: 'User bio for Ethiopian market' })
  bio?: string;

  @Field({ nullable: true, description: 'Creator category: ARTISAN, DESIGNER, EDUCATOR, etc.' })
  category?: string;

  @Field({ nullable: true, description: 'Profile image URL' })
  profileImage?: string;

  @Field({ description: 'User creation timestamp' })
  createdAt!: Date;

  @Field({ description: 'User last updated timestamp' })
  updatedAt!: Date;

  @Field({ description: 'Whether user is a creator with a store' })
  isCreator!: boolean;
}
