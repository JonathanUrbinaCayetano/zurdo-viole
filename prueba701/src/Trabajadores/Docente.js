import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../App.css';
import { Modal } from 'react-bootstrap'; 
import Confetti from 'react-confetti';  // Importamos el componente de confeti

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ListaDocentes = () => {
    const [docentes, setDocentes] = useState([]);
    const [expandedDocente, setExpandedDocente] = useState(null); 
    const [showChart, setShowChart] = useState(false); 
    const [selectedChartIndex, setSelectedChartIndex] = useState(null); 
    const [showConfetti, setShowConfetti] = useState(false); // Estado para controlar el confeti en los docentes
    const [showChartConfetti, setShowChartConfetti] = useState(false); // Estado para controlar el confeti en la gráfica

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost/apiprueba/api.php');
                const data = await response.json();
                setDocentes(data);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 1000);
        return () => clearInterval(interval);
    }, []);

    const chartData = {
        labels: docentes.map((docente) => `ID: ${docente.id}`),
        datasets: [
            {
                label: 'IDs de Docentes',
                data: docentes.map((docente) => docente.id),
                backgroundColor: [
                    'red', 'black', 'violet', 'darkgreen', 'brown', 'navy',
                    'red', 'black', 'violet', 'darkgreen', 'brown', 'navy'
                ],
                borderColor: [
                    'darkred', 'gray', 'purple', 'darkgreen', 'saddlebrown', 'darkblue',
                    'darkred', 'gray', 'purple', 'darkgreen', 'saddlebrown', 'darkblue'
                ],
                borderWidth: 1,
            },
        ],
    };

    const colors = [
        'red', 'black', 'violet', 'darkgreen', 'brown', 'navy',
        'red', 'black', 'violet', 'darkgreen', 'brown', 'navy'
    ];

    // Función para manejar el click en una tarjeta
    const handleCardClick = (docente) => {
        setExpandedDocente(docente);
        setShowConfetti(true); // Activar el confeti al hacer clic en el docente
        setTimeout(() => {
            setShowConfetti(false); // Desactivar el confeti después de 5 segundos
        }, 5000); // El confeti se mostrará durante 5 segundos
    };

    const handleChartClick = (index) => {
        setSelectedChartIndex(index);
        setShowChart(true);
        setShowChartConfetti(true); // Activar el confeti al hacer clic en la gráfica
        setTimeout(() => {
            setShowChartConfetti(false); // Desactivar el confeti después de 5 segundos
        }, 5000); // El confeti se mostrará durante 5 segundos
    };

    const closeChartModal = () => {
        setShowChart(false);
        setSelectedChartIndex(null);
    };

    return (
        <div className="container mt-4">
            {/* Efecto de confeti para las tarjetas */}
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

            {/* Efecto de confeti para la gráfica */}
            {showChartConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

            {/* Encabezado personalizado */}
            <header className="header-custom">
                <h1 className="display-4">DOCENTES INGENIERÍA INFORMÁTICA TESSFP</h1>
                <p className="lead">Listado de docentes con datos relevantes</p>
            </header>
            
            <div className="row">
                {docentes.map((docente, index) => (
                    <div key={index} className="col-md-4 mb-3">
                        <div 
                            className="card docente-card" 
                            style={{ backgroundColor: colors[index % colors.length] }}
                            onClick={() => handleCardClick(docente)} // Al hacer clic, mostramos el confeti
                        >
                            <div className="card-body">
                                <h5 className="card-title">
                                    Clave ISSEMYN: <strong>{docente.issemyn}</strong>
                                </h5>
                                <p className="card-text">
                                    <strong>ID:</strong> {docente.id}
                                </p>
                                <p className="card-text">
                                    <strong>Nombre:</strong> {docente.nombre}
                                </p>
                                <p className="card-text">
                                    <strong>Teléfono:</strong> {docente.telefono}
                                </p>
                                <p className="card-text">
                                    <strong>Sexo:</strong> {docente.sexo}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Gráfica de barras */}
            <div className="row mt-4">
                <div className="col-md-12">
                    <div className="card shadow-lg" onClick={() => handleChartClick(0)}>
                        <div className="card-body">
                            <h5 className="card-title">Gráfica de IDs de Docentes</h5>
                            <Bar data={chartData} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para los docentes */}
            {expandedDocente && (
                <Modal show={true} onHide={() => setExpandedDocente(null)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Detalles del Docente</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h5>Clave ISSEMYN: {expandedDocente.issemyn}</h5>
                        <p><strong>ID:</strong> {expandedDocente.id}</p>
                        <p><strong>Nombre:</strong> {expandedDocente.nombre}</p>
                        <p><strong>Teléfono:</strong> {expandedDocente.telefono}</p>
                        <p><strong>Sexo:</strong> {expandedDocente.sexo}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-secondary" onClick={() => setExpandedDocente(null)}>Cerrar</button>
                    </Modal.Footer>
                </Modal>
            )}

            {/* Modal para la gráfica expandida */}
            {showChart && selectedChartIndex !== null && (
                <Modal show={true} onHide={closeChartModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Gráfica de IDs de Docentes</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Bar data={chartData} />
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-secondary" onClick={closeChartModal}>Cerrar</button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default ListaDocentes;
