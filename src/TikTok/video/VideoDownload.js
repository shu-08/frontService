import React, { useState } from 'react';
import { Box, Button, TextField, Backdrop, CircularProgress } from '@mui/material';

function VideoDownload() {
  const [urls, setUrls] = useState(['']); // URLを配列で管理（最初のURLを含める）
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // クルクル状態を追加

  // URL変更時に配列を更新する関数
  const handleChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  // ダウンロード処理
  const handleDownload = async (e) => {
    e.preventDefault();
    setIsLoading(true); // クルクルを表示

    try {
      for (const url of urls) {
        if (!url.trim()) continue; // 空のURLはスキップ

        const response = await fetch('https://backservice-oqui.onrender.com/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });

        if (response.ok) {
          const blob = await response.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = 'downloaded_video'; // 任意のファイル名
          a.click();
        } else {
          const data = await response.json();
          setError(data.error || 'ダウンロードに失敗しました');
        }
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました');
    } finally {
      setIsLoading(false); // クルクルを非表示
    }
  };

  // 新しいテキストボックスを追加
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

      {/* クルクルをダウンロード中のみ表示 */}
      <Backdrop sx={{ color: '#fff', zIndex: 1300 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* エラーメッセージ */}
      {error && <div className="error">{error}</div>}

      {/* ボタンを横並びに配置 */}
      <Box sx={{ display: 'flex', gap: 2, marginTop: '16px' }}>
        <Button 
          variant="outlined" 
          onClick={addTextField} 
          sx={{ height: '40px', width: '140px' }}
        >
          URLを追加
        </Button>
        <Button 
          variant="contained" 
          size="large" 
          onClick={handleDownload} 
          disabled={isLoading}
          sx={{ height: '40px', width: '140px' }}
        >
          {isLoading ? 'ダウンロード中...' : 'ダウンロード'}
        </Button>
      </Box>
    </div>
  );
}

export default VideoDownload;
