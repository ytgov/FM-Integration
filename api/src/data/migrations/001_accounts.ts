import * as knex from "knex";

exports.up = function (knex: knex.Knex, Promise: any) {
  return knex.schema.createTable("accounts", function (table) {
    table.increments("id").notNullable().primary();
    table.string("org", 10).notNullable();
    table.string("account", 50).notNullable();
    table.string("notes", 200);
    table.string("type", 20).notNullable();
    table.string("status", 20).notNullable();
  });
};

exports.down = function (knex: knex.Knex, Promise: any) {
  return knex.schema.dropTable("accounts");
};
