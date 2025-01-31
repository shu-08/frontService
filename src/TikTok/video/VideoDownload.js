import React, { useState } from 'react';
import { Box, Button, TextField, Backdrop, CircularProgress, Typography } from '@mui/material';

function VideoDownload() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // クルクル状態を追加
  const [extraFields, setExtraFields] = useState([]); // 新しいテキストボックスを追加するためのステート

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

  // 新しいテキストボックスを追加する関数
  const addTextField = () => {
    setExtraFields([...extraFields, '']); // 新しいフィールドを追加
  };

  return (
    <div>
      <form onSubmit={handleDownload}>
        {/* Box コンポーネントで縦並びに */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField 
            type="text" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            placeholder="動画のURLを入力" 
            required 
            variant="outlined"
            sx={{
              width: '300px', // テキストボックスの幅を調整
              height: '56px', // 高さをボタンと同じにする
            }}
          />
        </Box>
      </form>

      {/* クルクルをダウンロード中のみ表示 */}
      <Backdrop sx={{ color: '#fff', zIndex: 1300 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* ダウンロード後に新しいテキストボックスを表示 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: '16px' }}>
        {extraFields.map((_, index) => (
          <TextField 
            key={index}
            type="text"
            placeholder={`追加のURL ${index + 1}`}
            variant="outlined"
            sx={{
              width: '300px',
              height: '56px',
            }}
          />
        ))}
      </Box>

      {/* エラーメッセージ */}
      {error && <div className="error">{error}</div>}

      {/* ボタンを押した後にテキストボックスを追加 */}
      <Box sx={{ display: 'flex', gap: 2, marginTop: '16px' }}>
        <Button 
          variant="outlined" 
          onClick={addTextField} 
          sx={{
            height: '40px',
            width: '140px', // ボタンの高さをテキストボックスと同じにする
          }}
        >
          URLを追加
        </Button>
        <Button 
          variant="contained" 
          size="large" 
          onClick={handleDownload} 
          disabled={isLoading}
          sx={{
            height: '40px',
            width: '140px', // ボタンの高さをテキストボックスと同じにする
          }}
        >
          {isLoading ? 'ダウンロード中...' : 'ダウンロード'}
        </Button>
      </Box>
    </div>
  );
}

export default VideoDownload;
