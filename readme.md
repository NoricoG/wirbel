# Wirbel

## Context

A companion application for Strudel.

Current functionality:
- Generate and mutate drum patterns

Integration with Strudel:
- Generate Strudel snippets
- Manually edit, but overwritten by mutations
- Play generated and modified Strudel snippets
- Manual copying to Strudel REPL or VS code extension


## Generation and mutation

Generation:
1. Select length from user range
2. Select number of elements to include from user range
3. Select specific elements to include
4. Randomly choose from the included elements

Mutation:
- User chooses from defined mutations
- Mutation history is kept to support undo


## Song structure

A song currently consists of:
- Settings for both generation and strudel
- Settings for generation only
- Settings for strudel only
- Named layers


## Documentation

### Wirbel
[Plans](docs/todo.md)

### Strudel/Hydra
[Reference](docs/ecosystem/reference.md)
[Inspiration](docs/ecosystem/inspiration.md)
[Editors](docs/ecosystem/editors.md)
