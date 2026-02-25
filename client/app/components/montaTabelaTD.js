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
        <div className="container mt-1">
            <div className="card p-3 shadow">
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                {cabecalho.map((value, index) => (
                                    <th key={index}>{value.includes("|") ? value.split("|")[0] : value}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {props.lista.map((value, index) => (
                                <tr key={index}>
                                    {propriedades.map((prop, index) => {
                                    if (prop !== "Ações") {
                                        // Verifica se a propriedade é um objeto aninhado, como "usuario.usuNome"
                                        const nestedProps = prop.split("."); // Divide a string por "."
                                        let cellValue = value;

                                        // Percorre as propriedades aninhadas
                                        nestedProps.forEach(nestedProp => {
                                            cellValue = cellValue ? cellValue[nestedProp] : null; // Acessa cada nível do objeto
                                        });

                                        return <td key={index}>{cellValue !== null && cellValue !== undefined ? cellValue : ""}</td>;
                                    } else {
                                        return (
                                            <td key={index}>
                                                <div>
                                                    <button onClick={() => props.alteracao(value[propriedades[0]])} title="ALTERAR" className="btn btn-primary mr-2 mb-2">
                                                        <i className="fas fa-pen"></i>
                                                    </button>
                                                    <button onClick={() => props.exclusao(value[propriedades[0]])} title="EXCLUIR" className="btn btn-danger mr-2 mb-2">
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        );
                                    }
                                })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}