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
 * Fetches private documents shared with a group — leaders only.
 * Backend: GET /files/documents/group/:groupUuid?targetUserUuid=&documentType=
 *
 * targetUserUuid scopes the results to a single member (used by the
 * UserProfileModal). When omitted, all members' shared docs are returned
 * (used by the Documents page member section).
 */
export function useGroupMemberDocumentsQuery(
  groupUuid: () => string,
  enabled: () => boolean,
  targetUserUuid?: () => string | undefined,
) {
  return useQuery({
    // Include targetUserUuid in the cache key so that fetching "all members"
    // and fetching "one member" are stored as separate cache entries.
    key: () => ['group-member-documents', groupUuid(), targetUserUuid?.() ?? null],
    query: () =>
      filesService.getGroupMemberDocuments(groupUuid(), targetUserUuid?.()).then((res) => res.data),
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
