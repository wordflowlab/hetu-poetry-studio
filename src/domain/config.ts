export const config = {
  "fields": {
    "poem": "poems",
    "stanza": "stanzas",
    "line": "lines",
    "profile": "profiles",
    "variant": "variants",
    "note": "notes"
  },
  "defaults": {
    "brief": "",
    "poems": [],
    "stanzas": [],
    "lines": [],
    "profiles": [],
    "variants": [],
    "notes": [],
    "imports": []
  },
  "tabs": [
    "诗集阅读",
    "音韵与形式",
    "用典依据",
    "逐句比较",
    "诗集交付"
  ]
} as const;
