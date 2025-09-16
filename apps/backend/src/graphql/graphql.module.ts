import { Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    NestGraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      playground: true,
      introspection: true,
      context: ({ req }: { req: Request }) => ({ req }),
      // Ethiopian market optimizations
      fieldResolverEnhancers: ['guards', 'interceptors'],
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
    }),
  ],
})
export class GraphqlModule {}
