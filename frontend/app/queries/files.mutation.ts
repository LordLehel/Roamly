// frontend/mutations/files.mutation.ts
import { useMutation } from '@pinia/colada';
import { filesService } from '~/services/files.service';

export function useUploadPrivateDocumentMutation() {
  return useMutation({
    mutation: (formData: FormData) => filesService.uploadPrivateDocument(formData),
  });
}

export function useDeletePrivateDocumentMutation() {
  return useMutation({
    mutation: (fileId: number) => filesService.deletePrivateDocument(fileId),
  });
}

export function useUploadGroupDocumentMutation() {
  return useMutation({
    mutation: (params: { groupUuid: string; formData: FormData }) =>
      filesService.uploadGroupDocument(params.groupUuid, params.formData),
  });
}

export function useDeleteGroupFileMutation() {
  return useMutation({
    mutation: (params: { groupUuid: string; fileId: number }) =>
      filesService.deleteGroupFile(params.groupUuid, params.fileId),
  });
}

export function useShareDocumentMutation() {
  return useMutation({
    mutation: (params: { fileId: number; groupUuid: string; accessLevel: string }) =>
      filesService.shareDocument(params.fileId, params.groupUuid, params.accessLevel),
  });
}
