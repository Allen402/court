# 公開上線方式

本遊戲是純靜態網站，可以免費部署，不需要資料庫或後端伺服器。

## Netlify Drop（最簡單）

1. 開啟 https://app.netlify.com/drop
2. 將整個 `courtroom-battle` 資料夾拖入頁面。
3. 等待上傳完成，即可取得公開網址。

## GitHub Pages

1. 建立 GitHub repository。
2. 上傳本資料夾中的全部檔案及 `assets` 資料夾。
3. 在 repository 的 Settings → Pages 選擇從主要分支部署。
4. 等待 GitHub 顯示公開網址。

## 注意事項

- 不可只上傳 `index.html`，必須連同 CSS、JavaScript 及 `assets` 一起上傳。
- 每位玩家的進度保存在自己的瀏覽器，換裝置不會同步。
- 清除瀏覽器網站資料後，通關紀錄會消失。
