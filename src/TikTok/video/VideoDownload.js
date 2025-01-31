import React, { useState } from 'react';

function VideoDownload() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleDownload = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://backservice-oqui.onrender.com/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        // ダウンロードリンクを取得して、ブラウザで直接ファイルをダウンロード
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'downloaded_video'; // 任意のファイル名
        a.click();
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'ダウンロードに失敗しました');
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました');
    }
  };

  return (
    <div>
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
    </div>
  );
}

export default VideoDownload;
