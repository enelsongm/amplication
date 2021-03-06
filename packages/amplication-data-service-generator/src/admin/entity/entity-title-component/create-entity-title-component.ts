import * as path from "path";
import { builders } from "ast-types";
import { Entity, EnumDataType } from "../../../types";
import { addImports, importNames, interpolate } from "../../../util/ast";
import { readFile, relativeImportPath } from "../../../util/module";
import { DTOs } from "../../../server/resource/create-dtos";
import { EntityComponent } from "../../types";

const template = path.resolve(__dirname, "entity-title-component.template.tsx");

export async function createEntityTitleComponent(
  entity: Entity,
  dtos: DTOs,
  entityToDirectory: Record<string, string>,
  entityToResource: Record<string, string>,
  dtoNameToPath: Record<string, string>
): Promise<EntityComponent> {
  const file = await readFile(template);
  const name = `${entity.name}Title`;
  const modulePath = `${entityToDirectory[entity.name]}/${name}.tsx`;
  const entityDTO = dtos[entity.name].entity;
  const resource = entityToResource[entity.name];

  interpolate(file, {
    ENTITY: builders.identifier(entity.name),
    ENTITY_TITLE: builders.identifier(name),
    ENTITY_TITLE_FIELD: builders.identifier(getEntityTitleField(entity)),
    RESOURCE: builders.stringLiteral(resource),
  });

  addImports(file, [
    importNames(
      [entityDTO.id],
      relativeImportPath(modulePath, dtoNameToPath[entityDTO.id.name])
    ),
  ]);

  return { name, file, modulePath };
}

/**@todo: replace with any other field of the entity, based on the actual implementation of the entity title */
export function getEntityTitleField(entity: Entity): string {
  const nameField = entity.fields.find((field) =>
    field.displayName.toLowerCase().includes("name")
  );
  if (nameField) return nameField.name;

  const titleField = entity.fields.find((field) =>
    field.displayName.toLowerCase().includes("title")
  );
  if (titleField) return titleField.name;

  const singleLineTextField = entity.fields.find(
    (field) => field.dataType === EnumDataType.SingleLineText
  );
  if (singleLineTextField) return singleLineTextField.name;

  return "id";
}
