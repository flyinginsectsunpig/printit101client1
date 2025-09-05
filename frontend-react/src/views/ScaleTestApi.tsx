import React, { useState } from "react";
import { Scale } from "../domain/Scale";
import * as scaleService from "../service/ScaleService";

const ScaleTestApi: React.FC = () => {
    const [x, setX] = useState(1);
    const [y, setY] = useState(1);
    const [z, setZ] = useState(1);

    const handleCreateScale = async () => {
        try {
            const newScale: Scale = { scaleId: 0, x, y, z };
            const created = await scaleService.createScale(newScale);
            console.log("Created Scale:", created);
            alert(`Scale created with ID: ${created.scaleId}`);
        } catch (err) {
            console.error(err);
            alert("Error creating Scale");
        }
    };

    const handleGetAll = async () => {
        try {
            const list = await scaleService.getAllScales();
            console.log("All Scales:", list);
            alert(`Fetched ${list.length} scales`);
        } catch (err) {
            console.error(err);
            alert("Error fetching scales");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Scale Test</h1>
            <input type="number" placeholder="X" value={x} onChange={(e) => setX(Number(e.target.value))} />
            <input type="number" placeholder="Y" value={y} onChange={(e) => setY(Number(e.target.value))} />
            <input type="number" placeholder="Z" value={z} onChange={(e) => setZ(Number(e.target.value))} />
            <div style={{ marginTop: "1rem" }}>
                <button onClick={handleCreateScale}>Create Scale</button>
                <button onClick={handleGetAll}>Get All Scales</button>
            </div>
        </div>
    );
};

export default ScaleTestApi;
