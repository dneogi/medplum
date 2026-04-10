import { useSearchResources } from '@medplum/react-hooks';
import { Table, Text, Loader, Center, Badge, ActionIcon, Group } from '@mantine/core';
import type { DocumentReference } from '@medplum/fhirtypes';

interface DocumentsTabProps {
  patientId: string;
}

function getContentType(doc: DocumentReference): string {
  return doc.content?.[0]?.attachment?.contentType || 'unknown';
}

function getTitle(doc: DocumentReference): string {
  return doc.content?.[0]?.attachment?.title || doc.description || 'Untitled';
}

function getCategoryDisplay(doc: DocumentReference): string {
  const coding = doc.category?.[0]?.coding?.[0];
  return coding?.display || coding?.code || '';
}

function getTypeDisplay(doc: DocumentReference): string {
  const coding = doc.type?.coding?.[0];
  return coding?.display || '';
}

function getAttachmentUrl(doc: DocumentReference): string | null {
  return doc.content?.[0]?.attachment?.url || null;
}

function contentTypeBadgeColor(ct: string): string {
  if (ct.includes('pdf')) return 'red';
  if (ct.includes('xml')) return 'blue';
  if (ct.includes('html')) return 'green';
  if (ct.includes('plain')) return 'gray';
  return 'violet';
}

function contentTypeLabel(ct: string): string {
  if (ct.includes('pdf')) return 'PDF';
  if (ct.includes('xml')) return 'XML';
  if (ct.includes('html')) return 'HTML';
  if (ct.includes('plain')) return 'Text';
  return ct;
}

export function DocumentsTab({ patientId }: DocumentsTabProps): React.JSX.Element {
  const [docs, loading] = useSearchResources('DocumentReference', {
    subject: `Patient/${patientId}`,
    _count: '100',
    _sort: '-date',
  });

  function openDocument(doc: DocumentReference): void {
    const url = getAttachmentUrl(doc);
    if (!url) return;
    // Medplum returns presigned storage URLs that work directly in the browser
    window.open(url, '_blank');
  }

  if (loading) {
    return (
      <Center h={200}>
        <Loader />
      </Center>
    );
  }

  if (!docs || docs.length === 0) {
    return <Text c="dimmed" ta="center" py="lg">No documents found for this patient.</Text>;
  }

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Title</Table.Th>
          <Table.Th>Type</Table.Th>
          <Table.Th>Category</Table.Th>
          <Table.Th>Format</Table.Th>
          <Table.Th>Date</Table.Th>
          <Table.Th>Action</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {docs.map((doc) => {
          const ct = getContentType(doc);
          return (
            <Table.Tr key={doc.id} style={{ cursor: 'pointer' }} onClick={() => openDocument(doc)}>
              <Table.Td>
                <Text size="sm" fw={500}>{getTitle(doc)}</Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{getTypeDisplay(doc)}</Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{getCategoryDisplay(doc)}</Text>
              </Table.Td>
              <Table.Td>
                <Badge color={contentTypeBadgeColor(ct)} variant="light" size="sm">
                  {contentTypeLabel(ct)}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{doc.date || ''}</Text>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={(e) => { e.stopPropagation(); openDocument(doc); }}
                    title="Open in new tab"
                  >
                    <span style={{ fontSize: 16 }}>&#128065;</span>
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
}
