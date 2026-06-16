"use client";

import React, { useState, useEffect } from "react";

// ==========================================
// TIPAGENS E INTERFACES (TypeScript)
// ==========================================

interface SensorDataSample {
  timestamp: string;
  pm25: number;
  pm10: number;
  co2: number;
  temperature: number;
  humidity: number;
  status: "GOOD" | "MODERATE" | "POOR";
}

interface WaitlistState {
  step: number;
  name: string;
  email: string;
  institution: string;
  vertical: "urban" | "agro" | "enterprise" | "";
  userRole: string;
  notes: string;
  termsAccepted: boolean;
}

interface TerminalLine {
  id: string;
  text: string;
  type: "info" | "success" | "warning" | "error" | "input";
}

// ==========================================
// COMPONENTE PRINCIPAL: LANDING PAGE ARAGUAIA
// ==========================================

export default function AraguaIALandingPage() {
  // ----------------------------------------
  // ESTADOS DA APLICAÇÃO
  // ----------------------------------------
  
  // Estado para o formulário de múltiplas etapas da Waitlist
  const [formData, setFormData] = useState<WaitlistState>({
    step: 1,
    name: "",
    email: "",
    institution: "",
    vertical: "",
    userRole: "",
    notes: "",
    termsAccepted: false,
  });

  // Estados de controle do formulário
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  // Estado para a aba ativa na seção de arquitetura técnica
  const [activeTechTab, setActiveTechTab] = useState<"hardware" | "rtos" | "data">("hardware");

  // Estado para a aba ativa na seção de verticais de negócios
  const [activeVerticalTab, setActiveVerticalTab] = useState<"urban" | "agro" | "enterprise">("urban");

  // Estado para simulação de dados em tempo real no dashboard interativo
  const [mockData, setMockData] = useState<SensorDataSample>({
    timestamp: "21:22:04",
    pm25: 12.4,
    pm10: 24.8,
    co2: 415,
    temperature: 24.6,
    humidity: 62.1,
    status: "GOOD",
  });

  // Estado para o terminal interativo que simula o log do ESP32/FreeRTOS
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { id: "1", text: "[System] Inicializando Ecossistema AraguaIA v1.0.0...", type: "info" },
    { id: "2", text: "[Hardware] SoC ESP32 Dual-Core detectado. Clock configurado para 240MHz.", type: "info" },
    { id: "3", text: "[FreeRTOS] Criando Task_Sensor no Core 1 (Prioridade 2)...", type: "success" },
    { id: "4", text: "[FreeRTOS] Criando Task_Network no Core 0 (Prioridade 1)...", type: "success" },
    { id: "5", text: "[I2C] Varrendo barramento... Sensor BME680 encontrado no endereço 0x77.", type: "info" },
    { id: "6", text: "[I2C] Display SSD1306 encontrado no endereço 0x3C.", type: "info" },
    { id: "7", text: "[LittleFS] Sistema de arquivos montado com sucesso na memória Flash.", type: "success" },
    { id: "8", text: "[WiFi] Tentando conectar via WiFiManager à última rede salva...", type: "info" },
  ]);

  const [newTerminalInput, setNewTerminalInput] = useState<string>("");

  // ----------------------------------------
  // EFEITOS E SIMULAÇÕES (useEffect)
  // ----------------------------------------
  
  // Efeito para atualizar periodicamente o simulador de dados do sensor
  useEffect(() => {
    const dataInterval = setInterval(() => {
      const now = new Date();
      const timeString = now.toTimeString().split(" ")[0];
      
      setMockData(prev => {
        // Gera pequenas flutuações realistas nos dados ambientais
        const co2Delta = Math.floor(Math.random() * 11) - 5;
        const pm25Delta = Number((Math.random() * 2 - 1).toFixed(1));
        const tempDelta = Number((Math.random() * 0.4 - 0.2).toFixed(2));
        
        const newCo2 = Math.max(380, Math.min(1200, prev.co2 + co2Delta));
        const newPm25 = Math.max(2, Math.min(150, prev.pm25 + pm25Delta));
        const newTemp = Math.max(15, Math.min(40, prev.temperature + tempDelta));
        
        // Determina o status com base no índice simplificado da qualidade do ar
        let currentStatus: "GOOD" | "MODERATE" | "POOR" = "GOOD";
        if (newPm25 > 50 || newCo2 > 1000) {
          currentStatus = "POOR";
        } else if (newPm25 > 25 || newCo2 > 700) {
          currentStatus = "MODERATE";
        }

        return {
          timestamp: timeString,
          pm25: newPm25,
          pm10: Number((newPm25 * 2).toFixed(1)),
          co2: newCo2,
          temperature: newTemp,
          humidity: Math.max(30, Math.min(95, prev.humidity + (Math.random() * 2 - 1))),
          status: currentStatus
        };
      });
    }, 4000);

    return () => clearInterval(dataInterval);
  }, []);

  // Efeito para alimentar o terminal simulado com logs contínuos do firmware
  useEffect(() => {
    const logInterval = setInterval(() => {
      const logsPool: { text: string; type: "info" | "success" | "warning" | "error" }[] = [
        { text: "[Task_Sensor] Leitura efetuada com sucesso via barramento I2C.", type: "success" },
        { text: "[Task_Network] Sincronização horária obtida via servidor NTP.", type: "success" },
        { text: "[Task_Network] Enviando pacote de telemetria para a API Gateway...", type: "info" },
        { text: "[Task_Network] Resposta do Servidor: HTTP 201 Created.", type: "success" },
        { text: "[System] Memória Heap livre no ESP32: 184 KB.", type: "info" },
        { text: "[Task_Sensor] Watchdog Timer (WDT) resetado com sucesso.", type: "success" },
        { text: "[Hardware] Atualizando display SSD1306 local.", type: "info" },
        { text: "[Hardware] Sinalização LED WS2812B atualizada com base no AQI.", type: "info" }
      ];

      const randomLog = logsPool[Math.floor(Math.random() * logsPool.length)];
      const id = Math.random().toString(36).substring(2, 9);
      
      setTerminalLines(prev => {
        const updated = [...prev, { id, text: randomLog.text, type: randomLog.type }];
        // Mantém apenas as últimas 14 linhas no buffer visual do terminal
        if (updated.length > 14) {
          return updated.slice(updated.length - 14);
        }
        return updated;
      });
    }, 6000);

    return () => clearInterval(logInterval);
  }, []);

  // ----------------------------------------
  // MANIPULADORES DE EVENTOS (Handlers)
  // ----------------------------------------
  
  // Avançar etapas do formulário com validação
  const handleNextStep = () => {
    if (formData.step === 1) {
      if (!formData.name.trim() || !formData.email.trim()) {
        setFormError("Por favor, preencha seu nome e e-mail para prosseguir.");
        return;
      }
      if (!formData.email.includes("@")) {
        setFormError("Insira um endereço de e-mail válido.");
        return;
      }
    }
    
    if (formData.step === 2) {
      if (!formData.vertical) {
        setFormError("Selecione pelo menos uma área vertical de interesse principal.");
        return;
      }
    }

    setFormError("");
    setFormData(prev => ({ ...prev, step: prev.step + 1 }));
  };

  // Voltar etapas do formulário
  const handlePrevStep = () => {
    setFormError("");
    setFormData(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  };

  // Processar envio final da Waitlist (Simulando uma Server Action)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      setFormError("Você precisa aceitar os termos de conformidade e uso de dados.");
      return;
    }

    setFormError("");
    setFormLoading(true);

    // Simula atraso na conexão de rede com a API de dados
    try {
      await new Promise(resolve => setTimeout(resolve, 1800));
      setFormSubmitted(true);
    } catch {
      setFormError("Ocorreu um erro ao processar sua inscrição. Tente novamente.");
    } finally {
      setFormLoading(false);
    }
  };

  // Enviar comando manual no terminal simulado
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerminalInput.trim()) return;

    const inputId = Math.random().toString(36).substring(2, 9);
    const responseId = Math.random().toString(36).substring(2, 9);
    const command = newTerminalInput.toLowerCase().trim();

    let responseText = `Comando não reconhecido: '${command}'. Digite 'ajuda' para ver comandos disponíveis.`;
    let responseType: "info" | "success" | "warning" | "error" = "error";

    if (command === "ajuda") {
      responseText = "Comandos disponíveis: 'status', 'limpar', 'sensores', 'memoria', 'arquitetura'";
      responseType = "info";
    } else if (command === "status") {
      responseText = `[ESP32] Operando nominalmente. Wi-Fi: Conectado. FreeRTOS: Sched Running. Core 0: 12% | Core 1: 34%`;
      responseType = "success";
    } else if (command === "sensores") {
      responseText = `[BME680] PM2.5: ${mockData.pm25}µg/m³ | CO2: ${mockData.co2}ppm | Temp: ${mockData.temperature.toFixed(1)}°C`;
      responseType = "success";
    } else if (command === "memoria") {
      responseText = "[LittleFS] Total: 4096KB | Usado: 244KB | Livre: 3852KB. Flash íntegra.";
      responseType = "info";
    } else if (command === "arquitetura") {
      responseText = "[AraguaIA] Dual-Core Core 0 (Network, NTP, LoRa Stack) + Core 1 (Data Aquisition, Mutex, LittleFS)";
      responseType = "info";
    }

    setTerminalLines(prev => {
      let updated = [
        ...prev, 
        { id: inputId, text: `> ${newTerminalInput}`, type: "input" as const }
      ];

      if (command === "limpar") {
        return [{ id: responseId, text: "[System] Buffer do terminal redefinido.", type: "info" }];
      }

      updated = [...updated, { id: responseId, text: responseText, type: responseType }];
      if (updated.length > 14) return updated.slice(updated.length - 14);
      return updated;
    });

    setNewTerminalInput("");
  };

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 font-sans antialiased overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-300 relative">
      
      {/* ==========================================
          MALLAS E GRADIENTES DE BACKGROUND (Tailwind v4 style)
         ========================================== */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_50%)]" />
        <div className="absolute top-[1200px] right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.05),transparent_60%)]" />
        <div className="absolute top-[2600px] left-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.04),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* ==========================================
          CABEÇALHO / NAVEGAÇÃO
         ========================================== */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-[#070708]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.3)]">
              <span className="font-bold text-black text-lg">A</span>
            </div>
            <div>
              <span className="font-semibold text-lg tracking-tight text-white block">Aragua<span className="text-emerald-400">IA</span></span>
              <span className="text-[10px] uppercase text-zinc-500 tracking-widest block font-medium -mt-1">IFG Campus Goiânia</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#arquitetura" className="hover:text-emerald-400 transition-colors">Arquitetura</a>
            <a href="#verticais" className="hover:text-emerald-400 transition-colors">Soluções</a>
            <a href="#simulador" className="hover:text-emerald-400 transition-colors">Tempo Real</a>
            <a href="#open-source" className="hover:text-emerald-400 transition-colors">Pesquisa</a>
          </nav>

          <div className="flex items-center gap-4">
            <a 
              href="#waitlist" 
              className="px-4 py-2 text-xs md:text-sm font-medium rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all duration-300"
            >
              Acessar Waitlist
            </a>
          </div>
        </div>
      </header>

      {/* ==========================================
          CONTEÚDO PRINCIPAL
         ========================================== */}
      <main className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center relative">
          <div className="mb-6 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 backdrop-blur-md shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-zinc-400">
              Edital Pesquisa 2026-2027
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
            Monitoramento Ambiental de Alta Performance com <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400">Arquitetura RTOS</span>
          </h1>

          <p className="mt-8 text-base sm:text-lg md:text-xl text-zinc-400 leading-relaxed max-w-3xl mx-auto">
            Plataforma IoT proprietária baseada em microcontroladores dual-core para o monitoramento contínuo e determinístico da qualidade do ar. Desenvolvido sob a robustez do FreeRTOS e integrado com Inteligência Artificial.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#waitlist"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-semibold shadow-[0_0_30px_rgba(52,211,153,0.2)] hover:shadow-[0_0_40px_rgba(52,211,153,0.4)] hover:scale-[1.01] transition-all duration-300 text-center"
            >
              Solicitar Acesso à Waitlist
            </a>
            <a
              href="#arquitetura"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-md text-zinc-300 hover:bg-zinc-800/80 hover:text-white transition-all duration-300 text-center"
            >
              Documentação Técnica
            </a>
          </div>

          {/* Tags de Destaque Técnico */}
          <div className="mt-16 pt-8 border-t border-zinc-900 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-900">
              <span className="text-xs text-zinc-500 block uppercase tracking-wider font-medium">Processamento</span>
              <span className="text-sm font-semibold text-zinc-300 block mt-1">ESP32 Dual-Core 240MHz</span>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-900">
              <span className="text-xs text-zinc-500 block uppercase tracking-wider font-medium">Núcleo de Software</span>
              <span className="text-sm font-semibold text-zinc-300 block mt-1">FreeRTOS Determinístico</span>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-900">
              <span className="text-xs text-zinc-500 block uppercase tracking-wider font-medium">Rede Tolerante a Falhas</span>
              <span className="text-sm font-semibold text-zinc-300 block mt-1">LittleFS Buffer & LoRa P2P</span>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-900">
              <span className="text-xs text-zinc-500 block uppercase tracking-wider font-medium">Licenciamento</span>
              <span className="text-sm font-semibold text-emerald-400 block mt-1">Apache License 2.0</span>
            </div>
          </div>
        </section>

        {/* ==========================================
            SEÇÃO DE DETALHAMENTO DE ARQUITETURA TÉCNICA
           ========================================== */}
        <section id="arquitetura" className="max-w-7xl mx-auto px-6 py-20 border-t border-zinc-900 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-semibold block mb-3">Imersão de Engenharia</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">Arquitetura de Próxima Geração</h2>
            <p className="mt-4 text-zinc-400">
              O projeto de pesquisa AraguaIA rompe com protótipos acadêmicos simples, implementando um ecossistema industrial de aquisição de dados em tempo real.
            </p>

            {/* Alternador de Abas Técnicas */}
            <div className="mt-10 inline-flex p-1.5 rounded-xl bg-zinc-950 border border-zinc-900 w-full max-w-lg">
              <button 
                onClick={() => setActiveTechTab("hardware")}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all ${activeTechTab === "hardware" ? "bg-zinc-800 text-emerald-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                Camada Física (Edge)
              </button>
              <button 
                onClick={() => setActiveTechTab("rtos")}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all ${activeTechTab === "rtos" ? "bg-zinc-800 text-emerald-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                Firmware RTOS
              </button>
              <button 
                onClick={() => setActiveTechTab("data")}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all ${activeTechTab === "data" ? "bg-zinc-800 text-emerald-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                Ingestão & ML
              </button>
            </div>
          </div>

          {/* CONTEÚDO DA ABA: CAMADA FÍSICA (HARDWARE) */}
          {activeTechTab === "hardware" && (
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 5h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Hardware Proprietário Dual-Core</h3>
                <p className="text-zinc-400 leading-relaxed">
                  A base física do projeto AraguaIA apoia-se em uma placa de circuito impresso customizada contendo o SoC **Espressif ESP32**. Abandonando abordagens tradicionais com loops bloqueantes, o hardware explora as capacidades de barramentos de comunicação estruturados para aquisição confiável.
                </p>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                    <span><strong>Barramento I2C Dedicado:</strong> Conexão paralela de alta velocidade para o sensor de gases e particulados **BME680** e display local **SSD1306**.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                    <span><strong>Sinalização Visual Inteligente:</strong> Matriz ou anel de LEDs RGB endereçáveis **WS2812B** alimentados por fonte regulada para indicar visualmente o AQI local.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                    <span><strong>Módulo RTC Externo (DS3231):</strong> Garante precisão cronológica milimétrica e retenção de carimbo de data/hora mesmo sob completo corte de energia.</span>
                  </li>
                </ul>
              </div>

              {/* Diagrama Esquemático de Hardware Simulado em CSS */}
              <div className="lg:col-span-7 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-8 font-mono text-xs text-zinc-500 shadow-2xl relative overflow-hidden">
                <div className="absolute top-3 right-4 flex items-center gap-1.5 text-[10px] text-zinc-600 uppercase tracking-widest font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Layer: Camada_Fisica_Hardware
                </div>
                <div className="border-b border-zinc-900 pb-4 mb-6">
                  <span className="text-emerald-400 font-semibold block">ESQUEMÁTICO SIMPLIFICADO DE CONEXÕES</span>
                  <span className="text-zinc-600 block text-[10px] mt-0.5">AraguaIA Sensor Board PCB v1.2</span>
                </div>
                
                <div className="space-y-6">
                  {/* Bloco Central ESP32 */}
                  <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/40 text-center max-w-md mx-auto relative">
                    <div className="absolute -top-2.5 left-4 px-2 bg-zinc-950 text-zinc-400 font-bold text-[10px]">MICROCONTROLADOR CENTRAL</div>
                    <span className="text-zinc-100 font-bold block">ESP-WROOM-32 (Tensilica LX6 @240MHz)</span>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] text-zinc-400">
                      <div className="bg-zinc-950/60 p-1.5 rounded border border-zinc-900 text-left">PRO_CPU (Core 0): Network & LoRa</div>
                      <div className="bg-zinc-950/60 p-1.5 rounded border border-zinc-900 text-left">APP_CPU (Core 1): Sensors & RTOS</div>
                    </div>
                  </div>

                  {/* Linhas de Fluxo / Conexões */}
                  <div className="flex justify-around text-zinc-600 max-w-lg mx-auto py-1">
                    <div className="text-center">│<br/>▼<br/><span className="text-[10px] font-sans text-sky-400">I2C (SDA/SCL)</span></div>
                    <div className="text-center">│<br/>▼<br/><span className="text-[10px] font-sans text-amber-500">SPI / GPIO</span></div>
                    <div className="text-center">│<br/>▼<br/><span className="text-[10px] font-sans text-emerald-400">Digital / PWM</span></div>
                  </div>

                  {/* Periféricos conectados */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="border border-zinc-800/80 rounded-xl p-3 bg-zinc-900/10">
                      <span className="text-sky-400 font-bold block text-[11px] mb-1">MÓDULO DE SENSORES</span>
                      <p className="text-[10px] text-zinc-400">Sensor BME680 (Gás/CO2/VOC)<br/>Display Local SSD1306 OLED<br/>Endereço: 0x77 / 0x3C</p>
                    </div>
                    <div className="border border-zinc-800/80 rounded-xl p-3 bg-zinc-900/10">
                      <span className="text-amber-500 font-bold block text-[11px] mb-1">CONTINGÊNCIA & LOCO</span>
                      <p className="text-[10px] text-zinc-400">Chip RTC DS3231 Externo<br/>Transceptor Sem Fio LoRa RFM95W<br/>Barramento SPI de Baixo Ruído</p>
                    </div>
                    <div className="border border-zinc-800/80 rounded-xl p-3 bg-zinc-900/10">
                      <span className="text-emerald-400 font-bold block text-[11px] mb-1">SINALIZAÇÃO LOCAL</span>
                      <p className="text-[10px] text-zinc-400">LEDs RGB Endereçáveis WS2812B<br/>Buzzer Piezoelétrico Ativo<br/>Alertas Sonoros Críticos</p>
                    </div>
                  </div>

                  {/* Detalhe Técnico de Alimentação */}
                  <div className="pt-2 text-zinc-600 text-[10px] border-t border-zinc-900/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <span>FONTE: Regulador de Tensão LDO AMS1117 3.3V com capacitores de desacoplamento de 100nF/10µF</span>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">Isolamento de Ruído Magnético</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTEÚDO DA ABA: FIRMWARE RTOS */}
          {activeTechTab === "rtos" && (
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Multitarefa Determinístico via FreeRTOS</h3>
                <p className="text-zinc-400 leading-relaxed">
                  O software embarcado foi concebido sob o paradigma de sistemas operacionais de tempo real (**RTOS**), dividindo as obrigações operacionais de forma estrita entre os dois núcleos de processamento do ESP32 para garantir o determinismo e evitar estouros de pilha.
                </p>
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl border border-zinc-900 bg-zinc-950">
                    <span className="text-sky-400 font-semibold block text-sm">Core 0 (PRO_CPU) — Camada de Comunicação</span>
                    <p className="text-xs text-zinc-400 mt-1">Gerencia a pilha de rede Wi-Fi através do **WiFiManager**, conexão com servidores de hora via protocolo **NTP** e a transmissão de pacotes assíncronos via **LoRa Ponto a Ponto**.</p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-zinc-900 bg-zinc-950">
                    <span className="text-emerald-400 font-semibold block text-sm">Core 1 (APP_CPU) — Camada de Aplicação</span>
                    <p className="text-xs text-zinc-400 mt-1">Executa com exclusividade a amostragem periódica dos sensores analógicos e digitais, atualização do display OLED local e controle dos LEDs RGB indicativos.</p>
                  </div>
                </div>
              </div>

              {/* Editor de Código Embarcado / Exemplo de Estrutura C++ */}
              <div className="lg:col-span-7 bg-zinc-950 border border-zinc-900 rounded-2xl p-5 sm:p-6 font-mono text-[11px] text-zinc-400 shadow-2xl relative overflow-hidden">
                <div className="absolute top-3 right-4 flex items-center gap-1.5 text-[10px] text-zinc-600 uppercase tracking-widest font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" /> firmware_main.cpp
                </div>
                <div className="border-b border-zinc-900 pb-3 mb-4 flex items-center gap-2 text-zinc-500">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                  <span className="text-[10px] ml-2 text-zinc-600">FreeRTOS Task Architecture Concept</span>
                </div>
                
                <div className="overflow-x-auto space-y-1 text-zinc-300 leading-relaxed max-h-[380px] overflow-y-auto pr-2">
                  <p className="text-zinc-600">// Criação das Tasks no setup inicial do microcontrolador</p>
                  <p><span className="text-pink-400">void</span> <span className="text-blue-400">setup</span>() &#123;</p>
                  <p className="pl-4 text-zinc-600">  // Inicializa semáforo Mutex para proteção do barramento I2C</p>
                  <p className="pl-4">  xI2CMutex = <span className="text-emerald-400">xSemaphoreCreateMutex</span>();</p>
                  <p className="pl-4 text-zinc-600">  // Inicializa Fila de Contingência para comunicação entre Cores</p>
                  <p className="pl-4">  dataQueue = <span className="text-emerald-400">xQueueCreate</span>(<span className="text-amber-400">30</span>, <span className="text-pink-400">sizeof</span>(SensorReading));</p>
                  <p className="pt-2 pl-4 text-zinc-600">  // Aloca Task_Sensor no Core 1 (Exclusivo para leitura física)</p>
                  <p className="pl-4">  <span className="text-emerald-400">xTaskCreatePinnedToCore</span>(</p>
                  <p className="pl-8">    vTaskSensor,    <span className="text-zinc-500">"Task_Sensor"</span>, <span className="text-amber-400">4096</span>, <span className="text-teal-400">NULL</span>,</p>
                  <p className="pl-8">    <span className="text-amber-400">2</span>,              <span className="text-teal-400">NULL</span>,         <span className="text-amber-400">1</span></p>
                  <p className="pl-4">  );</p>
                  <p className="pt-2 pl-4 text-zinc-600">  // Aloca Task_Network no Core 0 (Exclusivo para pilha Wi-Fi/Comunicação)</p>
                  <p className="pl-4">  <span className="text-emerald-400">xTaskCreatePinnedToCore</span>(</p>
                  <p className="pl-8">    vTaskNetwork,   <span className="text-zinc-500">"Task_Network"</span>, <span className="text-amber-400">4096</span>, <span className="text-teal-400">NULL</span>,</p>
                  <p className="pl-8">    <span className="text-amber-400">1</span>,              <span className="text-teal-400">NULL</span>,          <span className="text-amber-400">0</span></p>
                  <p className="pl-4">  );</p>
                  <p>&#125;</p>
                  <p className="pt-3 text-zinc-600">// Implementação da Task determinística de leitura</p>
                  <p><span className="text-pink-400">void</span> <span className="text-blue-400">vTaskSensor</span>(<span className="text-pink-400">void</span> *pvParameters) &#123;</p>
                  <p className="pl-4"><span className="text-pink-400">for</span>(;;) &#123;</p>
                  <p className="pl-8"><span className="text-pink-400">if</span> (<span className="text-emerald-400">xSemaphoreTake</span>(xI2CMutex, portMAX_DELAY) == pdTRUE) &#123;</p>
                  <p className="pl-12">bme.performReading();</p>
                  <p className="pl-12">reading.co2 = bme.readCO2();</p>
                  <p className="pl-12"><span className="text-emerald-400">xSemaphoreGive</span>(xI2CMutex);</p>
                  <p className="pl-8">&#125;</p>
                  <p className="pl-8 text-zinc-600">// Envia os dados para a fila de transmissão ou LittleFS</p>
                  <p className="pl-8"><span className="text-emerald-400">xQueueSend</span>(dataQueue, &reading, <span className="text-amber-400">0</span>);</p>
                  <p className="pl-8 text-zinc-600">// Alimenta o Hardware Watchdog Timer (WDT)</p>
                  <p className="pl-8">esp_task_wdt_reset();</p>
                  <p className="pl-8"><span className="text-emerald-400">vTaskDelay</span>(<span className="text-pink-400">pdMS_TO_TICKS</span>(<span className="text-amber-400">2000</span>));</p>
                  <p className="pl-4">&#125;</p>
                  <p>&#125;</p>
                </div>
              </div>
            </div>
          )}

          {/* CONTEÚDO DA ABA: INGESTÃO E ML */}
          {activeTechTab === "data" && (
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Infraestrutura de Dados & IA</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Os dados recebidos das centenas de nós sensores espalhados em campo passam por uma rigorosa rotina de normalização estruturada em bancos de dados relacioanais (**SGBD**), consumidos por backends em **Python** e analisados por modelos de **Machine Learning**.
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 border border-zinc-900 rounded-xl bg-zinc-950">
                    <span className="text-amber-400 font-semibold block">Camada de Ingestão</span>
                    <p className="text-zinc-500 mt-1">Tratamento de concorrência, normalização de strings SQL e expurgo de outliers de leitura física.</p>
                  </div>
                  <div className="p-3 border border-zinc-900 rounded-xl bg-zinc-950">
                    <span className="text-teal-400 font-semibold block">APIs em Python</span>
                    <p className="text-zinc-500 mt-1">Barramentos de microsserviços rápidos criados com consultas otimizadas e cacheadas.</p>
                  </div>
                </div>
              </div>

              {/* Painel de Exemplo de Pipeline de IA / Código Python */}
              <div className="lg:col-span-7 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 font-mono text-xs text-zinc-400 shadow-2xl">
                <div className="border-b border-zinc-900 pb-3 mb-4 flex justify-between items-center text-zinc-500 text-[10px]">
                  <span>DATA PIPELINE & INTEGRAÇÃO DE INTELIGÊNCIA ARTIFICIAL</span>
                  <span className="text-amber-500">ML_Core_Engine</span>
                </div>
                <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-4 mb-4">
                  <span className="text-zinc-500 block text-[10px] mb-1"># Exemplo de Consulta SQL Otimizada da API Python</span>
                  <p className="text-teal-300">
                    <span className="text-purple-400">SELECT</span> id_propriedade, <span className="text-purple-400">AVG</span>(valor_ozonio) <span className="text-purple-400">FROM</span> leituras_ambientais <span className="text-purple-400">WHERE</span> data_leitura &gt;= NOW() - INTERVAL <span className="text-amber-400">'1 day'</span> <span className="text-purple-400">GROUP BY</span> id_propriedade;
                  </p>
                </div>
                <div className="space-y-2 text-zinc-500 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span><strong>SGBD Relacional:</strong> Processa, valida e limpa dados espúrios de sensores com falha de leitura física.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span><strong>Modelos Preditivos:</strong> IA embarcada de Regressão e Classificação treinada com dados históricos locais.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span><strong>Predição de Alertas:</strong> Antecipa picos de contaminação industrial com até 4 horas de antecedência.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ==========================================
            SEÇÃO DE EXPLORAÇÃO DAS VERTICAIS DO PROJETO
           ========================================== */}
        <section id="verticais" className="max-w-7xl mx-auto px-6 py-20 border-t border-zinc-900 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-semibold block mb-3">Segmentação Tecnológica</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">Três Verticais Adaptativas</h2>
            <p className="mt-4 text-zinc-400">
              O ecossistema AraguaIA se subdivide em três arquiteturas de firmware e hardware específicas para responder a diferentes condições extremas em campo.
            </p>

            {/* Abas das Verticais */}
            <div className="mt-10 flex border-b border-zinc-900 justify-center gap-4 sm:gap-8 text-sm">
              <button 
                onClick={() => setActiveVerticalTab("urban")}
                className={`pb-4 font-medium transition-all relative ${activeVerticalTab === "urban" ? "text-sky-400 border-b-2 border-sky-400 font-semibold" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                AraguaIA Urban
              </button>
              <button 
                onClick={() => setActiveVerticalTab("agro")}
                className={`pb-4 font-medium transition-all relative ${activeVerticalTab === "agro" ? "text-emerald-400 border-b-2 border-emerald-400 font-semibold" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                AraguaIA Agro
              </button>
              <button 
                onClick={() => setActiveVerticalTab("enterprise")}
                className={`pb-4 font-medium transition-all relative ${activeVerticalTab === "enterprise" ? "text-amber-500 border-b-2 border-amber-500 font-semibold" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                AraguaIA Enterprises
              </button>
            </div>
          </div>

          {/* CONTEÚDO VERTICAL: URBAN */}
          {activeVerticalTab === "urban" && (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <span className="px-3 py-1 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider">Cidades Inteligentes</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">Monitoramento de Centros Urbanos</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Desenhado para integração contínua em vias públicas, postes de iluminação e fachadas institucionais. Alinhado diretamente com as demandas de saúde coletiva, o módulo urbano foca na ampla acessibilidade visual da população local.
                </p>
                <div className="space-y-3 font-mono text-xs text-zinc-500 bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                  <div className="text-sky-400 font-bold mb-1">ESPECIFICAÇÕES TÉCNICAS URBANAS:</div>
                  <div>• QR Code Dinâmico no Display: Acesso instantâneo aos relatórios sem apps adicionais.</div>
                  <div>• Alertas Sonoros Inteligentes: Avisos sonoros em caso de ar inadequado para grupos de risco.</div>
                  <div>• Escala de Cores Embutida: LEDs RGB (Verde, Amarelo, Vermelho) conforme índice AQI oficial.</div>
                  <div>• Alimentação Estável: Conexão direta via fonte AC/DC isolada para operação 24/7 sem interrupções.</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-900 rounded-2xl p-8 relative flex flex-col justify-center items-center h-80 shadow-2xl">
                <div className="absolute top-4 left-4 flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
                  <span className="text-[10px] text-zinc-600 font-mono">NODE_URBAN_ACTIVE</span>
                </div>
                {/* Renderização de Interface Simulando o Módulo Urban */}
                <div className="w-48 h-48 rounded-2xl border-4 border-zinc-800 bg-black p-4 flex flex-col justify-between shadow-2xl relative">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-sky-400 font-mono font-bold">AQI LOCAL</span>
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  </div>
                  <div className="text-center my-auto">
                    <span className="text-3xl font-bold text-white tracking-tight">34</span>
                    <span className="text-[10px] text-zinc-500 block font-mono">Ar Saudável</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="w-10 h-10 bg-white rounded-md p-0.5 flex items-center justify-center">
                      {/* Simulação Gráfica Simplificada de um QR Code */}
                      <div className="grid grid-cols-3 gap-0.5 w-full h-full bg-black" />
                    </div>
                    <span className="text-[8px] text-zinc-600 font-mono">v1.2-AC</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTEÚDO VERTICAL: AGRO */}
          {activeVerticalTab === "agro" && (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <span className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">Agronegócio Resiliente</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">Monitoramento de Larga Escala</h3>
                <p className="text-zinc-400 leading-relaxed">
                  O ambiente rural impõe desafios severos: ausência de rede elétrica constante e quedas frequentes de conectividade Wi-Fi. O módulo **AraguaIA Agro** resolve estes gargalos através de uma arquitetura embarcada ultra-resiliente.
                </p>
                <div className="space-y-3 font-mono text-xs text-zinc-500 bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                  <div className="text-emerald-400 font-bold mb-1">MECANISMOS DE RESILIÊNCIA RURAL:</div>
                  <div>
                    <strong className="text-zinc-300 block mb-0.5">1. Fila de Contingência Local (LittleFS):</strong>
                    Se a rede cair, o firmware bloqueia a transmissão e passa a salvar as amostras com carimbos cronológicos exatos na memória Flash utilizando o sistema **LittleFS** embarcado.
                  </div>
                  <div>
                    <strong className="text-zinc-300 block mb-0.5">2. Transmissão em Lote (Bulk Sending):</strong>
                    Assim que o Wi-Fi ou sinal LoRa restabelece, o ESP32 realiza a leitura em fila, sincroniza o relógio via **NTP** e descarrega os dados históricos acumulados de uma só vez.
                  </div>
                  <div>
                    <strong className="text-zinc-300 block mb-0.5">3. Comunicação Longo Alcance:</strong>
                    Uso de rádio frequência **LoRa Ponto a Ponto** (sem dependência de infraestruturas LoRaWAN comerciais caras) para conectar fazendas distantes.
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-900 rounded-2xl p-8 relative flex flex-col justify-center items-center h-80 shadow-2xl">
                <div className="absolute top-4 left-4 flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-zinc-600 font-mono">NODE_AGRO_OFFLINE_BUFFERING</span>
                </div>
                {/* Painel Gráfico Simulado do Buffer de Contingência */}
                <div className="w-full max-w-sm border border-zinc-800 bg-black/80 rounded-xl p-5 font-mono text-[11px]">
                  <div className="text-zinc-500 border-b border-zinc-900 pb-2 mb-3 flex justify-between">
                    <span>STATUS: RECONECTANDO...</span>
                    <span className="text-amber-500 animate-pulse">LITTLEFS_ACTIVE</span>
                  </div>
                  <div className="space-y-1.5 text-zinc-400">
                    <div className="flex justify-between bg-zinc-900/40 p-1 rounded border border-zinc-900/60">
                      <span className="text-zinc-600">[Slot 01]</span> <span>CO2: 440ppm</span> <span className="text-zinc-500">21:18:00</span>
                    </div>
                    <div className="flex justify-between bg-zinc-900/40 p-1 rounded border border-zinc-900/60">
                      <span className="text-zinc-600">[Slot 02]</span> <span>CO2: 442ppm</span> <span className="text-zinc-500">21:19:00</span>
                    </div>
                    <div className="flex justify-between bg-zinc-900/40 p-1 rounded border border-zinc-900/60">
                      <span className="text-zinc-600">[Slot 03]</span> <span>CO2: 445ppm</span> <span className="text-zinc-500">21:20:00</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-2 border-t border-zinc-900 flex justify-between items-center text-[10px]">
                    <span className="text-zinc-500">Fila local: 3/30 leituras acumuladas</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Bateria: 84%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTEÚDO VERTICAL: ENTERPRISE */}
          {activeVerticalTab === "enterprise" && (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <span className="px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold uppercase tracking-wider">Segurança Ocupacional</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">Monitoramento de Plantas Industriais</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Voltado para indústrias, galpões químicos e fábricas com alta emissão de gases particulados. A prioridade do módulo **Enterprises** é a velocidade crítica de resposta e o disparo automatizado de alertas de contaminação para proteção de vidas.
                </p>
                <div className="space-y-3 font-mono text-xs text-zinc-500 bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                  <div className="text-amber-500 font-bold mb-1">MÓDULO INDUSTRIAL INTEGRADO:</div>
                  <div>• Amostragem em Alta Frequência: Leituras a cada 200 milissegundos para detecção de vazamentos instantâneos.</div>
                  <div>• Relé de Acionamento Físico: Capacidade para acionar exaustores industriais ou sirenes externas de emergência.</div>
                  <div>• Gabinete Robusto de Policarbonato: Proteção IP65 contra poeira industrial suspensa e respingos de produtos químicos.</div>
                  <div>• Integração de Rede Industrial: Prontidão para exportação de dados via barramentos cabeados clássicos.</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-900 rounded-2xl p-8 relative flex flex-col justify-center items-center h-80 shadow-2xl">
                <div className="absolute top-4 left-4 flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-[10px] text-zinc-600 font-mono">NODE_ENTERPRISE_ALARM</span>
                </div>
                {/* Painel Industrial de Alerta Simulado */}
                <div className="w-full max-w-xs border-2 border-amber-500/40 bg-zinc-950 rounded-xl p-6 text-center space-y-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-amber-500 font-bold block animate-pulse">▲ CRITICAL OVER threshold ▲</span>
                  <div className="text-4xl font-extrabold text-white font-mono">1120 <span className="text-xs text-zinc-500 font-normal">ppm</span></div>
                  <p className="text-xs text-zinc-400">Concentração de CO₂ acima dos limites de segurança ocupacional na área de estocagem B.</p>
                  <div className="pt-2 flex gap-2 justify-center">
                    <span className="px-2 py-1 text-[9px] font-mono rounded bg-red-500/20 text-red-400 border border-red-500/30">SIRENE: ATIVA</span>
                    <span className="px-2 py-1 text-[9px] font-mono rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">EXAUSTOR: LIGADO</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ==========================================
            SEÇÃO DO SIMULADOR DE CONSOLE DE LOGS EM TEMPO REAL
           ========================================== */}
        <section id="simulador" className="max-w-7xl mx-auto px-6 py-20 border-t border-zinc-900 relative">
          <div className="grid lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Esquerda: Painel explicativo e Dashboard de Dados rápidos */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-semibold block mb-3">Live Stream de Telemetria</span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Simulador de Telemetria Físico</h2>
                <p className="mt-4 text-zinc-400 leading-relaxed">
                  Observe as flutuações e logs reais que o firmware do **ESP32** gera a cada ciclo de relógio do sistema operacional **FreeRTOS**. A simulação espelha as rotinas de tratamento de dados que alimentam a nuvem.
                </p>
              </div>

              {/* Grid de Dados Ambientais Rápidos Simulados */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono">
                <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl">
                  <span className="text-[10px] text-zinc-500 block">DADO: CO₂</span>
                  <span className="text-xl font-bold text-white block mt-1">{mockData.co2} <span className="text-[10px] font-normal text-zinc-500">ppm</span></span>
                </div>
                <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl">
                  <span className="text-[10px] text-zinc-500 block">DADO: PM 2.5</span>
                  <span className="text-xl font-bold text-emerald-400 block mt-1">{mockData.pm25} <span className="text-[10px] font-normal text-zinc-500">µg/m³</span></span>
                </div>
                <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl">
                  <span className="text-[10px] text-zinc-500 block">DADO: TEMP</span>
                  <span className="text-xl font-bold text-white block mt-1">{mockData.temperature.toFixed(1)} <span className="text-[10px] font-normal text-zinc-500">°C</span></span>
                </div>
                <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl">
                  <span className="text-[10px] text-zinc-500 block">DADO: UMIDADE</span>
                  <span className="text-xl font-bold text-white block mt-1">{mockData.humidity.toFixed(0)} <span className="text-[10px] font-normal text-zinc-500">%</span></span>
                </div>
                <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl">
                  <span className="text-[10px] text-zinc-500 block">CLOCK ATUAL</span>
                  <span className="text-xs font-bold text-zinc-400 block mt-2">{mockData.timestamp}</span>
                </div>
                <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-center">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${mockData.status === "GOOD" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : mockData.status === "MODERATE" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                    AQI: {mockData.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Direita: Interface Interativa de Terminal Serial */}
            <div className="lg:col-span-7 bg-[#0b0c10] border border-zinc-900 rounded-2xl p-4 sm:p-5 flex flex-col justify-between h-[450px] font-mono text-xs shadow-2xl relative">
              <div className="absolute top-3 right-4 text-[10px] text-zinc-600 uppercase tracking-widest font-sans">
                UART0_SERIAL_MONITOR
              </div>
              <div className="border-b border-zinc-900 pb-3 mb-3 flex items-center gap-1.5 text-zinc-500">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Baudrate: 115200bps — Conectado ao nó local</span>
              </div>

              {/* Console de Saída de Linhas */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-2 mb-4 scrollbar-thin scrollbar-thumb-zinc-800">
                {terminalLines.map((line) => (
                  <div key={line.id} className="leading-relaxed break-all">
                    {line.type === "input" ? (
                      <span className="text-zinc-200 block">{line.text}</span>
                    ) : line.type === "success" ? (
                      <span className="text-emerald-400 block">{line.text}</span>
                    ) : line.type === "warning" ? (
                      <span className="text-amber-400 block">{line.text}</span>
                    ) : line.type === "error" ? (
                      <span className="text-red-400 block">{line.text}</span>
                    ) : (
                      <span className="text-zinc-500 block">{line.text}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Campo de Comando Manual */}
              <form onSubmit={handleTerminalSubmit} className="flex gap-2 pt-3 border-t border-zinc-900">
                <span className="text-emerald-400 flex items-center">&gt;</span>
                <input
                  type="text"
                  value={newTerminalInput}
                  onChange={(e) => setNewTerminalInput(e.target.value)}
                  placeholder="Envie um comando (ex: 'status', 'sensores', 'ajuda')..."
                  className="flex-1 bg-transparent border-none text-zinc-100 outline-none text-xs font-mono placeholder:text-zinc-700"
                />
                <button 
                  type="submit" 
                  className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 font-sans hover:bg-zinc-800 hover:text-white transition-colors text-[10px]"
                >
                  Enviar
                </button>
              </form>
            </div>

          </div>
        </section>

        {/* ==========================================
            SEÇÃO INSTITUCIONAL: PESQUISA & OPEN SOURCE
           ========================================== */}
        <section id="open-source" className="max-w-7xl mx-auto px-6 py-20 border-t border-zinc-900 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-semibold block">Fomento Pedagógico & Governança</span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">Validação Acadêmica Comunitária</h2>
              <p className="text-zinc-400 leading-relaxed">
                Desenvolvido no coração do **IFG Campus Goiânia**, o projeto AraguaIA apoia-se em dois pilares fundamentais: a excelência científica na engenharia eletrônica e a total transparência de suas camadas lógicas e de hardware.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Como uma ferramenta pedagógica de ponta, todo o ecossistema será disponibilizado publicamente para reduzir a distância entre o aprendizado em sala de aula e o mercado real de sistemas embarcados de alta escala.
              </p>

              <div className="p-5 border border-zinc-900 bg-zinc-950/40 rounded-2xl flex items-start gap-4">
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 font-mono font-bold text-sm">
                  A2.0
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Licenciamento Apache License, Version 2.0</h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    Garantia legal de livre modificação, distribuição e uso comercial do firmware, esquemáticos de placas de circuito impresso e APIs, promovendo a inovação tecnológica comunitária e aberta.
                  </p>
                </div>
              </div>
            </div>

            {/* Quadro de Metas e Impacto Acadêmico */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/10 space-y-2">
                <span className="text-2xl font-bold text-emerald-400 block">01</span>
                <h4 className="text-base font-semibold text-white">Kit Pedagógico Estável</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Kit modular pronto para práticas de laboratório em engenharia, IoT e sistemas operacionais.</p>
              </div>
              <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/10 space-y-2">
                <span className="text-2xl font-bold text-sky-400 block">02</span>
                <h4 className="text-base font-semibold text-white">Processamento de Sinais</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Algoritmos dedicados para tratamento de ruído de sensores físicos suspensos.</p>
              </div>
              <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/10 space-y-2">
                <span className="text-2xl font-bold text-amber-500 block">03</span>
                <h4 className="text-base font-semibold text-white">Visão Computacional Leve</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Estrutura preparada para expansão futura com suporte a câmeras embarcadas de baixo consumo.</p>
              </div>
              <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-900/10 space-y-2">
                <span className="text-2xl font-bold text-purple-400 block">04</span>
                <h4 className="text-base font-semibold text-white">Validação Real</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Testes operacionais severos em ambientes urbanos e agrícolas reais do estado.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            SEÇÃO PRINCIPAL DA WAITLIST (WIZARD MULTI-ETAPAS)
           ========================================== */}
        <section id="waitlist" className="max-w-7xl mx-auto px-6 py-24 border-t border-zinc-900 relative flex justify-center">
          <div className="w-full max-w-2xl rounded-3xl border border-zinc-900 bg-[#0c0d12] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            
            {/* Indicador de progresso visual do Wizard */}
            {!formSubmitted && (
              <div className="flex items-center justify-between border-b border-zinc-900 pb-6 mb-8 text-xs font-mono text-zinc-500">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${formData.step >= 1 ? "bg-emerald-400 text-black" : "bg-zinc-900 text-zinc-500"}`}>1</span>
                  <span className={formData.step === 1 ? "text-white font-semibold" : ""}>Identificação</span>
                </div>
                <div className="w-8 h-px bg-zinc-900" />
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${formData.step >= 2 ? "bg-emerald-400 text-black" : "bg-zinc-900 text-zinc-500"}`}>2</span>
                  <span className={formData.step === 2 ? "text-white font-semibold" : ""}>Interesse</span>
                </div>
                <div className="w-8 h-px bg-zinc-900" />
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${formData.step >= 3 ? "bg-emerald-400 text-black" : "bg-zinc-900 text-zinc-500"}`}>3</span>
                  <span className={formData.step === 3 ? "text-white font-semibold" : ""}>Finalização</span>
                </div>
              </div>
            )}

            {/* FORMULÁRIO JÁ ENVIADO COM SUCESSO */}
            {formSubmitted ? (
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(52,211,153,0.15)]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">Inscrição Confirmada!</h3>
                  <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
                    Obrigado por se inscrever, <strong>{formData.name}</strong>. Seu perfil foi mapeado com sucesso para a vertical <strong>AraguaIA {formData.vertical.toUpperCase()}</strong>.
                  </p>
                </div>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed pt-4 border-t border-zinc-900">
                  Notificações de atualizações técnicas de firmware, esquemáticos e liberação das chaves da API Python serão enviadas para: <br />
                  <span className="text-emerald-400 font-mono block mt-1">{formData.email}</span>
                </p>
              </div>
            ) : (
              // FORMULÁRIO EM EXECUÇÃO (WIZARD ETAPAS)
              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* Título dinâmico por etapa */}
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-400 block mb-2">Acesso Exclusivo</span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Formulário Oficial de Waitlist</h3>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-2">
                    Participe do grupo pioneiro de homologação do projeto de pesquisa AraguaIA.
                  </p>
                </div>

                {/* Exibição de Erros Globais do Formulário */}
                {formError && (
                  <div className="p-3.5 text-xs font-mono rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
                    <span>⚠️</span> <span>{formError}</span>
                  </div>
                )}

                {/* ETAPA 1: DADOS PESSOAIS */}
                {formData.step === 1 && (
                  <div className="space-y-4 pt-2 animate-fadeIn">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">Nome Completo *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Carlos Silva"
                        className="w-full px-4 py-3.5 rounded-xl bg-black border border-zinc-900 text-sm text-white placeholder:text-zinc-700 outline-none focus:border-emerald-500/50 transition-colors"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">E-mail para Notificações *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Ex: carlos@instituição.edu.br"
                        className="w-full px-4 py-3.5 rounded-xl bg-black border border-zinc-900 text-sm text-white placeholder:text-zinc-700 outline-none focus:border-emerald-500/50 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">Instituição / Empresa (Opcional)</label>
                      <input
                        type="text"
                        value={formData.institution}
                        onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                        placeholder="Ex: Instituto Federal de Goiás / Produtor Rural"
                        className="w-full px-4 py-3.5 rounded-xl bg-black border border-zinc-900 text-sm text-white placeholder:text-zinc-700 outline-none focus:border-emerald-500/50 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* ETAPA 2: VERTICAL DE INTERESSE */}
                {formData.step === 2 && (
                  <div className="space-y-4 pt-2 animate-fadeIn">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-1">Selecione o seu foco de uso principal *</label>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div 
                        onClick={() => setFormData(prev => ({ ...prev, vertical: "urban" }))}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 bg-black ${formData.vertical === "urban" ? "border-sky-400/50 bg-sky-500/5" : "border-zinc-900 hover:border-zinc-800"}`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${formData.vertical === "urban" ? "border-sky-400" : "border-zinc-700"}`}>
                          {formData.vertical === "urban" && <div className="w-2 h-2 rounded-full bg-sky-400" />}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-white block">AraguaIA Urban</span>
                          <span className="text-xs text-zinc-500 block mt-0.5">Gestão governamental, monitoramento de poluição em avenidas e alertas de saúde pública.</span>
                        </div>
                      </div>

                      <div 
                        onClick={() => setFormData(prev => ({ ...prev, vertical: "agro" }))}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 bg-black ${formData.vertical === "agro" ? "border-emerald-400/50 bg-emerald-500/5" : "border-zinc-900 hover:border-zinc-800"}`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${formData.vertical === "agro" ? "border-emerald-400" : "border-zinc-700"}`}>
                          {formData.vertical === "agro" && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-white block">AraguaIA Agro</span>
                          <span className="text-xs text-zinc-500 block mt-0.5">Larga escala agrícola, nós sensores resilientes a chuva, sem internet contínua e comunicação LoRa.</span>
                        </div>
                      </div>

                      <div 
                        onClick={() => setFormData(prev => ({ ...prev, vertical: "enterprise" }))}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 bg-black ${formData.vertical === "enterprise" ? "border-amber-500/50 bg-amber-500/5" : "border-zinc-900 hover:border-zinc-800"}`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${formData.vertical === "enterprise" ? "border-amber-500" : "border-zinc-700"}`}>
                          {formData.vertical === "enterprise" && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-white block">AraguaIA Enterprises</span>
                          <span className="text-xs text-zinc-500 block mt-0.5">Monitoramento interno de galpões e indústrias com acionamento automático de relés/exaustores.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ETAPA 3: FINALIZAÇÃO E COMPROMISSO */}
                {formData.step === 3 && (
                  <div className="space-y-4 pt-2 animate-fadeIn">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block">Como você pretende colaborar ou usar o sistema? (Opcional)</label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Ex: Tenho interesse em testar o módulo agro na minha propriedade / Gostaria de contribuir com o código fonte do firmware FreeRTOS..."
                        className="w-full px-4 py-3.5 rounded-xl bg-black border border-zinc-900 text-sm text-white placeholder:text-zinc-700 outline-none focus:border-emerald-500/50 transition-colors resize-none"
                      />
                    </div>

                    {/* Checkbox de Conformidade de Uso de Dados Acadêmicos */}
                    <div 
                      onClick={() => setFormData(prev => ({ ...prev, termsAccepted: !prev.termsAccepted }))}
                      className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/60 cursor-pointer flex items-start gap-3 select-none"
                    >
                      <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center transition-colors ${formData.termsAccepted ? "bg-emerald-400 border-emerald-400 text-black" : "border-zinc-700"}`}>
                        {formData.termsAccepted && (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Declaro estar ciente de que o projeto **AraguaIA** encontra-se em estágio de pesquisa científica e homologação tecnológica pelo IFG. Aceito receber comunicações sobre liberação de repositórios e firmwares.
                      </p>
                    </div>
                  </div>
                )}

                {/* BOTÕES DE NAVEGAÇÃO DO FORM WIZARD */}
                <div className="pt-4 border-t border-zinc-900 flex justify-between items-center gap-4">
                  {formData.step > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      disabled={formLoading}
                      className="px-5 py-3 rounded-xl border border-zinc-800 text-zinc-400 text-sm font-medium hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
                    >
                      Voltar
                    </button>
                  ) : (
                    <div />
                  )}

                  {formData.step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-3 rounded-xl bg-zinc-100 text-black text-sm font-semibold hover:bg-white transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      Avançar
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black text-sm font-bold shadow-[0_0_25px_rgba(52,211,153,0.15)] hover:scale-[1.01] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {formLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processando...
                        </>
                      ) : (
                        "Concluir Inscrição"
                      )}
                    </button>
                  )}
                </div>

              </form>
            )}

          </div>
        </section>

        {/* ==========================================
            SEÇÃO DE INFORMAÇÕES DE CONTATO INSTITUCIONAL
           ========================================== */}
        <section id="contact" className="max-w-4xl mx-auto px-6 py-16 text-center border-t border-zinc-900 relative">
          <span className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-semibold block mb-3">Comunicação Oficial</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Deseja Colaborar com o Projeto?</h2>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">
            Seja você um pesquisador de outra instituição, gestor público municipal interessado em testes urbanos ou distribuidor agrícola, nosso canal de comunicação direta está aberto.
          </p>
          
          <div className="mt-8 inline-block">
            <a
              href="mailto:contato@araguaia.cloud"
              className="text-base md:text-lg font-mono font-medium text-white hover:text-emerald-400 transition-colors border border-zinc-900 bg-zinc-950 px-6 py-3 rounded-xl shadow-inner inline-flex items-center gap-2.5"
            >
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              contato@araguaia.cloud
            </a>
          </div>
        </section>

      </main>

      {/* ==========================================
          RODAPÉ (FOOTER)
         ========================================== */}
      <footer className="w-full border-t border-zinc-950 bg-[#040405] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-zinc-600 font-mono">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-400 font-sans">Aragua<span className="text-emerald-400">IA</span></span>
            <span>— Ecossistema IoT de Monitoramento de Alta Precisão</span>
          </div>
          <div>
            © 2026 AraguaIA — Instituto Federal de Goiás (IFG)
          </div>
        </div>
      </footer>

    </div>
  );
}
