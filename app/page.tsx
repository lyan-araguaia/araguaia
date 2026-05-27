export default function AraguaIALandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.15),transparent_40%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 py-24 text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm tracking-[0.25em] uppercase text-zinc-300">
              araguaia.cloud
            </span>
          </div>
        </div>

        {/* Hero */}
        <section className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight">
            Aragua<span className="text-green-400">IA</span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Monitore a qualidade do ar em tempo real com tecnologia IoT
            inteligente, precisa e de baixo custo.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#waitlist"
              className="px-7 py-3 rounded-2xl bg-green-400 text-black font-medium hover:scale-[1.02] transition-all duration-300 shadow-[0_0_40px_rgba(74,222,128,0.25)]"
            >
              Entrar na Waitlist
            </a>

            <a
              href="#contact"
              className="px-7 py-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 transition-all duration-300"
            >
              Contato
            </a>
          </div>
        </section>

        {/* Tech Card */}
        <section className="mt-24 w-full max-w-5xl grid md:grid-cols-3 gap-5">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-left shadow-2xl">
            <div className="text-sm text-green-400 mb-3">IoT</div>
            <h3 className="text-xl font-medium">Sensoriamento Inteligente</h3>
            <p className="mt-3 text-zinc-400 leading-relaxed">
              Estrutura baseada em sensores de baixo custo com monitoramento
              contínuo e em tempo real.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-left shadow-2xl">
            <div className="text-sm text-green-400 mb-3">Cloud</div>
            <h3 className="text-xl font-medium">Infraestrutura Escalável</h3>
            <p className="mt-3 text-zinc-400 leading-relaxed">
              Dados processados e disponibilizados através de uma arquitetura
              moderna e preparada para crescimento.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-left shadow-2xl">
            <div className="text-sm text-green-400 mb-3">Data</div>
            <h3 className="text-xl font-medium">Monitoramento Ambiental</h3>
            <p className="mt-3 text-zinc-400 leading-relaxed">
              Informações ambientais acessíveis para empresas, instituições e
              cidades inteligentes.
            </p>
          </div>
        </section>

        {/* Waitlist */}
        <section
          id="waitlist"
          className="mt-28 w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-10 shadow-2xl"
        >
          <div className="text-sm uppercase tracking-[0.2em] text-green-400 mb-4">
            Waitlist
          </div>

          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Seja um dos primeiros a acompanhar o projeto.
          </h2>

          <p className="mt-4 text-zinc-400 leading-relaxed">
            Receba novidades, atualizações técnicas e os primeiros acessos da
            plataforma AraguaIA.
          </p>

          <form className="mt-8 flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white outline-none focus:border-green-400 transition-all"
            />

            <button
              type="submit"
              className="px-6 py-4 rounded-2xl bg-green-400 text-black font-medium hover:scale-[1.02] transition-all duration-300"
            >
              Entrar
            </button>
          </form>
        </section>

        {/* Contact */}
        <section id="contact" className="mt-20 text-center">
          <div className="text-sm uppercase tracking-[0.2em] text-green-400 mb-4">
            Contato
          </div>

          <p className="text-zinc-400 max-w-xl leading-relaxed">
            Interessado em acompanhar o desenvolvimento, colaborar ou conversar
            sobre a proposta?
          </p>

          <a
            href="mailto:contato@araguaia.cloud"
            className="inline-block mt-6 text-lg text-white hover:text-green-400 transition-colors"
          >
            contato@araguaia.cloud
          </a>
        </section>

        {/* Footer */}
        <footer className="mt-28 text-zinc-600 text-sm">
          © 2026 AraguaIA — araguaia.cloud
        </footer>
      </main>
    </div>
  );
}
