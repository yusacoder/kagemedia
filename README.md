# KAGE MEDIA

KAGE MEDIA için sıfır bağımlılıklı, mobil öncelikli resmi profil sitesi. İçerik ve görünüm ayarları kökteki `data.json` dosyasından yönetilir.

## Yerelde çalıştırma

Site statik dosyalardan oluşur. `index.html` dosyasını bir statik web sunucusu üzerinden açın; örneğin:

```sh
npx serve .
```

İnternet bağlantısı yalnızca Google Fonts ve `data.json` içindeki dış görseller kullanılıyorsa gerekir.

## İçeriği düzenleme

- Profil adı, kullanıcı adı, avatar, doğrulama durumu ve açıklama: `profile`
- Arka plan fotoğrafı, bulanıklık, karartma, doygunluk ve konum: `background`
- Renkler: `theme`
- Menü ve sayfa metinleri: `navigation` ve `home`
- Sosyal medya ve diğer bağlantılar: `accounts`
- Telif ve alt bilgi bağlantısı: `footer`

Hesaplar `accounts` dizisine eklenir. Her öğe `id`, `platform`, `url` ve isteğe bağlı `username`, `description`, `icon`, `enabled`, `order` ve `verified` alanlarını alabilir. Yalnızca `enabled: true` olan ve geçerli bir `http`/`https` adresi içeren bağlantılar gösterilir. `icon` için `instagram`, `tiktok`, `youtube`, `discord`, `x`, `telegram`, `website` veya `link` kullanın.

JSON değişiklikleri açık sayfaya en geç beş saniye içinde yansır. Profil fotoğrafı boş ya da yüklenemezse harfli yedek avatar gösterilir. Hesap listesi boşsa bağlantı uydurmak yerine boş durum mesajı gösterilir.
