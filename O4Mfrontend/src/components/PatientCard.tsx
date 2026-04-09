import { HumanNameDisplay, ResourceAvatar } from '@medplum/react';
import { Card, Group, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import type { Patient } from '@medplum/fhirtypes';

interface PatientCardProps {
  patient: Patient;
}

export function PatientCard({ patient }: PatientCardProps): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/patients/${patient.id}`)}
    >
      <Group>
        <ResourceAvatar value={patient} size={48} />
        <div>
          <Text fw={500}>
            {patient.name ? (
              <HumanNameDisplay value={patient.name[0]} />
            ) : (
              'Unknown'
            )}
          </Text>
          <Text size="sm" c="dimmed">
            {patient.birthDate && `DOB: ${patient.birthDate}`}
            {patient.birthDate && patient.gender && ' | '}
            {patient.gender && `Gender: ${patient.gender}`}
          </Text>
        </div>
      </Group>
    </Card>
  );
}
