## Context

Categories currently expose more behavior and fields than the domain needs. The target storage is document-oriented, so the implementation should favor a small document shape and a simple CRUD surface: create, list, and delete.

## Goals / Non-Goals

**Goals:**
- Reduce category shape to the minimum useful data.
- Keep only create, list, and delete operations.
- Fit the implementation cleanly into the existing layered architecture.
- Use a document-style repository abstraction that can map to the target datastore.

**Non-Goals:**
- No category update operation.
- No category get-by-id operation.
- No search, pagination, or filtering.
- No migration tooling beyond what is needed to adopt the new shape.

## Decisions

- Store categories as a minimal document with generated `id` and `name`.
  - Rationale: this preserves identity while keeping the domain simple.
  - Alternative considered: keep `description` and timestamps. Rejected because the domain no longer needs them.
- Keep delete-by-id even though list/create are the primary flows.
  - Rationale: deletion is still required for lifecycle management and fits the document model.
  - Alternative considered: soft delete. Rejected because it adds unnecessary complexity.
- Model the repository around document-oriented operations instead of relational assumptions.
  - Rationale: avoids leaking storage semantics from the old shape into the new implementation.
  - Alternative considered: adapt the old repository contract. Rejected because it would preserve outdated behavior.

## Risks / Trade-offs

- [Breaking API consumers] -> Communicate the removed fields and endpoints clearly in the spec and implementation.
- [Data inconsistency during rollout] -> Ensure the repository and validation use the same minimal schema.
- [Overfitting to one datastore] -> Keep the repository interface storage-agnostic even if the first implementation targets a document DB.
