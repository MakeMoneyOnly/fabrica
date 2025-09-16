import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ProductType } from '@prisma/client';

export class CreateProductDto {
  @IsString() title!: string;
  @IsEnum(ProductType) type!: ProductType;
  @IsInt() @Min(0) priceInt!: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() downloadUrl?: string;
  @IsOptional() @IsBoolean() active?: boolean;
  @IsString() storeId!: string;
}

export class UpdateProductDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsEnum(ProductType) type?: ProductType;
  @IsOptional() @IsInt() @Min(0) priceInt?: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() downloadUrl?: string;
  @IsOptional() @IsBoolean() active?: boolean;
}
