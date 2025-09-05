import React, { useState } from "react";
import { Rotation } from "../domain/Rotation";
import * as rotationService from "../service/RotationService";

const RotationTestApi: React.FC = () => {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [z, setZ] = useState(0);

    const handleCreateRotation = async () => {
        try {
            const newRotation: Rotation = { rotationId: 0, x, y, z };
            const created = await rotationService.createRotation(newRotation);
            console.log("Created Rotation:", created);
            alert(`Rotation created with ID: ${created.rotationId}`);
        } catch (err) {
            console.error(err);
            alert("Error creating Rotation");
        }
    };

    const handleGetAll = async () => {
        try {
            const list = await rotationService.getAllRotations();
            console.log("All Rotations:", list);
            alert(`Fetched ${list.length} rotations`);
        } catch (err) {
            console.error(err);
            alert("Error fetching rotations");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Rotation Test</h1>
            <input type="number" placeholder="X" value={x} onChange={(e) => setX(Number(e.target.value))} />
            <input type="number" placeholder="Y" value={y} onChange={(e) => setY(Number(e.target.value))} />
            <input type="number" placeholder="Z" value={z} onChange={(e) => setZ(Number(e.target.value))} />
            <div style={{ marginTop: "1rem" }}>
                <button onClick={handleCreateRotation}>Create Rotation</button>
                <button onClick={handleGetAll}>Get All Rotations</button>
            </div>
        </div>
    );
};

export default RotationTestApi;
