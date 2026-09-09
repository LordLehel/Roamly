// frontend/app/queries/files.mutation.ts
import { useMutation, useQueryCache } from '@pinia/colada';
import { filesService } from '~/services/files.service';
import type { Ref } from 'vue';

interface MutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useGetPrivateDocumentUrlMutation = (options?: MutationOptions) => {
  return useMutation({
    mutation: (fileId: number) => filesService.getPrivateDocumentUrl(fileId),
    onSuccess: () => {
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};

export const useUploadPrivateDocumentMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();

  const mutation = useMutation({
    mutation: (formData: FormData) => filesService.uploadPrivateDocument(formData),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['private-documents'] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });

  return mutation;
};

export const useDeletePrivateDocumentMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();

  const mutation = useMutation({
    mutation: (fileId: number) => filesService.deletePrivateDocument(fileId),
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['private-documents'] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });

  return mutation;
};

export const useUploadGroupDocumentMutation = (
  groupUuid: Ref<string | undefined>,
  options?: MutationOptions,
) => {
  const queryCache = useQueryCache();

  const mutation = useMutation({
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

  return mutation;
};

export const useUpdateGroupDocumentMutation = (
  groupUuid: Ref<string | undefined>,
  options?: MutationOptions,
) => {
  const queryCache = useQueryCache();

  const mutation = useMutation({
    mutation: ({ fileId, formData }: { fileId: number; formData: FormData }) => {
      if (!groupUuid.value) throw new Error('Group UUID is required.');
      return filesService.updateGroupDocument(groupUuid.value, fileId, formData);
    },
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['group-files', groupUuid.value ?? null] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });

  return mutation;
};

export const useDeleteGroupFileMutation = (
  groupUuid: Ref<string | undefined>,
  options?: MutationOptions,
) => {
  const queryCache = useQueryCache();

  const mutation = useMutation({
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

  return mutation;
};

export const useShareDocumentMutation = (options?: MutationOptions) => {
  const queryCache = useQueryCache();

  const mutation = useMutation({
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

  return mutation;
};
