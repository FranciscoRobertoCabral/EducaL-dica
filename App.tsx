
import React, { useState, useRef } from 'react';
import { ActivityIdea, AgeGroup } from './types';
import { generateLessonIdea } from './services/geminiService';

const Header: React.FC = () => (
  <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-amber-100">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">E</div>
        <span className="font-bold text-xl tracking-tight text-amber-600">EducaLúdica</span>
      </div>
      <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
        <a href="#beneficios" className="hover:text-amber-500 transition-colors">Benefícios</a>
        <a href="#para-quem" className="hover:text-amber-500 transition-colors">Para Quem</a>
        <a href="#demo" className="hover:text-amber-500 transition-colors">Testar IA</a>
      </nav>
      <button className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md shadow-amber-200">
        Quero o Kit
      </button>
    </div>
  </header>
);

const Hero: React.FC = () => (
  <section className="pt-32 pb-20 px-4">
    <div className="max-w-4xl mx-auto text-center">
      <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 rounded-full">
        Sem Experiência? Sem Problemas!
      </span>
      <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
        Crie aulas encantadoras na Educação Infantil — <span className="text-amber-500">mesmo começando do zero</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
        Um kit de atividades lúdicas prontas para transformar suas aulas sem estresse, improviso ou horas de planejamento.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all shadow-lg shadow-amber-200 flex items-center justify-center gap-2">
          Quero Garantir Meu Kit Agora
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
        </button>
      </div>
    </div>
  </section>
);

