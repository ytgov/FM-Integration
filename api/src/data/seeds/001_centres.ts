import * as knex from "knex";

exports.seed = async function (knex: knex.Knex, Promise: any) {
  await knex("accounts").delete().whereRaw("1=1");

  //   return knex("accounts").insert([
  //   ]);
};
