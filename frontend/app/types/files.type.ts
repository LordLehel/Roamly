// frontend/types/files.type.ts

export type OwnershipType = 'PRIVATE' | 'GROUP';
export type AccessLevel = 'LEADER' | 'MEMBER';
export type PrivateDocumentType = 'ID' | 'PASSPORT' | 'DRIVING_LICENSE' | 'OTHER';
export type GroupDocumentType =
  'TICKET' | 'BOOKING_CONFIRMATION' | 'HOTEL_VOUCHER' | 'GUEST_REGISTRATION_CARD' | 'OTHER';

export interface DocumentDto {
  document_id: number;
  document_type: string;
  issue_date: string | null;
  expiry_date: string | null;
}

export interface MediaDto {
  media_id: number;
  description: string | null;
}

export interface FileDto {
  file_id: number;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  ownership_type: OwnershipType;
  user_id: number;
  group_id: number | null;
  uploaded_by: number;
  created_at: string;
  updated_at: string;
}

export interface PrivateDocumentMetadata extends FileDto {
  documents: DocumentDto | null;
  // Present when fetched via the leader-only group endpoint
  // (getAllPrivateDocumentsMetadataOfAllUsersInAGroup).
  owner?: {
    uuid: string;
    username: string;
    email: string;
    profile_image_url: string | null;
  };
}

export interface GroupFile extends FileDto {
  documents: DocumentDto | null;
  media_files: MediaDto | null;
  creator: {
    email: string;
    username: string;
    uuid: string;
  };
  download_url?: string;
}

export interface PaginatedGroupFiles {
  items: GroupFile[];
  meta: {
    next_cursor: number | null;
    has_next_page: boolean;
    limit: number;
    count: number;
  };
}

export interface FileShareDto {
  shared_by: number;
  shared_at: string;
  access_level: AccessLevel;
  groups: {
    name: string;
  };
}
