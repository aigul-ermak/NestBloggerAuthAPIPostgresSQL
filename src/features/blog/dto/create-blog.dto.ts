import { IsString, Length, Matches } from 'class-validator';
import { Trim } from '../../../base/decorators/transform/trim';

export class CreateBlogDto {
  @IsString()
  @Trim()
  @Length(1, 15, { message: 'Length not correct' })
  name: string;

  @IsString()
  @Trim()
  @Length(1, 500, { message: 'Description not correct' })
  description: string;

  @Length(1, 100, { message: 'WebsiteUrl not correct' })
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
    {
      message: 'Url not correct',
    },
  )
  websiteUrl: string;
}
