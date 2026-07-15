# React Pokémon — Build-It-Yourself Guide

A step-by-step guide to rebuild this app from an empty Vite project **without a tutor**.
Everything here is drawn from what we actually built and every bug we actually hit.

**How to use this guide:**
1. Read a phase's **Goal** and **Steps** and try to write the code yourself first.
2. Only if you're stuck, look at **✅ What right looks like** — that's your reference for "correct."
3. Read **Why it works** to understand the underneath (this is the part that makes you an engineer, not a copy-paster).
4. Hit the **Checkpoint** before moving on. If it doesn't match, check the **Debugging Playbook** at the bottom.

**What you're building:** a page with a button that fetches a random Pokémon (name, type/s, image) from a public API, plus a second button that finds 5 other Pokémon of the same type — all with loading and error handling, and styled with plain CSS.

---

## The tools you're learning

| Tool / Concept | What it does | Where it shows up |
|---|---|---|
| **Vite** | Dev server + build tool for React | `npm run dev`, port 5173 |
| **React** | Builds the UI from components + state | the whole `App.jsx` |
| **`useState`** | Remembers values across re-renders | `pokemon`, `similar`, `error`, `loading` |
| **Components + props** | Reusable UI pieces that take inputs | `PokemonCard` |
| **axios** | Makes HTTP requests to the API | every `axios.get(...)` |
| **async/await** | Waits for network responses without freezing | inside the handlers |
| **`Promise.all`** | Runs multiple requests in parallel | fetching the 5 similar |
| **try/catch/finally** | Handles errors instead of crashing | both handlers |
| **PokeAPI** | The free data source | `https://pokeapi.co/api/v2/...` |
| **Browser DevTools** | Inspect data + read errors | Console tab (Cmd+Option+J) |
| **Plain CSS + flexbox** | Styles + layout | `App.css` |

---

## Phase 0 — Setup and running the dev server

**Goal:** get a blank React app running in the browser.

**Steps:**
1. Create the project (if starting fresh): `npm create vite@latest react-pokemon -- --template react`
2. `cd react-pokemon` — **you must be inside this folder** for npm to work.
3. `npm install` — downloads React, Vite, etc. into `node_modules`.
4. `npm install axios` — adds the HTTP library you'll use.
5. `npm run dev` — starts the dev server. Open the `Local:` URL it prints (`http://localhost:5173/`).

**Why it works:**
- `npm run dev` reads the `"dev"` script from `package.json`. Vite templates name their dev command `dev` (not `start`).
- npm looks for `package.json` in your **current** directory and does not search subfolders. Run it from the wrong folder and you get `ENOENT: no such file or directory ... package.json`.

**Checkpoint:** the default Vite + React starter page loads at `localhost:5173`. Leave `npm run dev` running in its terminal — it hot-reloads every time you save.

> 🐛 **Gotcha we hit:** running `npm run dev` from the parent folder (`14JUL/`) instead of `14JUL/react-pokemon/` → `ENOENT ... package.json`. Fix: `cd` into the project folder first. Run `pwd` to confirm where you are.

---

## Phase 1 — Fetch and display ONE random Pokémon image

**Goal:** click a button → get a random Pokémon → show its sprite.

**Steps:**
1. In `src/App.jsx`, import `useState` from React and `axios`.
2. Add one piece of state: `const [image, setImage] = useState(null)`.
3. Write an `async` handler that:
   - picks a random number,
   - fetches `https://pokeapi.co/api/v2/pokemon/<that number>`,
   - calls `setImage(...)` with the sprite URL.
4. Add a `<button onClick={...}>` and an `<img src={image} />`.

**✅ What right looks like:**
```jsx
import axios from "axios";
import { useState } from "react";

function App() {
  const [image, setImage] = useState(null);

  async function getRandomPokemon() {
    const randNum = Math.floor(Math.random() * 1000) + 1;
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randNum}`);
    setImage(response.data.sprites.front_default);
  }

  return (
    <>
      <button onClick={getRandomPokemon}>Get Random Pokemon</button>
      <img src={image} alt="pokemon" />
    </>
  );
}

