import { requireSeller } from '@/lib/auth-context';
import SettingsForm from './components/SettingsForm';

export default async function SettingsPage() {
  // Get user data server-side
  const user = await requireSeller();
  
  return <SettingsForm initialData={user} />;
}