// frontend/queries/files.query.ts
import { useQuery } from '@pinia/colada';
import { filesService } from '~/services/files.service';

export function usePrivateDocumentsQuery() {
  return useQuery({
    key: () => ['private-documents'],
    query: () => filesService.getAllPrivateDocumentsMetadata().then((res) => res.data),
  });
}

export function useDocumentUrlQuery(fileId: () => number | null) {
  return useQuery({
    key: () => ['private-document-url', fileId() ?? -1],
    query: () => {
      const id = fileId();
      if (!id) throw new Error('File ID is required');
      return filesService.getPrivateDocumentUrl(id).then((res) => res.data);
    },
  });
}

export function useGroupFilesQuery(
  groupUuid: () => string,
  limit: () => number,
  cursor?: () => number | undefined,
  type?: () => string | undefined,
) {
  return useQuery({
    key: () => ['group-files', groupUuid(), type?.() ?? null, cursor?.() ?? null],
    query: () =>
      filesService
        .getGroupFiles(groupUuid(), limit(), cursor?.(), type?.())
        .then((res) => res.data),
    enabled: () => !!groupUuid(),
  });
}

/**
 * Fetches all private documents shared by members of a group.
 * Only available to group leaders — enforced server-side.
 * Endpoint: GET /files/group/:groupUuid/members/documents
 */
export function useGroupMemberDocumentsQuery(groupUuid: () => string, enabled: () => boolean) {
  return useQuery({
    key: () => ['group-member-documents', groupUuid()],
    query: () => filesService.getGroupMemberDocuments(groupUuid()).then((res) => res.data),
    enabled: () => !!groupUuid() && enabled(),
  });
}

export function useDocumentSharesQuery(fileId: () => number | null) {
  return useQuery({
    key: () => ['document-shares', fileId()],
    query: () => {
      const id = fileId();
      if (!id) throw new Error('File ID is required');
      return filesService.listDocumentShares(id).then((res) => res.data);
    },
    enabled: () => !!fileId(),
  });
}
