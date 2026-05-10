import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { changeMyPassword, deleteMyAccount, getMyProfile, updateMyProfile } from './api.js';

const emptyForm = { photo: '', name: '', email: '', phone: '', city: '', country: '', bio: '' };

export default function UserProfile() {
  const { updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [stats, setStats] = useState({ tripsCount: 0, countriesVisited: 0, daysTraveled: 0 });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changing, setChanging] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const payload = await getMyProfile();
        const user = payload?.user || {};
        setForm({
          photo: user.photo || '',
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          city: user.city || '',
          country: user.country || '',
          bio: user.bio || ''
        });
        setStats(payload?.stats || { tripsCount: 0, countriesVisited: 0, daysTraveled: 0 });
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const onPasswordChange = (e) => setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const avatarLabel = useMemo(() => (form.name || 'U').slice(0, 1).toUpperCase(), [form.name]);

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const user = await updateMyProfile(form);
      updateUser(user);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    setChanging(true);
    try {
      await changeMyPassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      toast.success('Password changed');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setChanging(false);
    }
  };

  const onDeleteAccount = async () => {
    const confirmed = window.confirm('Delete your account permanently? This cannot be undone.');
    if (!confirmed) return;
    setDeleting(true);
    try {
      await deleteMyAccount();
      toast.success('Account deleted');
      logout();
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <section className='page-in rounded-2xl bg-white p-6 shadow-md'>Loading profile...</section>;
  }

  return (
    <div className='page-in grid gap-5 lg:grid-cols-3'>
      <section className='rounded-2xl bg-white p-5 shadow-md lg:col-span-2'>
        <h3 className='font-sora text-xl font-semibold text-[#0F172A]'>User Profile</h3>
        <form className='mt-4 space-y-3' onSubmit={onSave}>
          <div className='grid gap-3 md:grid-cols-2'>
            <input className='input' name='photo' placeholder='Photo URL' value={form.photo} onChange={onChange} />
            <input className='input' name='name' placeholder='Name' value={form.name} onChange={onChange} required />
            <input className='input' name='email' type='email' placeholder='Email' value={form.email} onChange={onChange} required />
            <input className='input' name='phone' placeholder='Phone' value={form.phone} onChange={onChange} />
            <input className='input' name='city' placeholder='City' value={form.city} onChange={onChange} />
            <input className='input' name='country' placeholder='Country' value={form.country} onChange={onChange} />
          </div>
          <textarea className='input min-h-[120px]' name='bio' placeholder='Bio' value={form.bio} onChange={onChange} />
          <button className='btn-primary' disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
        </form>
      </section>

      <section className='space-y-5'>
        <article className='rounded-2xl bg-white p-5 shadow-md'>
          <div className='flex items-center gap-3'>
            <div className='grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-lg font-semibold'>{avatarLabel}</div>
            <div>
              <p className='font-medium text-slate-900'>{form.name || 'Traveler'}</p>
              <p className='text-sm text-slate-500'>{form.email}</p>
            </div>
          </div>
          <div className='mt-4 grid grid-cols-3 gap-2 text-center'>
            <div className='rounded-xl bg-slate-50 p-2'><p className='font-semibold'>{stats.tripsCount}</p><p className='text-xs text-slate-500'>Trips</p></div>
            <div className='rounded-xl bg-slate-50 p-2'><p className='font-semibold'>{stats.countriesVisited}</p><p className='text-xs text-slate-500'>Countries</p></div>
            <div className='rounded-xl bg-slate-50 p-2'><p className='font-semibold'>{stats.daysTraveled}</p><p className='text-xs text-slate-500'>Days</p></div>
          </div>
        </article>

        <article className='rounded-2xl bg-white p-5 shadow-md'>
          <h4 className='font-sora text-lg font-semibold text-[#0F172A]'>Change Password</h4>
          <form className='mt-3 space-y-3' onSubmit={onChangePassword}>
            <input className='input' type='password' name='currentPassword' placeholder='Current password' value={passwordForm.currentPassword} onChange={onPasswordChange} required />
            <input className='input' type='password' name='newPassword' placeholder='New password' value={passwordForm.newPassword} onChange={onPasswordChange} required />
            <button className='btn-secondary' disabled={changing}>{changing ? 'Updating...' : 'Update Password'}</button>
          </form>
        </article>

        <article className='rounded-2xl border border-red-200 bg-red-50 p-5'>
          <h4 className='font-sora text-lg font-semibold text-red-800'>Danger Zone</h4>
          <p className='mt-1 text-sm text-red-700'>Delete account permanently and remove all your trips.</p>
          <button className='mt-3 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white' onClick={onDeleteAccount} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </article>
      </section>
    </div>
  );
}
