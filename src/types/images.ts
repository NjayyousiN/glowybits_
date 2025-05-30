export interface ImageData {
  id: string;
  title: string;
  tags?: string[];
  url: string;
  metadata: Record<string, any>;
  is_private: boolean;
  is_deleted: boolean;
  owner_id: string;
  created_at: string;
  updated_at: string;
  storage_image_id: string;
}
