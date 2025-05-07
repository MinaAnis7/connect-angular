export interface Post {
  authorName: string;
  date: Date;
  text: string | null;
  imgUrl: string | null;
  lovesNumber: number;
  commentsNumber: number;
}
