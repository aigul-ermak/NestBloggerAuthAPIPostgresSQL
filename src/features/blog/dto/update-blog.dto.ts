import { PartialType } from '@nestjs/swagger';
import { CreateBlogDto } from './create-blog.dto';
import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Trim } from '../../../base/decorators/transform/trim';

export class UpdateBlogDto extends CreateBlogDto {}
