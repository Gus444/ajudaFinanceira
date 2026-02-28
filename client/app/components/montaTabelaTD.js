'use client'
import Link from "next/link";

export default function MontaTabelaTD(props) {
    // Verifica se os cabeçalhos e propriedades foram passados
    let cabecalho = props.cabecalhos || [];
    let propriedades = props.propriedades || [];

    // Se os cabeçalhos e propriedades não foram passados, usa as propriedades do primeiro item da lista
    if (props.lista.length > 0 && cabecalho.length === 0) {
        cabecalho = Object.keys(props.lista[0]);
    }

    if (props.lista.length > 0 && propriedades.length === 0) {
        propriedades = Object.keys(props.lista[0]);
    }
    
    // Adiciona a coluna "Ações" automaticamente
    if (!propriedades.includes("Ações")) {
        propriedades.push("Ações");
    }

    if (!cabecalho.includes("Ações")) {
        cabecalho.push("Ações");
    }

    return (
        <div className="container-fluid px-0 mt-4">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                {/* Header do Card com contador de registros */}
                <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="fw-bold text-dark mb-1">
                                <i className="fas fa-list me-2 text-primary"></i>
                                Registros Encontrados
                            </h5>
                            <p className="text-muted small mb-0">
                                Total de {props.lista.length} {props.lista.length === 1 ? 'registro' : 'registros'}
                            </p>
                        </div>
                        <div className="bg-light rounded-3 px-4 py-2">
                            <span className="fw-bold text-primary">{props.lista.length}</span>
                            <span className="text-muted ms-1">itens</span>
                        </div>
                    </div>
                </div>

                {/* Área da Tabela */}
                <div className="card-body p-0">
                    <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        <table className="table table-hover mb-0">
                            <thead className="bg-light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                                <tr>
                                    {cabecalho.map((value, index) => (
                                        <th 
                                            key={index} 
                                            className="text-uppercase small fw-bold py-3 px-3"
                                            style={{ 
                                                color: '#4a5568',
                                                background: '#f8fafc',
                                                borderBottom: '2px solid #e2e8f0'
                                            }}
                                        >
                                            <div className="d-flex align-items-center">
                                                {index === 0 && <i className="fas fa-hashtag me-2 text-primary"></i>}
                                                {value.includes("|") ? value.split("|")[0] : value}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {props.lista.length > 0 ? (
                                    props.lista.map((value, rowIndex) => (
                                        <tr 
                                            key={rowIndex} 
                                            className="align-middle"
                                            style={{ 
                                                transition: 'all 0.2s',
                                                borderBottom: '1px solid #edf2f7'
                                            }}
                                        >
                                            {propriedades.map((prop, colIndex) => {
                                                if (prop !== "Ações") {
                                                    // Verifica se a propriedade é um objeto aninhado, como "usuario.usuNome"
                                                    const nestedProps = prop.split(".");
                                                    let cellValue = value;

                                                    // Percorre as propriedades aninhadas
                                                    nestedProps.forEach(nestedProp => {
                                                        cellValue = cellValue ? cellValue[nestedProp] : null;
                                                    });

                                                    return (
                                                        <td key={colIndex} className="px-3 py-3">
                                                            <div className="d-flex align-items-center">
                                                                {colIndex === 0 && (
                                                                    <span className="badge bg-primary bg-opacity-10 text-primary rounded-circle me-2" style={{ width: '24px', height: '24px', lineHeight: '24px', textAlign: 'center' }}>
                                                                        {rowIndex + 1}
                                                                    </span>
                                                                )}
                                                                <span className="text-dark">
                                                                    {cellValue !== null && cellValue !== undefined ? cellValue : "-"}
                                                                </span>
                                                            </div>
                                                        </td>
                                                    );
                                                } else {
                                                    return (
                                                        <td key={colIndex} className="px-3 py-3">
                                                            <div className="d-flex gap-2">
                                                                <button 
                                                                    onClick={() => props.alteracao(value[propriedades[0]])} 
                                                                    title="ALTERAR"
                                                                    className="btn btn-sm btn-outline-primary border-0 rounded-3 px-3"
                                                                    style={{ 
                                                                        background: 'rgba(59, 130, 246, 0.1)',
                                                                        color: '#3b82f6',
                                                                        transition: 'all 0.2s'
                                                                    }}
                                                                    onMouseEnter={(e) => {
                                                                        e.target.style.background = '#3b82f6';
                                                                        e.target.style.color = 'white';
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                                                                        e.target.style.color = '#3b82f6';
                                                                    }}
                                                                >
                                                                    <i className="fas fa-pen me-1"></i>
                                                                    Editar
                                                                </button>
                                                                <button 
                                                                    onClick={() => props.exclusao(value[propriedades[0]])} 
                                                                    title="EXCLUIR"
                                                                    className="btn btn-sm btn-outline-danger border-0 rounded-3 px-3"
                                                                    style={{ 
                                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                                        color: '#ef4444',
                                                                        transition: 'all 0.2s'
                                                                    }}
                                                                    onMouseEnter={(e) => {
                                                                        e.target.style.background = '#ef4444';
                                                                        e.target.style.color = 'white';
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                                                                        e.target.style.color = '#ef4444';
                                                                    }}
                                                                >
                                                                    <i className="fas fa-trash me-1"></i>
                                                                    Excluir
                                                                </button>
                                                            </div>
                                                        </td>
                                                    );
                                                }
                                            })}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={propriedades.length} className="text-center py-5">
                                            <div className="d-flex flex-column align-items-center justify-content-center">
                                                <div className="bg-light rounded-circle p-4 mb-3">
                                                    <i className="fas fa-inbox fa-3x text-muted"></i>
                                                </div>
                                                <h6 className="fw-bold text-dark mb-2">Nenhum registro encontrado</h6>
                                                <p className="text-muted small mb-0">Não há dados para exibir nesta tabela.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer do Card com opções adicionais */}
                {props.lista.length > 0 && (
                    <div className="card-footer bg-white border-0 pt-3 pb-3 px-4 d-flex justify-content-between align-items-center">
                        <div className="text-muted small">
                            <i className="fas fa-info-circle me-1 text-primary"></i>
                            Clique nos botões de ação para editar ou excluir registros
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-secondary border-0 rounded-3" 
                                    style={{ background: '#f1f5f9', color: '#475569' }}>
                                <i className="fas fa-download me-1"></i>
                                Exportar
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Estilos adicionais para scrollbar personalizada */}
            <style jsx>{`
                .table-responsive::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                
                .table-responsive::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 10px;
                }
                
                .table-responsive::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                
                .table-responsive::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
                
                .table tr:hover {
                    background-color: #f8fafc;
                }
            `}</style>
        </div>
    );
}