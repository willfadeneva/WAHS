import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import AdminDashboard from './AdminDashboard';

const ADMIN_EMAILS = ['oingyu@gmail.com', 'charanjotsingh@gmail.com'];

export default async function AdminPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Check if user is in admin_users table OR is in the hardcoded list
  const { data: adminRecord } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', user.id)
    .single();

  const isAdmin = !!adminRecord || ADMIN_EMAILS.includes(user.email || '');

  if (!isAdmin) {
    redirect('/admin/login');
  }

  return <AdminDashboard />;
}
