import React, { useState } from 'react';
import { Box, Button, TextField, Backdrop, CircularProgress } from '@mui/material';

function VideoDownload() {
  const [urls, setUrls] = useState(['']); // URLを配列で管理
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadLinks, setDownloadLinks] = useState([]); // ダウンロードリンクを保存

  const handleChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setDownloadLinks([]); // リンクをリセット

    try {
      const response = await fetch('https://backservice-oqui.onrender.com/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls }), // 複数のURLを送信
      });

      const data = await response.json();
      if (response.ok) {
        setDownloadLinks(data.download_links);
      } else {
        setError(data.error || 'ダウンロードに失敗しました');
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const addTextField = () => {
    setUrls([...urls, '']);
  };

  return (
    <div>
      <form onSubmit={handleDownload}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {urls.map((url, index) => (
            <TextField
              key={index}
              type="text"
              value={url}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={`動画のURL ${index + 1}`}
              required
              variant="outlined"
              sx={{ width: '300px', height: '56px' }}
            />
          ))}
        </Box>
      </form>

      <Backdrop sx={{ color: '#fff', zIndex: 1300 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {error && <div className="error">{error}</div>}

      {/* ダウンロードリンクの表示 */}
      {downloadLinks.length > 0 && (
        <div>
          <h3>ダウンロードリンク</h3>
          <ul>
            {downloadLinks.map((link, index) => (
              <li key={index}>
                <a href={link} download>
                  動画 {index + 1} をダウンロード
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Box sx={{ display: 'flex', gap: 2, marginTop: '16px' }}>
        <Button variant="outlined" onClick={addTextField} sx={{ height: '40px', width: '140px' }}>
          URLを追加
        </Button>
        <Button variant="contained" size="large" onClick={handleDownload} disabled={isLoading} sx={{ height: '40px', width: '140px' }}>
          {isLoading ? 'ダウンロード中...' : 'ダウンロード'}
        </Button>
      </Box>
    </div>
  );
}

export default VideoDownload;
