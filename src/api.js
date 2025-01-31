const API_URL = "https://backservice-oqui.onrender.com"; // FlaskのURL

export const downloadVideo = async (url) => {
    try {
        const response = await fetch(`${API_URL}/download`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                url: url,
            }),
            mode: "cors",
        });

        if (!response.ok) {
            throw new Error("APIエラー");
        }

        // レスポンス内容をまずテキストとして取得して、ログに出力
        const textData = await response.text();
        console.log("Response text:", textData);  // ここで内容を確認

        // もしJSONとしてパースできる場合はJSONとして処理
        const data = JSON.parse(textData);

        if (data.download_link) {
            return { downloadLink: data.download_link };  // ダウンロードリンクを返す
        } else if (data.error) {
            throw new Error(data.error);  // エラーメッセージを投げる
        }
    } catch (error) {
        console.error("Error downloading video:", error);
        return { error: error.message };
    }
};
