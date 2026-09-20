# 3D Character — Portfolio Hero

A single-page Three.js scene showing the rigged caricature bust (built in
Blender from the Hunyuan3D-generated mesh). The head/neck follow the mouse
cursor in real time, and a subtle breathing/sway idle loop plays underneath it.

## Files

- `index.html` — the whole site (Three.js loaded from a CDN via import map, no build step)
- `character.glb` — the rigged, textured model: **400k triangles, Draco-compressed, 2.7 MB**,
  with base colour (2048), normal (2048) and packed metallic/roughness (1024) maps
- `character_rigged.blend` — the Blender source for the above (decimate + rig + idle action)

### Why Draco matters here

An earlier build decimated the mesh 95.5% (67k tris) and dropped the normal map
just to get the file under 5 MB. That is what made the surface look faceted and
washed out — the fine detail lives in the normal map. With
`export_draco_mesh_compression_enable=True` the geometry compresses roughly
10×, so 400k triangles *and* all three textures now fit in **less** space than
the stripped-down 67k version did.

Because the file uses `KHR_draco_mesh_compression` (listed in
`extensionsRequired`), the page **must** register a `DRACOLoader` — it is wired
up in `index.html` and pulls the decoder from the jsDelivr CDN. Swapping in a
non-Draco `.glb` still works; the loader just won't need it.

## Run it locally

Browsers block `fetch()` on `file://` pages, so `character.glb` won't load if
you just double-click `index.html`. Serve the folder instead:

```bash
cd portfolio-3d-character
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Publish on GitHub Pages

```bash
cd portfolio-3d-character
git init
git add .
git commit -m "3D character portfolio hero"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Then in the repo on GitHub: **Settings → Pages → Source → Deploy from branch →
main / (root)**. The site will be live at
`https://<your-username>.github.io/<repo-name>/` a minute or two later.

## Notes

- The model's `Head` and `Neck` bones are rotated live in JS to track the
  mouse — that part is not a baked Blender animation, it happens on every frame.
- The only baked animation clip is a ~3.75s looping idle sway (torso only),
  played automatically via `THREE.AnimationMixer`.
- To swap in a different model later, replace `character.glb` and make sure
  it still has bones named `Head` and `Neck` (or edit the names in
  `index.html`'s `updateHeadLook()`/traverse section to match your rig).

## Performance notes (read before tweaking the particles)

Point sizes are authored in **world units** and converted to device pixels by
`pointScale()` (`0.5 * canvasHeight / tan(fov/2)`). Do not go back to the
common `size * (300.0 / -mvPosition.z)` snippet from the three.js examples —
that constant assumes a scene hundreds of units across. This scene is ~1 unit
tall with the camera 3.3 units away, so it produced ~500px sprites and tens of
billions of fragments per frame.

The canvas is **full-bleed**, not a right-hand panel. A part-width canvas
clipped the particle dust and left a hard vertical seam down the page; the
character is offset to the right in 3D instead (`layoutModel()`), which scales
with aspect ratio and re-centres on narrow screens.

`history.scrollRestoration` is forced to `manual` — otherwise a reload drops
you back mid-page and the assembly intro plays off screen.

Other things holding the frame rate together:

- the character material is **opaque, `FrontSide`** — transparency on a
  self-overlapping mesh sorts per object, not per triangle, which punched
  see-through "holes" through the face and doubled fragment work
- particles whose alpha is below 0.008 are pushed outside clip space in the
  vertex shader, so a fully assembled character costs nothing
- rendering stops entirely once the hero scrolls out of view
- `adaptQuality()` walks the pixel ratio down if average frame time goes past
  ~24 ms, and back up if there is headroom

## Scroll-shatter effect

On load, the character lands as scattered pieces that fly together and
assemble (a ~1.6s intro, `INTRO_DURATION` in `index.html`). After that,
scrolling past the hero explodes it back apart into its individual triangles
(via a custom vertex shader, `buildShardMesh()`), and it's **fully
reversible** — scroll down to shatter, scroll back up and it reassembles.
The transition happens over the `#shatter-space` div (120vh by default);
make it taller/shorter to slow down or speed up the effect.

## Work section

Below the shatter zone is a filterable grid — **Art / Poster Design / UI
Design / 3D Design** — driven by `data-cat` attributes on `.work-card`
elements. Everything except the two 3D Design cards is a placeholder right
now (dashed box, "Add ... here"): swap the placeholder `<div>` for an
`<img src="./assets/your-file.jpg">` once you've picked which pieces from
your Figma file (or elsewhere) should represent each category — I didn't
want to guess which of your ~360 Figma frames you'd want featured.

There's also a stray `Untitled.blend` (5.7 MB) sitting in this folder that I
didn't put there — worth checking whether that's something you want to keep
before pushing to GitHub.

### Getting the rest of the images out of Figma

Two Art placeholders are now real exports (`roses4.png`, `birds1.png`). The
Figma export tool kept timing out / hitting a size limit on the bigger
frames (posters, app screens), so those are still placeholders. Fastest way
to fill them in: in Figma, select a frame → Export panel (bottom right) →
PNG or JPG → export, then drop the file into `assets/` and swap it into the
matching `<img src="./assets/...">` in `index.html`.
