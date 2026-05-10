import { Plane } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || 'Login failed');

      const authData = data?.data || data;
      login({ token: authData?.token, user: authData?.user || { email: form.email, name: form.email.split('@')[0] } });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='relative flex min-h-screen items-center justify-center bg-[#0F172A] p-6'>
      <div className='auth-blob auth-blob1' />
      <div className='auth-blob auth-blob2' />
      <form onSubmit={onSubmit} className='relative z-10 w-full max-w-md rounded-2xl bg-white p-7 shadow-md'>
        <div className='mb-6 flex flex-col items-center gap-3'>
          <div className='grid h-10 w-10 place-items-center rounded-xl bg-white text-[#0D9488] shadow'>
            <Plane size={18} />
          </div>
          <h1 className='font-sora text-2xl font-semibold text-[#0F172A]'>Traveloop</h1>
        </div>

        <div className='space-y-3'>
          <input className='input' name='email' type='email' placeholder='Email' value={form.email} onChange={onChange} required />
          <input className='input' name='password' type='password' placeholder='Password' value={form.password} onChange={onChange} required />
          {error && <p className='text-sm text-red-600'>{error}</p>}
          <button disabled={loading} className='btn-primary w-full'>{loading ? 'Logging in...' : 'Login'}</button>
          <p className='text-center text-sm text-[#64748B]'>
            Don&apos;t have an account? <Link className='font-medium text-[#0D9488]' to='/register'>Register</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
