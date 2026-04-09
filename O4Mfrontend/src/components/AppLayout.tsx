import { useMedplum } from '@medplum/react-hooks';
import { AppShell, Group, Button, Title } from '@mantine/core';
import { Outlet, useNavigate } from 'react-router-dom';

export function AppLayout(): React.JSX.Element {
  const medplum = useMedplum();
  const navigate = useNavigate();

  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Title
              order={4}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              O4M FHIR Viewer
            </Title>
            <Button variant="subtle" onClick={() => navigate('/')}>
              Patients
            </Button>
            <Button variant="subtle" onClick={() => navigate('/conditions')}>
              Conditions
            </Button>
            <Button variant="subtle" onClick={() => navigate('/medications')}>
              Medications
            </Button>
          </Group>
          <Button
            variant="light"
            color="red"
            size="xs"
            onClick={() => {
              medplum.signOut();
              window.location.reload();
            }}
          >
            Sign Out
          </Button>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
