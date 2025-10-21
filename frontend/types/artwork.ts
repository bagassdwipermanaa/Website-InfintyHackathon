export interface Artwork {
  id: string;
  title: string;
  description: string;
  fileHash: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  status: "pending" | "verified" | "rejected" | "disputed";
  userId?: number;
  user_id?: number;
  certificateUrl?: string;
  nftTokenId?: string;
}

export interface AdminArtwork {
  id: number;
  title: string;
  description: string;
  file_hash: string;
  file_type: string;
  file_size: number;
  status: "pending" | "verified" | "rejected" | "disputed";
  created_at: string;
  user_name: string;
  user_email: string;
}
