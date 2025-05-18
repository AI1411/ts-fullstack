// カテゴリー情報
export const categories = [
  {
    id: 1,
    slug: 'fashion',
    name: 'ファッション',
    description: 'トレンドのアパレルやアクセサリー',
    imageUrl:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    href: '/categories/fashion',
  },
  {
    id: 2,
    slug: 'electronics',
    name: 'エレクトロニクス',
    description: '最新のガジェットとテクノロジー',
    imageUrl:
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1501&q=80',
    href: '/categories/electronics',
  },
  {
    id: 3,
    slug: 'home',
    name: 'ホーム＆リビング',
    description: '家具やインテリア、キッチン用品',
    imageUrl:
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    href: '/categories/home',
  },
  {
    id: 4,
    slug: 'sports',
    name: 'スポーツ＆アウトドア',
    description: 'スポーツ用品やアウトドアギア',
    imageUrl:
      'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1626&q=80',
    href: '/categories/sports',
  },
  {
    id: 5,
    slug: 'beauty',
    name: 'ビューティー＆ヘルス',
    description: '化粧品や健康関連商品',
    imageUrl:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
    href: '/categories/beauty',
  },
  {
    id: 6,
    slug: 'kids',
    name: 'キッズ＆ベビー',
    description: '子供用品やベビー用品',
    imageUrl:
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    href: '/categories/kids',
  },
];

