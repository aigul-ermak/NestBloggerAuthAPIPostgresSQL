export class PostOutputModel {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: number;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: {
      createdAt: number;
      userId: string;
      login: string;
    }[];
  };
}

export const PostLikeOutputModelMapper = (
  post,
  newestLikes: {
    createdAt: Date;
    login: string;
    userId: string;
  }[],
  status: string,
) => {
  const outputModel: PostOutputModel = new PostOutputModel();

  outputModel.id = post._id.toString();
  outputModel.title = post.title;
  outputModel.shortDescription = post.shortDescription;
  outputModel.content = post.content;
  outputModel.blogId = post.blogId;
  outputModel.blogName = post.blogName;
  outputModel.createdAt = +post.createdAt;

  outputModel.extendedLikesInfo = {
    likesCount: post.likesCount,
    dislikesCount: post.dislikesCount,
    myStatus: status,
    newestLikes: newestLikes.map((like) => ({
      createdAt: +like.createdAt,
      userId: like.userId,
      login: like.login,
    })),
  };

  return outputModel;
};

export const mapPostToResponse = (post: any, blogName: string) => {
  return {
    id: +post.id,
    title: post.title,
    shortDescription: post.short_description, // Fixed typo (_short_descriptionn_)
    content: post.content,
    blogId: +post.blog_id,
    blogName,
    createdAt: post.created_at,
    extendedLikesInfo: {
      likesCount: post.likes_count, // Fixed naming to match returned object
      dislikesCount: post.dislikes_count,
      myStatus: post.my_status ?? 'None',
      newestLikes: [],
    },
  };
};
