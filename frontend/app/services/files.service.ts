// frontend/services/files.service.ts
import type {
  PrivateDocumentMetadata,
  GroupFile,
  PaginatedGroupFiles,
  FileShareDto,
} from '~/types/files.type';
import type { ApiResponse } from '~/types/api.type';

export const filesService = {
  // --- PRIVATE DOCUMENTS ---
  uploadPrivateDocument(formData: FormData): Promise<ApiResponse<PrivateDocumentMetadata>> {
    return $fetch('/files/documents', {
      method: 'POST',
      body: formData,
    });
  },

  getPrivateDocumentUrl(
    fileId: number,
  ): Promise<
    ApiResponse<{ url: string; file_name: string; mime_type: string; created_at: string }>
  > {
    return $fetch(`/files/documents/${fileId}`);
  },

  deletePrivateDocument(fileId: number): Promise<ApiResponse<null>> {
    return $fetch(`/files/documents/${fileId}`, { method: 'DELETE' });
  },

  getAllPrivateDocumentsMetadata(): Promise<ApiResponse<PrivateDocumentMetadata[]>> {
    return $fetch('/files/documents');
  },

  replacePrivateDocument(
    fileId: number,
    formData: FormData,
  ): Promise<ApiResponse<PrivateDocumentMetadata>> {
    return $fetch(`/files/documents/${fileId}`, {
      method: 'PATCH',
      body: formData,
    });
  },

  // --- SHARING ---
  shareDocument(
    fileId: number,
    groupUuid: string,
    accessLevel: string,
  ): Promise<ApiResponse<FileShareDto>> {
    return $fetch(`/files/documents/share/${fileId}`, {
      method: 'POST',
      body: { groupUuid, accessLevel },
    });
  },

  deleteSharing(fileId: number, groupUuid: string): Promise<ApiResponse<null>> {
    return $fetch(`/files/documents/share/${fileId}/${groupUuid}`, { method: 'DELETE' });
  },

  updateSharingConditions(
    fileId: number,
    groupUuid: string,
    accessLevel: string,
  ): Promise<ApiResponse<FileShareDto>> {
    return $fetch(`/files/documents/share/${fileId}/${groupUuid}`, {
      method: 'PATCH',
      body: { accessLevel },
    });
  },

  listDocumentShares(fileId: number): Promise<ApiResponse<FileShareDto[]>> {
    return $fetch(`/files/documents/${fileId}/shares`);
  },

  // --- GROUP FILES ---
  uploadGroupDocument(groupUuid: string, formData: FormData): Promise<ApiResponse<GroupFile>> {
    return $fetch(`/files/group/${groupUuid}/document`, {
      method: 'POST',
      body: formData,
    });
  },

  uploadGroupMediaFile(groupUuid: string, formData: FormData): Promise<ApiResponse<GroupFile>> {
    return $fetch(`/files/group/${groupUuid}/media`, {
      method: 'POST',
      body: formData,
    });
  },

  updateGroupDocument(
    groupUuid: string,
    fileId: number,
    formData: FormData,
  ): Promise<ApiResponse<GroupFile>> {
    return $fetch(`/files/group/${groupUuid}/document/${fileId}`, {
      method: 'PATCH',
      body: formData,
    });
  },

  updateGroupMediaFile(
    groupUuid: string,
    fileId: number,
    formData: FormData,
  ): Promise<ApiResponse<GroupFile>> {
    return $fetch(`/files/group/${groupUuid}/media/${fileId}`, {
      method: 'PATCH',
      body: formData,
    });
  },

  deleteGroupFile(groupUuid: string, fileId: number): Promise<ApiResponse<null>> {
    return $fetch(`/files/group/${groupUuid}/${fileId}`, { method: 'DELETE' });
  },

  getGroupFiles(
    groupUuid: string,
    limit: number,
    cursor?: number,
    type?: string,
  ): Promise<ApiResponse<PaginatedGroupFiles>> {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) params.append('cursor', cursor.toString());
    if (type) params.append('type', type);

    return $fetch(`/files/group/${groupUuid}?${params.toString()}`);
  },
};
