'use client'
import Link from "next/link";
import { useEffect, useRef, useState, useContext } from "react"
import UserContext from "../context/userContext.js"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function HomeAdmin() {

    let msgRef = useRef(null);
    let {user, setUser} = useContext(UserContext);
    let [listaLancamento, setListaLancamento] = useState([])
    let [carregando, setCarregando] = useState(true)
    
    // Estados para o filtro de mês/ano
    const dataAtual = new Date();
    const [mesSelecionado, setMesSelecionado] = useState(dataAtual.getMonth() + 1);
    const [anoSelecionado, setAnoSelecionado] = useState(dataAtual.getFullYear());

    function carregarLancamento() {
        fetch(`http://localhost:5000/lancamento/${user.usuId}`, {
            mode: 'cors',
            credentials: 'include',
            method: "GET",
        })
        .then(r=> r.json())
        .then(r=> {
            console.log("Dados carregados:", r);
            setListaLancamento(r);
            setCarregando(false);
        })
        .catch(erro => {
            console.error("Erro ao carregar lançamentos:", erro);
            setCarregando(false);
        });
    }

    useEffect(() => {
        if (user?.usuId) {
            carregarLancamento();
        }
    }, [user]);

    // Função para gerar lista de anos disponíveis
    const anosDisponiveis = () => {
        const anos = new Set();
        listaLancamento.forEach(item => {
            const data = new Date(item.lanData);
            anos.add(data.getFullYear());
        });
        const anoAtual = new Date().getFullYear();
        if (!anos.has(anoAtual)) anos.add(anoAtual);
        return Array.from(anos).sort((a, b) => b - a); // Ordem decrescente
    };

    // Filtrar lançamentos por mês e ano selecionados
    const lancamentosFiltrados = listaLancamento.filter(item => {
        const data = new Date(item.lanData);
        return data.getMonth() + 1 === mesSelecionado && data.getFullYear() === anoSelecionado;
    });

    // Totais do período filtrado
    const totaisPeriodo = lancamentosFiltrados.reduce((acc, item) => {
        const valor = parseFloat(item.lanValor);
        const tipo = item.lanTipo;
        
        if (tipo === "2" || tipo === "entrada") {
            acc.receitas += valor;
        } else {
            acc.despesas += valor;
        }
        return acc;
    }, { receitas: 0, despesas: 0 });

    // Processar dados para os cards
    const totais = listaLancamento.reduce((acc, item) => {
        const valor = parseFloat(item.lanValor);
        const tipo = item.lanTipo;
        
        if (tipo === "2" || tipo === "entrada") {
            acc.receitas += valor;
        } else {
            acc.despesas += valor;
        }
        acc.saldo = acc.receitas - acc.despesas;
        return acc;
    }, { receitas: 0, despesas: 0, saldo: 0 });

    // Agrupar por mês
    const gastosPorMes = listaLancamento.reduce((acc, item) => {
        const data = new Date(item.lanData);
        const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`;
        const valor = parseFloat(item.lanValor);
        const tipo = item.lanTipo;
        
        if (!acc[mesAno]) {
            acc[mesAno] = { despesas: 0, receitas: 0 };
        }
        
        if (tipo === "2" || tipo === "entrada") {
            acc[mesAno].receitas += valor;
        } else {
            acc[mesAno].despesas += valor;
        }
        
        return acc;
    }, {});

    // Ordenar meses
    const mesesOrdenados = Object.keys(gastosPorMes).sort((a, b) => {
        const [mesA, anoA] = a.split('/');
        const [mesB, anoB] = b.split('/');
        return new Date(anoA, mesA - 1) - new Date(anoB, mesB - 1);
    });

    // Agrupar por categoria (agora usando cat_nome que já vem do JOIN)
    const gastosPorCategoria = listaLancamento
        .filter(item => {
            const tipo = item.lanTipo;
            return tipo === "1" || tipo === "saida";
        })
        .reduce((acc, item) => {
            const valor = parseFloat(item.lanValor);
            const nomeCategoria = item.lanCatNome || "Sem categoria";
            
            if (!acc[nomeCategoria]) {
                acc[nomeCategoria] = 0;
            }
            acc[nomeCategoria] += valor;
            return acc;
        }, {});

    // Top 5 categorias
    const topCategorias = Object.entries(gastosPorCategoria)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    // Dados para o gráfico de barras (Gastos por Mês)
    const dadosGraficoBarras = {
        labels: mesesOrdenados,
        datasets: [
            {
                label: 'Despesas',
                data: mesesOrdenados.map(mes => gastosPorMes[mes].despesas),
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 1
            },
            {
                label: 'Receitas',
                data: mesesOrdenados.map(mes => gastosPorMes[mes].receitas),
                backgroundColor: 'rgba(34, 197, 94, 0.7)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1
            }
        ]
    };

    // Dados para o gráfico de pizza (Categorias)
    const dadosGraficoPizza = {
        labels: topCategorias.map(item => item[0]),
        datasets: [
            {
                data: topCategorias.map(item => item[1]),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(139, 92, 246, 0.7)',
                    'rgba(236, 72, 153, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(16, 185, 129, 0.7)'
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(139, 92, 246)',
                    'rgb(236, 72, 153)',
                    'rgb(245, 158, 11)',
                    'rgb(16, 185, 129)'
                ],
                borderWidth: 1
            }
        ]
    };

    // Dados para o gráfico de rosca (Período Filtrado)
    const dadosGraficoRosca = {
        labels: ['Receitas', 'Despesas'],
        datasets: [
            {
                data: [totaisPeriodo.receitas, totaisPeriodo.despesas],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.7)',
                    'rgba(239, 68, 68, 0.7)'
                ],
                borderColor: [
                    'rgb(34, 197, 94)',
                    'rgb(239, 68, 68)'
                ],
                borderWidth: 1,
                cutout: '70%'
            }
        ]
    };

    // Opções dos gráficos
    let opcoesGrafico = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    };

    // Opções específicas para o gráfico de rosca
    let opcoesGraficoRosca = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';
                        let value = context.raw || 0;
                        let total = context.dataset.data.reduce((a, b) => a + b, 0);
                        let percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                        return `${label}: ${formatarMoeda(value)} (${percentage}%)`;
                    }
                }
            }
        }
    };

    // Formatar moeda
    let formatarMoeda = (valor) => {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    // Nomes dos meses
    let meses = [
        { valor: 1, nome: 'Janeiro' },
        { valor: 2, nome: 'Fevereiro' },
        { valor: 3, nome: 'Março' },
        { valor: 4, nome: 'Abril' },
        { valor: 5, nome: 'Maio' },
        { valor: 6, nome: 'Junho' },
        { valor: 7, nome: 'Julho' },
        { valor: 8, nome: 'Agosto' },
        { valor: 9, nome: 'Setembro' },
        { valor: 10, nome: 'Outubro' },
        { valor: 11, nome: 'Novembro' },
        { valor: 12, nome: 'Dezembro' }
    ];

    // Nome do mês selecionado
    const nomeMesSelecionado = meses.find(m => m.valor === mesSelecionado)?.nome || '';

    if (carregando) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 mb-0 fw-bold">Dashboard Financeiro</h1>
                    <p className="text-muted small mb-0">
                        Visão geral das suas movimentações financeiras
                    </p>
                </div>
                <div className="bg-light rounded-3 px-4 py-2">
                    <span className="fw-bold text-primary">{listaLancamento.length}</span>
                    <span className="text-muted ms-1">movimentações</span>
                </div>
            </div>

            {/* Cards de Resumo */}
            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="bg-success bg-opacity-10 rounded-3 p-3">
                                    <i className="fas fa-arrow-down fa-2x text-success"></i>
                                </div>
                                <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                                    Entradas
                                </span>
                            </div>
                            <h2 className="h3 fw-bold mb-1">{formatarMoeda(totais.receitas)}</h2>
                            <p className="text-muted small mb-0">Total de receitas</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="bg-danger bg-opacity-10 rounded-3 p-3">
                                    <i className="fas fa-arrow-up fa-2x text-danger"></i>
                                </div>
                                <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill">
                                    Saídas
                                </span>
                            </div>
                            <h2 className="h3 fw-bold mb-1">{formatarMoeda(totais.despesas)}</h2>
                            <p className="text-muted small mb-0">Total de despesas</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className={`bg-opacity-10 rounded-3 p-3 ${totais.saldo >= 0 ? 'bg-primary' : 'bg-warning'}`}>
                                    <i className={`fas fa-wallet fa-2x ${totais.saldo >= 0 ? 'text-primary' : 'text-warning'}`}></i>
                                </div>
                                <span className={`badge bg-opacity-10 px-3 py-2 rounded-pill ${totais.saldo >= 0 ? 'bg-primary text-primary' : 'bg-warning text-warning'}`}>
                                    Saldo
                                </span>
                            </div>
                            <h2 className={`h3 fw-bold mb-1 ${totais.saldo >= 0 ? 'text-primary' : 'text-warning'}`}>
                                {formatarMoeda(totais.saldo)}
                            </h2>
                            <p className="text-muted small mb-0">Saldo atual</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráficos */}
            <div className="row g-4 mb-4">
                {/* Gráfico de Barras - Evolução Mensal */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
                            <h5 className="fw-bold mb-0">
                                <i className="fas fa-chart-bar me-2 text-primary"></i>
                                Evolução Mensal
                            </h5>
                            <p className="text-muted small mb-0">Receitas vs Despesas por mês</p>
                        </div>
                        <div className="card-body p-4">
                            <div style={{ height: '300px' }}>
                                <Bar data={dadosGraficoBarras} options={opcoesGrafico} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gráfico de Pizza - Top Categorias */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
                            <h5 className="fw-bold mb-0">
                                <i className="fas fa-chart-pie me-2 text-primary"></i>
                                Top 5 Categorias
                            </h5>
                            <p className="text-muted small mb-0">Maiores gastos por categoria</p>
                        </div>
                        <div className="card-body p-4">
                            <div style={{ height: '250px' }}>
                                <Pie data={dadosGraficoPizza} options={opcoesGrafico} />
                            </div>
                            <div className="mt-3">
                                {topCategorias.map(([categoria, valor], index) => (
                                    <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex align-items-center">
                                            <div className="rounded-circle me-2" style={{
                                                width: '10px',
                                                height: '10px',
                                                backgroundColor: dadosGraficoPizza.datasets[0].backgroundColor[index]
                                            }}></div>
                                            <span className="small text-muted">{categoria}</span>
                                        </div>
                                        <span className="small fw-bold">{formatarMoeda(valor)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* GRÁFICO COM FILTRO: Período Selecionado */}
            <div className="row g-4 mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="fw-bold mb-0">
                                        <i className="fas fa-filter me-2 text-primary"></i>
                                        Análise por Período
                                    </h5>
                                    <p className="text-muted small mb-0">Selecione o mês e ano para visualizar</p>
                                </div>
                                
                                {/* Filtros */}
                                <div className="d-flex gap-2">
                                    <select 
                                        className="form-select form-select-sm rounded-3" 
                                        style={{ width: '140px' }}
                                        value={mesSelecionado}
                                        onChange={(e) => setMesSelecionado(parseInt(e.target.value))}
                                    >
                                        {meses.map(mes => (
                                            <option key={mes.valor} value={mes.valor}>
                                                {mes.nome}
                                            </option>
                                        ))}
                                    </select>
                                    
                                    <select 
                                        className="form-select form-select-sm rounded-3" 
                                        style={{ width: '100px' }}
                                        value={anoSelecionado}
                                        onChange={(e) => setAnoSelecionado(parseInt(e.target.value))}
                                    >
                                        {anosDisponiveis().map(ano => (
                                            <option key={ano} value={ano}>
                                                {ano}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div className="card-body p-4">
                            {lancamentosFiltrados.length > 0 ? (
                                <div className="row align-items-center">
                                    <div className="col-md-5">
                                        <div style={{ height: '250px' }}>
                                            <Doughnut data={dadosGraficoRosca} options={opcoesGraficoRosca} />
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <div className="row g-3">
                                            <div className="col-sm-6">
                                                <div className="bg-success bg-opacity-10 rounded-4 p-4">
                                                    <div className="d-flex align-items-center mb-2">
                                                        <i className="fas fa-arrow-down text-success me-2"></i>
                                                        <span className="small text-muted">Receitas do período</span>
                                                    </div>
                                                    <h3 className="h4 fw-bold text-success mb-0">
                                                        {formatarMoeda(totaisPeriodo.receitas)}
                                                    </h3>
                                                    <small className="text-muted">
                                                        {lancamentosFiltrados.filter(i => i.lanTipo === "2" || i.lanTipo === "entrada").length} lançamentos
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="bg-danger bg-opacity-10 rounded-4 p-4">
                                                    <div className="d-flex align-items-center mb-2">
                                                        <i className="fas fa-arrow-up text-danger me-2"></i>
                                                        <span className="small text-muted">Despesas do período</span>
                                                    </div>
                                                    <h3 className="h4 fw-bold text-danger mb-0">
                                                        {formatarMoeda(totaisPeriodo.despesas)}
                                                    </h3>
                                                    <small className="text-muted">
                                                        {lancamentosFiltrados.filter(i => i.lanTipo === "1" || i.lanTipo === "saida").length} lançamentos
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className={`rounded-4 p-4 ${totaisPeriodo.receitas - totaisPeriodo.despesas >= 0 ? 'bg-primary bg-opacity-10' : 'bg-warning bg-opacity-10'}`}>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <i className={`fas fa-chart-line me-2 ${totaisPeriodo.receitas - totaisPeriodo.despesas >= 0 ? 'text-primary' : 'text-warning'}`}></i>
                                                        <span className="small text-muted">Saldo do período</span>
                                                    </div>
                                                    <h3 className={`h4 fw-bold mb-0 ${totaisPeriodo.receitas - totaisPeriodo.despesas >= 0 ? 'text-primary' : 'text-warning'}`}>
                                                        {formatarMoeda(totaisPeriodo.receitas - totaisPeriodo.despesas)}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <div className="mb-3">
                                        <i className="fas fa-calendar-times fa-4x text-muted"></i>
                                    </div>
                                    <h5 className="fw-bold text-dark mb-2">
                                        Nenhum lançamento encontrado
                                    </h5>
                                    <p className="text-muted mb-0">
                                        Não há movimentações para {nomeMesSelecionado}/{anoSelecionado}
                                    </p>
                                    <p className="text-muted small mt-3">
                                        Tente selecionar outro período ou cadastre novos lançamentos
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Últimas Movimentações */}
            <div className="row">
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-header bg-white border-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="fw-bold mb-0">
                                    <i className="fas fa-history me-2 text-primary"></i>
                                    Últimas Movimentações
                                </h5>
                                <p className="text-muted small mb-0">Seus últimos lançamentos</p>
                            </div>
                            <Link href="/admin/movimentacao" className="btn btn-sm btn-outline-primary rounded-3">
                                Ver todas
                                <i className="fas fa-arrow-right ms-2"></i>
                            </Link>
                        </div>
                        <div className="card-body p-4">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="small fw-bold text-muted">DATA</th>
                                            <th className="small fw-bold text-muted">DESCRIÇÃO</th>
                                            <th className="small fw-bold text-muted">CATEGORIA</th>
                                            <th className="small fw-bold text-muted">VALOR</th>
                                            <th className="small fw-bold text-muted">TIPO</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listaLancamento.slice(0, 5).map((item) => {
                                            const data = new Date(item.lanData).toLocaleDateString('pt-BR');
                                            const tipo = item.lanTipo === "2" || item.lanTipo === "entrada" ? "Receita" : "Despesa";
                                            const valor = parseFloat(item.lanValor);
                                            const descricao = item.lanDescricao;
                                            const nomeCategoria = item.lanCatNome || "Sem categoria";
                                            
                                            return (
                                                <tr key={item.lan_id || item.lanId}>
                                                    <td>
                                                        <span className="small">{data}</span>
                                                    </td>
                                                    <td>
                                                        <span className="fw-medium">{descricao}</span>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                                                            {nomeCategoria}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`fw-bold ${tipo === "Receita" ? 'text-success' : 'text-danger'}`}>
                                                            {formatarMoeda(valor)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${tipo === "Receita" ? 'bg-success' : 'bg-danger'} px-3 py-2 rounded-pill`}>
                                                            {tipo}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}