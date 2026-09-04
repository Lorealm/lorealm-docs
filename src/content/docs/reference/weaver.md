---
title: The Weaver Programming Language
description: A reference for weaver_lang
---
## Introduction
Weaver is a custom programming language created with Lorealm in mind. Weaver aims to give you, the author, more control over how things appear.

## Use cases
Weaver operates on the principle that every return type is eventually rendered as a string. Weaver is similar in spirit to Jinja, but 

## Tokens
### Quick Reference
| type       | syntax                                                |
|------------|-------------------------------------------------------|
| variables  | `{{namespace:value}}`                                 |
| processors | `@[namespace.name(foo: value1, bar: value2)]`         |
| commands   | `$[name(foo, bar)]`                                   |
| triggers   | `<trigger id="some_id">`                              |
| documents  | `[[some_id]]`                                         |
| if/else    | `{# if foo == bar #} baz {# endif #}`                 |
| foreach    | `{# foreach foo in bar #} - {{foo}} {# endforeach #}` |

### Variables
Variables allow you to store data for later use. If you have any prior programming experience, it's exactly the same as a variable in your language of choice.

Variables are defined by `{{namespace:value}}`, where `namespace` refers to a logical group of variables, and `value` is the name of the variable. If you've used Lorealm, you might have seen the common variables `{{char:name}}` and `{{user:name}}`. These are normal Weaver variables which automatically substitute to their underlying values.

### Processors
Processors provide a way to process a chunk of data. Processors are strictly restricted to "dumb" operations. This means that the processor can only see the values passed into it. They can not read state, they can not activate other entries and they can not modify anything. They take input values and produce an output value.

Processors are defined as `@[namespace.name(foo: value1, bar: value2)]`. Processors use a similar naming scheme to variables: a namespace and a name. These don't strictly mean anything, and they only exist due to organizational purposes. A processor can support virtually any number of input parameters, but it's recommended to keep it lean.

### Commands
Commands are very similar to processors, but unlike processors, commands can do virtually anything. They can read/mutate state, activate/deactivate other entries, etc.

Commands are defined as `$[name(foo, bar)]`. Unlike earlier expressions, commands do not accept a namespace. The reason for this is that commands are supposed to serve a single focused feature such as setting a variable, checking if an entry is active, etc. This functionality is something that should only exist once and variants should be explicitly marked.

:::caution[For Developers]
Commands should only be used when you require access to the internal state. Depending on the host code, commands *can* be a security hazard, so use with caution, especially when accepting 3rd party commands.
:::

### Triggers
Triggers serve as a way to deterministically trigger another entry. These expressions do not produce any text output, but rather marks an entry for activation.

Triggers are defined as `<trigger id="some_id">` where `some_id` refers to the identifier of the entry you're targeting.

:::caution[For Developers]
Triggers are not resolved automatically in `weaver_lang`. If you're implementing a Host using `weaver_lang` you need to manually keep track of and activate marked triggers.
:::

### Documents
Documents function almost identically to triggers with one small nuance. While triggers return nothing, documents will return the text content of the given entry. This is meant as a way to let users create reusable context blocks.

Documents are defined as `[[some_id]]`, where once again, `some_id` refers to the identifier of the entry you're targeting.

:::caution[For Developers]
Triggers are not resolved automatically in `weaver_lang`. If you're implementing a Host using `weaver_lang` you need to manually keep track of and activate marked triggers.
:::

### Control Flow
Weaver provides some basic control flow expressions. Control flow refers to conditional blocks that let you control how your entries flow.

#### If, else and elif
If-else statements lie at the foundation of any programming language, and the same is true in Weaver. A basic **if** statement may look like:
```weaver
{# if {{char:name}} == "Alice" #}
  They say she comes from wonderland.
{# endif #}
```
If statements check whether the **expression** is true. If the expression is true, the body will then be queued for evaluation, if not, it is simply ignored. An expression is any value that can be true or false. These can be comparisons (like above) or processors/commands that return a bool.

But what if we need to check multiple conditions at once? Then we have the **else** and **elif** (else, if). Here's an example:
```weaver
{# if {{char:name}} == "Alice" #}
  They say {{char:name}} comes from Wonderland.
{# elif {{char:balance}} > 30 #}
  {{char:name}} is not from Wonderland, but is filthy rich.
{# else #}
  {{char:name}} is neither from Wonderland, nor are they rich.
{# endif #}
```
If it wasn't clear, **elif** lets you create multiple **if** statements after another. If the first is false, it tries the second one. If the second one is false, it would try the third one, and so on. Finally **else** is evaluated if every statement above fails.

#### Foreach
Foreach statments do exactly what they imply, they perform some logic for each element in a collection. Foreach blocks can only operate on array types. Here's an example of how it may be used:
```weaver
{# foreach {{item}} in ["sword", "shield", "longbow"] #}
  - {{item}}
{# endforeach #}
```
This code will simply list every element in the array and append a dash in front of it. The rendered output would look like this:
```text
  - sword
  - shield
  - longbow
```
Note that the foreach expression has a unique identifier syntax: `{{item}}`. These are essentially variables without the namespace, and they only exist within the scope of the foreach block. Note that these identifiers do not support namespaces at all. If tried to write `{{char:item}}` instead of `{{item}}`, you would get an error.

```weaver
Hello {{user:name}}! @[core.weaver.rng(min: 5, max: 10)] and [[intro]].
```
