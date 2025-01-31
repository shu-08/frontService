import React, { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [error, setError] = useState('');

  const handleDownload = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://your-backend-url.com/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (response.ok) {
        setDownloadLink(data.download_link);
        setError('');
      } else {
        setError(data.error || 'ダウンロードに失敗しました');
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました');
    }
  };

  return (
    <div>
      <h1>YouTube Video Downloader</h1>
      <form onSubmit={handleDownload}>
        <input 
          type="text" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          placeholder="動画のURLを入力" 
          required 
        />
        <button type="submit">ダウンロード</button>
      </form>
      {error && <div className="error">{error}</div>}
      {downloadLink && (
        <div className="download-link">
          <p>ダウンロード完了: <a href={downloadLink} download>ここをクリックしてダウンロード</a></p>
        </div>
      )}
    </div>
  );
}

export default App;
