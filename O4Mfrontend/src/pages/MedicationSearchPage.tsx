import { Operator } from '@medplum/core';
import type { Filter } from '@medplum/core';
import { SearchControl } from '@medplum/react';
import { Container, TextInput, Title, Stack, SegmentedControl } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MedicationRequest } from '@medplum/fhirtypes';

type SearchMode = 'drug' | 'reason';

export function MedicationSearchPage(): React.JSX.Element {
  const [mode, setMode] = useState<SearchMode>('drug');
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const navigate = useNavigate();

  const filters: Filter[] = [];
  if (debouncedSearch) {
    if (mode === 'drug') {
      filters.push({ code: 'code:text', operator: Operator.EQUALS, value: debouncedSearch });
    } else {
      filters.push({ code: 'reason-code:text', operator: Operator.EQUALS, value: debouncedSearch });
    }
  }

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Title order={2}>Medication Search</Title>
        <SegmentedControl
          value={mode}
          onChange={(val) => {
            setMode(val as SearchMode);
            setSearch('');
          }}
          data={[
            { label: 'By Drug Name', value: 'drug' },
            { label: 'By Reason / Disease', value: 'reason' },
          ]}
        />
        <TextInput
          placeholder={
            mode === 'drug'
              ? 'Search by drug name (e.g., "metformin")...'
              : 'Search by reason/disease (e.g., "Polycystic")...'
          }
          size="md"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <SearchControl
          search={{
            resourceType: 'MedicationRequest',
            filters,
            fields: ['medication', 'subject', 'status', 'reason-code'],
            count: 50,
          }}
          hideToolbar
          onClick={(e) => {
            const med = e.resource as MedicationRequest;
            const ref = med.subject?.reference;
            if (ref) {
              const patientId = ref.replace('Patient/', '');
              navigate(`/patients/${patientId}`);
            }
          }}
        />
      </Stack>
    </Container>
  );
}