const PainPoints: React.FC = () => (
  <section id="beneficios" className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Você ama o que faz, mas o planejamento te assombra?</h2>
          <div className="space-y-6">
            {[
              { q: "“Será que isso vai funcionar?”", icon: "🤔" },
              { q: "“E se as crianças não se interessarem?”", icon: "👧" },
              { q: "“Eu não sou criativa o suficiente…”", icon: "🎨" },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-2xl">{item.icon}</span>
                <p className="italic text-slate-700 font-medium">{item.q}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-slate-600">
            O problema não é você. É a falta de apoio certo. Planejar do zero consome tempo e energia que você poderia estar usando com as crianças.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: "Atividades Testadas", text: "Tudo validado em sala.", icon: "✅", color: "bg-green-100" },
            { title: "Zero Improviso", text: "Passo a passo detalhado.", icon: "⏱️", color: "bg-blue-100" },
            { title: "Estimule o Brincar", text: "Foco no desenvolvimento.", icon: "🧠", color: "bg-purple-100" },
            { title: "Felicidade Geral", icon: "👧🧒", text: "Crianças engajadas.", color: "bg-pink-100" }
          ].map((feature, idx) => (
            <div key={idx} className={`${feature.color} p-6 rounded-3xl`}>
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-slate-900">{feature.title}</h3>
              <p className="text-sm text-slate-700">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const AIDemo: React.FC = () => {
  const [theme, setTheme] = useState('');
  const [age, setAge] = useState(AgeGroup.MATERNAL);
  const [idea, setIdea] = useState<ActivityIdea | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!theme) return;
    setLoading(true);
    setError(null);
    setIdea(null);

    try {
      if (!process.env.API_KEY) {
        throw new Error("Chave de API não configurada. Verifique as variáveis de ambiente.");
      }
      const result = await generateLessonIdea(theme, age);
      setIdea(result);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } catch (err: any) {
      const msg = err.message?.includes("API_KEY") 
        ? "Erro de Configuração: A chave de API não foi encontrada no ambiente Vercel."
        : "Ops! Não consegui criar a ideia agora. Verifique sua conexão ou tente novamente em instantes.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="demo" className="py-20 px-4">
      <div className="max-w-4xl mx-auto bg-amber-50 rounded-[2.5rem] p-8 md:p-12 border border-amber-200 shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-200/20 rounded-full blur-3xl"></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-4 animate-float">
            <span className="text-3xl">✨</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Simulador de Ideias Lúdicas</h2>
          <p className="text-slate-600 max-w-lg mx-auto">Digite um tema e escolha a idade para ver a mágica do planejamento acontecer instantaneamente.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8 relative z-10">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Qual o tema de hoje?</label>
            <input 
              type="text" 
              placeholder="Ex: Primavera, Meio Ambiente, Cores..."
              className={`w-full px-5 py-3 rounded-xl border ${error ? 'border-red-300' : 'border-amber-200'} focus:ring-2 focus:ring-amber-400 outline-none transition-all shadow-sm`}
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Para qual turminha?</label>
            <select 
              className="w-full px-5 py-3 rounded-xl border border-amber-200 focus:ring-2 focus:ring-amber-400 outline-none bg-white transition-all shadow-sm"
              value={age}
              onChange={(e) => setAge(e.target.value as AgeGroup)}
            >
              {Object.values(AgeGroup).map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading || !theme}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-200 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Semeando Criatividade...
            </>
          ) : "Gerar Ideia de Aula"}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center text-sm font-medium animate-in fade-in zoom-in duration-300">
            {error}
            {!process.env.API_KEY && (
              <p className="mt-2 text-xs opacity-70 italic font-normal">Dica: Lembre-se de adicionar a API_KEY nas configurações do projeto no Vercel.</p>
            )}
          </div>
        )}

        {idea && (
          <div ref={resultRef} className="mt-12 bg-white rounded-3xl p-8 border border-amber-100 shadow-inner animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">💡</span>
              <h3 className="text-2xl font-bold text-amber-600">{idea.title}</h3>
            </div>
            
            <div className="space-y-8">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span> Objetivo Pedagógico
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">{idea.objective}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                    📦 Materiais Necessários
                  </h4>
                  <ul className="space-y-2">
                    {idea.materials.map((m, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-amber-400">•</span> {m}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                    🏃 Passo a Passo
                  </h4>
                  <ol className="space-y-3">
                    {idea.steps.map((s, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-600">
                        <span className="flex-shrink-0 w-5 h-5 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold text-[10px]">{i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 text-amber-200/50 text-4xl font-serif leading-none italic select-none">"</div>
                <h4 className="font-bold text-amber-700 text-xs uppercase tracking-widest mb-2">Dica de Ouro da Professora</h4>
                <p className="text-amber-800 italic text-sm relative z-10">{idea.tips}</p>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-400 text-sm mb-6 font-medium">Esta é apenas uma amostra da criatividade infinita do nosso Kit.</p>
              <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2 mx-auto">
                Baixar Kit Completo em PDF
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const ForWhom: React.FC = () => (
  <section id="para-quem" className="py-20 bg-slate-900 text-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 relative">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Este Kit foi feito pensando em você!</h2>
        <div className="w-20 h-1.5 bg-amber-400 mx-auto rounded-full"></div>
      </div>
      <div className="grid md:grid-cols-4 gap-6">
        {[
          "Professoras da Educação Infantil",
          "Auxiliares e Estagiárias",
          "Quem está começando e quer segurança",
          "Quem quer aulas criativas sem complicação"
        ].map((item, idx) => (
          <div key={idx} className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-amber-400/50 transition-all text-center">
            <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-slate-900 font-bold mx-auto mb-4">
              {idx + 1}
            </div>
            <p className="font-semibold text-lg">{item}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Footer: React.FC = () => (
  <footer className="bg-white py-12 border-t border-slate-100">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center text-white font-bold">E</div>
        <span className="font-bold text-xl tracking-tight text-amber-600">EducaLúdica</span>
      </div>
      <p className="text-slate-400 text-sm">
        © 2024 EducaLúdica - Transformando a educação através do brincar.<br/>
        Feito com ❤️ para educadores extraordinários.
      </p>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <PainPoints />
      <ForWhom />
      <AIDemo />
      
      <section className="py-20 px-4 bg-amber-400">
        <div className="max-w-3xl mx-auto text-center text-slate-900">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">Pronta para encantar suas crianças?</h2>
          <p className="text-xl mb-10 opacity-90">
            Chega de passar horas planejando ou se sentindo insegura. O kit EducaLúdica é o suporte que faltava na sua rotina.
          </p>
          <button className="bg-white hover:bg-slate-50 text-amber-600 px-10 py-5 rounded-2xl text-xl font-black transition-all shadow-2xl hover:scale-105 active:scale-95">
            SIM! QUERO ACESSO AO KIT!
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
