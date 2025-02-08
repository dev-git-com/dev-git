import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface IEntity {
  name: string;
  properties: {
    key: string;
    type: string;
    validation: string;
    defaultValue: string;
    length: number;
    autoIncrement: boolean;
    unique: boolean;
    nullable: boolean;
  }[];
}

export const EntityGenerator = () => {
  const [entities, setEntities] = useState<IEntity[]>([]);
  const [newEntityName, setNewEntityName] = useState("");
  const [newProperty, setNewProperty] = useState({
    key: "",
    type: "",
    validation: "",
    defaultValue: "",
    length: 0,
    autoIncrement: false,
    unique: false,
    nullable: false,
  });

  const addEntity = () => {
    if (newEntityName.trim()) {
      setEntities([...entities, { name: newEntityName, properties: [] }]);
      setNewEntityName("");
    }
  };

  const addProperty = (entityIndex: number) => {
    setEntities((prevEntities) => {
      const updatedEntities = [...prevEntities];
      updatedEntities[entityIndex].properties.push({ ...newProperty });
      return updatedEntities;
    });
    setNewProperty({
      key: "",
      type: "",
      validation: "",
      defaultValue: "",
      length: 0,
      autoIncrement: false,
      unique: false,
      nullable: false,
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Entity Generator</h1>
      <div className="mb-4">
        <Label htmlFor="entity-name" className="block mb-2">
          Entity Name
        </Label>
        <Input
          id="entity-name"
          value={newEntityName}
          onChange={(e) => setNewEntityName(e.target.value)}
          className="mb-2"
        />
        <Button onClick={addEntity}>Add Entity</Button>
      </div>

      {entities.map((entity, entityIndex) => (
        <div key={entityIndex} className="mb-4">
          <h2 className="text-xl font-bold mb-2">{entity.name}</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor={`key-${entityIndex}`} className="block mb-2">
                Key/Name
              </Label>
              <Input
                id={`key-${entityIndex}`}
                value={newProperty.key}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, key: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor={`type-${entityIndex}`} className="block mb-2">
                Value Type
              </Label>
              <Select
                onValueChange={(value) =>
                  setNewProperty({ ...newProperty, type: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor={`validation-${entityIndex}`}
                className="block mb-2"
              >
                Validation
              </Label>
              <Select
                onValueChange={(value) =>
                  setNewProperty({ ...newProperty, validation: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select validation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="required">Required</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="url">URL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor={`default-value-${entityIndex}`}
                className="block mb-2"
              >
                Default Value
              </Label>
              <Input
                id={`default-value-${entityIndex}`}
                value={newProperty.defaultValue}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    defaultValue: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor={`length-${entityIndex}`} className="block mb-2">
                Length
              </Label>
              <Input
                id={`length-${entityIndex}`}
                type="number"
                value={newProperty.length}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    length: parseInt(e.target.value, 10),
                  })
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`auto-increment-${entityIndex}`}
                checked={newProperty.autoIncrement}
                onCheckedChange={(checked) =>
                  setNewProperty({
                    ...newProperty,
                    autoIncrement: checked === true,
                  })
                }
              />
              <Label htmlFor={`auto-increment-${entityIndex}`}>
                Auto Increment
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`unique-${entityIndex}`}
                checked={newProperty.unique}
                onCheckedChange={(checked) =>
                  setNewProperty({ ...newProperty, unique: checked === true })
                }
              />
              <Label htmlFor={`unique-${entityIndex}`}>Unique</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`nullable-${entityIndex}`}
                checked={newProperty.nullable}
                onCheckedChange={(checked) =>
                  setNewProperty({ ...newProperty, nullable: checked === true })
                }
              />
              <Label htmlFor={`nullable-${entityIndex}`}>Nullable</Label>
            </div>
          </div>
          <Button onClick={() => addProperty(entityIndex)}>Add Property</Button>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Key/Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Validation</TableHead>
                <TableHead>Default Value</TableHead>
                <TableHead>Length</TableHead>
                <TableHead>Auto Increment</TableHead>
                <TableHead>Unique</TableHead>
                <TableHead>Nullable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entity.properties.map((property, propertyIndex) => (
                <TableRow key={propertyIndex}>
                  <TableCell>{property.key}</TableCell>
                  <TableCell>{property.type}</TableCell>
                  <TableCell>{property.validation}</TableCell>
                  <TableCell>{property.defaultValue}</TableCell>
                  <TableCell>{property.length}</TableCell>
                  <TableCell>{property.autoIncrement ? "Yes" : "No"}</TableCell>
                  <TableCell>{property.unique ? "Yes" : "No"}</TableCell>
                  <TableCell>{property.nullable ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};
