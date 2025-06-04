# 🧠 Prompt Optimizer Frontend

Bu proje, yapay zekaya gönderilen prompt'ları iyileştiren ve çoklu model stratejilerine göre cevaplar oluşturan bir sistemin **React tabanlı kullanıcı arayüzüdür**.

> Backend: [.NET 8 Web API — PromptOptimizer.API](https://github.com/ArslanKG/PromptOptimizer)

---

## 🚀 Özellikler

- 🎯 Prompt girişi ve düzenleme
- 🤖 Strateji ve optimizasyon tipi seçimi
- 💬 AI yanıtlarını chat formatında gösterme
- 🔄 Gerçek zamanlı yüklenme animasyonu
- 💡 Temiz, modüler ve ölçeklenebilir yapı
- 🧩 Zustand ile global store
- 🌐 Axios ile API iletişimi
- 📁 Component bazlı klasörleme

---

## 🤖 MCP Server

Bu proje ayrıca **Model Context Protocol (MCP) Server** içermektedir - prompt optimizasyon araçları ve kaynakları sağlayan kapsamlı bir sunucu.

### MCP Server Özellikleri

#### 🔧 Araçlar (6 adet)
- **optimize_prompt** - Çeşitli stratejiler ve modeller kullanarak prompt optimizasyonu
- **analyze_prompt_quality** - Detaylı geri bildirimle prompt kalite analizi
- **get_optimization_suggestions** - Promptlar için spesifik iyileştirme önerileri
- **compare_models** - Farklı kullanım durumları için AI model karşılaştırması
- **validate_prompt_structure** - Prompt yapısı ve format doğrulaması
- **generate_prompt_variations** - Mevcut promptların çoklu varyasyonlarını üretme

#### 📚 Kaynaklar (4 adet)
- **prompt://strategies** - Optimizasyon stratejileri
- **prompt://models** - Desteklenen AI modelleri ve fiyatlandırma
- **prompt://best-practices** - Prompt yazma rehberi
- **prompt://templates** - Hazır prompt şablonları

### Hızlı Kurulum

1. **MCP Server dizinine gidin**:
   ```bash
   cd mcp-server
   npm install
   ```

2. **Ortam değişkenlerini yapılandırın** (`.env` dosyası):
   ```env
   API_BASE_URL=https://localhost:7179/api
   USE_MOCK_DATA=false
   ENABLE_CACHE=true
   JWT_TOKEN=your_token_here  # Opsiyonel
   ```

### Kullanım Örnekleri

```javascript
// Prompt optimizasyonu
use_mcp_tool("prompt-optimizer", "optimize_prompt", {
  "prompt": "Bir hikaye yaz",
  "strategy": "quality",
  "optimizationType": "clarity"
});

// Model karşılaştırması
use_mcp_tool("prompt-optimizer", "compare_models", {
  "criteria": ["cost", "speed", "quality"],
  "useCase": "general text generation"
});

// Stratejileri getir
access_mcp_resource("prompt-optimizer", "prompt://strategies");
```

### Test ve Doğrulama

```bash
cd mcp-server
node test-setup.js
```

### Özellikler

- ✅ **Backend Entegrasyonu**: API bağlantısı ve otomatik fallback
- ✅ **Mock Data**: Geliştirme için kapsamlı test verisi
- ✅ **Önbellekleme**: Performans için akıllı yanıt önbellekleme
- ✅ **Kimlik Doğrulama**: JWT token desteği
- ✅ **Hata Yönetimi**: Zarif hata kurtarma ve loglama
- ✅ **Doğrulama**: Zod şemaları ile giriş doğrulaması

> **Detaylı Dokümantasyon**: [`mcp-server/README.md`](mcp-server/README.md)
> **Kullanım Rehberi**: [`MCP-SERVER-USAGE.md`](MCP-SERVER-USAGE.md)

---

## �️ Proje Yapısı

```bash
src/
├── assets/               # Logo ve statik dosyalar
├── components/
│   ├── Auth/             # Kimlik doğrulama bileşenleri
│   ├── Chat/             # Chat ve session yönetimi
│   ├── Common/           # Spinner, Hata mesajı vb.
│   ├── Layout/           # Header, Footer, Sayfa yapısı
│   └── PromptOptimizer/  # Ana optimizasyon arayüzü
├── contexts/             # React Context providers
├── data/                 # JSON veri dosyaları
├── hooks/                # Özel React hooks
├── locales/              # Çok dilli destek
├── pages/                # Route'a bağlı sayfalar
├── services/             # API işlemleri
├── store/                # Global state (Zustand)
├── utils/                # Sabitler ve yardımcılar
├── App.js
├── index.js
└── .env

mcp-server/               # MCP Server
├── index.js              # Ana MCP sunucu dosyası
├── package.json          # Node.js bağımlılıkları
├── .env                  # MCP sunucu yapılandırması
├── README.md             # Detaylı MCP dokümantasyonu
└── test-setup.js         # Doğrulama script'i

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
