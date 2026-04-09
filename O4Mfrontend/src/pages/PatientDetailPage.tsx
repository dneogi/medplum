import { Operator } from '@medplum/core';
import { PatientSummary, SearchControl } from '@medplum/react';
import { useResource } from '@medplum/react-hooks';
import { Container, Tabs, Title, Loader, Center, Text, Stack } from '@mantine/core';
import { useParams, useNavigate } from 'react-router-dom';
import type { Patient, Resource } from '@medplum/fhirtypes';

export function PatientDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const patient = useResource<Patient>({ reference: `Patient/${id}` });
  const navigate = useNavigate();

  if (!patient) {
    return (
      <Center h={400}>
        <Loader />
      </Center>
    );
  }

  const patientName = patient.name?.[0]
    ? [patient.name[0].given?.join(' '), patient.name[0].family].filter(Boolean).join(' ')
    : 'Patient';

  const handleClick = (resource: Resource) => {
    if (resource.resourceType === 'Patient') {
      navigate(`/patients/${resource.id}`);
    }
  };

  return (
    <Container size="xl">
      <Stack gap="md">
        <Title order={2}>{patientName}</Title>
        <Text size="sm" c="dimmed">
          {patient.birthDate && `DOB: ${patient.birthDate}`}
          {patient.birthDate && patient.gender && ' | '}
          {patient.gender && `Gender: ${patient.gender}`}
          {patient.id && ` | ID: ${patient.id}`}
        </Text>

        <Tabs defaultValue="summary">
          <Tabs.List>
            <Tabs.Tab value="summary">Summary</Tabs.Tab>
            <Tabs.Tab value="conditions">Conditions</Tabs.Tab>
            <Tabs.Tab value="medications">Medications</Tabs.Tab>
            <Tabs.Tab value="labs">Labs</Tabs.Tab>
            <Tabs.Tab value="procedures">Procedures</Tabs.Tab>
            <Tabs.Tab value="encounters">Encounters</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="summary" pt="md">
            <PatientSummary patient={patient} onClickResource={handleClick} />
          </Tabs.Panel>

          <Tabs.Panel value="conditions" pt="md">
            <SearchControl
              search={{
                resourceType: 'Condition',
                filters: [{ code: 'subject', operator: Operator.EQUALS, value: `Patient/${id}` }],
                fields: ['code', 'clinical-status', 'verification-status', 'onset-date'],
              }}
              hideToolbar
              onClick={(e) => handleClick(e.resource)}
            />
          </Tabs.Panel>

          <Tabs.Panel value="medications" pt="md">
            <SearchControl
              search={{
                resourceType: 'MedicationRequest',
                filters: [{ code: 'subject', operator: Operator.EQUALS, value: `Patient/${id}` }],
                fields: ['medication', 'status', 'authored-on', 'reason-code'],
              }}
              hideToolbar
              onClick={(e) => handleClick(e.resource)}
            />
          </Tabs.Panel>

          <Tabs.Panel value="labs" pt="md">
            <SearchControl
              search={{
                resourceType: 'Observation',
                filters: [
                  { code: 'subject', operator: Operator.EQUALS, value: `Patient/${id}` },
                  { code: 'category', operator: Operator.EQUALS, value: 'laboratory' },
                ],
                fields: ['code', 'value-quantity', 'status', 'date'],
              }}
              hideToolbar
              onClick={(e) => handleClick(e.resource)}
            />
          </Tabs.Panel>

          <Tabs.Panel value="procedures" pt="md">
            <SearchControl
              search={{
                resourceType: 'Procedure',
                filters: [{ code: 'subject', operator: Operator.EQUALS, value: `Patient/${id}` }],
                fields: ['code', 'status', 'date'],
              }}
              hideToolbar
              onClick={(e) => handleClick(e.resource)}
            />
          </Tabs.Panel>

          <Tabs.Panel value="encounters" pt="md">
            <SearchControl
              search={{
                resourceType: 'Encounter',
                filters: [{ code: 'subject', operator: Operator.EQUALS, value: `Patient/${id}` }],
                fields: ['type', 'status', 'period', 'class'],
              }}
              hideToolbar
              onClick={(e) => handleClick(e.resource)}
            />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
