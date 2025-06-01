export const tr = {
  // Common
  common: {
    loading: 'Yükleniyor...',
    error: 'Hata',
    success: 'Başarılı',
    cancel: 'İptal',
    save: 'Kaydet',
    delete: 'Sil',
    edit: 'Düzenle',
    close: 'Kapat',
    back: 'Geri',
    next: 'İleri',
    submit: 'Gönder',
    search: 'Ara',
    filter: 'Filtrele',
    sort: 'Sırala',
    refresh: 'Yenile',
    yes: 'Evet',
    no: 'Hayır',
    ok: 'Tamam',
    details: 'Detaylar',
    showDetails: 'Detayları Gör',
    hideDetails: 'Detayları Gizle',
    language: 'Dil',
  },

  // Navigation
  navigation: {
    home: 'Ana Sayfa',
    chat: 'Chat',
    models: 'Modeller',
    about: 'Hakkında',
  },

  // Home Page
  home: {
    title: 'Arkegu AI',
    subtitle: 'Prompt Optimizasyon Platformu',
    description: 'Yapay zeka modellerinden maksimum verim alın. Akıllı prompt optimizasyonu ile daha etkili sonuçlar elde edin.',
    startButton: 'Hemen Başla',
    exploreFeatures: 'Özellikleri Keşfet',
    stats: {
      models: 'AI Modeli',
      strategies: 'Strateji',
      responseTime: 'En Hızlı Yanıt',
    },
    features: {
      title: 'Özellikler',
      subtitle: 'Arkegu AI ile prompt optimizasyonunun gücünü keşfedin',
      smartOptimization: {
        title: 'Akıllı Optimizasyon',
        description: 'Yapay zeka ile prompt\'larınızı otomatik olarak optimize edin.',
        details: [
          'Bağlam analizi ve otomatik iyileştirme',
          'Dil bilgisi ve anlam düzeltmeleri',
          'Hedef odaklı prompt yapılandırması',
          'Çoklu optimizasyon seçeneği'
        ],
      },
      multiModel: {
        title: 'Multi-Model Desteği',
        description: 'Arkegu AI ile 7+ farklı AI modeliyle çalışın, en iyi sonuçları alın.',
        details: [
          'GPT-4, GPT-4o ve GPT-4o-mini',
          'DeepSeek Chat ve Reasoning modelleri',
          'Grok-2 ve Grok-3 beta versiyonları',
          'O3-mini yeni nesil model desteği'
        ],
      },
      strategies: {
        title: '4 Farklı Strateji',
        description: 'İhtiyacınıza göre hız, kalite, maliyet veya konsensüs stratejisi seçin.',
        details: [
          'Quality: En kaliteli ve detaylı yanıtlar',
          'Speed: 3 saniyeden kısa sürede yanıt',
          'Consensus: Çoklu model karşılaştırması',
          'Cost-Effective: Bütçe dostu çözümler'
        ],
      },
      analytics: {
        title: 'Gelişmiş Analitik',
        description: 'Kullanılan modeller, işlem süresi ve token kullanımını takip edin.',
        details: [
          'Gerçek zamanlı performans metrikleri',
          'Model karşılaştırma ve maliyet analizi',
          'Yanıt kalitesi değerlendirmesi',
          'Kullanım istatistikleri ve raporlama'
        ],
      },
    },
    cta: {
      title: 'Hemen Başlayın',
      description: 'Ücretsiz denemeye başlayın ve AI\'nın gücünü keşfedin',
      button: 'Ücretsiz Dene',
    },
  },

  // Models Page
  models: {
    title: 'AI Modelleri',
    subtitle: 'Kullanılabilir tüm AI modellerini keşfedin',
    types: {
      fast: {
        name: 'Hızlı',
        description: 'En hızlı yanıt süreleri',
      },
      balanced: {
        name: 'Dengeli',
        description: 'Hız ve kalite dengesi',
      },
      advanced: {
        name: 'Gelişmiş',
        description: 'En yüksek kalite',
      },
      reasoning: {
        name: 'Muhakeme',
        description: 'Karmaşık problemler için',
      },
    },
    labels: {
      active: 'Aktif',
      cost: 'Maliyet',
      priority: 'Öncelik Seviyesi',
    },
  },

  // About Page
  about: {
    title: 'Hakkında',
    subtitle: 'Yapay zeka teknolojilerini kullanarak prompt optimizasyonu yapan, çoklu model desteği sunan yenilikçi bir platform.',
    mission: {
      title: 'Misyonumuz',
      description1: 'Arkegu AI, kullanıcıların AI modellerinden en verimli şekilde yararlanmalarını sağlamak için geliştirilmiş bir platformdur.',
      description2: 'Amacımız, karmaşık AI teknolojilerini herkes için erişilebilir ve kullanımı kolay hale getirmektir.',
    },
    features: [
      'Multi-model AI desteği ile en iyi sonuçları alın',
      'Prompt optimizasyonu ile daha etkili sorgular',
      '4 farklı strateji ile ihtiyacınıza uygun çözümler',
      'Gerçek zamanlı yanıt ve işlem takibi',
      'Modern ve kullanıcı dostu arayüz',
      'Güvenli ve hızlı API entegrasyonu',
    ],
    technologies: {
      title: 'Teknolojilerimiz',
      stack: {
        backend: {
          title: 'Backend',
          tech: '.NET 8, C#, RESTful API',
        },
        ai: {
          title: 'AI Models',
          tech: 'GPT-4, Gemini, DeepSeek, Grok',
        },
        frontend: {
          title: 'Frontend',
          tech: 'React, Material-UI, Framer Motion',
        },
        security: {
          title: 'Security',
          tech: 'HTTPS, Bearer Auth, CORS',
        },
      },
    },
    contact: {
      title: 'İletişim',
      description: 'Sorularınız veya önerileriniz için bizimle iletişime geçin',
      email: 'info@arkegu.ai',
    },
  },

  // Chat Page
  chat: {
    optimizationType: 'Optimizasyon Tipi',
    strategy: 'Strateji',
    inputPlaceholder: {
      initial: 'Optimize etmek istediğiniz prompt\'u yazın...',
      continue: 'Mesajınızı yazın veya yeni bir prompt girin...',
    },
    buttons: {
      optimize: 'Optimize Et',
      send: 'Gönder',
      newChat: 'Yeni Sohbet',
    },
    emptyState: {
      title: 'Arkegu AI\'ya Hoş Geldiniz',
      description: 'Prompt\'larınızı optimize etmek için aşağıdaki alana yazın ve gönder butonuna tıklayın.',
    },
    messages: {
      user: 'Sen',
      assistant: 'Arkegu AI',
      thinking: 'Düşünüyor...',
      error: 'Bir hata oluştu. Lütfen tekrar deneyin.',
    },
  },

  // Optimization Types
  optimizationTypes: {
    clarity: {
      name: 'Netlik',
      description: 'Daha açık ve anlaşılır',
    },
    creativity: {
      name: 'Yaratıcılık',
      description: 'Daha yaratıcı ve özgün',
    },
    conciseness: {
      name: 'Özlülük',
      description: 'Daha kısa ve öz',
    },
    detail: {
      name: 'Detay',
      description: 'Daha detaylı ve kapsamlı',
    },
  },

  // Strategies
  strategies: {
    quality: {
      name: 'Quality',
      description: 'En yüksek kalite',
    },
    speed: {
      name: 'Speed',
      description: 'En hızlı yanıt',
    },
    consensus: {
      name: 'Consensus',
      description: 'Çoklu model uzlaşısı',
    },
    costEffective: {
      name: 'Cost-Effective',
      description: 'Maliyet odaklı',
    },
  },

  // Footer
  footer: {
    copyright: '© 2024 Arkegu AI. Tüm hakları saklıdır.',
    builtWith: 'Built with',
    and: 'and',
  },

  // Error Messages
  errors: {
    general: 'Bir hata oluştu',
    network: 'Ağ bağlantısı hatası',
    server: 'Sunucu hatası',
    validation: 'Doğrulama hatası',
    notFound: 'Bulunamadı',
    unauthorized: 'Yetkisiz erişim',
    forbidden: 'Erişim engellendi',
    timeout: 'İstek zaman aşımına uğradı',
  },

  // Success Messages
  success: {
    saved: 'Başarıyla kaydedildi',
    updated: 'Başarıyla güncellendi',
    deleted: 'Başarıyla silindi',
    sent: 'Başarıyla gönderildi',
  },
};
