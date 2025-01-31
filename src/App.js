import React, { useState, useEffect } from "react";
import { fetchData } from "./api";

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchData().then(setData);
    }, []);

    return (
        <div>
            <h1>React + Flask App</h1>
            <p>Backendからのデータ: {data ? JSON.stringify(data) : "Loading..."}</p>
        </div>
    );
}

export default App;
