import assert from "node:assert/strict";
import { createCategoryInMemoryRepository } from "@/repository/in-memory/category";
import { createCategoryService } from "@/services/category.service";

async function main() {
  const repo = createCategoryInMemoryRepository();
  const service = createCategoryService(repo);

  const created = await service.create({ name: "Politics" });
  assert.equal(created.name, "Politics");
  assert.equal(typeof created.id, "string");

  const categories = await service.findAll();
  assert.equal(categories.length, 1);
  assert.equal(categories[0].name, "Politics");

  const deleted = await service.delete(created.id);
  assert.equal(deleted, true);

  const afterDelete = await service.findAll();
  assert.equal(afterDelete.length, 0);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