export default App;
```

**Why it works:**
- **`useState(null)`** gives you a value (`image`) and a setter (`setImage`). Calling the setter updates the value **and** re-renders the component so the screen updates. `null` is the starting value (nothing fetched yet).
- **`Math.random()`** returns a float from 0 up to (not including) 1. It takes **no arguments** — `Math.random(0, 500)` silently ignores them. `Math.floor(Math.random() * 1000) + 1` turns it into a whole number from 1–1000.
- **Template literals** use **backticks** `` ` ``, not quotes. `` `.../pokemon/${randNum}` `` inserts the number. `".../pokemon/${randNum}"` (with quotes) sends the literal text `${randNum}` and breaks.
- **`await`** pauses the function until the network responds, so `response` holds real data on the next line.
- The single-Pokémon endpoint is `/api/v2/pokemon/<id>`. The response has the sprite at `response.data.sprites.front_default`.

**Checkpoint:** clicking the button shows a Pokémon sprite. Some clicks may error (see gotchas) — that's expected until Phase 8.

> 🐛 **Gotchas we hit (all produce a broken button):**
> - Fetching `/api/v2/pokemon` (the **list** endpoint) instead of `/api/v2/pokemon/<id>` → the response has no `sprites`, so `.sprites.front_default` crashes.
> - `"https://.../v2/${randNum}"` in double quotes → `${randNum}` is not interpolated. Use backticks.
> - Missing the `pokemon/` segment: `/api/v2/445` → **400 Bad Request**. It must be `/api/v2/pokemon/445`.
> - Referencing a variable that doesn't exist (e.g. `pokemonData.length`) → `ReferenceError`.
>
> **How you'll catch these:** open DevTools → **Console** (Cmd+Option+J). A red `GET .../v2/445 400 (Bad Request)` tells you the exact URL that failed.

---

## Phase 2 — Add the name (and learn conditional rendering)

**Goal:** show the Pokémon's name above the image.

**Steps:**
1. Add a second state: `const [name, setName] = useState(null)`.
2. In the handler, add `setName(response.data.name)`.
3. Render the name in a **text** element: `<h2>{name}</h2>`.

**Why it works:**
- The name is at `response.data.name` (a string like `"charmander"`).
- A name is **text**, so it goes inside a text element (`<h2>`, `<p>`), not an `<img src>` (which expects an image URL).
- `{name}` renders the value between the tags. `<h2 {name} />` is wrong — that's attribute-spread syntax, not content.

**Checkpoint:** the name appears above the image and changes each click.

---

## Phase 3 — Add the type(s) and learn `.map()`

**Goal:** show the Pokémon's type or types (some have two).

**Steps:**
1. First, **inspect the data.** In the handler, temporarily add `console.log(response.data)`. Click the button, open DevTools → Console, expand the object, and find `types`.
2. You'll see `types` is an **array** of objects: `[ { slot: 1, type: { name: "fire", url: "..." } } ]`.
3. Add state: `const [types, setTypes] = useState(null)` and `setTypes(response.data.types)`.
4. Render each type with `.map()`.

**✅ What right looks like:**
```jsx
<h3>
  Type:{" "}
  {types && types.map((t) => (
    <span key={t.slot}>{t.type.name} </span>
  ))}
</h3>
```

**Why it works:**
- `.map()` turns an array into an array of JSX elements — one `<span>` per type. **1 type → 1 span, 2 types → 2 spans, automatically.** This is why you don't special-case dual types.
- **`key={t.slot}`** — React requires a unique `key` on each element produced by `.map()` so it can track them across re-renders. `slot` is 1 or 2, unique within one Pokémon.
- **`types &&`** guards against the first render, when `types` is still `null`. Calling `.map()` on `null` throws. `{types && (...)}` means "only render this once `types` is truthy."
- **`{" "}`** is an explicit space so `Type:` doesn't jam against the first badge.

**Checkpoint:** a single-type Pokémon shows one type, a dual-type shows two.

> 💡 **The core skill here:** when you don't know a response's shape, `console.log` it and expand it in DevTools. Don't guess — look.

---

## Phase 4 — The big refactor: one object instead of three variables ⭐

This is the most important lesson in the whole build.

**The problem:** you now have three separate state variables — `image`, `name`, `types` — that all describe **one** Pokémon. That works for one. But you're about to add 5 *more* Pokémon. With this design you'd need `similarImages`, `similarNames`, `similarTypes` — three arrays kept in sync by index. That's a nightmare.

**The fix — model state after your domain.** A Pokémon is *one thing* with three fields, so store it as *one object*:

