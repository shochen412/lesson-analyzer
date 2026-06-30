#!/bin/bash
echo "=== 課堂語言分析系統 - 環境設定 ==="
echo ""
echo "請依序輸入你的 API Keys（輸入時不會顯示在畫面上）"
echo ""
read -p "AssemblyAI API Key: " -s AKEY && echo ""
read -p "Anthropic API Key:  " -s OKEY && echo ""

cat > .env.local << ENVEOF
ASSEMBLYAI_API_KEY=${AKEY}
ANTHROPIC_API_KEY=${OKEY}
ENVEOF

echo ""
echo "✅ .env.local 已建立完成"
echo "現在執行：npm run dev"
