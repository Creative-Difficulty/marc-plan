/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p08vynqz9qxndgo")

  collection.createRule = "@request.auth.id != \"\" && date_time > @now && created = @now && @request.auth.id = created_by"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p08vynqz9qxndgo")

  collection.createRule = "@request.auth.id != \"\" && date_time > @now && created = @now"

  return dao.saveCollection(collection)
})
