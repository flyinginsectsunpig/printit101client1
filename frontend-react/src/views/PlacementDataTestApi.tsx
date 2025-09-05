// src/views/PlacementDataTestApi.tsx
import React, { useState } from "react";
import { PlacementData } from "../domain/PlacementData";
import * as placementDataService from "../service/PlacementDataService";
import * as positionService from "../service/PositionService";
import * as rotationService from "../service/RotationService";
import * as scaleService from "../service/ScaleService";

const PlacementDataTestApi: React.FC = () => {
    const [positionId, setPositionId] = useState<number | "">(0);
    const [rotationId, setRotationId] = useState<number | "">(0);
    const [scaleId, setScaleId] = useState<number | "">(0);

    const handleCreate = async () => {
        if (!positionId || !rotationId || !scaleId) {
            alert("Please fill in all fields");
            return;
        }

        try {
            // Fetch full objects from their respective services
            const position = await positionService.getPositionById(positionId);
            if (!position) {
                alert(`Position with ID ${positionId} not found`);
                return;
            }

            const rotation = await rotationService.getRotationById(rotationId);
            if (!rotation) {
                alert(`Rotation with ID ${rotationId} not found`);
                return;
            }

            const scale = await scaleService.getScaleById(scaleId);
            if (!scale) {
                alert(`Scale with ID ${scaleId} not found`);
                return;
            }

            // Build complete PlacementData object
            const newPlacementData: PlacementData = {
                position,
                rotation,
                scale
            };

            const created = await placementDataService.createPlacementData(newPlacementData);
            console.log("Created PlacementData:", created);
            alert(`PlacementData created! ID: ${created.placementDataId}`);
        } catch (err) {
            console.error(err);
            alert("Error creating PlacementData. Ensure the IDs exist in the database.");
        }
    };

    const handleGetAll = async () => {
        try {
            const allData: PlacementData[] = await placementDataService.getAllPlacementData();
            console.log("All PlacementData:", allData);
            alert(`Fetched ${allData.length} PlacementData records! Check console.`);
        } catch (err) {
            console.error(err);
            alert("Error fetching PlacementData");
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "600px" }}>
            <h1>PlacementData Test API</h1>
            <input
                type="number"
                placeholder="Position ID"
                value={positionId}
                onChange={e => setPositionId(Number(e.target.value))}
            />
            <input
                type="number"
                placeholder="Rotation ID"
                value={rotationId}
                onChange={e => setRotationId(Number(e.target.value))}
            />
            <input
                type="number"
                placeholder="Scale ID"
                value={scaleId}
                onChange={e => setScaleId(Number(e.target.value))}
            />
            <div style={{ marginTop: "1rem" }}>
                <button onClick={handleCreate} style={{ marginRight: "1rem" }}>
                    Create PlacementData
                </button>
                <button onClick={handleGetAll}>Get All PlacementData</button>
            </div>
        </div>
    );
};

export default PlacementDataTestApi;
