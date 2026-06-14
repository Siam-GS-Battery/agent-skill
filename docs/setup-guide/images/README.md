# Setup Guide screenshots

Drop real screenshots here and rerun `python build_setup_guide.py`. Each file
auto-embeds into its step frame; any missing file falls back to the labeled
placeholder. Capture on Windows with **Win + Shift + S**, save as PNG with the
exact name below.

Accepted extensions: `.png`, `.jpg`, `.jpeg`. Images are scaled to 15.5 cm wide.

## Filenames → what to capture

### Supabase MCP
| File | Screen to capture |
|------|-------------------|
| `supabase-mcp-1.png` | Claude Desktop → Settings → Connectors → Add custom connector |
| `supabase-mcp-2.png` | Connector dialog with URL `https://mcp.supabase.com/mcp` entered |
| `supabase-mcp-3.png` | Supabase OAuth login → Authorize screen |
| `supabase-mcp-4.png` | Selecting the Organization and scoping to your project |
| `supabase-mcp-5.png` | Claude calling `list_tables` (connection test) |

### GitHub MCP
| File | Screen to capture |
|------|-------------------|
| `github-mcp-1.png` | Settings → Connectors → Add custom connector |
| `github-mcp-2.png` | URL `https://api.githubcopilot.com/mcp/` entered |
| `github-mcp-3.png` | GitHub OAuth → Authorize |
| `github-mcp-4.png` | Granting access to the `Siam-GS-Battery` org |
| `github-mcp-5.png` | Claude reading a file / listing branches in `agent-skill` |

### Agent Skill
| File | Screen to capture |
|------|-------------------|
| `agent-skill-1.png` | The zipped `skill-sop-sdlc` folder |
| `agent-skill-2.png` | Settings → Capabilities → Skills |
| `agent-skill-3.png` | Upload skill → choosing the zip |
| `agent-skill-4.png` | `sopify-sdlc` showing as enabled |
| `agent-skill-5.png` | Claude referencing the SOP during a task |

## Image provenance / credits

| File | Source | Notes |
|------|--------|-------|
| `supabase-mcp-3.png` | Supabase official blog — [Supabase is now an official Claude connector](https://supabase.com/blog/supabase-is-now-an-official-claude-connector) (`screenshot-2.png`) | © Supabase. Official OAuth Authorize screen. Replace with an internal capture if licensing for redistribution is a concern. |

All other frames are awaiting internal screenshots captured from the team's own
Claude Desktop. No suitable, license-clear web images were found for them.
