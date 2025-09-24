import { Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { UserGraphqlModule } from './user/user.module';

@Module({
  imports: [
    NestGraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      playground: true,
      introspection: true,
      context: ({ req }: { req: any }) => ({
        req: {
          ...req,
          logIn: () => {}, // Mock logIn method for GraphQL context
          logOut: () => {},
          isAuthenticated: () => false,
        }
      }),
      // Disable guards for GraphQL for now
      // fieldResolverEnhancers: ['guards', 'interceptors'],
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
    }),
    UserGraphqlModule,
  ],
})
export class GraphqlModule {}
