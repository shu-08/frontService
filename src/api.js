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
            mode: "cors",  // CORSリクエストを明示的に設定
        });
        
        if (!response.ok) {
            throw new Error("APIエラー");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error downloading video:", error);
        return { error: error.message };  // エラーを返す
    }
};
