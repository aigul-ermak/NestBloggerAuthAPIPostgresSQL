import { LIKE_STATUS } from '../../../base/enums/enums';

export class PostOutputModel {
  id: string;
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
  post: any,
  blogName: string,
  newestLikes: any[],
  status: LIKE_STATUS,
) => {
  return {
    id: post.id.toString(),
    title: post.title,
    shortDescription: post.short_description,
    content: post.content,
    blogId: post.blog_id.toString(),
    createdAt: post.created_at,
    blogName: blogName,
    extendedLikesInfo: {
      likesCount: post.likes_count,
      dislikesCount: post.dislikes_count,
      myStatus: status,
      newestLikes: newestLikes,
    },
  };
};

// export const PostLikeOutputModelMapper = (post: PostDocument, newestLikes: {
//   createdAt: Date;
//   login: string;
//   userId: string
// }[], status: string): PostOutputModel => {
//   const outputModel: PostOutputModel = new PostOutputModel();
//
//   outputModel.id = post._id.toString();
//   outputModel.title = post.title;
//   outputModel.shortDescription = post.shortDescription;
//   outputModel.content = post.content;
//   outputModel.blogId = post.blogId;
//   outputModel.blogName = post.blogName;
//   outputModel.createdAt = +post.createdAt;
//
//   outputModel.extendedLikesInfo = {
//     likesCount: post.likesCount,
//     dislikesCount: post.dislikesCount,
//     myStatus: status,
//     newestLikes: newestLikes.map(like => ({
//       createdAt: +like.createdAt,
//       userId: like.userId,
//       login: like.login
//     }))
//   }
//
//   return outputModel;
// }
