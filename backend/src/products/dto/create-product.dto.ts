import { IsString, IsNotEmpty, IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

class AssignmentDto {
  @IsString()
  @IsNotEmpty()
  baureihe!: string; // e.g., "964"

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  modelle!: string[]; // e.g., ["Coupe", "Targa"]
}

export class CreateVariantDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssignmentDto)
  @ArrayMinSize(1, { message: 'A variant must have at least one assignment.' })
  assignments!: AssignmentDto[];
}