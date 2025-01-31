import React, { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'; // Box コンポーネントをインポート

function VideoDownload() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // クルクル状態を追加

  const handleDownload = async (e) => {
    e.preventDefault();
    setIsLoading(true); // ダウンロード開始時にクルクルを表示

    try {
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
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'ダウンロードに失敗しました');
      }
    } catch (err) {
      setError('ネットワークエラーが発生しました');
    } finally {
      setIsLoading(false); // ダウンロード完了時にクルクルを非表示
    }
  };

  return (
    <div>
      <form onSubmit={handleDownload}>
        {/* Box コンポーネントで横並びに */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField 
            type="text" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            placeholder="動画のURLを入力" 
            required 
            variant="outlined"
            fullWidth
          />
          <Button 
            variant="contained" 
            onClick={handleDownload} 
            disabled={isLoading}
          >
            {isLoading ? 'ダウンロード中...' : 'ダウンロード'}
          </Button>
        </Box>
      </form>

      {/* クルクルをダウンロード中のみ表示 */}
      <Backdrop sx={{ color: '#fff', zIndex: 1300 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default VideoDownload;
