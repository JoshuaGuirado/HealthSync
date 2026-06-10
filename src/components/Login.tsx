import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, ArrowRight, ShieldCheck, HeartPulse, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('leandro@exemplo.com');
  const [password, setPassword] = useState('********');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-[#0f172a] font-sans relative overflow-hidden">
      {/* Background Animated Circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-3xl animate-pulse duration-[10000ms]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-3xl animate-pulse duration-[8000ms]"></div>

      {/* Left Side - Branding & Value Prop */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center border-r border-slate-800/50">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-950 via-slate-950 to-slate-950 z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent z-0"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 p-16 text-white max-w-2xl space-y-12"
        >
          <div className="flex items-center space-x-3.5">
            <div className="bg-gradient-premium p-2.5 rounded-2xl shadow-lg shadow-blue-500/20">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-display font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-300">
              Health Sync
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl font-display font-extrabold leading-tight tracking-tight">
              Seu histórico médico,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
                centralizado e inteligente.
              </span>
            </h1>
            
            <p className="text-base text-slate-300 leading-relaxed max-w-lg">
              Unifique exames, vacinas e consultas em um único espaço. Entenda sua saúde com resumos gerados por Inteligência Artificial e compartilhe com seu médico de forma simples e rápida.
            </p>
          </div>

          <div className="space-y-6 pt-4">
            {[
              {
                icon: ShieldCheck,
                title: 'Privacidade & Anonimização',
                desc: 'Seus dados são lidos pela IA com segurança e anonimização de informações sensíveis.',
                color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
              },
              {
                icon: HeartPulse,
                title: 'Controle Total do Paciente',
                desc: 'Você é o proprietário dos seus dados médicos, prontuários e carteiras de imunizações.',
                color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
              }
            ].map((prop, idx) => (
              <div key={idx} className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl border shrink-0 ${prop.color}`}>
                  <prop.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-100">{prop.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{prop.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl shadow-blue-950/20"
        >
          {/* Logo on Mobile */}
          <div className="lg:hidden flex items-center space-x-2.5 mb-8 justify-center">
            <div className="bg-gradient-premium p-2 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-extrabold text-white">Health Sync</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold text-white tracking-tight">Bem-vindo ao Health Sync</h2>
            <p className="text-slate-400 mt-2 text-sm">Acesse seu prontuário digital inteligente</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-800 bg-slate-950/40 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="exemplo@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-300">Senha</label>
                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 font-bold transition-colors">Esqueceu a senha?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-800 bg-slate-950/40 text-slate-200 placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-gradient-premium hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Entrar no Prontuário
                  <ArrowRight className="ml-2 w-4.5 h-4.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 font-medium">
              <Lock className="w-4 h-4 text-slate-600" />
              <span>Acesso seguro com criptografia de ponta a ponta</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
