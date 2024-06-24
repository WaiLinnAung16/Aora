import { FormEntry } from "@/app/(tabs)/create";
import { VideoProps } from "@/types";
import { ImagePickerAsset } from "expo-image-picker";
import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Models,
  Storage,
  ImageGravity,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.onlyone.aora",
  projectId: "6639f76a002c867d391f",
  databaseId: "663afde200209fd71d0f",
  usersCollectionId: "663afdfc001c85a24e6e",
  videosCollectionId: "663afe2400357138a3ce",
  storageId: "663affd9003de2d735a7",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  usersCollectionId,
  videosCollectionId,
  storageId,
} = appwriteConfig;

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(endpoint) // Your Appwrite Endpoint
  .setProject(projectId) // Your project ID
  .setPlatform(platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      databaseId,
      usersCollectionId,
      ID.unique(),
      { accountId: newAccount.$id, email, username, avatar: avatarUrl }
    );

    return newUser;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      databaseId,
      usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async (): Promise<VideoProps[]> => {
  try {
    const response = await databases.listDocuments(
      databaseId,
      videosCollectionId
    );
    const posts: VideoProps[] = response.documents.map(
      (doc: Models.Document) => ({
        $id: doc.$id,
        title: doc.title,
        thumbnail: doc.thumbnail,
        video: doc.video,
        creators: {
          username: doc.creators?.username,
          avatar: doc.creators?.avatar,
        },
        favourite: doc.favourite,
      })
    );
    return posts;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const getLatestPosts = async (): Promise<VideoProps[]> => {
  try {
    const response = await databases.listDocuments(
      databaseId,
      videosCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );
    const posts: VideoProps[] = response.documents.map(
      (doc: Models.Document) => ({
        $id: doc.$id,
        title: doc.title,
        thumbnail: doc.thumbnail,
        video: doc.video,
        creators: {
          username: doc.creators?.username,
          avatar: doc.creators?.avatar,
        },
        favourite: doc.favourite,
      })
    );
    return posts;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const serachPosts = async (
  query: string | undefined
): Promise<VideoProps[]> => {
  try {
    const response = await databases.listDocuments(
      databaseId,
      videosCollectionId,
      [Query.search("title", query)]
    );
    const posts: VideoProps[] = response.documents.map(
      (doc: Models.Document) => ({
        $id: doc.$id,
        title: doc.title,
        thumbnail: doc.thumbnail,
        video: doc.video,
        creators: {
          username: doc.creators?.username,
          avatar: doc.creators?.avatar,
        },
        favourite: doc.favourite,
      })
    );
    return posts;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const getUserPosts = async (
  userId: string | undefined
): Promise<VideoProps[]> => {
  try {
    const response = await databases.listDocuments(
      databaseId,
      videosCollectionId,
      [Query.equal("creators", userId)]
    );
    const posts: VideoProps[] = response.documents.map(
      (doc: Models.Document) => ({
        $id: doc.$id,
        title: doc.title,
        thumbnail: doc.thumbnail,
        video: doc.video,
        creators: {
          username: doc.creators?.username,
          avatar: doc.creators?.avatar,
        },
        favourite: doc.favourite,
      })
    );
    return posts;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl;
  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
};

export const uploadFile = async (
  file: ImagePickerAsset | null,
  type: string
) => {
  if (!file) return;

  const assest: any = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      assest
    );
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    console.log(error);
  }
};

export const createVideo = async (form: FormEntry) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      videosCollectionId,
      ID.unique(),
      {
        title: form.title,
        prompt: form.prompt,
        video: videoUrl,
        thumbnail: thumbnailUrl,
        creators: form.userId,
        favourite: form.favourite,
      }
    );

    return newPost;
  } catch (error) {
    console.log(error);
  }
};

export const addSaved = async (videoId: string, userId: string | undefined) => {
  try {
    const post = await databases.listDocuments(databaseId, videosCollectionId, [
      Query.equal("$id", videoId),
    ]);

    const favouriteList = post?.documents[0].favourite;
    let updatedFav;

    const isAlreadyExit = favouriteList.find((id: string) => id === userId);
    if (isAlreadyExit) {
      updatedFav = favouriteList.filter((id: string) => id !== userId);
    } else {
      updatedFav = [...favouriteList, userId];
    }

    const newAddSaved = await databases.updateDocument(
      databaseId,
      videosCollectionId,
      videoId,
      { favourite: updatedFav }
    );

    return newAddSaved;
  } catch (error) {
    console.log("Database error: ", error);
  }
};

export const getSavedVideo = async (userId: string | undefined) => {
  try {
    const response = await databases.listDocuments(
      databaseId,
      videosCollectionId,
      [Query.equal("favourite", userId)]
    );
    const posts: VideoProps[] = response.documents.map(
      (doc: Models.Document) => ({
        $id: doc.$id,
        title: doc.title,
        thumbnail: doc.thumbnail,
        video: doc.video,
        creators: {
          username: doc.creators?.username,
          avatar: doc.creators?.avatar,
        },
        favourite: doc.favourite,
      })
    );

    return posts;
  } catch (error) {
    console.log("Database error ", error);
  }
};

export const searchSavedVideos = async (query: string, userId: string) => {
  try {
    if (userId) {
      const savedVideos: VideoProps[] | undefined = await getSavedVideo(userId);

      if (savedVideos) {
        const filterSavedVideos: VideoProps[] = savedVideos.filter((video) =>
          video.title.toLocaleLowerCase().includes(query.toLocaleLowerCase())
        );
        return filterSavedVideos;
      }
    }
  } catch (error) {
    console.log("Database error:", error);
  }
};

export const deletePost = async (postId: string) => {
  try {
    await databases.deleteDocument(databaseId, videosCollectionId, postId);
  } catch (error) {
    console.log("Database error: ", error);
  }
};
