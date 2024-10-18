import {
  // ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsBlogByIdExists', async: true })
@Injectable()
export class IsBlogByIdExistsConstraint
  implements ValidatorConstraintInterface
{
  //TODO
  //constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {}
  constructor() {}

  //TODO
  //async validate(blogId: string, args: ValidationArguments) {
  async validate(blogId: string) {
    //const blog = await this.blogsQueryRepository.getBlogById(blogId);
    const blog = blogId;
    return !!blog;
  }

  // defaultMessage(args: ValidationArguments) {
  //   return 'Blog with the given ID does not exist';
  // }
}
