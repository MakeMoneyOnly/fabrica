import { InputType, Field } from '@nestjs/graphql';

@InputType({ description: 'Create user input for Ethiopian market' })
export class CreateUserInput {
  @Field({ description: 'User email address' })
  email!: string;

  @Field({ description: 'User password' })
  password!: string;

  @Field({ description: 'User first name' })
  firstName!: string;

  @Field({ description: 'User last name' })
  lastName!: string;

  @Field({ description: 'Ethiopian phone number with local format (+251)' })
  phoneNumber!: string;

  @Field({ nullable: true, description: 'User bio for Ethiopian market' })
  bio?: string;

  @Field({ nullable: true, description: 'Creator category: ARTISAN, DESIGNER, EDUCATOR, etc.' })
  category?: string;

  @Field({ nullable: true, description: 'Profile image URL' })
  profileImage?: string;
}

@InputType({ description: 'Update user input for Ethiopian market' })
export class UpdateUserInput {
  @Field({ nullable: true, description: 'User first name' })
  firstName?: string;

  @Field({ nullable: true, description: 'User last name' })
  lastName?: string;

  @Field({ nullable: true, description: 'Ethiopian phone number with local format (+251)' })
  phoneNumber?: string;

  @Field({ nullable: true, description: 'User status: ACTIVE, INACTIVE, SUSPENDED' })
  status?: string;

  @Field({ nullable: true, description: 'User bio for Ethiopian market' })
  bio?: string;

  @Field({ nullable: true, description: 'Creator category: ARTISAN, DESIGNER, EDUCATOR, etc.' })
  category?: string;

  @Field({ nullable: true, description: 'Profile image URL' })
  profileImage?: string;
}
