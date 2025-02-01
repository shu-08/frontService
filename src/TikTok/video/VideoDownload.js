import React, { useState } from 'react';
import { Box, Button, TextField, Backdrop, CircularProgress, Typography, Link } from '@mui/material';

function VideoDownload() {
  const [urls, setUrls] = useState(['']); // URLのリスト
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadLinks, setDownloadLinks] = useState([]); // 各動画のダウンロードリンクを格納

  // URL変更時に配列を更新する関数
  const handleChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  // ダウンロード処理（複数URLを個別に処理）
  const handleDownload = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setDownloadLinks([]); // 前回のリンクをクリア

    try {
      const newDownloadLinks = [];

      for (const url of urls) {
        if (!url.trim()) continue; // 空のURLは無視

        const response = await fetch('https://backservice-oqui.onrender.com/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });

        if (response.ok) {
          const blob = await response.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          newDownloadLinks.push({ url, downloadUrl });

          // 自動でダウンロード開始
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `video_${newDownloadLinks.length}.mp4`; // 動画ごとに異なる名前を付与
          a.click();
        } else {
          const data = await response.json();
          setError(data.error || 'ダウンロードに失敗しました');
        }
      }

      setDownloadLinks(newDownloadLinks);
      setError('');
    } catch (err) {
      setError('ネットワークエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 新しいテキストボックスを追加する関数
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
      {error && <Typography color="error">{error}</Typography>}

      {/* ダウンロードリンクの表示（複数対応） */}
      {downloadLinks.length > 0 && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">ダウンロードリンク</Typography>
          {downloadLinks.map((link, index) => (
            <Typography key={index}>
              <Link href={link.downloadUrl} download={`video_${index + 1}.mp4`}>
                {`動画 ${index + 1} をダウンロード`}
              </Link>
            </Typography>
          ))}
        </Box>
      )}

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