**✅ What right looks like:**
```jsx
const [pokemon, setPokemon] = useState(null);
// pokemon will be: { name, image, types }

async function getRandomPokemon() {
  const randNum = Math.floor(Math.random() * POKEMON_COUNT) + 1;
  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randNum}`);
  setPokemon({
    name: response.data.name,
    image: response.data.sprites.front_default,
    types: response.data.types,
  });
}
```
And in JSX, read fields off the object and guard the whole block:
```jsx
{pokemon && (
  <div>
    <h2>Name: {pokemon.name}</h2>
    <h3>Type:{" "}
      {pokemon.types.map((t) => <span key={t.slot}>{t.type.name} </span>)}
    </h3>
    <img src={pokemon.image} alt={pokemon.name} />
  </div>
)}
```

**Why it works:**
- One `setPokemon({...})` call replaces three `setX` calls. Everything about one Pokémon lives in one object.
- The 5 similar Pokémon become an **array of this exact same shape** — which sets up the reusable component in Phase 5.
- `pokemon.name` on `null` would crash, so `{pokemon && (...)}` guards the whole card.

**Also in this phase — the `POKEMON_COUNT` constant:**
```jsx
const POKEMON_COUNT = 1351; // above function App(), at module scope
```
- PokeAPI's list endpoint reports `count: 1351`. Use that as your random ceiling instead of a made-up `1000` (which could pick invalid IDs or miss valid ones).
- Put it at **module scope** (outside `App`) because it's a fixed constant that doesn't depend on state — no need to rebuild it on every render.
- **ALL_CAPS** is a *convention* signalling "fixed config constant." It's not a language rule — `const` is what actually makes it unchangeable.

**Checkpoint:** identical behavior to Phase 3, but now driven by a single `pokemon` object.

> 🐛 **Gotchas we hit:**
> - Using a value in JSX that's scoped inside a function → `not defined`. A variable only exists inside the `{}` block it's declared in. Hoist shared values (like `POKEMON_COUNT`) to a scope both the handler and JSX can see.
> - Case mismatch: declaring `pokemonCount` but writing `POKEMON_COUNT` in JSX → `POKEMON_COUNT is not defined`. JS is case-sensitive; names must match exactly.

---

## Phase 5 — Extract a reusable `PokemonCard` component

**Goal:** write the card display **once** so the main Pokémon and the 5 similar ones all render identically.

**Steps:**
1. Create a function `PokemonCard` **outside** `App` that takes a `pokemon` prop and returns the card JSX.
2. Replace the inline card in `App` with `<PokemonCard pokemon={pokemon} />`.

**✅ What right looks like:**
```jsx
function PokemonCard({ pokemon, small }) {
  return (
    <div className={small ? "card card-small" : "card"}>
      <h2>Name: {pokemon.name}</h2>
      <h3>Type:{" "}
        {pokemon.types.map((t) => (
          <span key={t.slot} className="type-badge">{t.type.name}</span>
        ))}
      </h3>
      {pokemon.image ? (
        <img src={pokemon.image} alt={pokemon.name} width={small ? 96 : 200} />
      ) : (
        <p className="no-image">No image available</p>
      )}
    </div>
  );
}
```

**Why it works:**
- A **component** is just a function that returns JSX. **Props** are its inputs, passed as attributes: `<PokemonCard pokemon={pokemon} />`.
- `function PokemonCard({ pokemon, small })` **destructures** the props object — it pulls out the `pokemon` and `small` props by name.
- **`small ? 96 : 200`** is a ternary: if `small` is true, render at 96px, else 200px. Same component, two sizes.
- **`pokemon.image ? (...) : (...)`** guards the null-sprite case (some Pokémon return `null` for `front_default` — otherwise you'd get a broken-image icon).
- Because both the main Pokémon and the similar ones are the **same `{name, image, types}` shape**, they can share this one component. "Displayed exactly as the first" is now guaranteed by construction.

**Checkpoint:** the main Pokémon renders through `PokemonCard`, looking exactly as before.

---

## Phase 6 — Fetch 5 similar Pokémon by type

**Goal:** a second button that finds 5 Pokémon sharing the first Pokémon's type.

**Steps:**
1. Add state: `const [similar, setSimilar] = useState([])` (empty **array**, not `null`, since you'll `.map()` it).
2. Write a second handler, `getSimilar`. The chain of requests:
   - grab the type URL you already have: `pokemon.types[0].type.url`,
   - fetch it → its `.data.pokemon` is a big array of `{ pokemon: { name, url } }`,
   - `.slice(0, 5)` takes the first five,
   - those five only have `{name, url}` — so fetch **each** one's full detail,
   - reshape each into your `{name, image, types}` shape and `setSimilar(...)`.
3. Add a button (only shown once a Pokémon exists) and render `similar` with `.map()`.

**✅ What right looks like:**
```jsx
const [similar, setSimilar] = useState([]);

