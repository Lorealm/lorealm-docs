---
title: ContextWeaver
description: A reference for ContextWeaver
---
## Introduction
ContextWeaver is the engine used for managing lorebooks, written from the ground up with Lorealm in mind. It's built as a standalone crate, and is quite versatile, so there are use-cases outside of a Lorealm context too.

### How it differs from normal Lorebooks
In spirit, ContextWeaver is very similar to systems deployed by platforms like SillyTavern. Lorealm and the Weaver stack was built with two objectives in mind:

### State
If you've ever tried to use Lorebooks in SillyTavern, you'll find that maintaining any sort of state is clunky. It requires interacting with their command system, which is inherently untyped and unreliable (in my experience). ContextWeaver supports variables, functions and a variety of strategies for embedding content as first-class constructs. This allows you to create highly sophisticated systems that persist and modify state across turns. This is extremely powerful if you want to create any kind of game system or something that requires more predictable logic than whatever your LLM gives you.

### Distribution
This is the biggest pain point of other platforms. There is no way of sharing your sophisticated systems with others. Every system you create rely on your specific environment being the way it is. The Weaver stack solves this by deploying a macro language that works exactly the same way no matter where they are.

## Entries
An entry is a single page within the Lorebook. It looks a little bit like this:
```weaver
---
id: dark_forest
name: Dark Forest Description
keywords: ["dark forest", "shadowed path"]
condition: '{{state:location}} == "forest"'
priority: 150
slot: backdrop
fallback: [setting]
sticky_turns: 2
---
{# if {{state:level}} > 5 #}
The ancient dark forest recognizes a seasoned adventurer.
{# else #}
The dark forest looms, its shadows deep and menacing.
{# endif #}
Threat level: @[text.upper(text: "high")]
$[set_var("state:visited_forest", true)]
```
The file is split into two parts, separated by three dashes: `---`

### Frontmatter/Metadata
The first part declares the metadata of an entry. This provides the engine with useful information such as where to find the entry, how to activate it, where in the context it should appear, and much more. If you've used SillyTavern, this should feel familiar.

### Source
The source is the 2nd part of the entry, and it contains the actual logic that'll be executed. This can either be plain text if you want to keep it simple, or it can be a more complicated script. Your imagination is the limit!

## Frontmatter
The frontmatter supports a variety of properties that may be useful. Here's a comprehensive index of each feature:
| property        | description                                                                                       | optional |
|-----------------|---------------------------------------------------------------------------------------------------|----------|
| id              | The id used to access this entry                                                                  | ❌        |
| name            | A human-readable name                                                                             | ❌        |
| keywords        | A list of keywords used for activation                                                            | ✅       |
| regex           | A list of regular expressions used for activation                                                 | ✅       |
| condition       | A Weaver expression used for activation. Must evaluate to either true or false                    | ✅       |
| scan_depth      | How many messages should be scanned for keyword/regex matches                                     | ✅       |
| constant        | Whether this entry should always be active, despite keyword/regex/condition contents              | ❌        |
| priority        | Used for deciding which entries should be evaluated first. Higher priority = evaluated earlier.   | ✅       |
| slot            | Which context slot this entry should appear in when activated                                     | ❌        |
| fallback        | A list of fallback slots to use if the primary slot is not available                              | ✅       |
| insertion_order | Used for deciding which entries are rendered first. Higher order = inserted later.                | ❌        |
| enabled         | Whether this entry is enabled                                                                     | ❌        |
| sticky_turns    | How many turns this entry should remain pinned for after being activated. 0 = always re-evaluate. | ❌        |
| cooldown        | How many turns required between each activation of this entry                                     | ❌        |
| group           | The name of a group. Groups can be used to limit token limits within that group.                  | ✅       |
| tags            | A list of tags used for organizational purposes. Other entries may also query these for info.     | ✅       |
| extensions      | All unknown keys. These are preserved and can be used for plugins/extensions.                     | ✅       |
