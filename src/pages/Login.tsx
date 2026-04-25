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

  React.useEffect(() => {
    if (localStorage.getItem('isAuthenticated') === 'true') {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        if (data.user) {
          // Fetch role from profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();
            
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userType', profile?.role || 'donor');
          navigate('/dashboard');
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        
        if (data.user) {
          // Insert profile record
          const { error: profileError } = await supabase.from('profiles').insert([
            { id: data.user.id, full_name: fullName, role: role }
          ]);
          if (profileError) console.error("Profile creation error:", profileError);
        }
        
        alert('Signup successful! ' + (data.session ? 'Logging you in...' : 'Please look for a verification email.'));
        if (data.session) {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userType', role);
          navigate('/dashboard');
        } else {
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
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
            {!isLogin && (
              <>
                <Input 
                  label="Full Name / Organization" 
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
              placeholder={isLogin ? "Enter your password" : "Create a password (min 1 char)"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              minLength={1}
            />
            
            {error && <div className="auth-error" style={{ color: 'var(--color-danger)', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '6px' }}>{error}</div>}

            <Button type="submit" fullWidth size="lg" disabled={isLoading}>
              {isLoading ? 'Processing...' : (isLogin ? <><LogIn size={18} /> Sign In</> : <><UserPlus size={18} /> Create Account</>)}
            </Button>

            <div className="test-login-divider">
              <span>OR QUICK TEST</span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <Button 
                type="button" 
                variant="outline" 
                fullWidth 
                onClick={async () => {
                  const testEmail = 'ngo@test.com';
                  const testPass = '111111';
                  const testRole = 'ngo';
                  setEmail(testEmail);
                  setPassword(testPass);
                  
                  // Trigger auto-login
                  setIsLoading(true);
                  setError('');
                  try {
                    const { data, error: loginErr } = await supabase.auth.signInWithPassword({
                      email: testEmail,
                      password: testPass,
                    });

                    if (loginErr) {
                      // If login fails, try to signup once automatically
                      const { error: signUpErr } = await supabase.auth.signUp({
                        email: testEmail,
                        password: testPass,
                      });
                      if (signUpErr) throw signUpErr;
                      
                      // Create profile
                      await supabase.from('profiles').insert([{ id: (await supabase.auth.getUser()).data.user?.id, full_name: 'Test NGO', role: testRole }]);
                      
                      alert('Test Serve account created! Clicking again will log you in.');
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
                }}
                style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', flex: 1, padding: '0 8px', height: 'auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px', paddingBlock: '12px' }}
              >
                <div style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><HandHeart size={20} /> Serve</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.8, lineHeight: 1.2 }}>Claim & distribute to those in need</div>
              </Button>

              <Button 
                type="button" 
                variant="outline" 
                fullWidth 
                onClick={async () => {
                  const testEmail = 'shop@test.com';
                  const testPass = '111111';
                  const testRole = 'shop';
                  setEmail(testEmail);
                  setPassword(testPass);
                  
                  // Trigger auto-login
                  setIsLoading(true);
                  setError('');
                  try {
                    const { data, error: loginErr } = await supabase.auth.signInWithPassword({
                      email: testEmail,
                      password: testPass,
                    });

                    if (loginErr) {
                      // If login fails, try to signup once automatically
                      const { error: signUpErr } = await supabase.auth.signUp({
                        email: testEmail,
                        password: testPass,
                      });
                      if (signUpErr) throw signUpErr;
                      
                      // Create profile
                      await supabase.from('profiles').insert([{ id: (await supabase.auth.getUser()).data.user?.id, full_name: 'Test Supermarket', role: testRole }]);
                      
                      alert('Test Rescue account created! Clicking again will log you in.');
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
                }}
                style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', flex: 1, padding: '0 8px', height: 'auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px', paddingBlock: '12px' }}
              >
                <div style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Leaf size={20} /> Rescue</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.8, lineHeight: 1.2 }}>List & manage surplus food</div>
              </Button>
            </div>

            <div style={{ marginTop: '8px' }}>
              <Button 
                type="button" 
                variant="outline" 
                fullWidth 
                onClick={async () => {
                  const testEmail = 'mithra@test.com';
                  const testPass = '111111';
                  const testRole = 'mithra';
                  setEmail(testEmail);
                  setPassword(testPass);
                  
                  setIsLoading(true);
                  setError('');
                  try {
                    const { data, error: loginErr } = await supabase.auth.signInWithPassword({
                      email: testEmail,
                      password: testPass,
                    });

                    if (loginErr) {
                      const { error: signUpErr } = await supabase.auth.signUp({
                        email: testEmail,
                        password: testPass,
                      });
                      if (signUpErr) throw signUpErr;
                      
                      await supabase.from('profiles').insert([{ id: (await supabase.auth.getUser()).data.user?.id, full_name: 'Test Volunteer', role: testRole }]);
                      
                      alert('Test Mithra account created! Clicking again will log you in.');
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
                }}
                style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)', height: 'auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px', paddingBlock: '12px' }}
              >
                <div style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Bike size={20} /> Mithra</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.8, lineHeight: 1.2 }}>Volunteer — pick up & deliver food</div>
              </Button>
            </div>
          </form>

          <div className="auth-footer">
            {isLogin ? (
              <p>Don't have an account? <button onClick={() => setIsLogin(false)}>Sign Up</button></p>
            ) : (
              <p>Already have an account? <button onClick={() => setIsLogin(true)}>Log In</button></p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
