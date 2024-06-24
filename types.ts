export interface Creator {
  username: string;
  avatar: string;
}

export interface VideoProps {
  $id: string;
  title: string;
  thumbnail: string;
  video: string;
  creators: Creator;
  favourite?: string[];
}

export interface VideoCardProps {
  video: VideoProps;
}
