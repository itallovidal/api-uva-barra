import assert from "node:assert/strict";
import { createCategoryInMemoryRepository } from "@/repository/in-memory/category";
import { createCategoryService } from "@/services/category.service";

async function main() {
  const repo = createCategoryInMemoryRepository();
  const service = createCategoryService(repo);

  // Create with tags
  const created = await service.create({ name: "Health", tags: ["Wellness", "Fitness"] });
  assert.equal(created.name, "Health");
  assert.equal(typeof created.id, "string");
  assert.deepEqual(created.tags, ["Wellness", "Fitness"]);

  // Create without tags defaults to empty array
  const noTags = await service.create({ name: "Politics" });
  assert.deepEqual(noTags.tags, []);

  // FindAll returns all
  const categories = await service.findAll();
  assert.equal(categories.length, 2);

  // FindById
  const found = await service.findById(created.id);
  assert.equal(found.name, "Health");

  // FindById throws 404 for non-existent
  try {
    await service.findById("non-existent-id");
    assert.fail("Should have thrown");
  } catch (error: unknown) {
    assert.equal((error as { statusCode: number }).statusCode, 404);
  }

  // Update
  const updated = await service.update(created.id, { name: "Health & Wellness", tags: ["Wellness", "Nutrition"] });
  assert.equal(updated.name, "Health & Wellness");
  assert.deepEqual(updated.tags, ["Wellness", "Nutrition"]);

  // Tags deduplication
  const deduped = await service.create({ name: "Dedup Test", tags: ["A", "A", "B", " B "] });
  assert.deepEqual(deduped.tags, ["A", "B"]);

  // Delete
  const deleted = await service.delete(created.id);
  assert.equal(deleted, true);

  const afterDelete = await service.findAll();
  assert.equal(afterDelete.length, 2);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
