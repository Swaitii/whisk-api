export type ImageModel =
  | "IMAGEN_2"
  | "IMAGEN_3"
  | "IMAGEN_3_1"
  | "IMAGEN_3_5"
  | "IMAGEN_3_PORTRAIT"
  | "IMAGEN_3_LANDSCAPE"
  | "IMAGEN_3_PORTRAIT_THREE_FOUR"
  | "IMAGEN_3_LANDSCAPE_FOUR_THREE";
export type AspectRatio =
  | "IMAGE_ASPECT_RATIO_SQUARE"
  | "IMAGE_ASPECT_RATIO_PORTRAIT"
  | "IMAGE_ASPECT_RATIO_LANDSCAPE"
  | "IMAGE_ASPECT_RATIO_UNSPECIFIED"
  | "IMAGE_ASPECT_RATIO_LANDSCAPE_FOUR_THREE"
  | "IMAGE_ASPECT_RATIO_PORTRAIT_THREE_FOUR";

export interface Credentials {
  cookie: string;
  authorizationKey?: string;
}

export interface Result<T> {
  Ok?: T;
  Err?: Error;
}

export interface Request {
  url: string;
  headers: Headers;
  body?: string;
  method:
  | "GET"
  | "POST"
  | "HEAD"
  | "OPTIONS"
  | "PUT"
  | "PATCH"
  | "DELETE";
}

export interface Prompt {
  seed?: number;
  prompt: string;
  projectId?: string;
  imageModel?: ImageModel;
  aspectRatio?: AspectRatio;
}

export interface Projects {
  name: string;
  media: Media;
  displayName: string;
  createTime: string;
}

export interface Media {
  name: string;
  image: Image;
  mediaGenerationId: MediaGenerationId;
}

export interface Image {
  seed: number;
  prompt: string;
  modelNameType: string;
  previousMediaGenerationId: string;
  workflowId: string;
  fingerprintLogRecordId: string;
}

export interface MediaGenerationId {
  mediaType: string;
  workflowId: string;
  workflowStepId: string;
  mediaKey: string;
}

export interface Images {
  name: string;
  media: Media;
  createTime: string;
}

export interface FetchedImage {
  name: string;
  image: FetchedImageDetails;
  createTime: string;
  backboneMetadata: BackboneMetadata;
  mediaGenerationId: MediaGenerationId;
}

export interface FetchedImageDetails {
  encodedImage: string;
  seed: number;
  mediaGenerationId: string;
  mediaVisibility: "PRIVATE" | "PUBLIC";
  prompt: string;
  modelNameType: string;
  previousMediaGenerationId: string;
  workflowId: string;
  fingerprintLogRecordId: string;
}

export interface BackboneMetadata {
  mediaCategory: "MEDIA_CATEGORY_BOARD";
  recipeInput: RecipeInput;
}

export interface RecipeInput {
  userInput: UserInput;
  mediaInputs: MediaInput[];
}

export interface UserInput {
  userInstructions: string;
}

export interface MediaInput {
  mediaCategory: "MEDIA_CATEGORY_BOARD";
}

export interface ImageMetadata {
  name: string;
  image: ImageDetails;
  createTime: string;
  backboneMetadata: BackboneMetadata;
}

export interface ImageDetails {
  mediaGenerationId: string;
  mediaVisibility: "PRIVATE" | "PUBLIC";
  prompt: string;
}

export interface GenerationResult {
  imagePanels: ImagePanel[];
  workflowId: string;
}

export interface ImagePanel {
  prompt: string;
  generatedImages: GeneratedImage[];
}

export interface GeneratedImage {
  encodedImage: string;
  seed: number;
  mediaGenerationId: string;
  prompt: string;
  isMaskEditedImage?: boolean
  modelNameType?: string;
  workflowId?: string;
  fingerprintLogRecordId?: string;
  imageModel?: ImageModel;
}

export interface RefinementRequest {
  existingPrompt: string;
  newRefinement: string;
  base64image: string;
  /**
   * The media key of the image you want to refine.
   * You can get this by calling `getImageHistory()[0...N].name`
   */
  imageId: string;
  seed?: number;
  count?: number,
  imageModel?: ImageModel;
  aspectRatio?: AspectRatio;
  projectId?: string;
}