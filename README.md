# McGovern Estates — Website

**mcgovernestates.ie** · Greystones, Co. Wicklow

---

## Folder Structure

```
mcgovern-estates/
├── index.html          ← Homepage (the only page so far)
├── css/
│   └── styles.css      ← All visual styling — colours, fonts, layout
├── js/
│   └── main.js         ← All interactive behaviour — carousel, menu, listings
├── images/             ← Local images (hero photos etc.)
└── README.md           ← This file
```

---

## How to update property listings

Open `js/main.js` and find the `properties` array near the top of the file.

To **add a listing**, copy an existing entry and paste it at the **top** of the array, then update the fields:

```js
{
  id: 5,                          // increment the number
  name: "12 Burnaby Park",
  address: "Greystones, Co. Wicklow",
  price: "€525,000",
  status: "For Sale",             // or "Sale Agreed"
  beds: 3,
  baths: 2,
  size: "110 m²",
  link: "https://www.mcgovernestates.ie/residential/brochure/...",
  image: "https://photos-a.propertyimages.ie/..."
},
```

To **remove a listing**, delete its entire `{ ... },` block.

The **first listing in the array** always appears as the large featured card.

---

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Live site — only merge here when tested and ready |
| `dev`  | Day-to-day development and testing |

**Workflow:**
1. Make changes on `dev`
2. Preview locally with VS Code Live Server
3. When happy → merge `dev` into `main`
4. Site updates live

---

## Local development

1. Install [VS Code](https://code.visualstudio.com/)
2. Install the **Live Server** extension
3. Open the `mcgovern-estates` folder in VS Code
4. Click **"Go Live"** in the bottom right
5. Preview at `http://localhost:5500`

---

## Planned pages

- [ ] `/properties` — Full listings page with search/filter
- [ ] `/about` — Team and company history  
- [ ] `/valuations` — Valuation request page
- [ ] `/contact` — Contact form
- [ ] `/admin` — Staff listing uploader (future)
