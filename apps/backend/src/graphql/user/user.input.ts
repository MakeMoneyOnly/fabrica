import { InputType, Field } from '@nestjs/graphql';

@InputType({ description: 'Create user input for Ethiopian market' })
export class CreateUserInput {
  @Field({ description: 'User email address' })
  email!: string;

  @Field({ description: 'User password' })
  password!: string;

  @Field({ nullable: true, description: 'User full name' })
  name?: string;

  @Field({ nullable: true, description: 'User name in Amharic for localization' })
  amharicName?: string;

  @Field({ nullable: true, description: 'Profile avatar URL' })
  avatarUrl?: string;
}

@InputType({ description: 'Update user input for Ethiopian market' })
export class UpdateUserInput {
  @Field({ nullable: true, description: 'User full name' })
  name?: string;

  @Field({ nullable: true, description: 'User name in Amharic for localization' })
  amharicName?: string;

  @Field({ nullable: true, description: 'Profile avatar URL' })
  avatarUrl?: string;

  @Field({ nullable: true, description: 'Two-factor authentication enabled' })
  twoFactorEnabled?: boolean;
}
