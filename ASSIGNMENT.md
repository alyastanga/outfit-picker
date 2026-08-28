# Outfit Try-On Web App — Assignment Brief

**Role:** Software developer, ~30 minutes, limited web experience  
**Goal:** Upload clothing images → show a 2D mannequin wearing them  
**Approach:** Ship a **layer compositing MVP**, not real AI try-on.

> Note: Cursor time-limited goals (e.g. `/goal 30m`) are not supported yet. Treat the half-hour as a personal ship deadline, not a goal timer.

---

## 1. 30-minute strategy

| Ship (must finish) | Skip (say “later”) |
|---|---|
| Single-page app: upload → categorize → wear on mannequin | Real AI try-on / pose transfer / body segmentation |
| Fixed 2D mannequin silhouette + slot overlays (top, bottom, dress, shoes, accessory) | Photoreal fabric drape / lighting match |
| Simple UI: wardrobe list + worn preview | Auth, accounts, cloud sync, sharing |
| Local storage (browser) for a few items | Backend, DB, CDN, payments |
| Optional background removal if it already works | Perfect cutouts, size calibration |
| One happy path with example items | Edge-case polish, a11y audit |

**Rule:** Demo one outfit on screen. Document what is composited vs what a real model would need.

**Time box:** ~10 min UI · ~15 min mannequin + wear slots · ~5 min samples + notes.

---

## 2. MVP feature list

### Must
- Upload clothing image (PNG/JPG)
- Assign category: top | bottom | dress | shoes | accessory
- Show fixed 2D mannequin
- Toggle items on/off in worn slots (dress vs top+bottom mutual exclusion)
- Persist wardrobe locally
- Ship with example items so demo works without uploads

### Should
- Predefined slot scale/position per category
- Remove / mark unavailable
- Height / body-type sliders
- Optional background removal for cleaner overlays

### Won’t (this deadline)
- Photoreal AI try-on on a real person photo
- Multi-user, login, social feed
- Size recommendation / fit scoring
- Video, AR
- Production deployment polish

---

## 3. Model requirements & features

### A. Compositing MVP (what we ship)

| Need | Why |
|---|---|
| Clothing image (front-facing preferred) | Source for overlay |
| Category / slot | Where to place on mannequin |
| Transparent or cut-out garment (or BG remove) | Looks wearable, not a rectangle |
| Fixed mannequin template | Anchor for layers |
| Slot layout rules (z-index, scale, y-offset) | Top above bottom, shoes at feet |

**Not needed for MVP:** body mesh, pose keypoints, lighting model, fabric physics, user photo.

### B. Real AI try-on (future)

| Input | Purpose |
|---|---|
| Person image (or body mesh + pose) | Target to dress |
| Garment image(s), ideally flat-lay / ghost mannequin | Source clothing |
| Garment type / mask | Warping and occlusion |
| Pose / keypoints (or DensePose) | Align sleeves, legs, torso |
| Optional: height, measurements, view angle | Fit and proportions |

| Model capability | Output |
|---|---|
| Person / garment segmentation | Clean masks |
| Pose estimation | Alignment |
| Warping / VITON-style or diffusion try-on | Dressed image |
| Occlusion handling | Believable composite |

**Honest line:** MVP = layered 2D dress-up. Real try-on = vision model + person photo + compute/API cost.

---

## 4. Clarifying questions

1. Target: dress-up mannequin, or try clothes on a **real user photo**?
2. Quality bar: “looks like a game” OK, or must look photoreal?
3. Garment rules: front-only? Must images have transparent backgrounds?
4. Slots: which categories? Does dress replace top+bottom?
5. Character: one fixed body, or adjustable height/body type?
6. Data: local-only, or save outfits to a server?
7. Scale: how many items / users in the first demo?
8. Deliverable: working demo, source repo, or both + write-up?
9. Constraints: offline? browser-only? any banned third-party APIs?
10. Success metric: upload 1 top + 1 bottom and see them on the figure in &lt;30s?

---

## 5. How to use Cursor subagents

| Subagent | Job | Prompt focus |
|---|---|---|
| **explore** | Audit repo fast | Map upload → wardrobe → worn → mannequin; list done vs missing for 2D MVP |
| **generalPurpose** | Implement features | One feature per agent: uploader, slots, mannequin layout, docs |
| **shell** | Run / build / fix | `npm install`, `npm run dev`, `npm run build`; paste errors back |

### Parallelize
1. **explore** inventories App, wardrobe, mannequin, store.
2. Parallel **generalPurpose** agents: UI, mannequin compositing, assignment docs.
3. **shell** after merges: install → dev → build; fix blockers only.

### Tips
- Give each agent **file paths + acceptance check**.
- Prefer compositing; forbid “add AI API” unless required.
- One agent owns shared store/types to avoid edit conflicts.

---

## 6. Demo script (this repo)

```bash
npm install
npm run dev
```

1. Open the local URL.
2. Click **Add example clothes** (or upload your own photos).
3. Tap a top + bottom (or a dress) and shoes.
4. Adjust height / body type if desired.
5. Point out: this is **2D slot compositing**, not generative try-on.
