import { IsString, Length } from 'class-validator';
import { Trim } from '../../../base/decorators/transform/trim';

export class CreatePostToBlogDto {
  @IsString()
  @Trim()
  @Length(1, 30, { message: 'Length not correct' })
  title: string;

  @IsString()
  @Trim()
  @Length(1, 100, { message: 'ShortDescription not correct' })
  shortDescription: string;

  @IsString()
  @Trim()
  @Length(1, 1000, { message: 'Content not correct' })
  content: string;
}