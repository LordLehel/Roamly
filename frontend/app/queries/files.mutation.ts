// frontend/app/queries/files.mutation.ts
import { useMutation } from '@pinia/colada';
import { filesService } from '~/services/files.service';

interface MutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useUploadPrivateDocumentMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();

  return useMutation({
    mutation: (formData: FormData) => filesService.uploadPrivateDocument(formData),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['private-documents'] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};

export const useDeletePrivateDocumentMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();

  return useMutation({
    mutation: (fileId: number) => filesService.deletePrivateDocument(fileId),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['private-documents'] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};

export const useUploadGroupDocumentMutation = (
  groupUuid: Ref<string | undefined>,
  options?: MutationOptions,
) => {
  const queryCache = useQueryCache();

  return useMutation({
    mutation: (formData: FormData) => {
      if (!groupUuid.value) throw new Error('Group UUID is required.');
      return filesService.uploadGroupDocument(groupUuid.value, formData);
    },
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['group-files', groupUuid.value ?? null] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};

export const useDeleteGroupFileMutation = (
  groupUuid: Ref<string | undefined>,
  options?: MutationOptions,
) => {
  const queryCache = useQueryCache();

  return useMutation({
    mutation: (fileId: number) => {
      if (!groupUuid.value) throw new Error('Group UUID is required.');
      return filesService.deleteGroupFile(groupUuid.value, fileId);
    },
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['group-files', groupUuid.value ?? null] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};

export const useShareDocumentMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();

  return useMutation({
    mutation: (params: { fileId: number; groupUuid: string; accessLevel: string }) =>
      filesService.shareDocument(params.fileId, params.groupUuid, params.accessLevel),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['group-files'] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};
