# Virtual Media Folders — Promo Site

The marketing/promo website for the Virtual Media Folders WordPress plugin and its add-ons. A static site whose job is to drive plugin installs while showcasing the add-on ecosystem to both site editors and developers.

## Language

**Promo Site**:
This project — the static marketing website. Not the plugin itself.
_Avoid_: Landing page (it's more than one page), docs site.

**Plugin**:
Virtual Media Folders — the core WordPress plugin being promoted. Always the full name "Virtual Media Folders" in copy; "VMF" only in internal/dev contexts.
_Avoid_: VMF (in user-facing copy), Media Manager (the old, pre-1.0 name).

**Virtual Folder**:
A taxonomy-based folder that organizes media without moving files on disk, so URLs never change. The core concept of the plugin.
_Avoid_: Directory, category, real folder.

**Add-on**:
A separate, free plugin that extends Virtual Media Folders (e.g. AI Organizer, Search). There are nine, each in its own GitHub repo under the `soderlind` org.
_Avoid_: Extension, plugin (ambiguous with the core plugin), module, plugin add-on.

**Add-On Manager**:
The `vmfa` plugin that installs and manages add-ons from a dedicated admin screen. It is itself an add-on-adjacent tool, not one of the nine feature add-ons.
_Avoid_: Add-on installer, vmfa (in user-facing copy).

**Playground Demo**:
The live, in-browser trial of the plugin via WordPress Playground, launched from the site.
_Avoid_: Sandbox, live preview, demo site.
