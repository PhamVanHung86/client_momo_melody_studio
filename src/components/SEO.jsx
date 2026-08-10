import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, image, url, structuredData }) => {
  const siteName = "momo's melody studio";
  const defaultDesc =
    "Những món đồ handmade nhỏ xinh được làm thủ công tỉ mỉ — phone charms, keychain, stickers, postcards & mail club.";
  const defaultImage = "/og-image.jpg";
  const siteUrl = "https://momomelody.vn";

  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const metaDesc = description || defaultDesc;
  const metaImage = image || defaultImage;
  const metaUrl = url ? `${siteUrl}${url}` : siteUrl;

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={metaUrl} />

      {/* Open Graph (Facebook, Zalo) */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="vi_VN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaImage} />

      {/* Extra */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content={siteName} />
      <meta
        name="keywords"
        content="handmade, phone charm, keychain, sticker, postcard, mail club, momo melody studio"
      />

      {/* 🔍 Structured Data (schema.org) — giúp Google hiển thị rich
          snippet (giá, rating, tình trạng còn hàng...) ngay trên kết quả
          tìm kiếm thay vì chỉ có link + mô tả thường. */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
