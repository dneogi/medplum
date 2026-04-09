import { Operator } from '@medplum/core';
import { SearchControl } from '@medplum/react';
import { Container, TextInput, Title, Stack } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Condition } from '@medplum/fhirtypes';
import type { Filter } from '@medplum/core';

export function ConditionSearchPage(): React.JSX.Element {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const navigate = useNavigate();

  const filters: Filter[] = debouncedSearch
    ? [{ code: 'code:text', operator: Operator.EQUALS, value: debouncedSearch }]
    : [];

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Title order={2}>Condition Search</Title>
        <TextInput
          placeholder='Search conditions (e.g., "diabetes", "polycystic")...'
          size="md"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <SearchControl
          search={{
            resourceType: 'Condition',
            filters,
            fields: ['code', 'subject', 'clinical-status', 'onset-date'],
            count: 50,
          }}
          hideToolbar
          onClick={(e) => {
            const condition = e.resource as Condition;
            const ref = condition.subject?.reference;
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
