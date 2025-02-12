import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { type Permission, availablePermissions } from '~/lib/constants';

interface PermissionsSelectProps {
  selectedPermissions: Permission[];
  setSelectedPermissions: (permissions: Permission[]) => void;
}

export function PermissionsSelect({
  selectedPermissions,
  setSelectedPermissions,
}: PermissionsSelectProps) {
  function addPermission(value: string) {
    const permission = availablePermissions.find(p => p.value === value);
    if (permission && !selectedPermissions.some(p => p.value === value)) {
      setSelectedPermissions([...selectedPermissions, permission]);
    }
  }

  function removePermission(value: string) {
    setSelectedPermissions(selectedPermissions.filter(p => p.value !== value));
  }

  const availableToSelect = availablePermissions.filter(
    p => !selectedPermissions.some(sp => sp.value === p.value)
  );

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <Label>Permissions</Label>
        <div className="flex flex-wrap gap-2">
          {selectedPermissions.map(permission => (
            <Badge key={permission.value} className="gap-2 pr-1">
              {permission.label}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-4 rounded-full border border-transparent text-accent hover:bg-accent/90 hover:text-accent-foreground/90"
                onClick={() => removePermission(permission.value)}>
                <X className="h-1 w-1" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>
      <Select onValueChange={addPermission} value="" disabled={availableToSelect.length === 0}>
        <SelectTrigger className="w-full bg-background">
          <SelectValue
            placeholder={
              availableToSelect.length === 0
                ? 'No more permissions available'
                : 'Select permissions'
            }
          />
        </SelectTrigger>
        <SelectContent className="min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
          {availableToSelect.map(permission => (
            <SelectItem
              key={permission.value}
              value={permission.value}
              className="group cursor-pointer">
              <div className="flex flex-col">
                <span>{permission.label}</span>
                <span className="text-xs text-muted-foreground/50 group-hover:text-muted-foreground">
                  {permission.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
