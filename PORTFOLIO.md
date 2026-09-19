![工作坊完成徽章](https://img.shields.io/badge/GitHub_Copilot_實戰工作坊-已完成-1F883D?style=for-the-badge&logo=githubcopilot&logoColor=white)

# 待辦清單 Web App

這是我在「GitHub Copilot 實戰工作坊:Agent Mode × MCP × Agentic Workflows」中,透過 GitHub Copilot Agent Mode 從零打造的一個純前端待辦清單(To-Do List)網頁應用程式。整個過程從需求描述、功能迭代、文件查詢到修復 GitHub Issue 並開 PR,都是以自然語言與 AI 協作完成。

## 線上展示

🔗 https://windperson.github.io/githubbootcamp2026-workshop/

## 功能

- 新增待辦事項(輸入空白內容不會新增)
- 勾選待辦事項為完成 / 取消完成,完成的項目會加上刪除線並淡化顯示
- 刪除指定待辦事項
- 底部顯示「未完成:N 項」統計,永遠反映整體資料、不受篩選影響
- 依「全部 / 未完成 / 已完成」篩選清單,選中的篩選按鈕有明顯樣式
- 篩選結果為空時顯示對應提示文字,並明確告知使用者資料只是被篩選掉、不是被刪除
- 篩選條件存進 `localStorage`,重新整理頁面後仍維持上次選擇
- 深色 / 淺色模式切換,按鈕圖示與文字會依目前主題動態更新
- 深色模式偏好存進 `localStorage`;若使用者從未手動切換過,會自動跟隨作業系統的深淺色設定(`prefers-color-scheme`)
- 待辦事項資料存進 `localStorage`,重新整理頁面後資料不會遺失
- 版面置中、卡片式設計、圓角與陰影,並支援手機螢幕的響應式版面(RWD)

## 技術

- 純 HTML、CSS、原生 JavaScript 實作,沒有使用任何前端框架或套件(不用 React / Vue / jQuery / Bootstrap / Tailwind)
- 不依賴任何外部 CDN,離線即可開啟使用
- 沒有 `package.json`,不需要 `npm install` 或建置流程
- 所有資料(待辦清單、主題偏好、篩選條件)都存在瀏覽器的 `localStorage`,沒有後端伺服器或資料庫

## 開發方式

這個專案完全在 VS Code 中透過 GitHub Copilot 完成,主要運用以下三種方式:

- **Agent Mode**:用自然語言描述功能需求(例如新增待辦、深色模式、篩選功能),由 Copilot 直接規劃並修改 `index.html`、`styles.css`、`app.js` 三個檔案,再由我確認驗證結果。
- **MCP(Model Context Protocol)整合**:透過設定於 `.vscode/mcp.json` 的 MCP 伺服器,讓 Copilot 能查詢 Microsoft Learn 官方文件(例如 `prefers-color-scheme` 與色彩對比的無障礙建議),以及讀取本 repo 在 GitHub 上的 Issue 內容,把外部知識與專案脈絡帶進對話中。
- **Agentic Workflow(`.github/prompts`)**:撰寫了一份 `fix-issue.prompt.md` 的可重複使用流程,讓 Copilot 依照固定步驟(讀取 Issue → 提出修改計畫並等待確認 → 建立分支 → 修改程式碼 → 說明驗證方式 → 提交推送 → 開 Pull Request)自動化修復多個 GitHub Issue,並在每次修改前都會停下來讓我確認計畫。

`.github/copilot-instructions.md` 則定義了這個專案固定的技術限制與程式風格(純前端、繁體中文註解、CSS 變數等),確保每一次 Copilot 的修改都符合同一套規範。

## 我學到什麼

1. 把技術限制與程式風格寫進 `copilot-instructions.md`,能讓 AI 在多次對話、多個功能迭代之間保持一致的程式碼風格與架構決策。
2. 在動手修改前先讓 AI 條列計畫並等待確認,可以在還沒改任何檔案之前就發現理解落差,降低來回修正的成本。
3. MCP 讓 AI 助理不再只靠既有知識回答,而能即時查證官方文件(如無障礙色彩對比規範)或讀取專案自己的 GitHub Issue,回答更貼近實際情境。
4. 把「讀 Issue → 提案 → 建分支 → 改程式 → 驗證 → 提交 → 開 PR」寫成固定的 Prompt 檔案,可以把原本零散的手動流程變成一致、可重複執行的 Agentic Workflow。
5. 即使是很小的 UX 問題(例如篩選後清單變空卻沒有任何提示),透過清楚描述重現步驟與預期行為的 Issue,也能讓 AI 提出精準且範圍可控的修正方案。
