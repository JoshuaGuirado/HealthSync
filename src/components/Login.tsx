import React, { useState } from 'react';
import { Activity, ArrowRight, ShieldCheck, HeartPulse, FileText, Lock } from 'lucide-react';

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
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side - Branding & Value Prop */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 overflow-hidden items-center justify-center">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-500/30 blur-3xl"></div>
          <div className="absolute bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/30 blur-3xl"></div>
        </div>

        <div className="relative z-10 p-16 text-white max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <div className="flex items-center space-x-3 mb-12">
              <div className="bg-white p-2 rounded-xl">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <span className="text-3xl font-display font-bold tracking-tight">Health Sync</span>
            </div>

            <h1 className="text-5xl font-display font-bold leading-tight mb-6">
              Seu histórico médico,<br />
              <span className="text-blue-200">finalmente em suas mãos.</span>
            </h1>
            
            <p className="text-lg text-blue-100 mb-12 max-w-lg leading-relaxed">
              Unifique exames, vacinas e consultas em um único lugar. Use Inteligência Artificial para entender sua saúde e compartilhar resumos com seu médico em segundos.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500/50 p-3 rounded-full">
                  <ShieldCheck className="w-6 h-6 text-blue-100" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Privacidade Garantida</h3>
                  <p className="text-blue-200 text-sm">Seus dados são anonimizados e criptografados.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500/50 p-3 rounded-full">
                  <HeartPulse className="w-6 h-6 text-blue-100" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Foco no Paciente</h3>
                  <p className="text-blue-200 text-sm">Você é o dono do seu prontuário, não a clínica.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <div className="lg:hidden flex items-center space-x-2 mb-8 justify-center">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold text-gray-900">Health Sync</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold text-gray-900">Bem-vindo de volta</h2>
            <p className="text-gray-500 mt-2 text-sm">Acesse seu prontuário digital inteligente.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                required
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Esqueceu a senha?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Entrar no Prontuário
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              <span>Acesso seguro e criptografado (E2EE)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
