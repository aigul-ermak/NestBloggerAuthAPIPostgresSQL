export class BlogOutputModel {
  id: number;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
}

export const BlogOutputModelMapper = (blog): BlogOutputModel => {
  return {
    id: blog.id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.website_url,
    createdAt: blog.created_at,
    isMembership: blog.is_membership ?? false,
  };
};
