import { Plane } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const registerUser = async (formData) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const text = await response.text();

    if (!text || text.trim() === '') {
      throw new Error(`Server returned empty response (HTTP ${response.status})`);
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Server error: ${text}`);
    }

    if (!response.ok) {
      throw new Error(data?.message || data?.error || 'Registration failed');
    }

    return data;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await registerUser(form);

      const authData = data?.data || data;
      login({
        token: authData?.token,
        user: authData?.user || {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          city: form.city,
          country: form.country
        }
      });
      navigate('/', { replace: true });
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
      <form onSubmit={onSubmit} className='relative z-10 w-full max-w-lg rounded-2xl bg-white p-7 shadow-md'>
        <div className='mb-6 flex flex-col items-center gap-3'>
          <div className='grid h-10 w-10 place-items-center rounded-xl bg-white text-[#0D9488] shadow'>
            <Plane size={18} />
          </div>
          <h1 className='font-sora text-2xl font-semibold text-[#0F172A]'>Traveloop</h1>
        </div>

        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
          <input className='input' name='firstName' placeholder='First Name' value={form.firstName} onChange={onChange} required />
          <input className='input' name='lastName' placeholder='Last Name' value={form.lastName} onChange={onChange} required />
          <input className='input md:col-span-2' name='email' type='email' placeholder='Email' value={form.email} onChange={onChange} required />
          <input className='input' name='phone' placeholder='Phone' value={form.phone} onChange={onChange} required />
          <input className='input' name='city' placeholder='City' value={form.city} onChange={onChange} required />
          <input className='input' name='country' placeholder='Country' value={form.country} onChange={onChange} required />
          <input className='input md:col-span-2' name='password' type='password' placeholder='Password' value={form.password} onChange={onChange} required />
        </div>

        {error && <p className='mt-3 text-sm text-red-600'>{error}</p>}
        <button disabled={loading} className='btn-primary mt-4 w-full'>{loading ? 'Registering...' : 'Register'}</button>
        <p className='mt-3 text-center text-sm text-[#64748B]'>
          Already have an account? <Link className='font-medium text-[#0D9488]' to='/login'>Login</Link>
        </p>
      </form>
    </div>
  );
}
