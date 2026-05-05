export type Channel = {
  id: string
  name: string
  price: string
  cpc?: number
  cpm?: number
  fixedCost?: number
  eldin?: boolean
  badge?: string
  badgeType?: 'green' | 'orange' | 'blue'
  desc: string
}

export type ChannelGroup = {
  label: string
  channels: Channel[]
}

export const CHANNEL_GROUPS: ChannelGroup[] = [
  {
    label: 'Rekommenderade',
    channels: [
      {
        id: 'meta_reel',
        name: 'Meta: Reel',
        price: '7,45 kr/klick',
        cpc: 7.45,
        eldin: true,
        badge: 'Bäst räckvidd',
        badgeType: 'green',
        desc: 'Vertikalt videoformat i Facebooks och Instagrams flöde. Hög engagemangsgrad och 26% lägre CPC än vanliga inlägg. Passar rekryteringsfilm väldigt bra.',
      },
      {
        id: 'meta_post',
        name: 'Meta: Inlägg',
        price: '1,45 kr/klick',
        cpc: 1.45,
        eldin: true,
        badge: 'Lägst pris',
        badgeType: 'orange',
        desc: 'Vanligt bildformat eller kort video i flödet. Lägst klickpris av alla digitala kanaler — perfekt för att maximera antal ansökningar inom budget.',
      },
      {
        id: 'na_native',
        name: 'NA: Native-annons',
        price: '14 500 kr (fast)',
        fixedCost: 14500,
        eldin: true,
        badge: 'Lokal',
        badgeType: 'blue',
        desc: 'Sponsrat artikelformat i Nerikes Allehanda. Bygger förtroende och når en lokal Örebro-publik som inte nås via sociala medier.',
      },
    ],
  },
  {
    label: 'Övriga digitala kanaler',
    channels: [
      {
        id: 'meta_story',
        name: 'Meta: Story',
        price: '14,50 kr/klick',
        cpc: 14.5,
        desc: 'Helskärmsformat mellan Stories på Facebook och Instagram. Högt synlighetsformat men högre CPC — funkar bäst som komplement.',
      },
      {
        id: 'tiktok',
        name: 'TikTok: In-Feed',
        price: '10,70 kr/klick',
        cpc: 10.7,
        desc: 'Native-videoannons i TikToks flöde. Når yngre målgrupper med säljdriv. Kräver att filmen känns organisk och autentisk.',
      },
      {
        id: 'youtube_shorts',
        name: 'YouTube: Shorts',
        price: '~4–8 kr/1 000 vis',
        cpm: 6,
        desc: 'Vertikalt videoformat i YouTubes Shorts-flöde. Bred räckvidd och låg CPM. Bra för varumärkeskännedom men lägre direktkonvertering än Meta.',
      },
      {
        id: 'snapchat',
        name: 'Snapchat: Video Ad',
        price: '~9 kr/klick',
        cpc: 9.0,
        desc: 'Helskärmsvideoannons i Snapchats flöde. Når 18–30-åringar men har enligt vår erfarenhet inte presterat bra för Konceptas rekrytering.',
      },
      {
        id: 'linkedin',
        name: 'LinkedIn: Trafik',
        price: '85,00 kr/klick',
        cpc: 85.0,
        desc: 'Sponsrat inlägg till yrkesverksamma. Mycket högt CPC — mest relevant för seniora säljprofiler.',
      },
      {
        id: 'tv',
        name: 'Regional-TV',
        price: 'Från ~40 000 kr',
        fixedCost: 40000,
        desc: 'Annonsering i regionala TV-kanaler. Brett videoformat med hög lokal räckvidd. Pris varierar beroende på kanal och sändningstid.',
      },
    ],
  },
]

export const CHANNELS = CHANNEL_GROUPS.flatMap(g => g.channels)
export const BUDGET_CAP = 20000
