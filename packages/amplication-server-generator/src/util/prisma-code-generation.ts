import { namedTypes, builders } from "ast-types";
import { pascalCase } from "pascal-case";
import { importNames } from "./ast";

export const PRISMA_CLIENT_MODULE = "@prisma/client";

export enum PrismaAction {
  FindOne = "FindOne",
  FindMany = "FindMany",
  Create = "Create",
}

export function createPrismaArgsID(
  action: PrismaAction,
  entity: string
): namedTypes.Identifier {
  switch (action) {
    case PrismaAction.FindOne:
    case PrismaAction.FindMany:
      return builders.identifier(`${action}${pascalCase(entity)}Args`);
    case PrismaAction.Create:
      return builders.identifier(`${pascalCase(entity)}CreateArgs`);
  }
}

export function createPrismaEntityID(entity: string) {
  return builders.identifier(pascalCase(entity));
}

export function importNamesFromPrisma(
  names: namedTypes.Identifier[]
): namedTypes.ImportDeclaration {
  return importNames(names, PRISMA_CLIENT_MODULE);
}
