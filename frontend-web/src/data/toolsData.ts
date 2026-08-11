export type ToolEntry = {
  label: string
  shortLabel: string
  icon: string
  description: string
  scanLogs: string[]
  data: Record<string, string | string[] | boolean | number>
}

export const TOOLS: Record<string, ToolEntry> = {
  account_history: {
    label: 'Account History', shortLabel: 'ACCT HIST', icon: '◉',
    description: 'Scan creation date, username history, and post frequency patterns.',
    scanLogs: ['Connecting to social graph API...','Fetching account metadata...','Resolving username change history...','Analyzing posting frequency...','Cross-referencing flagged accounts...'],
    data: { account_age: '3 days', prev_usernames: ['@cryptopump2021','@forex_alpha_99'], post_frequency: '47 posts in 72 hours', follower_gain_rate: '+823,000 in 48 hours', account_type: 'Public', suspicious_pattern: 'DETECTED — coordinated inauthentic behavior' },
  },
  domain_authority: {
    label: 'Domain Authority', shortLabel: 'DOMAIN', icon: '◈',
    description: 'Check source domain trust score, category, and related network.',
    scanLogs: ['Querying domain reputation index...','Fetching OSINT classification data...','Resolving related domain network...','Checking SSL certificate chain...'],
    data: { domain: 'climatewatcher.net', trust_score: '12 / 100', trust_category: 'VERY LOW', classification: 'Known Misinformation Network', registered: '2026-08-03', related_domains: ['climatehoax.net','geoengineering-truth.org'], ssl_valid: true },
  },
  image_metadata: {
    label: 'Image Metadata', shortLabel: 'IMG META', icon: '◧',
    description: 'Analyze EXIF data, reverse search results, and AI generation signals.',
    scanLogs: ['Extracting EXIF metadata...','Running reverse image search...','Querying AI detection model...','Analyzing noise pattern consistency...','Checking photo forensics database...'],
    data: { generation_tool: 'DALL-E 3', origin: 'AI GENERATED — NOT PHOTOGRAPHIC', authenticity_score: '0.02 / 1.00', exif_data: 'ABSENT — stripped or synthetic', reverse_search_matches: 0, created: '2026-08-05T14:23:11Z', anomalies: ['impossible lighting vectors','blurred horizon seam','noise inconsistency'] },
  },
  whois: {
    label: 'WHOIS Lookup', shortLabel: 'WHOIS', icon: '◌',
    description: 'Query domain registration records and registrant identity.',
    scanLogs: ['Connecting to WHOIS server...','Fetching registration records...','Resolving registrant data...','Checking privacy shield status...'],
    data: { registrar: 'NameCheap Inc.', registered: '2026-08-03', expiry: '2027-08-03', registrant: 'REDACTED FOR PRIVACY', country: 'Seychelles (SC)', status: 'clientTransferProhibited', nameservers: ['ns1.cloudflare.com','ns2.cloudflare.com'] },
  },
  cross_source: {
    label: 'Cross-Source Check', shortLabel: 'X-SOURCE', icon: '◎',
    description: 'Verify the claim across 14 credible news orgs and official sources.',
    scanLogs: ['Querying NASA.gov press releases...','Scanning Reuters archive...','Searching AP News database...','Checking BBC Science & Environment...','Querying Nature journal index...','Aggregating results from 14 sources...'],
    data: { query: '"NASA temperature drop 2.3C solar cycle 2026"', nasa_gov: 'NO MATCHING PRESS RELEASE', reuters: 'NOT FOUND', ap_news: 'NOT FOUND', bbc_science: 'NOT FOUND', nature_journal: 'NOT FOUND', credible_sources: '0 of 14 confirmed', disinfo_site_results: 847 },
  },
  keyword_search: {
    label: 'Keyword Analysis', shortLabel: 'KEYWORDS', icon: '◑',
    description: 'Scan caption for manipulation tactics and credibility red flags.',
    scanLogs: ['Tokenizing caption text...','Running NLP manipulation classifier...','Flagging urgency language patterns...','Scoring credibility indicators...'],
    data: { flagged_phrases: ['"BREAKING"','"SUPPRESSING"','"Share before they take it down"'], manipulation_tactics: ['False urgency','Suppression narrative','Unverified stats','No byline/author'], sentiment: 'HIGHLY ALARMIST', credibility_risk_score: '9.1 / 10.0', recommendation: 'HIGH PROBABILITY — FABRICATED CONTENT' },
  },
}

export const GROUND_TRUTH = {
  verdict: 'fabricated' as const,
  explanation: 'This post is entirely fabricated. The account was created just 3 days ago and previously operated as a crypto pump scheme under @cryptopump2021. NASA has issued no such data — zero of 14 major credible sources corroborate this claim. The image was generated using DALL-E 3 with all EXIF metadata stripped. The domain "climatewatcher.net" is a 3-day-old site registered in the Seychelles, linked to a known misinformation network.',
  primary_signal: 'AI-generated image with stripped EXIF + 3-day-old account with prior fraudulent history + zero corroboration from 14 major news organizations including NASA.gov itself.',
}
