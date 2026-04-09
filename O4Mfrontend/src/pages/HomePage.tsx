import { useSearchResources } from '@medplum/react-hooks';
import { Container, TextInput, Title, Stack, SimpleGrid, Loader, Center, Text } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useState } from 'react';
import { PatientCard } from '../components/PatientCard';

export function HomePage(): React.JSX.Element {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);

  const query: Record<string, string> = { _count: '50', _sort: 'name' };
  if (debouncedSearch) {
    query.name = debouncedSearch;
  }

  const [patients, loading] = useSearchResources('Patient', query);

  return (
    <Container size="lg">
      <Stack gap="lg">
        <Title order={2}>Patients</Title>
        <TextInput
          placeholder="Search patients by name..."
          size="md"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        {loading && (
          <Center>
            <Loader />
          </Center>
        )}
        {patients && patients.length === 0 && (
          <Text c="dimmed" ta="center">No patients found.</Text>
        )}
        {patients && patients.length > 0 && (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {patients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
}