async function getSimilar() {
  const typeUrl = pokemon.types[0].type.url;
  const typeResponse = await axios.get(typeUrl);
  const firstFive = typeResponse.data.pokemon.slice(0, 5);

  const detailResponses = await Promise.all(
    firstFive.map((entry) => axios.get(entry.pokemon.url))
  );

  const detailedPokemon = detailResponses.map((res) => ({
    name: res.data.name,
    image: res.data.sprites.front_default,
    types: res.data.types,
  }));

  setSimilar(detailedPokemon);
}
```
```jsx
{pokemon && <button onClick={getSimilar}>Get 5 Similar Pokemon</button>}

<div className="similar-row">
  {similar.map((p) => (
    <PokemonCard key={p.name} pokemon={p} small />
  ))}
</div>
```

**Why it works:**
- `pokemon.types[0].type.url` is a **ready-to-use URL** (`.../type/2/`). You don't rebuild it from the number — pass it straight to `axios.get`.
- The type endpoint returns a `pokemon` array of `{pokemon: {name, url}}`. Those entries are just name+URL — no sprite/types — so you must fetch each URL for full detail.
- **`Promise.all`** runs all 5 detail requests **in parallel** and waits for all of them, instead of awaiting one at a time in a loop. `firstFive.map((entry) => axios.get(...))` builds an array of 5 in-flight requests; `Promise.all` resolves to their results in order.
- **`<PokemonCard ... small />`** — passing `small` alone is shorthand for `small={true}`. The main card omits it, so it stays full-size.

**Checkpoint:** clicking "Get 5 Similar" shows 5 smaller cards in a row, all the same type family.

> 💡 **Known trade-offs (fine for this exercise):** the 5 can include the original Pokémon itself, and only the *first* type is used for dual-type Pokémon. Note them; don't over-engineer.
>
> 🐛 **Gotcha we hit:** a **misplaced closing brace** ended the function early, leaving the rest of the code stranded in the component body (`await` at the top level → syntax error; inner variables `not defined`). Keep the function body **indented one level** so the scope is visually obvious, and make sure the closing `}` sits *after* the last line of the function. Also watch typos in property names — `res.data.nmae` won't crash, it silently gives `undefined`.

---

## Phase 7 — Style it with plain CSS

**Goal:** cards with borders/shadows, type "pills," and the 5 similar in a neat row.

**Steps:**
1. Create/replace `src/App.css`.
2. Import it at the top of `App.jsx`: `import "./App.css";`
3. Add `className`s to your JSX (note: **`className`**, not `class` — `class` is a reserved word in JS).
4. Use **flexbox** for the row of 5 — not a `<table>`. Tables are for tabular data; flexbox is the tool for "lay these out in a row."

**✅ What right looks like (key rules):**
```css
.similar-row {
  display: flex;        /* lays children out in a horizontal row */
  flex-wrap: wrap;      /* wraps to a new line if they don't fit */
  justify-content: center;
  gap: 16px;            /* space between cards */
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 28px;
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.type-badge {
  color: var(--accent);
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  border-radius: 999px;   /* pill shape */
  padding: 2px 10px;
}
```

**Why it works:**
- `display: flex` on a container arranges its children in a row automatically; `gap` spaces them.
- `var(--border)`, `var(--accent)`, etc. are **CSS variables (design tokens)** already defined in `index.css`. Reusing them (instead of hardcoding `#aa3bff`) keeps the app consistent and makes it work in dark mode for free, since those tokens already have dark-mode values.
- Inline styles use double braces — `style={{ display: "flex" }}` — because the outer `{}` means "JS here" and the inner `{}` is a JS object of CSS properties. A CSS file is cleaner once you have more than a couple of rules.

**Checkpoint:** cards have borders + shadows, types show as colored pills, the 5 similar sit in a centered row, and it looks right in both light and dark mode.

---

## Phase 8 — Error handling + loading state

**Goal:** never show a blank/broken screen when a request fails; show a message instead.

**Steps:**
1. Add `const [error, setError] = useState(null)` and `const [loading, setLoading] = useState(false)`.
2. Wrap **each** handler's body in `try { ... } catch (err) { ... } finally { ... }`.
3. Render the error and loading messages conditionally; disable the buttons while loading.

**✅ What right looks like:**
```jsx
async function getRandomPokemon() {
  try {
    setError(null);
    setLoading(true);
    setSimilar([]); // clear the old similar list when fetching a new pokemon
    const randNum = Math.floor(Math.random() * POKEMON_COUNT) + 1;
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randNum}`);
    setPokemon({
      name: response.data.name,
      image: response.data.sprites.front_default,
      types: response.data.types,
    });
  } catch (err) {
    console.log(err);
    setError("Could not fetch a Pokemon. Please try again.");
  } finally {
    setLoading(false);
  }
}
```
```jsx
<button onClick={getRandomPokemon} disabled={loading}>Get Random Pokemon</button>
{loading && <p className="status">Loading…</p>}
{error && <p className="error">{error}</p>}
```

**Why it works:**
- **`try`** runs the risky code. If any `await` rejects (a 400, a dropped connection), execution jumps straight to **`catch`** — skipping `setPokemon`, so you never render broken data. `err` holds the real error object (log it while debugging); the user sees your friendly string.
- **`finally`** runs no matter what (success *or* failure) — the correct place to turn `loading` off.
- **`disabled={loading}`** stops double-clicks mid-request (matters most on the 6-request similar call).
- **`setSimilar([])`** on a fresh random pull clears the previous Pokémon's similar cards so they don't linger under an unrelated Pokémon.

**Checkpoint:** the app never crashes to a blank screen. To *prove* the catch works, turn off wifi and click — you should see the red error message, not a frozen page.

---

## Debugging Playbook — every error we hit and how to read it

| Symptom | Likely cause | Fix |
|---|---|---|
| `ENOENT ... package.json` | Running npm in the wrong folder | `cd` into the project root; check with `pwd` |
| `400 (Bad Request)` on the API call | Wrong URL (missing `pokemon/`, or bad ID) | Read the exact URL in the Console; fix the path |
| `${randNum}` appears literally in the URL | Used quotes instead of backticks | Use `` `...${randNum}` `` |
| `Cannot read properties of undefined (reading 'front_default')` | Hit the list endpoint, not `/pokemon/<id>` | Use the single-Pokémon endpoint |
| `X is not defined` | Typo/case mismatch, or variable out of scope | Match names exactly; hoist shared values |
| Blank name / `undefined` showing | Typo in a property (`res.data.nmae`) | Fix the property spelling |
| `await is only valid in async functions` | Misplaced `}` closed the function early | Move the closing brace; keep body indented |
| Broken-image icon | Pokémon has `front_default: null` | Guard: `pokemon.image ? <img/> : <p>No image</p>` |
| Stale "similar" cards under a new Pokémon | Didn't reset `similar` | `setSimilar([])` at the start of the random handler |
| React warning about missing "key" | `.map()` without a `key` prop | Add `key={...}` with a unique value |

**How to debug, generally:** open DevTools (Cmd+Option+J on Mac) → **Console** tab. Red text = an error; it names the file, line, and often the exact URL. To inspect unknown data, `console.log(response.data)` and expand it there — **look, don't guess.**

---

## Concept Glossary (quick reference)

- **State (`useState`)** — a value React watches; changing it (via the setter) re-renders the UI. Returns `[value, setValue]`.
- **Component** — a function that returns JSX. Named with a Capital letter.
- **Props** — inputs to a component, passed like HTML attributes; received as an object (often destructured: `function Card({ pokemon })`).
- **Conditional rendering** — `{condition && <JSX/>}` renders only when `condition` is truthy. Used to guard `null` state.
- **`.map()` in JSX** — turns an array into a list of elements; each needs a unique `key`.
- **Ternary** — `condition ? a : b`, a compact if/else that returns a value. Works inside JSX.
- **Template literal** — a string in **backticks** that can embed `${expressions}`.
- **`async/await`** — `await` pauses an `async` function until a Promise resolves, giving you the value on the next line.
- **`Promise.all([...])`** — runs many Promises in parallel; resolves when all finish, with results in order.
- **`try/catch/finally`** — run risky code; jump to `catch` on error; `finally` always runs.
- **CSS variable / token** — `var(--name)`; a reusable value defined once (in `index.css`) and used everywhere.
- **Flexbox** — `display: flex` on a container lays its children out in a row (or column); `gap` spaces them.
- **`className`** — React's version of HTML's `class` (because `class` is a reserved JS word).

---

## Full reference solution

If you want to compare your finished file against a known-good version, the working code is in:
- `src/App.jsx` — the component logic
- `src/App.css` — the styles

Both are the exact files we built and verified running in the browser. Treat them as the answer key — **build first, check second.**
