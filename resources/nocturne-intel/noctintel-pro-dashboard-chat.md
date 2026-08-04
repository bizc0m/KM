# NoctIntel Pro Dashboard Chat

## Canonical Call

`resource:nocturne-intel/noctintel-pro-dashboard-chat`

## Short Summary

Conversation source for the NoctIntel Pro dashboard iterations: English-only interface, nightlife intelligence positioning, source atlas, active source links, scoring, article-theme heatmap, share actions, theme filters, and progressive visual refinements.

## Source

Codex project chat, sanitized synthesis.

## Date

2026-05-16

## Related Project

Nocturne Intel / NoctIntel Pro.

## Usage

- Rebuild or continue the NoctIntel Pro dashboard without rereading the full chat.
- Preserve decisions about fixed-size heatmap cells, score display, theme colors, source-link behavior, and dashboard structure.
- Provide a stable reference for future UI, scoring, scraping, and resource integration work.

## Key Decisions

- Keep the user interface in English only.
- Keep `NoctIntel Pro` as a premium nightlife intelligence dashboard.
- Use theme categories: Nightlife, Tech, Luxury, Music, Business, Culture, Design, Travel, Wellness.
- Keep source titles and active sources clickable to their source sites.
- Remove unrelated export buttons and redundant scan text from the visible UI.
- Use a heatmap based on article/theme importance, not source availability.
- Keep heatmap cells the same size; express score differences through color, intensity, and visible points.
- Display the scoring formula near the heatmap.
- Preserve sharing actions with compact icon buttons.
- Keep source data copied or referenced without overwriting originals.

## Current Heatmap Rule

Score uses a non-linear transformation to create larger visible gaps:

```text
Score = 18 + 82 x ((relevance + reach + freshness - 50) / 62)^1.85
```

Reach and freshness modifiers:

- Reach: `+10` when the scan is reachable.
- Reach: `-14` when a source path fails or falls back.
- Freshness: `+8` for 2026.
- Freshness: `+3` for 2025.
- Freshness: `-4` for older sources.

## Risks

- Visual drift from too many iterative versions.
- Confusion between source quality, article importance, and scan reachability if labels are not explicit.
- Some external sources may block scans or change URLs.
- Heatmap colors can reduce readability if saturation is too high.
- Personal paths must not be copied into exportable documentation.

## Future Integration

- Link this resource from NoctIntel project documentation.
- Consider a transversal theme for `Data Sources & Scraping`.
- Consider a transversal theme for `City Intelligence` if the heatmap, pulse, signal, and scoring language is reused.
- Keep original project files untouched and copy only sanitized references into resources.
