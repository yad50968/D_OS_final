# 2021分散式系統期末專案

## Backend && Frontend

Install & Setting:
1. cd Backend
2. 創建credential files
3. 創建serviceAccountKey.json (Firebase)
4. pip install -r requirements.txt

Run:
uvicorn main:app --reload

## Blockchain
Install & Setting:

1. cd Blockchain
2. npm install
3. 修改web3Func.js中HttpProvider網址 // var web3 = new Web3(new Web3.providers.HttpProvider(""));
4. 確任main.js中apiUrl，及helper.js中postSCURL、postMintURL正確

Run:
node main.js

## IPFS
Install & Setting:

1. cd IPFS
2. 安裝所需套件:ipfshttpclient, requests, json, hashlib
4. 確卻main.py中resourse_path正確

Run:
python main.py


# Deploy and Mint
前後端、區塊鏈部分、IPFS部分開啟後
1. 可透過Monitor頁面確認區塊鏈部分及IPFS部分是否持續執行
2. 可透過Home頁面進行布署合約或Mint token