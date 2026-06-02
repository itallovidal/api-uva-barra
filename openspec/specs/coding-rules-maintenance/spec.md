## Purpose

`CODING-RULES.md` is the canonical contributor reference for the project's directory layout, layer responsibilities, dependency wiring, error handling, naming, function style, validation, authentication, HTTP test files, and path aliases. To stay trustworthy it MUST be patched in lockstep with every architectural change in the codebase or in the live OpenSpec specs. This capability formalizes that obligation and the verification steps that PR reviewers and the change-archival workflow SHALL apply.

## Requirements

### Requirement: CODING-RULES.md SHALL stay in sync with the codebase

The repository root SHALL contain a `CODING-RULES.md` file describing the directory structure, layer responsibilities, dependency injection wiring, error handling conventions, naming conventions, function style, validation, authentication, HTTP test files, and path aliases. Every contributor change that alters any of those facts SHALL update `CODING-RULES.md` in the same PR.

#### Scenario: Source layout change updates the rules
- **WHEN** a PR adds, moves, renames, or removes a file or directory under `src/`
- **THEN** the PR SHALL update the `Directory Structure` section of `CODING-RULES.md` to reflect the new layout

#### Scenario: Architectural rule change updates the rules
- **WHEN** a PR changes a layer's responsibility, import direction, error handling pattern, naming convention, auth flow, function style, response envelope, or path alias mapping
- **THEN** the PR SHALL update the corresponding section of `CODING-RULES.md` in the same commit range

#### Scenario: New ErrorCode added
- **WHEN** a PR adds a new string literal to the `ErrorCode` union in `src/types/api/response.ts`
- **THEN** the PR SHALL add the same literal to the `ErrorCode` list documented in the `Error Handling` section of `CODING-RULES.md`

#### Scenario: New HTTP endpoint added
- **WHEN** a PR adds a new route to any controller in `src/controllers/`
- **THEN** the PR SHALL also update the matching `http/<domain>.http` manual test file, and `CODING-RULES.md` SHALL continue to list `http/<domain>.http` in its HTTP Test Files section

#### Scenario: PR omits the rules update
- **WHEN** a PR ships an architectural change without touching `CODING-RULES.md`
- **THEN** code review SHALL treat the missing update as a blocking issue and request the file be patched before merge

### Requirement: OpenSpec changes SHALL plan the CODING-RULES.md update

Whenever an OpenSpec change under `openspec/changes/<change-name>/` proposes modifications that fall into any of the categories listed above (source layout, layer responsibility, import direction, error handling, naming, auth flow, validation, HTTP test files, function style, path aliases, response envelope), its `tasks.md` SHALL include a final task explicitly named `Update CODING-RULES.md`.

#### Scenario: Change touches src/ layout
- **WHEN** an OpenSpec change proposes moving, adding, or removing files under `src/`
- **THEN** the change's `tasks.md` SHALL contain a task `Update CODING-RULES.md` in the closing section

#### Scenario: Change touches architectural conventions
- **WHEN** an OpenSpec change proposes a new convention (naming, error pattern, middleware contract, factory naming, etc.)
- **THEN** the change's `tasks.md` SHALL contain a task `Update CODING-RULES.md` in the closing section

#### Scenario: Change is purely a feature endpoint that respects existing rules
- **WHEN** an OpenSpec change only adds new endpoints, services, or repositories that follow the existing conventions without introducing new ones
- **THEN** the change's `tasks.md` SHALL include a task to update the matching `http/<domain>.http` file, but it is NOT required to amend `CODING-RULES.md` unless the directory tree changes

#### Scenario: Archive step verifies the update
- **WHEN** a change is being archived (moved to `openspec/changes/archive/`)
- **THEN** the archiver SHALL verify that `CODING-RULES.md` reflects every architectural decision recorded in the change's `design.md` and `spec.md`

### Requirement: Live specs and CODING-RULES.md SHALL not drift

If a live spec under `openspec/specs/<capability>/spec.md` and `CODING-RULES.md` disagree about a rule, the live spec SHALL be treated as authoritative, but `CODING-RULES.md` SHALL be corrected in the same PR that detects the drift.

#### Scenario: Drift detected during review
- **WHEN** a reviewer finds that `CODING-RULES.md` describes a rule differently from a live OpenSpec spec
- **THEN** the PR SHALL patch `CODING-RULES.md` to match the spec wording before merge

#### Scenario: Spec change overrides outdated rule
- **WHEN** a PR modifies a live spec under `openspec/specs/` in a way that contradicts `CODING-RULES.md`
- **THEN** the PR SHALL update `CODING-RULES.md` in the same commit range

### Requirement: CODING-RULES.md SHALL surface the maintenance rule at the top of the file

The first content block of `CODING-RULES.md` (after the title) SHALL contain a short notice stating that every change touching `src/`, `openspec/specs/`, or the directory layout MUST also update the file, and SHALL reference the OpenSpec capability `coding-rules-maintenance`.

#### Scenario: New contributor opens the file
- **WHEN** a contributor opens `CODING-RULES.md` for the first time
- **THEN** they SHALL see, before any rule section, a "Maintenance rule" notice describing the obligation and pointing to `openspec/specs/coding-rules-maintenance/spec.md`

#### Scenario: Notice removed by accident
- **WHEN** a PR removes or hides the top maintenance notice
- **THEN** code review SHALL request its restoration before merge
