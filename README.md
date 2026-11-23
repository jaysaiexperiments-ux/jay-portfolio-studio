# Jay Bhanushali — studio portfolio

A minimal, editorial portfolio. Static HTML / CSS / vanilla JS, no build step.

## Interactions
- **Career, to scale**: a Gantt-style ruler of every role, with a detail panel for whichever one you hover or tap
- **Index**: project list with a preview card that follows the cursor
- **Content × Connections × Community**: toggles that explain the approach
- Number count-ups, a growth bar for the case study, a live IST clock, and click-to-copy email
- Respects `prefers-reduced-motion`

## Local preview
```bash
python3 -m http.server 8000
```

## Edit content
- Roles and their bullet points: the `roles` array in `main.js`
- Everything else: `index.html`
