import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ShieldCheck, LogIn, UserPlus, HandHeart, Leaf, Bike } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './Login.css';

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('shop');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const { data, error: loginErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (loginErr) throw loginErr;
        
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();
            
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userType', profile?.role || 'shop');
          navigate('/dashboard');
        }
      } else {
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpErr) throw signUpErr;
        
        if (data.user) {
          await supabase.from('profiles').insert([
            { id: data.user.id, full_name: fullName, role: role }
          ]);
        }
        
        if (data.session) {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userType', role);
          navigate('/dashboard');
        } else {
          alert('Signup successful! Please log in.');
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickTest = async (testEmail: string, testPass: string, testRole: string, name: string) => {
    setIsLoading(true);
    setError('');
    try {
      const { data, error: loginErr } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPass,
      });

      if (loginErr) {
        // Auto-signup if test account doesn't exist
        const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
          email: testEmail,
          password: testPass,
        });
        if (signUpErr) throw signUpErr;
        
        if (signUpData.user) {
          await supabase.from('profiles').upsert([
            { id: signUpData.user.id, full_name: name, role: testRole }
          ]);
        }
        alert(`Test ${testRole} account created! Click again to log in.`);
      } else if (data.user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userType', profile?.role || testRole);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-visual">
        <div className="login-logo">
          <img src="/annamithralogo.jpeg" alt="AnnaMithra" width={80} />
          <h1>AnnaMithra</h1>
        </div>
        <p>Connecting surplus food to social impact through trust and transparency.</p>
        <div className="trust-stats">
          <div className="tstat">
            <ShieldCheck size={20} />
            <span>Verified Users</span>
          </div>
          <div className="tstat">
            <LogIn size={20} />
            <span>Secure Access</span>
          </div>
        </div>
      </div>

      <div className="login-form-side">
        <Card className="auth-card glass">
          <div className="auth-header">
            <h2>{isLogin ? 'Welcome Back' : 'Join the Network'}</h2>
            <p>{isLogin ? 'Sign in to your AnnaMithra account' : 'Select your role: Rescue, Serve, or Mithra'}</p>
          </div>

          <form onSubmit={handleAuth} className="auth-form">
            {error && <div className="auth-error">{error}</div>}
            
            {!isLogin && (
              <>
                <Input 
                  label="Full Name / Org Name" 
                  placeholder="e.g., Akshaya Patra Foundation" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required 
                />
                
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="input-label" style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--color-text)' }}>Account Type</label>
                  <select 
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1.5px solid rgba(139, 161, 148, 0.4)', background: 'var(--glass-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-main)' }}
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="shop">Rescue (List Surplus Food)</option>
                    <option value="ngo">Serve (Distribute Food)</option>
                    <option value="mithra">Mithra (Volunteer Delivery)</option>
                  </select>
                </div>
              </>
            )}

            <Input 
              type="email"
              label="Email Address" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />

            <Button 
              type="submit" 
              className="w-full" 
              size="lg" 
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>

          <div className="test-login-divider">OR QUICK TEST</div>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
            <Button 
              variant="outline" 
              onClick={() => handleQuickTest('ngo@test.com', 'password123', 'ngo', 'Test Serve Org')}
              style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', flex: 1, padding: '0 8px', height: 'auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px', paddingBlock: '12px' }}
            >
              <div style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><HandHeart size={20} /> Serve</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.8, lineHeight: 1.2 }}>Claim & distribute</div>
            </Button>

            <Button 
              variant="outline" 
              onClick={() => handleQuickTest('shop@test.com', 'password123', 'shop', 'Test Rescue Shop')}
              style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', flex: 1, padding: '0 8px', height: 'auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px', paddingBlock: '12px' }}
            >
              <div style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Leaf size={20} /> Rescue</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.8, lineHeight: 1.2 }}>List surplus food</div>
            </Button>
          </div>

          <div style={{ marginTop: '12px' }}>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleQuickTest('mithra@test.com', 'password123', 'mithra', 'Test Mithra Volunteer')}
              style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', height: 'auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px', paddingBlock: '12px' }}
            >
              <div style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Bike size={20} /> Mithra</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.8, lineHeight: 1.2 }}>Volunteer Delivery Partner</div>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
