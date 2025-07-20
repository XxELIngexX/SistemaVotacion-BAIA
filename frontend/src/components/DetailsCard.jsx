import React from "react";
import "../styles/detailsCard.css";

const DetailsCard = ({ eleccion }) => {
    const { id, name, active, proposals, votes } = eleccion;

    return (
        <div className="details-card">
           

            <table className="propuestas-tabla">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Propuesta</th>
                        <th>Votos</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(proposals).map((key, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{proposals[key]}</td>
                            <td>{votes[key]?.toString() || 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>


        </div>
    );
};

export default DetailsCard;
