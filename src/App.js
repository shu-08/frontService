import React, { useState } from "react";
import { downloadVideo } from "./api";

function App() {
    const [url, setUrl] = useState("");
    const [downloadLink, setDownloadLink] = useState(null);
    const [error, setError] = useState(null);

    const handleDownload = async () => {
        try {
            const result = await downloadVideo(url);
            if (result?.download_link) {
                setDownloadLink(result.download_link);
            } else {
                setError("ダウンロードに失敗しました。");
            }
        } catch (error) {
            setError("ダウンロード中にエラーが発生しました。");
        }
    };

    return (
        <div>
            <h1>React + Flask 動画ダウンロード</h1>
            <input
                type="text"
                placeholder="動画のURLを入力"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />
            <button onClick={handleDownload}>ダウンロード</button>
            {downloadLink && <a href={downloadLink} download>ダウンロードリンク</a>}
            {error && <p>{error}</p>}
        </div>
    );
}

export default App;
