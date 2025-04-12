import { useState, useEffect } from "react";
import { addDays, format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
// Código com layout horizontal e funcionalidades será inserido.
