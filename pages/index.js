import { useState, useEffect } from "react";
import { addDays, format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const startDate = new Date(2025, 3, 14); // 14/04/2025

export default function Missao60Dias() {
  const [historico, setHistorico] = useState({});
  const [observacoes, setObservacoes] = useState({});
  const [graficoData, setGraficoData] = useState([]);

  useEffect(() => {
    const salvo = localStorage.getItem("historico60");
    const obsSalvas = localStorage.getItem("obs60");
    if (salvo) setHistorico(JSON.parse(salvo));
    if (obsSalvas) setObservacoes(JSON.parse(obsSalvas));
  }, []);

  useEffect(() => {
    localStorage.setItem("historico60", JSON.stringify(historico));
    localStorage.setItem("obs60", JSON.stringify(observacoes));
    gerarGrafico();
  }, [historico]);

  const handleCheck = (data, campo, valor) => {
    setHistorico((prev) => ({
      ...prev,
      [data]: {
        ...(prev[data] || {}),
        [campo]: valor,
      },
    }));
  };

  const handleObs = (data, texto) => {
    setObservacoes((prev) => ({ ...prev, [data]: texto }));
  };

  const enviarObs = (data) => {
    alert("Observação enviada!");
  };

  const dias = Array.from({ length: 60 }, (_, i) => addDays(startDate, i));

  const gerarGrafico = () => {
    const semanas = Array.from({ length: 9 }, (_, i) => dias.slice(i * 7, i * 7 + 7));
    const dados = semanas.map((semana, i) => {
      let total = 0;
      semana.forEach((d) => {
        const data = format(d, "dd/MM/yyyy");
        const dia = historico[data];
        if (dia) {
          ["Dieta", "Água", "Treino"].forEach((campo) => {
            if (dia[campo] === "✔️") total += 1;
          });
        }
      });
      return { semana: `Semana ${i + 1}`, acertos: total };
    });
    setGraficoData(dados);
  };

  return (
    <div className="p-4 font-sans bg-gray-50 text-gray-800">
      <div className="flex flex-col items-center mb-6">
        <img
          src="/FOTO2.png"
          alt="Luiz e Angelina"
          className="w-28 h-28 rounded-full shadow mb-2 object-cover"
        />
        <p className="text-sm text-gray-600">Criado por Luiz Henrique e Angelina</p>
        <p className="text-xs text-gray-500 mb-4">Nutricionista & Personal Trainer</p>
        <div className="text-center text-indigo-700 font-medium mb-4">
          🎯 Bem-vindo ao Missão 60 Dias!<br />
          Serão 60 dias para mudar sua rotina, seu corpo e sua vida.
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-gray-600 mb-2">
        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-3 text-sm">
        {dias.map((dia, i) => {
          const data = format(dia, "dd/MM/yyyy");
          const status = historico[data] || {};
          const obs = observacoes[data] || "";
          const diaSemana = format(dia, "EEEE", { locale: ptBR });

          return (
            <div key={i} className="bg-white p-2 rounded-xl shadow">
              <div className="font-bold text-indigo-600 text-sm mb-1">
                {diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)}<br />
                {format(dia, "dd/MM")}
              </div>
              {["Dieta", "Água", "Treino"].map((campo) => (
                <div key={campo} className="flex items-center justify-between mb-1">
                  <span className="text-xs">{campo}</span>
                  <div className="space-x-1">
                    <button
                      className={`px-2 rounded ${status[campo] === "✔️" ? "bg-green-500 text-white" : "bg-green-100"}`}
                      onClick={() => handleCheck(data, campo, "✔️")}
                    >
                      ✔️
                    </button>
                    <button
                      className={`px-2 rounded ${status[campo] === "❌" ? "bg-red-500 text-white" : "bg-red-100"}`}
                      onClick={() => handleCheck(data, campo, "❌")}
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ))}
              <textarea
                value={obs}
                onChange={(e) => handleObs(data, e.target.value)}
                className="w-full mt-1 p-1 border rounded text-xs"
                placeholder="Se errou..."
              />
              <button
                onClick={() => enviarObs(data)}
                className="mt-1 bg-indigo-500 text-white w-full py-1 rounded text-xs"
              >
                Enviar
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-2 text-center text-indigo-600">📊 Evolução semanal</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={graficoData}>
            <XAxis dataKey="semana" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="acertos" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
