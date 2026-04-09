import { SignInForm } from '@medplum/react';
import { useMedplumProfile } from '@medplum/react-hooks';
import { Center, Stack, Title } from '@mantine/core';
import { Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { HomePage } from './pages/HomePage';
import { PatientDetailPage } from './pages/PatientDetailPage';
import { ConditionSearchPage } from './pages/ConditionSearchPage';
import { MedicationSearchPage } from './pages/MedicationSearchPage';

export function App(): React.JSX.Element {
  const profile = useMedplumProfile();

  if (!profile) {
    return (
      <Center h="100vh">
        <Stack align="center" gap="lg">
          <Title order={2}>O4M FHIR Viewer</Title>
          <SignInForm onSuccess={() => window.location.reload()} />
        </Stack>
      </Center>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/patients/:id" element={<PatientDetailPage />} />
        <Route path="/conditions" element={<ConditionSearchPage />} />
        <Route path="/medications" element={<MedicationSearchPage />} />
      </Route>
    </Routes>
  );
}