// カテゴリー別の商品データ
export const productsByCategory = {
  fashion: [
    {
      id: 101,
      name: 'プレミアムレザーウォレット',
      price: 12800,
      description:
        '高品質な本革を使用した長財布。耐久性と美しさを兼ね備えたデザイン。',
      imageUrl:
        'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    },
    {
      id: 102,
      name: 'オーガニックコットンTシャツ',
      price: 4900,
      description:
        '環境に優しいオーガニックコットン100%使用。肌触りが良く、着心地抜群のTシャツ。',
      imageUrl:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
    },
    {
      id: 103,
      name: 'デザイナーサングラス',
      price: 15800,
      description:
        'UV保護機能付きの高級サングラス。洗練されたデザインでどんなスタイルにもマッチ。',
      imageUrl:
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
    },
    {
      id: 104,
      name: 'カジュアルデニムジャケット',
      price: 9800,
      description:
        '上質なデニム素材を使用したジャケット。カジュアルからセミフォーマルまで幅広く活用できます。',
      imageUrl:
        'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
    },
  ],
  electronics: [
    {
      id: 201,
      name: 'ワイヤレスノイズキャンセリングヘッドフォン',
      price: 32800,
      description:
        '最新のノイズキャンセリング技術を搭載したワイヤレスヘッドフォン。30時間のバッテリー寿命。',
      imageUrl:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 202,
      name: 'スマートウォッチ プロ',
      price: 42800,
      description:
        '健康管理、通知、GPS機能を搭載した最新のスマートウォッチ。防水機能付き。',
      imageUrl:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1399&q=80',
    },
    {
      id: 203,
      name: '4Kウルトラワイドモニター',
      price: 89800,
      description:
        '鮮明な4K解像度と広視野角のウルトラワイドモニター。クリエイティブ作業やゲームに最適。',
      imageUrl:
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 204,
      name: 'ポータブルBluetoothスピーカー',
      price: 18800,
      description:
        '高音質で防水機能付きのポータブルスピーカー。12時間の連続再生が可能。',
      imageUrl:
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1636&q=80',
    },
  ],
  home: [
    {
      id: 301,
      name: 'モダンダイニングテーブルセット',
      price: 128000,
      description:
        'シンプルでモダンなデザインのダイニングテーブルと4脚のチェアセット。高品質な木材を使用。',
      imageUrl:
        'https://images.unsplash.com/photo-1617104678098-de229db51175?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 302,
      name: 'プレミアム寝具セット',
      price: 32800,
      description:
        '高品質なコットン素材を使用した寝具セット。掛け布団カバー、ボックスシーツ、枕カバー2枚のセット。',
      imageUrl:
        'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 303,
      name: 'スマートLED照明システム',
      price: 24800,
      description:
        'スマートフォンで操作できるLED照明システム。色や明るさを自由に調整可能。',
      imageUrl:
        'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 304,
      name: '高級キッチンナイフセット',
      price: 42800,
      description:
        'プロ仕様の高級キッチンナイフ6点セット。ステンレス製の刃と人間工学に基づいたハンドル。',
      imageUrl:
        'https://images.unsplash.com/photo-1593618998160-e34014e67546?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
  ],
  sports: [
    {
      id: 401,
      name: 'プロフェッショナルヨガマット',
      price: 8800,
      description:
        '高密度のエコフレンドリー素材を使用したヨガマット。滑り止め加工で安全に使用できます。',
      imageUrl:
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 402,
      name: '軽量ハイキングバックパック',
      price: 15800,
      description:
        '耐水性と耐久性を備えた軽量ハイキングバックパック。多数のポケットと収納スペースを装備。',
      imageUrl:
        'https://images.unsplash.com/photo-1445116572660-236099ec97a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    },
    {
      id: 403,
      name: 'スマートフィットネストラッカー',
      price: 18800,
      description:
        '心拍数、歩数、睡眠の質などを追跡するフィットネストラッカー。防水機能付き。',
      imageUrl:
        'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 404,
      name: 'プロフェッショナルテニスラケット',
      price: 24800,
      description:
        '軽量で操作性に優れたプロ仕様のテニスラケット。振動吸収システム搭載。',
      imageUrl:
        'https://images.unsplash.com/photo-1617083934551-dba3a9f65c76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80',
    },
  ],
  beauty: [
    {
      id: 501,
      name: 'オーガニックスキンケアセット',
      price: 12800,
      description:
        '自然由来の成分を使用したスキンケアセット。クレンザー、化粧水、美容液、保湿クリームのセット。',
      imageUrl:
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 502,
      name: 'プロフェッショナルヘアドライヤー',
      price: 22800,
      description:
        'イオンテクノロジー搭載の高性能ヘアドライヤー。髪の傷みを抑えながら素早く乾かします。',
      imageUrl:
        'https://images.unsplash.com/photo-1522338140262-f46f5913618a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80',
    },
    {
      id: 503,
      name: 'ラグジュアリーバスセット',
      price: 9800,
      description:
        '高級入浴剤、バスボム、アロマキャンドル、ボディスクラブのセット。リラックスタイムを演出します。',
      imageUrl:
        'https://images.unsplash.com/photo-1570213489059-0aac6626cade?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 504,
      name: 'プレミアム化粧ブラシセット',
      price: 15800,
      description:
        '高品質な合成毛を使用した化粧ブラシ12本セット。専用ケース付き。',
      imageUrl:
        'https://images.unsplash.com/photo-1596462118800-453aa5a01759?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
    },
  ],
  kids: [
    {
      id: 601,
      name: '木製知育玩具セット',
      price: 8800,
      description:
        '子供の創造性と問題解決能力を育む木製知育玩具のセット。安全な素材を使用。',
      imageUrl:
        'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1475&q=80',
    },
    {
      id: 602,
      name: 'キッズ用防水レインコート',
      price: 4800,
      description:
        '明るい色の可愛いデザインの子供用レインコート。防水性と通気性を兼ね備えています。',
      imageUrl:
        'https://images.unsplash.com/photo-1545048702-79362596cdc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 603,
      name: 'ベビーモニター',
      price: 15800,
      description:
        '高解像度カメラと双方向通話機能を搭載したベビーモニター。スマートフォンと連携可能。',
      imageUrl:
        'https://images.unsplash.com/photo-1586105449897-20b5efeb3233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
      id: 604,
      name: 'キッズ用スポーツセット',
      price: 6800,
      description:
        '子供向けのサッカーボール、バスケットボール、フリスビーのセット。屋外活動を促進します。',
      imageUrl:
        'https://images.unsplash.com/photo-1535572290543-960a8046f5af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
  ],
};
