const API_BASE_URL = "https://backservice-oqui.onrender.com"; // RenderのFlask URL

export const downloadVideo = async (url) => {
    try {
        const response = await fetch("https://backservice-oqui.onrender.com", {  // `/download` エンドポイントに変更
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                url: url,
            }),
        });
        
        if (!response.ok) {
            throw new Error("APIエラー");
        }

        // Flask バックエンドからのレスポンスデータを取得
        const data = await response.json();

        // download_linkが返ってくると仮定
        if (data.download_link) {
            return { downloadLink: data.download_link };  // リンクを返す
        } else {
            throw new Error("ダウンロードリンクが返されませんでした");
        }

    } catch (error) {
        console.error("Error downloading video:", error);
        return { error: error.message };  // エラーを返す
    }
};
